# Infra for AWS Lambda templates

Using:

- TypeScript
- Node 24.x (at the time of writing the version supported by AWS Lambda)

## Useful commands

- `pnpm run all` run all steps
- `pnpm run watch` watch for changes and compile
- `pnpm run test` perform the Jest unit tests
- `pnpm run snap -- -u` accept and update snapshot tests
- `pnpm exec cdk --profile your-profile deploy` deploy this stack to AWS account/region
- `pnpm exec cdk --profile your-profile diff` compare deployed stack with current state
- `pnpm exec cdk --profile your-profile synth` emits the synthesized CloudFormation template
