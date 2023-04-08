![Build status](https://github.com/pelaakso/aws-fargate-template/actions/workflows/build-infra.yml/badge.svg?branch=main)

# AWS Fargate template

AWS ECS Fargate template to use as base for projects.

* [infra](./infra) directory contains CDK infra to deploy the template to AWS.

## What is being created

The template creates an ECS cluster with Fargate launch type.
No Fargate services are created.

Additionally, the following resources are created:

* CloudWatch log group for ECS logs
* ECR repository for Docker images

## Caveats

* An existing VPC is required to deploy the template.
* Skipping some configuration values might trigger an automatic creation of resources by CDK.
Eg. a new VPC is created if `vpcId` is not provided.

## Configuring

To keep secret things secret, the configuration file is not committed to version control.
Create following file to `infra/bin/awsConfig.ts`:

```typescript
import { AWSConfiguration } from './configType';

export const awsConfig: AWSConfiguration = {
  accountId: '123456789012',
  vpcId: 'vpc-12345678',
};
```

Variables in [infta.ts](infra/bin/infra.ts) can be fine tuned to your needs.
