import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";

interface ElbProps {
  vpc: ec2.Vpc;
}

export class ElbCdkConstruct extends Construct {
  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly listener: elbv2.ApplicationListener;
  public readonly securityGroup: ec2.SecurityGroup;
  public readonly targetGroup: elbv2.ApplicationTargetGroup;

  constructor(scope: Construct, id: string, { vpc }: ElbProps) {
    super(scope, id);

    this.securityGroup = new ec2.SecurityGroup(this, "craftdocs-elb-sg", {
      vpc,
      securityGroupName: "craftdocs-elb-sg",
      description: "Security group for Craftdocs ELB (Elastic Load Balancer)",
    });

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), // TODO: restrict?
      ec2.Port.tcp(80),
      "Allow from anyone on port 80"
    );

    this.alb = new elbv2.ApplicationLoadBalancer(this, "craftdocs-alb", {
      loadBalancerName: "craftdocs-alb",
      vpc,
      securityGroup: this.securityGroup,
      deletionProtection: false,
    });

    this.targetGroup = new elbv2.ApplicationTargetGroup(
      this,
      "craftdocs-alb-tg",
      {
        vpc,
        targetType: elbv2.TargetType.IP,
        protocol: elbv2.ApplicationProtocol.HTTP,
        port: 80,
        targetGroupName: "craftdocs-alb-tg",
        stickinessCookieDuration: Duration.days(1),
      }
    );

    this.listener = new elbv2.ApplicationListener(
      this,
      "craftdocs-alb-listener",
      {
        loadBalancer: this.alb,
        port: 80,
        protocol: elbv2.ApplicationProtocol.HTTP,
        defaultAction: elbv2.ListenerAction.forward([this.targetGroup]),
      }
    );
  }
}
