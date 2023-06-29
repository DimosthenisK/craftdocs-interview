#!/usr/bin/env node

import "dotenv/config";
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { CraftdocsStack } from "./services/stack";

const app = new cdk.App();
new CraftdocsStack(app, "Craftdocs", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
