import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const RedFlagForm = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [college, setCollege] = useState('');
  const [flaggedReason, setFlaggedReason] = useState('');
  const [flaggedReasonImage, setFlaggedReasonImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFlaggedReasonImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !rollNumber || !college || !flaggedReason) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('roll_number', rollNumber);
    formData.append('college', college);
    formData.append('flagged_reason', flaggedReason);

    if (flaggedReasonImage) {
      formData.append('flagged_reason_image', {
        uri: flaggedReasonImage,
        type: 'image/jpeg',
        name: 'flagged_reason_image.jpg',
      } as any);
    }

    try {
      const response = await axios.post('http://192.168.162.83:8000/redflag/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Red flag report submitted successfully');
      setName('');
      setRollNumber('');
      setCollege('');
      setFlaggedReason('');
      setFlaggedReasonImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit red flag report');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.topbarText}>CFSC</Text>
        <Image source={require("../assets/images/icon.png")} style={styles.logo} />
      </View>
      <ScrollView style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Roll Number</Text>
        <TextInput
          style={styles.input}
          value={rollNumber}
          onChangeText={setRollNumber}
          placeholder="Enter your roll number"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>College</Text>
        <TextInput
          style={styles.input}
          value={college}
          onChangeText={setCollege}
          placeholder="Enter your college"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Flagged Reason</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={flaggedReason}
          onChangeText={setFlaggedReason}
          placeholder="Enter reason for flagging"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>

        {flaggedReasonImage && (
          <Image
            source={{ uri: flaggedReasonImage }}
            style={styles.image}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RedFlagForm;
