import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import axios from 'axios';

const StudentProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  const name = 'Lokii';
  const collegeRegisterNumber = '22BECSE049';
  const collegeName = 'Kahe';

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://192.168.162.83:8000/student-profile/', {
        params: {
          name,
          college_register_number: collegeRegisterNumber,
          college_name: collegeName,
        },
      });

      setProfile(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch student profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Student Profile</Text>
      </View>
        

      {profile && (
        <View style={styles.profileContainer}>
          <Image source={{ uri: profile.photo }} style={styles.profileImage} />
          <View style={styles.profileDetails}>
            <Text style={styles.profileLabel}>Name:</Text>
            <Text style={styles.profileText}>{profile.name}</Text>
            <Text style={styles.profileLabel}>Age:</Text>
            <Text style={styles.profileText}>{profile.age}</Text>
            <Text style={styles.profileLabel}>Aadhar Number:</Text>
            <Text style={styles.profileText}>{profile.aadhar_number}</Text>
            <Text style={styles.profileLabel}>Phone Number:</Text>
            <Text style={styles.profileText}>{profile.phone_number}</Text>
            <Text style={styles.profileLabel}>Email ID:</Text>
            <Text style={styles.profileText}>{profile.email_id}</Text>
            <Text style={styles.profileLabel}>Course Name:</Text>
            <Text style={styles.profileText}>{profile.course_name}</Text>
            <Text style={styles.profileLabel}>Course Year:</Text>
            <Text style={styles.profileText}>{profile.course_year}</Text>
            <Text style={styles.profileLabel}>Passing Out Year:</Text>
            <Text style={styles.profileText}>{profile.passingout_year}</Text>
            <Text style={styles.profileLabel}>College Register Number:</Text>
            <Text style={styles.profileText}>{profile.college_register_number}</Text>
            <Text style={styles.profileLabel}>College Name:</Text>
            <Text style={styles.profileText}>{profile.college_name}</Text>
            <Text style={styles.profileLabel}>Parents Address:</Text>
            <Text style={styles.profileText}>{profile.parents_address}</Text>
            <Text style={styles.profileLabel}>Parents Phone Number:</Text>
            <Text style={styles.profileText}>{profile.parents_phone_number}</Text>
            <Text style={styles.profileLabel}>Present Residential Address:</Text>
            <Text style={styles.profileText}>{profile.present_residential_address}</Text>
            <Text style={styles.profileLabel}>Latitude:</Text>
            <Text style={styles.profileText}>{profile.latitude}</Text>
            <Text style={styles.profileLabel}>Longitude:</Text>
            <Text style={styles.profileText}>{profile.longitude}</Text>
            <Text style={styles.profileLabel}>Residency Name:</Text>
            <Text style={styles.profileText}>{profile.residency_name}</Text>
            <Text style={styles.profileLabel}>Residency Owner Name:</Text>
            <Text style={styles.profileText}>{profile.residency_ownername}</Text>
            <Text style={styles.profileLabel}>Owner Phone Number:</Text>
            <Text style={styles.profileText}>{profile.owner_phone_number}</Text>
            <Text style={styles.profileLabel}>Room Number:</Text>
            <Text style={styles.profileText}>{profile.room_number}</Text>
            <Text style={styles.profileLabel}>Previous Cases Count:</Text>
            <Text style={styles.profileText}>{profile.previous_cases_count}</Text>
            <Text style={styles.profileLabel}>Vehicle Number:</Text>
            <Text style={styles.profileText}>{profile.vehicle_number}</Text>
            <Text style={styles.profileLabel}>Flagged Reason:</Text>
            <Text style={styles.profileText}>{profile.flagged_reason}</Text>
            <Text style={styles.profileLabel}>Flag Count:</Text>
            <Text style={styles.profileText}>{profile.flag_count}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginVertical: 16,
  },
  loading: {
    marginVertical: 16,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileDetails: {
    marginTop: 8,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default StudentProfile;
