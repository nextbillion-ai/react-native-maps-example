import { MapView, Camera } from "@nextbillion-ai/react-native-maps";
import { StyleSheet } from "react-native";

export default function BasicMap() {
  return (
    <MapView
      style={styles.map}
      onDidFinishLoadingMap={() => console.log("Map is ready!")}
    >
      <Camera
        defaultSettings={{
          centerCoordinate: [103.8198, 1.3521],
          zoomLevel: 12,
        }}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
