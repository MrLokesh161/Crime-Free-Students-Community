import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    CreatedBy: '1',
    name: '',
    age: '',
    aadhar_number: '',
    phone_number: '',
    email_id: '',
    course_name: '',
    course_year: '',
    passingout_year: '',
    college_register_number: '',
    college_name: '',
    parents_address: '',
    parents_phone_number: '',
    present_residential_address: '',
    latitude: '',
    longitude: '',
    residency_name: '',
    residency_ownername: '',
    owner_phone_number: '',
    room_number: '',
    previous_cases: false,
    previous_cases_count: '',
    vehicle_available: false,
    vehicle_number: '',
  });

  const [photo, setPhoto] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckBoxChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (photo) {
      submitData.append('photo', {
        uri: photo,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await axios.post('http://192.168.10.83:8000/userprofiles/create/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile Created:', response.data);
      alert('Profile Created Successfully');
      navigation.navigate('studentform');
    } catch (error) {
      console.error('Error creating profile', error);
      alert('Error creating profile');
    }
  };

  // Reusable function for rendering text input fields
  const renderInputField = (label, placeholder, name, keyboardType = 'default') => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formData[name]}
        keyboardType={keyboardType}
        onChangeText={(value) => handleInputChange(name, value)}
      />
    </View>
  );

  return (
    <View>
      <View style={styles.topbar}>
        <Text style={styles.topbarText}>CFSC</Text>
        <Image source={require("../assets/images/icon.png")} style={styles.logo} />
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create User Profile</Text>

        <Text style={styles.label}>Student Image</Text>

        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          )}
        </TouchableOpacity>

        {renderInputField('Name', 'Enter full name', 'name')}
        {renderInputField('Age', 'Enter age', 'age', 'numeric')}
        {renderInputField('Aadhar Number', 'Enter Aadhar number', 'aadhar_number', 'numeric')}
        {renderInputField('Phone Number', 'Enter phone number', 'phone_number', 'phone-pad')}
        {renderInputField('Email ID', 'Enter email', 'email_id', 'email-address')}
        {renderInputField('Course Name', 'Enter course name', 'course_name')}
        {renderInputField('Course Year', 'Enter course year', 'course_year')}
        {renderInputField('Passing Out Year', 'Enter passing out year', 'passingout_year')}
        {renderInputField('College Register Number', 'Enter register number', 'college_register_number')}
        {renderInputField('College Name', 'Enter college name', 'college_name')}
        {renderInputField('Parents\' Address', 'Enter parents\' address', 'parents_address')}
        {renderInputField('Parents\' Phone Number', 'Enter parents\' phone number', 'parents_phone_number', 'phone-pad')}
        {renderInputField('Present Residential Address', 'Enter current address', 'present_residential_address')}
        {renderInputField('Latitude', 'Enter latitude', 'latitude', 'numeric')}
        {renderInputField('Longitude', 'Enter longitude', 'longitude', 'numeric')}
        {renderInputField('Residency Name', 'Enter residency name', 'residency_name')}
        {renderInputField('Residency Owner Name', 'Enter owner name', 'residency_ownername')}
        {renderInputField('Owner Phone Number', 'Enter owner phone number', 'owner_phone_number', 'phone-pad')}
        {renderInputField('Room Number', 'Enter room number', 'room_number')}

        <View style={styles.formGroup}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={formData.previous_cases}
              onValueChange={(value) => handleCheckBoxChange('previous_cases', value)}
            />
            <Text style={styles.label}>Any Previous Cases</Text>
          </View>
          {formData.previous_cases && (
            <TextInput
              style={styles.input}
              placeholder="Enter number of previous cases"
              keyboardType="numeric"
              value={formData.previous_cases_count}
              onChangeText={(value) => handleInputChange('previous_cases_count', value)}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={formData.vehicle_available}
              onValueChange={(value) => handleCheckBoxChange('vehicle_available', value)}
            />
            <Text style={styles.label}>Vehicle Available</Text>
          </View>
          {formData.vehicle_available && (
            <TextInput
              style={styles.input}
              placeholder="Enter vehicle number"
              value={formData.vehicle_number}
              onChangeText={(value) => handleInputChange('vehicle_number', value)}
            />
          )}
        </View>

        <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
        <View style={styles.summa}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  topbar: {
    width: '100%',
    height: 90,
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topbarText: {
    fontSize: 20,
    paddingTop: 30,
    paddingLeft: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logo: {
    marginTop: 25,
    width: 50,
    height: 50,
  },
  imagePicker: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  summa: {
    marginBottom: 100,
  },
});

export default UserProfileForm;
