#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { awsConfig } from './awsConfig';
import { FargateTemplateStack } from '../lib/fargate-template-stack';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

/** CloudFormation stack name. */
const stackName = 'FargateTemplateStack';
/** A name used for most resources in the stack where applicable. */
const resourceName = 'fargate-template';
/** Amount of CPU for Fargate container. */
const cpu = 512;
/** Amount of memory for Fargate container. */
const memoryLimitMiB = 1024;
/** CloudWatch log retention period. */
const logRetention = RetentionDays.FIVE_DAYS;

const app = new cdk.App();

new FargateTemplateStack(app, stackName, {
  description: 'Fargate template',
  env: { account: awsConfig.accountId, region: awsConfig.region },
  vpcId: awsConfig.vpcId,
  resourceName,
  cpu,
  memoryLimitMiB,
  logRetention,
});

/* If you don't specify 'env', this stack will be environment-agnostic.
 * Account/Region-dependent features and context lookups will not work,
 * but a single synthesized template can be deployed anywhere. */

/* Uncomment the next line to specialize this stack for the AWS Account
 * and Region that are implied by the current CLI configuration. */
// env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

/* Uncomment the next line if you know exactly what Account and Region you
 * want to deploy the stack to. */
// env: { account: '123456789012', region: 'us-east-1' },

/* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
