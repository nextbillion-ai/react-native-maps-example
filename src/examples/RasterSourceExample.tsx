import {
  MapView,
  Camera,
  RasterSource,
  RasterLayer,
} from "@nextbillion-ai/react-native-maps";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OPACITY_LEVELS = [0, 0.25, 0.5, 0.75, 1];

export default function RasterSourceExample() {
  const [opacity, setOpacity] = useState(0.75);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          defaultSettings={{ centerCoordinate: [103.82, 1.35], zoomLevel: 11 }}
        />
        <RasterSource
          id="carto-light"
          tileUrlTemplates={[
            "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          ]}
          tileSize={256}
        >
          <RasterLayer
            id="cartoLayer"
            style={{ rasterOpacity: opacity }}
          />
        </RasterSource>
      </MapView>
      <View style={styles.buttons}>
        {OPACITY_LEVELS.map((o) => (
          <TouchableOpacity
            key={o}
            style={[styles.btn, o === opacity && styles.btnActive]}
            onPress={() => setOpacity(o)}
          >
            <Text style={[styles.btnText, o === opacity && styles.btnTextActive]}>
              {o * 100}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttons: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  btnActive: { backgroundColor: "#295daa" },
  btnText: { fontSize: 13, color: "#333" },
  btnTextActive: { color: "#fff" },
});
