import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// Function to generate random nearby coordinates
const generateNearbyCoordinates = (center: { latitude: number; longitude: number }, count: number, range: number) => {
  const coordinates = [];
  for (let i = 0; i < count; i++) {
    const offsetLat = (Math.random() - 0.5) * range;
    const offsetLon = (Math.random() - 0.5) * range;
    coordinates.push({
      id: i + 1,
      latitude: center.latitude + offsetLat,
      longitude: center.longitude + offsetLon,
    });
  }
  return coordinates;
};

// Central point (Karpagam College)
const centralLocation = { latitude: 10.91925, longitude: 76.98658 };

// Generate 10 fake data points within a 0.01 degree range
const fakeData = generateNearbyCoordinates(centralLocation, 10, 0.01);

const ClusteredMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markers, setMarkers] = useState(fakeData);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location permissions to use this feature.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
    })();
  }, []);

  const clusterData = (data: any[], center: { latitude: number; longitude: number }, radius: number) => {
    return data.filter((point) => {
      const distance = getDistance(center, point);
      return distance <= radius;
    });
  };

  const getDistance = (point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }) => {
    const latDiff = point1.latitude - point2.latitude;
    const lonDiff = point1.longitude - point2.longitude;
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  };

  if (!currentLocation) {
    return <Text>Loading current location...</Text>;
  }

  const clusteredMarkers = clusterData(markers, currentLocation, 0.01); // Adjust radius as needed

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor="blue" // Different color for current location
        />
        
        {clusteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={`Marker ${marker.id}`}
            pinColor="red" // Different color for clustered markers
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ClusteredMap;
