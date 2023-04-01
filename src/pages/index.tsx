import { useEffect, useState, CSSProperties } from "react";
import Head from "next/head";
import Map from "../components/Map";
import Button from "@/components/Button";
import styles from "@/styles/Home.module.css";
import axios from "axios";

import * as dynamoose from "dynamoose";
import { dynamoInstance, Coordinate } from "../lib/schema";

import ScaleLoader from "react-spinners/ScaleLoader";

// import earthquakes from "../../seeds/earthquakes.json";
// import random from "../seeds/random10000.json";

const api = axios.create({
  timeout: 20000, // set timeout to 20 seconds
});

export default function Home({ features }: any) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(features);
  const [limit, setLimit] = useState(1);
  const buttons = ["10", "100", "1,000", "10,000"];

  const setLengthHandler = (button: string) => {
    setLoading(true);
    setLimit(parseInt(button.replaceAll(",", "")));
  };

  useEffect(() => {
    if (limit > data.length) {
      (async function () {
        const response = await api.get(
          `${process.env.NEXT_PUBLIC_API}api/scan?limit=${limit}`
        );
        const parsed = await response.data;
        setData(parsed);
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  }, [limit, data.length]);

  const override: CSSProperties = {
    position: "absolute",
    left: "50%",
    zIndex: "3",
    margin: "0 auto",
  };

  return (
    <>
      <Head>
        <title>Evoly Map</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          {loading && (
            <div className={styles.loader}>
              <ScaleLoader
                loading={loading}
                cssOverride={override}
                color="#000"
              />
            </div>
          )}

          <Map features={data.slice(0, limit)} />
        </div>
        <div>
          {buttons.map((button, index) => {
            return (
              <Button
                key={index}
                onClick={setLengthHandler}
                name={button}
                disabled={parseInt(button.replaceAll(",", "")) === limit}
              ></Button>
            );
          })}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  // Set DynamoDB instance to the Dynamoose DDB instance
  dynamoose.aws.ddb.set(dynamoInstance);
  const results = await Coordinate.scan().all().exec();
  const features = await JSON.stringify(results);
  const parsed = JSON.parse(features);
  return {
    props: { features: parsed }, // will be passed to the page component as props
  };
}
