import { useState, useCallback } from "react";
import {
  MapView,
  Camera,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
  CircleLayer,
  type Location,
} from "@nextbillion-ai/react-native-maps";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const isAndroid = Platform.OS === "android";

type RenderStyle = "native" | "normal" | "custom" | "hidden";

export default function UserLocationExample() {
  const [location, setLocation] = useState<Location>();
  const [followUser, setFollowUser] = useState(true);
  const [showHeading, setShowHeading] = useState(false);
  const [renderStyle, setRenderStyle] = useState<RenderStyle>(
    isAndroid ? "native" : "normal",
  );
  const [trackingMode, setTrackingMode] = useState<string>(
    UserTrackingMode.Follow,
  );
  const [navigationMode, setNavigationMode] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const onLocationUpdate = useCallback((newLocation: Location) => {
    if (newLocation?.coords) {
      setLocation(newLocation);
    }
  }, []);

  const renderModeValue =
    renderStyle === "native"
      ? UserLocationRenderMode.Native
      : UserLocationRenderMode.Normal;

  const showUserLocation = renderStyle !== "hidden" && mapReady;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        contentInset={navigationMode ? [200, 0, 0, 0] : undefined}
        pitchEnabled={navigationMode}
        onDidFinishLoadingMap={() => setMapReady(true)}
      >
        {showUserLocation && (
          <UserLocation
            visible={true}
            renderMode={renderModeValue}
            showsUserHeadingIndicator={showHeading}
            onUpdate={onLocationUpdate}
            androidRenderMode={
              renderStyle === "native" ? "compass" : "normal"
            }
          >
            {renderStyle === "custom"
              ? [
                  <CircleLayer
                    key="custom-bg"
                    id="custom-bg"
                    style={{ circleColor: "#4A90D9", circleRadius: 12 }}
                  />,
                  <CircleLayer
                    key="custom-fg"
                    id="custom-fg"
                    style={{ circleColor: "#FFFFFF", circleRadius: 6 }}
                  />,
                ]
              : undefined}
          </UserLocation>
        )}

        <Camera
          followUserLocation={followUser && mapReady}
          followUserMode={trackingMode as any}
          followZoomLevel={navigationMode ? 18 : 16}
          followPitch={navigationMode ? 60 : 0}
          defaultSettings={{
            centerCoordinate: [103.82, 1.35],
            zoomLevel: 12,
          }}
          onUserTrackingModeChange={(event) => {
            if (!event.nativeEvent.payload.followUserLocation) {
              setFollowUser(false);
            }
          }}
        />
      </MapView>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            {location.coords.latitude.toFixed(5)},{" "}
            {location.coords.longitude.toFixed(5)}
            {"  "}
            Speed: {(location.coords.speed ?? 0).toFixed(1)} m/s
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.controlsContainer}
        contentContainerStyle={styles.controlsContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.controlsInner}>
          <View style={styles.row}>
            <Chip
              label={followUser ? "Following" : "Not Following"}
              active={followUser}
              onPress={() => setFollowUser((v) => !v)}
            />
            <Chip
              label={showHeading ? "Heading ON" : "Heading OFF"}
              active={showHeading}
              onPress={() => setShowHeading((v) => !v)}
            />
            <Chip
              label={navigationMode ? "Nav Mode ON" : "Nav Mode OFF"}
              active={navigationMode}
              onPress={() => {
                setNavigationMode((v) => {
                  const next = !v;
                  if (next) {
                    setFollowUser(true);
                    setShowHeading(true);
                    setTrackingMode(UserTrackingMode.FollowWithHeading);
                  } else {
                    setTrackingMode(UserTrackingMode.Follow);
                  }
                  return next;
                });
              }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Render:</Text>
            {(
              (isAndroid
                ? ["native", "hidden"]
                : ["normal", "native", "custom", "hidden"]) as RenderStyle[]
            ).map((mode) => (
              <Chip
                key={mode}
                label={mode}
                active={renderStyle === mode}
                onPress={() => setRenderStyle(mode)}
              />
            ))}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Track:</Text>
            {Object.entries(UserTrackingMode).map(([key, value]) => (
              <Chip
                key={key}
                label={key.replace("FollowWith", "+")}
                active={trackingMode === value}
                onPress={() => {
                  setTrackingMode(value);
                  setFollowUser(true);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  locationInfo: {
    position: "absolute",
    top: 8,
    left: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationText: { color: "#fff", fontSize: 12, textAlign: "center" },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 180,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  controlsContent: { paddingHorizontal: 12, paddingVertical: 10 },
  controlsInner: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  label: { fontSize: 12, fontWeight: "700", color: "#555", marginRight: 2 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  chipActive: { backgroundColor: "#295daa", borderColor: "#295daa" },
  chipText: { fontSize: 12, color: "#555" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
});
