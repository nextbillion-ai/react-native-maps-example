import { MapView, Camera } from "@nextbillion-ai/react-native-maps";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const REGIONS = [
  {
    name: "Singapore",
    bounds: { ne: [104.0, 1.47] as [number, number], sw: [103.6, 1.15] as [number, number] },
  },
  {
    name: "Europe",
    bounds: { ne: [30.0, 60.0] as [number, number], sw: [-10.0, 35.0] as [number, number] },
  },
  {
    name: "US East",
    bounds: { ne: [-65.0, 47.0] as [number, number], sw: [-85.0, 25.0] as [number, number] },
  },
];

export default function CameraBounds() {
  const [regionIdx, setRegionIdx] = useState(0);
  const region = REGIONS[regionIdx];

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          bounds={{
            ...region.bounds,
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 20,
            paddingRight: 20,
          }}
          animationDuration={1500}
        />
      </MapView>
      <View style={styles.buttons}>
        {REGIONS.map((r, i) => (
          <TouchableOpacity
            key={r.name}
            style={[styles.btn, i === regionIdx && styles.btnActive]}
            onPress={() => setRegionIdx(i)}
          >
            <Text style={[styles.btnText, i === regionIdx && styles.btnTextActive]}>
              {r.name}
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
