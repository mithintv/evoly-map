// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

type Data = {
  name: string;
};

const client = new DynamoDBClient({});

const params = {
  TableName: "evoly-coords",
  /* Item properties will depend on your application concerns */
};

const command = new ScanCommand(params);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await client.send(command);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}
