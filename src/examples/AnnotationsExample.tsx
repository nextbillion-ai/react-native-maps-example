import { useRef, useState, useCallback } from "react";
import {
  MapView,
  Camera,
  PointAnnotation,
  MarkerView,
  Callout,
  ShapeSource,
  SymbolLayer,
  Images,
} from "@nextbillion-ai/react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import type { PointAnnotationRef } from "@nextbillion-ai/react-native-maps";

const markerIcon = require("../assets/map_marker.png");

const SINGAPORE_CENTER: [number, number] = [103.82, 1.35];

interface MarkerData {
  id: string;
  coordinate: [number, number];
  title: string;
  snippet: string;
  color: string;
}

const PRESET_MARKERS: MarkerData[] = [
  {
    id: "hq",
    coordinate: [103.8198, 1.3521],
    title: "NextBillion.ai HQ",
    snippet: "Singapore Office",
    color: "#007AFF",
  },
  {
    id: "marina-bay",
    coordinate: [103.8586, 1.2834],
    title: "Marina Bay Sands",
    snippet: "Iconic landmark",
    color: "#FF3B30",
  },
  {
    id: "gardens",
    coordinate: [103.8636, 1.2816],
    title: "Gardens by the Bay",
    snippet: "Nature park",
    color: "#34C759",
  },
  {
    id: "merlion",
    coordinate: [103.8519, 1.2868],
    title: "Merlion Park",
    snippet: "National icon",
    color: "#FF9500",
  },
];

const PROPERTY_LISTINGS = [
  {
    id: "prop-1",
    coordinate: [103.85, 1.36] as [number, number],
    price: "$2,450/mo",
    desc: "2 bed · 1 bath",
  },
  {
    id: "prop-2",
    coordinate: [103.79, 1.33] as [number, number],
    price: "$1,800/mo",
    desc: "Studio · 1 bath",
  },
  {
    id: "prop-3",
    coordinate: [103.84, 1.31] as [number, number],
    price: "$3,200/mo",
    desc: "3 bed · 2 bath",
  },
];

function buildDynamicGeoJSON(
  markers: { id: string; coordinate: [number, number] }[],
) {
  return {
    type: "FeatureCollection" as const,
    features: markers.map((m) => ({
      type: "Feature" as const,
      id: m.id,
      geometry: {
        type: "Point" as const,
        coordinates: m.coordinate,
      },
      properties: { id: m.id },
    })),
  };
}

export default function AnnotationsExample() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [draggableCoord, setDraggableCoord] = useState<[number, number]>([
    103.82, 1.345,
  ]);
  const [dynamicMarkers, setDynamicMarkers] = useState<
    { id: string; coordinate: [number, number] }[]
  >([]);
  const [showMarkerViews, setShowMarkerViews] = useState(true);
  const pointAnnotationRefs = useRef<Record<string, PointAnnotationRef | null>>(
    {},
  );

  const addDynamicMarker = useCallback(() => {
    const lng = 103.78 + Math.random() * 0.1;
    const lat = 1.28 + Math.random() * 0.1;
    const id = `dynamic-${Date.now()}`;
    setDynamicMarkers((prev) => [
      ...prev,
      { id, coordinate: [lng, lat] },
    ]);
  }, []);

  const clearDynamicMarkers = useCallback(() => {
    setDynamicMarkers([]);
  }, []);

  const handleMarkerSelected = useCallback((marker: MarkerData) => {
    setSelectedMarkerId(marker.id);
    console.log(`Selected: ${marker.title}`);
  }, []);

  const handleMarkerDeselected = useCallback(() => {
    setSelectedMarkerId(null);
  }, []);

  const handleDragEnd = useCallback(
    (e: { geometry: { coordinates: [number, number] } }) => {
      const coords = e.geometry.coordinates;
      setDraggableCoord(coords);
      Alert.alert(
        "Marker Dropped",
        `New position:\nLng: ${coords[0].toFixed(5)}\nLat: ${coords[1].toFixed(5)}`,
      );
    },
    [],
  );

  const refreshAnnotation = useCallback((id: string) => {
    if (Platform.OS === "android") {
      setTimeout(() => {
        pointAnnotationRefs.current[id]?.refresh();
      }, 100);
    }
  }, []);

  const dynamicGeoJSON = buildDynamicGeoJSON(dynamicMarkers);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          defaultSettings={{
            centerCoordinate: SINGAPORE_CENTER,
            zoomLevel: 12,
          }}
        />

        {/* Register marker image for SymbolLayer usage */}
        <Images images={{ mapMarker: markerIcon }} />

        {/* --- PointAnnotation: custom pin + callout --- */}
        {PRESET_MARKERS.map((marker) => (
          <PointAnnotation
            key={marker.id}
            id={marker.id}
            ref={(ref) => {
              pointAnnotationRefs.current[marker.id] = ref;
            }}
            coordinate={marker.coordinate}
            title={marker.title}
            snippet={marker.snippet}
            selected={selectedMarkerId === marker.id}
            onSelected={() => handleMarkerSelected(marker)}
            onDeselected={handleMarkerDeselected}
          >
            <View
              style={[styles.customPin, { backgroundColor: marker.color }]}
              onLayout={() => refreshAnnotation(marker.id)}
            >
              <View style={styles.pinDot} />
            </View>
            <Callout title={marker.title}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutSnippet}>{marker.snippet}</Text>
                <View
                  style={[
                    styles.calloutBadge,
                    { backgroundColor: marker.color },
                  ]}
                >
                  <Text style={styles.calloutBadgeText}>View Details</Text>
                </View>
              </View>
            </Callout>
          </PointAnnotation>
        ))}

        {/* --- Draggable PointAnnotation with marker image --- */}
        <PointAnnotation
          id="draggable"
          ref={(ref) => {
            pointAnnotationRefs.current["draggable"] = ref;
          }}
          coordinate={draggableCoord}
          title="Drag Me!"
          draggable
          onDragEnd={handleDragEnd}
        >
          <Image
            source={markerIcon}
            style={styles.draggableIcon}
            onLoad={() => refreshAnnotation("draggable")}
          />
          <Callout title="Draggable Marker">
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Draggable Marker</Text>
              <Text style={styles.calloutSnippet}>
                Lng: {draggableCoord[0].toFixed(4)}
              </Text>
              <Text style={styles.calloutSnippet}>
                Lat: {draggableCoord[1].toFixed(4)}
              </Text>
            </View>
          </Callout>
        </PointAnnotation>

        {/* --- MarkerView: React Native views on map --- */}
        {showMarkerViews &&
          PROPERTY_LISTINGS.map((prop) => (
            <MarkerView
              key={prop.id}
              coordinate={prop.coordinate}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={styles.markerCard}>
                <Text style={styles.markerPrice}>{prop.price}</Text>
                <Text style={styles.markerDesc}>{prop.desc}</Text>
              </View>
            </MarkerView>
          ))}

        {/* --- Dynamic markers via ShapeSource + SymbolLayer (Android-reliable) --- */}
        <ShapeSource
          id="dynamic-markers-source"
          shape={dynamicGeoJSON}
          onPress={(e) => {
            const feature = e.features?.[0];
            if (feature) {
              const coords = (feature.geometry as any).coordinates;
              Alert.alert(
                "Dynamic Marker Tapped",
                `Lng: ${coords[0].toFixed(4)}\nLat: ${coords[1].toFixed(4)}`,
              );
            }
          }}
        >
          <SymbolLayer
            id="dynamic-markers-layer"
            style={{
              iconImage: "mapMarker",
              iconSize: 0.35,
              iconAnchor: "bottom",
              iconAllowOverlap: true,
            }}
          />
        </ShapeSource>
      </MapView>

      {/* --- Control Panel --- */}
      <View style={styles.panel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.panelBtn}
            onPress={addDynamicMarker}
          >
            <Text style={styles.panelBtnText}>+ Add Marker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.panelBtn, styles.panelBtnDanger]}
            onPress={clearDynamicMarkers}
          >
            <Text style={styles.panelBtnText}>Clear Dynamic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.panelBtn,
              !showMarkerViews && styles.panelBtnInactive,
            ]}
            onPress={() => setShowMarkerViews((v) => !v)}
          >
            <Text style={styles.panelBtnText}>
              {showMarkerViews ? "Hide" : "Show"} MarkerViews
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.panelHint}>
          {dynamicMarkers.length} dynamic marker
          {dynamicMarkers.length !== 1 ? "s" : ""} · Drag the red pin to move
          it
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  customPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },

  draggableIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  callout: { padding: 10, minWidth: 140 },
  calloutTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 2 },
  calloutSnippet: { color: "#666", fontSize: 12, marginBottom: 4 },
  calloutBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  calloutBadgeText: { color: "white", fontSize: 11, fontWeight: "600" },

  markerCard: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  markerPrice: { fontWeight: "700", fontSize: 14, color: "#222" },
  markerDesc: { color: "#888", fontSize: 11, marginTop: 2 },

  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  panelBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
  },
  panelBtnDanger: { backgroundColor: "#FF3B30" },
  panelBtnInactive: { backgroundColor: "#999" },
  panelBtnText: { color: "white", fontWeight: "600", fontSize: 13 },
  panelHint: {
    color: "#999",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },
});
