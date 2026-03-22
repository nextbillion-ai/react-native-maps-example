import {
  MapView,
  Camera,
  ShapeSource,
  CircleLayer,
  SymbolLayer,
} from "@nextbillion-ai/react-native-maps";
import { StyleSheet } from "react-native";

const points = {
  type: "FeatureCollection" as const,
  features: Array.from({ length: 50 }, (_, i) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [
        103.8 + (Math.random() - 0.5) * 0.2,
        1.35 + (Math.random() - 0.5) * 0.15,
      ],
    },
    properties: { id: i, name: `Point ${i}` },
  })),
};

export default function ClusteringExample() {
  return (
    <MapView style={styles.map}>
      <Camera
        defaultSettings={{ centerCoordinate: [103.82, 1.35], zoomLevel: 10 }}
      />
      <ShapeSource
        id="clusteredPoints"
        shape={points}
        cluster={true}
        clusterRadius={50}
        clusterMaxZoomLevel={14}
        onPress={(e) =>
          console.log("Tapped feature:", e.features[0]?.properties)
        }
      >
        <CircleLayer
          id="clusters"
          filter={["has", "point_count"]}
          style={{
            circleRadius: ["step", ["get", "point_count"], 18, 10, 24, 30, 32],
            circleColor: "#51bbd6",
            circleOpacity: 0.84,
            circleStrokeWidth: 2,
            circleStrokeColor: "#fff",
          }}
        />
        <SymbolLayer
          id="clusterCount"
          filter={["has", "point_count"]}
          style={{
            textField: ["get", "point_count_abbreviated"],
            textSize: 14,
            textColor: "#fff",
          }}
        />
        <CircleLayer
          id="singlePoints"
          filter={["!", ["has", "point_count"]]}
          style={{
            circleRadius: 7,
            circleColor: "#f28cb1",
            circleStrokeWidth: 1.5,
            circleStrokeColor: "#fff",
          }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
