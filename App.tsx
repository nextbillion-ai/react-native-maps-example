import { useEffect } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  setAccessKey,
  requestAndroidLocationPermissions,
} from "@nextbillion-ai/react-native-maps";
import "react-native-gesture-handler";

import BasicMap from "./src/examples/BasicMap";
import CameraAnimation from "./src/examples/CameraAnimation";
import CameraBounds from "./src/examples/CameraBounds";
import ShapeSourceCircles from "./src/examples/ShapeSourceCircles";
import ClusteringExample from "./src/examples/ClusteringExample";
import LineLayerExample from "./src/examples/LineLayerExample";
import FillLayerExample from "./src/examples/FillLayerExample";
import AnnotationsExample from "./src/examples/AnnotationsExample";
import UserLocationExample from "./src/examples/UserLocationExample";
import MapRefExample from "./src/examples/MapRefExample";
import RasterSourceExample from "./src/examples/RasterSourceExample";
import HeatmapExample from "./src/examples/HeatmapExample";

const NB_ACCESS_KEY = "YOUR-NB_ACCESS_KEY";

const EXAMPLES = [
  { name: "Basic Map", component: BasicMap, section: "Map" },
  { name: "Camera Animation (FlyTo)", component: CameraAnimation, section: "Camera" },
  { name: "Camera Bounds", component: CameraBounds, section: "Camera" },
  { name: "Map Ref Methods", component: MapRefExample, section: "Map" },
  { name: "ShapeSource + CircleLayer", component: ShapeSourceCircles, section: "Sources & Layers" },
  { name: "Clustering", component: ClusteringExample, section: "Sources & Layers" },
  { name: "LineLayer (Route)", component: LineLayerExample, section: "Sources & Layers" },
  { name: "FillLayer (Polygons)", component: FillLayerExample, section: "Sources & Layers" },
  { name: "RasterSource (OSM Tiles)", component: RasterSourceExample, section: "Sources & Layers" },
  { name: "Heatmap", component: HeatmapExample, section: "Sources & Layers" },
  { name: "Annotations & Markers", component: AnnotationsExample, section: "Annotations" },
  { name: "User Location", component: UserLocationExample, section: "User Location" },
];

const Stack = createStackNavigator();

function HomeScreen({ navigation }: any) {
  const sections = [...new Set(EXAMPLES.map((e) => e.section))];

  return (
    <FlatList
      style={styles.list}
      data={EXAMPLES}
      keyExtractor={(item) => item.name}
      renderItem={({ item, index }) => {
        const showSection =
          index === 0 || EXAMPLES[index - 1].section !== item.section;
        return (
          <View>
            {showSection && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionText}>{item.section}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate(item.name)}
            >
              <Text style={styles.rowText}>{item.name}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

export default function App() {
  useEffect(() => {
    setAccessKey(NB_ACCESS_KEY);
    if (Platform.OS === "android") {
      requestAndroidLocationPermissions();
    }
  }, []);

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          card: "#295daa",
          primary: "#fff",
          text: "#fff",
          background: "#f5f5f5",
        },
      }}
    >
      <Stack.Navigator initialRouteName="Integration Guide Examples">
        <Stack.Screen name="Integration Guide Examples" component={HomeScreen} />
        {EXAMPLES.map((ex) => (
          <Stack.Screen key={ex.name} name={ex.name} component={ex.component} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: "#f5f5f5" },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e8e8e8",
  },
  sectionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  rowText: { fontSize: 16, color: "#222" },
  chevron: { fontSize: 24, color: "#999" },
});
