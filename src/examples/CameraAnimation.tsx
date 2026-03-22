import { MapView, Camera } from "@nextbillion-ai/react-native-maps";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LOCATIONS = [
  { name: "Singapore", coord: [103.8198, 1.3521] as [number, number], zoom: 12 },
  { name: "Tokyo", coord: [139.6917, 35.6895] as [number, number], zoom: 10 },
  { name: "London", coord: [-0.1276, 51.5074] as [number, number], zoom: 10 },
  { name: "New York", coord: [-74.006, 40.7128] as [number, number], zoom: 10 },
];

export default function CameraAnimation() {
  const [locIdx, setLocIdx] = useState(0);
  const loc = LOCATIONS[locIdx];

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          centerCoordinate={loc.coord}
          zoomLevel={loc.zoom}
          animationDuration={2000}
          animationMode="flyTo"
        />
      </MapView>
      <View style={styles.buttons}>
        {LOCATIONS.map((l, i) => (
          <TouchableOpacity
            key={l.name}
            style={[styles.btn, i === locIdx && styles.btnActive]}
            onPress={() => setLocIdx(i)}
          >
            <Text style={[styles.btnText, i === locIdx && styles.btnTextActive]}>
              {l.name}
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
