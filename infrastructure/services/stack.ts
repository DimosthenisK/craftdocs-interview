import * as cdk from "aws-cdk-lib";

import { ApiGatewayCdkConstruct } from "./gw.cdk";
import { Construct } from "constructs";
import { EcCdkConstruct } from "./ec.cdk";
import { EcsCdkConstruct } from "./ecs.cdk";
import { ElbCdkConstruct } from "./elb.cdk";
import { RdsCdkConstruct } from "./rds.cdk";
import { VpcCdkConstruct } from "./vpc.cdk";

export class CraftdocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add("app", "Craftdocs");

    const vpc = new VpcCdkConstruct(this, "vpc").vpc;
    const rds = new RdsCdkConstruct(this, "rds", { vpc });
    const ec = new EcCdkConstruct(this, "ec", { vpc });
    const elb = new ElbCdkConstruct(this, "elb", { vpc });
    const gw = new ApiGatewayCdkConstruct(this, "gw", { vpc, elb });
    const ecs = new EcsCdkConstruct(this, "ecs", { vpc, elb, rds, ec });
  }
}
