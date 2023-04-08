import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { FargateTemplateStack } from '../lib/fargate-template-stack';
import { expect, test } from 'vitest';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

test('Stack snapshot', () => {
  const resourceName = 'fargate-template';
  const cpu = 512;
  const memoryLimitMiB = 1024;
  const logRetention = RetentionDays.FIVE_DAYS;

  const stack = new cdk.Stack();

  const myStack = new FargateTemplateStack(stack, 'MyTestStack', {
    env: { account: '123456789012', region: 'eu-central-1' },
    isUnitTest: true,
    vpcId: 'vpc-12345678',
    resourceName,
    cpu,
    memoryLimitMiB,
    logRetention,
  });

  const template = Template.fromStack(myStack);

  // Replace all 64 byte asset hashes, because they are likely to change from build to build.
  // For example 02eaccf2c7a5bca24a1360de04a6ec227dfbebb07d930a867f0fe8ee5fc32f4d.zip
  expect.addSnapshotSerializer({
    test: (val) => (typeof val === 'string' && val.match(/[0-9a-f]{64}.zip/) ? true : false),
    print: (val) => {
      if (typeof val === 'string') {
        return val.replace(/[0-9a-f]{64}.zip/, '64-byte-asset-hash-removed.zip');
      }
      return `${val}`;
    },
  });

  expect(template).toMatchSnapshot();
});
