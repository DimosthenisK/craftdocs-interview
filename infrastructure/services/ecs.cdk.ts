import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as path from "path";
import * as sm from "aws-cdk-lib/aws-secretsmanager";

import { DockerImageAsset, Platform } from "aws-cdk-lib/aws-ecr-assets";

import { Construct } from "constructs";
import { EcCdkConstruct } from "./ec.cdk";
import { ElbCdkConstruct } from "./elb.cdk";
import { RdsCdkConstruct } from "./rds.cdk";

interface EcsProps {
  vpc: ec2.Vpc;
  elb: ElbCdkConstruct;
  rds: RdsCdkConstruct;
  ec: EcCdkConstruct;
}

export class EcsCdkConstruct extends Construct {
  constructor(scope: Construct, id: string, { vpc, elb, rds, ec }: EcsProps) {
    super(scope, id);

    const cluster = new ecs.Cluster(this, "craftdocs-ecs-cluster", {
      clusterName: "craftdocs-ecs-cluster",
      vpc,
    });

    const securityGroup = new ec2.SecurityGroup(this, "craftdocs-ecs-sg", {
      vpc,
      securityGroupName: "craftdocs-ecs-sg",
      description:
        "Security group for Craftdocs ECS (Elastic Container Service)",
    });

    ec.securityGroup.addIngressRule(
      securityGroup,
      ec2.Port.tcp(6379),
      "Allow Redis access from ECS"
    );

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "craftdocs-ecs-task-definition",
      {
        // TODO: adjust it
        memoryLimitMiB: 1024,
        cpu: 512,
      }
    );

    const image = new DockerImageAsset(this, "craftdocs-ecr-image", {
      directory: path.join(__dirname, "../..", "app"),
      platform: Platform.LINUX_AMD64,
    });

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "craftdocs",
    });

    taskDefinition.addContainer("craftdocs-ecs-container", {
      containerName: "craftdocs-ecs-container",
      logging,
      image: ecs.ContainerImage.fromDockerImageAsset(image),
      portMappings: [
        {
          containerPort: 3000,
          protocol: ecs.Protocol.TCP,
        },
      ],
      environment: {
        NODE_ENV: "production",
        DATABASE_URL: this.getDatabaseUrlUnsafe(rds.cluster.secret!), // TODO: do it in a secure way
        REDIS_URL: ec.cluster.attrRedisEndpointAddress,
        REDIS_PORT: ec.cluster.attrRedisEndpointPort,
      },
    });

    const service = new ecs.FargateService(this, `${id}`, {
      serviceName: "craftdocs-ecs-service",
      taskDefinition,
      securityGroups: [securityGroup],
      cluster,
      // TODO: adjust it
      desiredCount: 1,
      enableExecuteCommand: true,
      maxHealthyPercent: 200,
      minHealthyPercent: 100,
    });

    // TODO: adjust it
    const scaling = service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 2,
    });

    // TODO: adjust it
    scaling.scaleOnCpuUtilization(`${id}-cpuscaling`, {
      targetUtilizationPercent: 85,
      scaleInCooldown: cdk.Duration.seconds(120),
      scaleOutCooldown: cdk.Duration.seconds(30),
    });

    rds.cluster.connections.allowDefaultPortFrom(
      service,
      "Fargate access to RDS"
    );

    service.connections.allowFrom(
      elb.alb,
      ec2.Port.tcp(80),
      "Allow traffic from ELB"
    );

    service.connections.allowTo(
      ec.securityGroup,
      ec2.Port.tcp(6379),
      "Allow traffic to redis"
    );

    elb.listener.addTargets("craftdocs-ecs-targets", {
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [service],
      healthCheck: {
        // TODO: adjust it
        healthyHttpCodes: "200",
        healthyThresholdCount: 3,
        interval: cdk.Duration.seconds(30),
      },
    });
  }

  // This is super unsecure
  private getDatabaseUrlUnsafe(secret: sm.ISecret): string {
    const host = secret.secretValueFromJson("host").unsafeUnwrap();
    const port = secret.secretValueFromJson("port").unsafeUnwrap();
    const username = secret.secretValueFromJson("username").unsafeUnwrap();
    const password = secret.secretValueFromJson("password").unsafeUnwrap();
    const database = secret.secretValueFromJson("dbname").unsafeUnwrap();

    return `postgresql://${username}:${password}@${host}:${port}/${database}`;
  }
}
