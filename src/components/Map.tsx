import { useState, useEffect, useRef } from "react";
import { GeoJSON, FeatureCollection, Feature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// const RandomGenerator = require("random-points-generator");
// const points = RandomGenerator.random(10000, {
//   bbox: [-180, -80, 180, 80],
// });
// console.log(JSON.stringify(points));

export default function Map({
  features,
  size,
}: {
  features: Feature[];
  size: number;
}) {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-17.48);
  const [lat, setLat] = useState(20.63);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    console.log(features, size);
    // if (map.current) return; // prevents re-render of map

    // Initializes map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    // Outputs and updates center coordinates of map container area based on user interaction
    map.current!.on("move", () => {
      setLng(parseFloat(map.current!.getCenter().lng.toFixed(2)));
      setLat(parseFloat(map.current!.getCenter().lat.toFixed(2)));
      setZoom(parseFloat(map.current!.getZoom().toFixed(2)));
    });

    // Custom map configuration for clusters, points, and popups
    map.current!.on("load", () => {
      if (!map.current!.getSource("earthquakes")) {
        map.current!.addSource("earthquakes", {
          type: "geojson",
          // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
          // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
          //   data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
          data: {
            type: "FeatureCollection",
            features: features.slice(0, size),
          },
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });

        // Add zoom and rotation controls to the map.
        map.current!.addControl(new mapboxgl.NavigationControl());

        // layer to group unclustered points into clusters
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
              10,
              "#8AD369",
              100,
              "#f1f075",
              500,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              10,
              20,
              100,
              30,
              500,
              40,
            ],
          },
        });

        // Layer to label size of clusters
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

        // Layer to distinguish individual unclustered points
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

        map.current!.on("click", "unclustered-point", (e) => {
          const coordinates = e.features![0].geometry.coordinates.slice();

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `<b>Coordinates</b><br>Longitude: ${coordinates[0].toFixed(
                2
              )}<br>Latitude: ${coordinates[1].toFixed(2)}`
            )
            .addTo(map.current!);
        });

        // Pointer changes on mouseenter/mouseleave for clusters and unclustered points
        map.current!.on("mouseenter", ["clusters", "unclustered-point"], () => {
          map.current!.getCanvas().style.cursor = "pointer";
        });
        map.current!.on("mouseleave", ["clusters", "unclustered-point"], () => {
          map.current!.getCanvas().style.cursor = "";
        });
      }
    });
  }, [size, features]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
