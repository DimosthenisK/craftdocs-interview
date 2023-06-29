import * as ec from "aws-cdk-lib/aws-elasticache";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { Construct } from "constructs";

interface EcProps {
  vpc: ec2.Vpc;
}

export class EcCdkConstruct extends Construct {
  public readonly cluster: ec.CfnCacheCluster;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, { vpc }: EcProps) {
    super(scope, id);

    const securityGroup = new ec2.SecurityGroup(this, "craftdocs-ec-sg", {
      vpc,
      securityGroupName: "craftdocs-ec-sg",
      description: "Security group for craftdocs EC (ElastiCache)",
      allowAllOutbound: true,
    });

    const subnetGroup = new ec.CfnSubnetGroup(
      this,
      "craftdocs-ec-subnet-group",
      {
        description: "Subnet group for craftdocs EC (ElastiCache)",
        subnetIds: vpc.privateSubnets.map((subnet) => subnet.subnetId),
        cacheSubnetGroupName: "craftdocs-ec-subnet-group",
      }
    );

    const cluster = new ec.CfnCacheCluster(this, "craftdocs-ec-cluster", {
      clusterName: "craftdocs-ec-cluster",
      autoMinorVersionUpgrade: true,
      cacheNodeType: "cache.t2.small",
      engine: "redis",
      numCacheNodes: 1,
      cacheSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [securityGroup.securityGroupId],
    });

    cluster.addDependency(subnetGroup);

    this.cluster = cluster;
    this.securityGroup = securityGroup;
  }
}
