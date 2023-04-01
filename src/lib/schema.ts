import * as dynamoose from "dynamoose";

// Create new DynamoDB instance
export const dynamoInstance = new dynamoose.aws.ddb.DynamoDB({
  // @ts-ignore
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  maxRetries: 3, // maximum number of retries for failed requests
  httpOptions: {
    timeout: 20000, // timeout in milliseconds
    connectTimeout: 20000, // connection timeout in milliseconds
  },
});

export const schema = new dynamoose.Schema({
  id: String,
  type: String,
  properties: Object,
  geometry: {
    type: Object,
    schema: {
      type: String,
      coordinates: {
        type: Array,
        schema: [Number],
      },
    },
  },
});

export const Coordinate = dynamoose.model(process.env.TABLE_NAME!, schema);
