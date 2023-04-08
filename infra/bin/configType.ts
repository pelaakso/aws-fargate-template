/**
 * Define external configuration file in TypeScript that contains AWS account specific
 * details we don't want to commit to source control.
 */
export interface AWSConfiguration {
  /** Account id is not actually something to be kept secret. */
  readonly accountId: string;

  /** The VPC ID to use for the ECS cluster. */
  readonly vpcId: string;
}
