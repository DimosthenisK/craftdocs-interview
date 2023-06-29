import * as ec2 from "aws-cdk-lib/aws-ec2";

import { Construct } from "constructs";

export class VpcCdkConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, "craftdocs-vpc", {
      vpcName: "craftdocs-vpc",
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      natGateways: 2,
      natGatewayProvider: ec2.NatProvider.gateway(),
      subnetConfiguration: [
        {
          name: "craftdocs-public-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "craftdocs-private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });
  }
}
