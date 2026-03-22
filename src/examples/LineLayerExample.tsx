import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
} from "@nextbillion-ai/react-native-maps";
import { StyleSheet } from "react-native";

const routeGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [103.8198, 1.3521],
          [103.83, 1.36],
          [103.85, 1.355],
          [103.87, 1.37],
          [103.88, 1.36],
          [103.9, 1.35],
        ],
      },
      properties: {},
    },
  ],
};

export default function LineLayerExample() {
  return (
    <MapView style={styles.map}>
      <Camera
        defaultSettings={{ centerCoordinate: [103.85, 1.36], zoomLevel: 12 }}
      />
      <ShapeSource id="route" shape={routeGeoJSON}>
        <LineLayer
          id="routeLine"
          style={{
            lineColor: "blue",
            lineWidth: 4,
            lineJoin: "round",
            lineCap: "round",
          }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
