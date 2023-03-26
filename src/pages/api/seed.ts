// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

import data from "../../seeds/random10000.json";

const client = new DynamoDBClient({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    for (let i = 0; i < 5; i++) {
      let coords = data.features[i].geometry.coordinates;
      let params = {
        TableName: "evoly-coords",
        /* Item properties will depend on your application concerns */
        Item: {
          id: {
            S: uuid.v4(),
          },
          type: {
            S: "Feature",
          },
          geometry: {
            M: {
              type: {
                S: "Point",
              },
              coordinates: {
                NS: [coords[0].toString(), coords[1].toString()],
              },
            },
          },
        },
      };
      const response = await client.send(new PutItemCommand(params));
      console.log(response);
    }
    res.send("Done seeding!");
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}
