import { MapView, Camera } from "@nextbillion-ai/react-native-maps";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MapRefExample() {
  const mapRef = useRef<any>(null);
  const [info, setInfo] = useState("Tap a button to query the map");

  async function getCenter() {
    const center = await mapRef.current?.getCenter();
    setInfo(`Center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}]`);
  }

  async function getZoom() {
    const zoom = await mapRef.current?.getZoom();
    setInfo(`Zoom: ${zoom.toFixed(2)}`);
  }

  async function getBounds() {
    const bounds = await mapRef.current?.getVisibleBounds();
    setInfo(
      `NE: [${bounds[0][0].toFixed(3)}, ${bounds[0][1].toFixed(3)}]\n` +
        `SW: [${bounds[1][0].toFixed(3)}, ${bounds[1][1].toFixed(3)}]`,
    );
  }

  async function takeSnapshot() {
    try {
      const uri = await mapRef.current?.takeSnap(false);
      Alert.alert("Snapshot", `Captured: ${uri?.substring(0, 60)}...`);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        <Camera
          defaultSettings={{ centerCoordinate: [103.82, 1.35], zoomLevel: 12 }}
        />
      </MapView>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{info}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={getCenter}>
          <Text style={styles.btnText}>Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={getZoom}>
          <Text style={styles.btnText}>Zoom</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={getBounds}>
          <Text style={styles.btnText}>Bounds</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={takeSnapshot}>
          <Text style={styles.btnText}>Snap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoBox: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 10,
    padding: 12,
  },
  infoText: { fontSize: 13, color: "#333" },
  buttons: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#295daa",
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
