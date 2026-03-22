import {
  MapView,
  Camera,
  ShapeSource,
  FillLayer,
  LineLayer,
} from "@nextbillion-ai/react-native-maps";
import { StyleSheet } from "react-native";

const polygonGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [103.82, 1.34],
            [103.86, 1.34],
            [103.86, 1.37],
            [103.82, 1.37],
            [103.82, 1.34],
          ],
        ],
      },
      properties: { name: "Downtown Zone" },
    },
    {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [103.75, 1.29],
            [103.79, 1.29],
            [103.79, 1.32],
            [103.75, 1.32],
            [103.75, 1.29],
          ],
        ],
      },
      properties: { name: "West Zone" },
    },
  ],
};

export default function FillLayerExample() {
  return (
    <MapView style={styles.map}>
      <Camera
        defaultSettings={{ centerCoordinate: [103.82, 1.33], zoomLevel: 11 }}
      />
      <ShapeSource id="zones" shape={polygonGeoJSON}>
        <FillLayer
          id="zoneFill"
          style={{
            fillColor: "#4264fb",
            fillOpacity: 0.3,
          }}
        />
        <LineLayer
          id="zoneOutline"
          style={{
            lineColor: "#4264fb",
            lineWidth: 2,
          }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
