import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { AwsLogDriverMode, Cluster, ContainerImage, FargateTaskDefinition, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';

export interface Props extends StackProps {
  /**
   * Is this stack being created as part of a unit test?
   * If so, dummy assets are used so that real code assets don't need to exist.
   *
   * @default - It is assumed that stack is not created as part of unit test and real asset path is used.
   */
  readonly isUnitTest?: boolean;

  /**
   * The VPC ID to use for the stack.
   */
  readonly vpcId: string;

  /**
   * The name used for resources where applicable.
   */
  readonly resourceName: string;

  /**
   * The amount of CPU to use for the Fargate container.
   * @default - Whatever is the default in CDK.
   */
  readonly cpu: number;

  /**
   * The amount of memory to use for the Fargate container.
   * @default - Whatever is the default in CDK.
   */
  readonly memoryLimitMiB: number;

  /**
   * The amount of time to retain CloudWatch logs.
   * @default - Whatever is the default in CDK.
   */
  readonly logRetention: RetentionDays;
}

export class FargateTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);

    const existingVpc = Vpc.fromLookup(this, 'VPC', {
      vpcId: props?.vpcId,
    });

    const ecrRepository = new Repository(this, 'FargateTemplateRepository', {
      repositoryName: props?.resourceName,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new Cluster(this, 'FargateTemplateCluster', {
      clusterName: props?.resourceName,
      enableFargateCapacityProviders: true,
      vpc: existingVpc,
    });

    const logGroup = new LogGroup(this, props?.resourceName ?? 'fargate-template', {
      logGroupName: props?.resourceName,
      retention: props?.logRetention,
    });

    const taskDef = new FargateTaskDefinition(this, 'FargateTemplateTaskDef', {
      family: props?.resourceName,
      cpu: props?.cpu,
      memoryLimitMiB: props?.memoryLimitMiB,
    });
    taskDef.addContainer('FargateTemplateContainer', {
      containerName: props?.resourceName,
      image: ContainerImage.fromEcrRepository(ecrRepository),
      logging: LogDriver.awsLogs({
        logGroup,
        streamPrefix: props?.resourceName ?? 'fargate-template',
        mode: AwsLogDriverMode.NON_BLOCKING,
      }),
    });
  }
}
