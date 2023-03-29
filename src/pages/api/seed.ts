// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as dynamoose from "dynamoose";
import { dynamoInstance, Coordinate } from "../../lib/schema";
// import * as uuid from "uuid";
// import data from "../../seeds/random10000.json";

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(dynamoInstance);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // for (let i = 0; i < 10000; i++) {
    //   let coord = new Coordinate({
    //     id: uuid.v4(),
    //     type: data.features[i].type,
    //     properties: data.features[i].properties,
    //     geometry: {
    //       type: data.features[i].geometry.type,
    //       coordinates: [...data.features[i].geometry.coordinates],
    //     },
    //   });
    //   await coord.save();
    //   console.log(`Save operation was successful. Item Count: ${i + 1}`);
    // }
    // res.send("Done seeding!");
    res.send("Seeding logic is disabled");
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}
