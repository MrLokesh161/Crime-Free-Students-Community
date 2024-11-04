import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// API URLs
const API_URL = 'http://192.168.10.83:8000/latlongs/';
const PROFILE_API_URL = 'http://192.168.10.83:8000/profile_by_latlong/';

const ClusteredMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [expandedClusters, setExpandedClusters] = useState<Set<number>>(new Set());
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(14);

  useEffect(() => {
    let subscription: any;

    const fetchMarkers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load marker data');
      }
    };

    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location permissions to use this feature.');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentLocation({ latitude, longitude });
        }
      );
    };

    fetchMarkers();
    getCurrentLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handleMarkerPress = async (latitude: string, longitude: string) => {
    try {
      const response = await axios.get(PROFILE_API_URL, {
        params: { latitude, longitude },
      });
      setSelectedProfile(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile details');
    }
  };

  const handleClusterPress = (clusterId: number) => {
    if (expandedClusters.has(clusterId)) {
      expandedClusters.delete(clusterId);
    } else {
      expandedClusters.add(clusterId);
    }
    setExpandedClusters(new Set(expandedClusters));
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  const clusterData = (data: any[], zoom: number) => {
    const clusterRadius = zoom < 12 ? 0.02 : 0.005; // Adjust based on zoom level
    const clusters: any[][] = [];
    const processed = new Set<number>();

    for (let i = 0; i < data.length; i++) {
      if (processed.has(i)) continue;
      const baseMarker = data[i];
      const cluster = [baseMarker];

      for (let j = i + 1; j < data.length; j++) {
        if (processed.has(j)) continue;

        const comparisonMarker = data[j];
        const distance = getDistance(baseMarker, comparisonMarker);

        if (distance < clusterRadius) {
          cluster.push(comparisonMarker);
          processed.add(j);
        }
      }
      clusters.push(cluster);
    }

    return clusters;
  };

  const getDistance = (point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }) => {
    const latDiff = point1.latitude - point2.latitude;
    const lonDiff = point1.longitude - point2.longitude;
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  };

  if (!currentLocation) {
    return <Text style={styles.loading}>Loading current location...</Text>;
  }

  const clusteredMarkers = clusterData(markers, zoomLevel);

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
        onRegionChangeComplete={(region) => {
          const newZoomLevel = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
          setZoomLevel(newZoomLevel);
        }}
      >
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor="blue"
        />
        {clusteredMarkers.map((cluster, index) => {
          const isClusterExpanded = expandedClusters.has(index);

          if (cluster.length === 1 || isClusterExpanded) {
            return cluster.map((marker, markerIndex) => (
              <Marker
                key={`${index}-${markerIndex}`}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={`Marker ${index + 1}`}
                pinColor="red"
                onPress={() => handleMarkerPress(marker.latitude, marker.longitude)}
              >
                <Callout>
                  <Text>Marker {index + 1}</Text>
                </Callout>
              </Marker>
            ));
          } else {
            const averageLat = cluster.reduce((sum, marker) => sum + marker.latitude, 0) / cluster.length;
            const averageLon = cluster.reduce((sum, marker) => sum + marker.longitude, 0) / cluster.length;

            return (
              <Marker
                key={index}
                coordinate={{ latitude: averageLat, longitude: averageLon }}
                pinColor="green"
                onPress={() => handleClusterPress(index)}
              >
                <View style={styles.clusterContainer}>
                  <Text style={styles.clusterText}>{cluster.length}</Text>
                </View>
              </Marker>
            );
          }
        })}
      </MapView>

      {selectedProfile && (
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseProfile}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <ScrollView>
            <Image
              source={{ uri: `http://192.168.10.83:8000${selectedProfile.photo}` }}
              style={styles.profileImage}
            />
            <Text style={styles.profileText}>Name: {selectedProfile.name}</Text>
            <Text style={styles.profileText}>Age: {selectedProfile.age}</Text>
            <Text style={styles.profileText}>Aadhar Number: {selectedProfile.aadhar_number}</Text>
            <Text style={styles.profileText}>Phone: {selectedProfile.phone_number}</Text>
            <Text style={styles.profileText}>Email: {selectedProfile.email_id}</Text>
            <Text style={styles.profileText}>Course: {selectedProfile.course_name}</Text>
            <Text style={styles.profileText}>Year: {selectedProfile.course_year}</Text>
            <Text style={styles.profileText}>Passing Out: {selectedProfile.passingout_year}</Text>
            <Text style={styles.profileText}>College Register No: {selectedProfile.college_register_number}</Text>
            <Text style={styles.profileText}>College: {selectedProfile.college_name}</Text>
            <Text style={styles.profileText}>Parents Address: {selectedProfile.parents_address}</Text>
            <Text style={styles.profileText}>Parents Phone: {selectedProfile.parents_phone_number}</Text>
            <Text style={styles.profileText}>Residential Address: {selectedProfile.present_residential_address}</Text>
            <Text style={styles.profileText}>Residency Name: {selectedProfile.residency_name}</Text>
            <Text style={styles.profileText}>Residency Owner: {selectedProfile.residency_ownername}</Text>
            <Text style={styles.profileText}>Owner Phone: {selectedProfile.owner_phone_number}</Text>
            <Text style={styles.profileText}>Room Number: {selectedProfile.room_number}</Text>
            <Text style={styles.profileText}>Previous Cases: {selectedProfile.previous_cases_count}</Text>
            <Text style={styles.profileText}>Vehicle Number: {selectedProfile.vehicle_number}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  profileContainer: {
    height: '30%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  profileText: {
    fontSize: 14,
    marginBottom: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  clusterContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 128, 0, 0.7)', // semi-transparent green
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ClusteredMap;
