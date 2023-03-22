import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// import earthquakes from "../../seeds/earthquakes.json";
import random from "../../seeds/random1000.json";

// const RandomGenerator = require("random-points-generator");
// const points = RandomGenerator.random(1000, {
//   //   bbox: [-118.2, 34.3, -67.03, 44.76],
// });
// console.log(JSON.stringify(points));

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const [lng, setLng] = useState(-95.665);
  const [lat, setLat] = useState(37.6);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current!.on("move", () => {
      setLng(parseInt(map.current!.getCenter().lng.toFixed(4)));
      setLat(parseInt(map.current!.getCenter().lat.toFixed(4)));
      setZoom(parseInt(map.current!.getZoom().toFixed(2)));
    });

    map.current!.on("load", () => {
      if (!map.current!.getSource("earthquakes")) {
        map.current!.addSource("earthquakes", {
          type: "geojson",
          // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
          // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
          //   data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
          data: random,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });

        map.current!.addLayer({
          id: "clusters",
          type: "circle",
          source: "earthquakes",
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        map.current!.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "earthquakes",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });

        map.current!.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "earthquakes",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });

        map.current!.on("click", "clusters", (e) => {
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features[0].properties!.cluster_id;
          map
            .current!.getSource("earthquakes")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              map.current!.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });

        map.current!.on("click", "unclustered-point", (e) => {});

        // Pointer changes on mouseenter/mouseleave for clusters and unclustered points
        map.current!.on("mouseenter", ["clusters", "unclustered-point"], () => {
          map.current!.getCanvas().style.cursor = "pointer";
        });
        map.current!.on("mouseleave", ["clusters", "unclustered-point"], () => {
          map.current!.getCanvas().style.cursor = "";
        });
      }
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
