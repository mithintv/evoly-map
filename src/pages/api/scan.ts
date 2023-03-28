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
  const query = req.query;
  const { limit } = query;
  let limitNumber = parseInt(limit!.toString());
  console.log(limitNumber);

  try {
    const t1 = performance.now();
    let results;
    if (limitNumber === 10000) {
      results = await Coordinate.scan()
        .all()
        .attributes(["type", "geometry"])
        .exec();
    } else if (limitNumber === 1000) {
      results = await Coordinate.scan()
        .attributes(["type", "geometry"])
        .limit(limitNumber)
        .exec();
    } else results = await Coordinate.scan().limit(limitNumber).exec();

    console.log(results.count, results.scannedCount);
    const t2 = performance.now();
    console.log(t2 - t1);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}
