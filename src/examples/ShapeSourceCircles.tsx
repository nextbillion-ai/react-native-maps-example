import {
  MapView,
  Camera,
  ShapeSource,
  CircleLayer,
} from "@nextbillion-ai/react-native-maps";
import { StyleSheet } from "react-native";

const stores = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [103.8198, 1.3521] },
      properties: { name: "Downtown Store", revenue: 85000 },
    },
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [103.76, 1.3] },
      properties: { name: "West Side Store", revenue: 42000 },
    },
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [103.87, 1.37] },
      properties: { name: "North Store", revenue: 65000 },
    },
    {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [103.85, 1.28] },
      properties: { name: "South Store", revenue: 53000 },
    },
  ],
};

export default function ShapeSourceCircles() {
  return (
    <MapView style={styles.map}>
      <Camera
        defaultSettings={{
          centerCoordinate: [103.82, 1.33],
          zoomLevel: 11,
        }}
      />
      <ShapeSource
        id="stores"
        shape={stores}
        onPress={(e) =>
          console.log("Tapped:", e.features[0]?.properties?.name)
        }
      >
        <CircleLayer
          id="storeCircles"
          style={{
            circleRadius: 10,
            circleColor: "#4A90D9",
            circleStrokeWidth: 2,
            circleStrokeColor: "#ffffff",
          }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
