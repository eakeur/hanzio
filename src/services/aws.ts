import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  region: 'us-west-1',
});

export const translateClient = new AWS.Translate();

export const polly = new AWS.Polly({})

export const bedrock = new AWS.BedrockRuntime({ region: 'sa-east-1'})