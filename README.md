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

None of the resources created by the stack incur any costs initially.
Leaving a Fargate task running or a great amount of log data to CloudWatch LogGroup will incur costs.

## Caveats

* An existing VPC is recommended to deploy the template.
* Skipping some configuration values might trigger an automatic creation of resources by CDK.
Eg. a new VPC is created if `vpcId` is not provided.
* An outbound internet connection is required to run Fargate tasks (unless you have explicitly created VPC endpoints for AWS services).
  * If using a personal AWS account, you are probably trying to minimize costs and do not have a NAT gateway.
  * Remember to start you NAT EC2 instance.

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

## Running tasks

To run Fargate tasks on the created cluster, follow these guidelines.

Push an image to ECR repository:

* Build you image
* Tag your image

```bash
docker tag YOUR-IMAGE:latest 123456789012.dkr.ecr.eu-central-1.amazonaws.com/fargate-template:latest
```

* Login to ECR and push

```bash
aws --profile YOUR-PROFILE ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.eu-central-1.amazonaws.com
docker push 123456789012.dkr.ecr.eu-central-1.amazonaws.com/fargate-template:latest
```

These instructions can also be found in ECR repository page in AWS console, "View push commands" button.
They also might need to be adapted if you fine tune the configuration variables in [infta.ts](infra/bin/infra.ts).

After setting up the ECR, run a Fargate task in AWS console or any other way you prefer.
