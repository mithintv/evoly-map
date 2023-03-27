// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as dynamoose from "dynamoose";
import { dynamoInstance, Coordinate } from "../../lib/schema";

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(dynamoInstance);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const results = await Coordinate.scan().exec();
    console.log(results);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}
