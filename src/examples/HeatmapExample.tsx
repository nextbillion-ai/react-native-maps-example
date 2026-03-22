import {
  MapView,
  Camera,
  ShapeSource,
  HeatmapLayer,
} from "@nextbillion-ai/react-native-maps";
import { StyleSheet } from "react-native";

const heatData = {
  type: "FeatureCollection" as const,
  features: Array.from({ length: 200 }, (_, i) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [
        103.8 + (Math.random() - 0.5) * 0.15,
        1.35 + (Math.random() - 0.5) * 0.1,
      ],
    },
    properties: { mag: Math.random() * 5 + 1 },
  })),
};

export default function HeatmapExample() {
  return (
    <MapView style={styles.map}>
      <Camera
        defaultSettings={{ centerCoordinate: [103.82, 1.35], zoomLevel: 12 }}
      />
      <ShapeSource id="heatSource" shape={heatData}>
        <HeatmapLayer
          id="heatLayer"
          style={{
            heatmapRadius: 20,
            heatmapWeight: ["get", "mag"],
            heatmapIntensity: ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
            heatmapColor: [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(33,102,172,0)",
              0.2, "rgb(103,169,207)",
              0.4, "rgb(209,229,240)",
              0.6, "rgb(253,219,119)",
              0.8, "rgb(239,138,98)",
              1, "rgb(178,24,43)",
            ],
            heatmapOpacity: 0.8,
          }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
