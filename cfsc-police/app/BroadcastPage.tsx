import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const BroadcastPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSendBroadcast = () => {
    if (title && message) {
      // Handle the actual broadcast logic here
      Alert.alert('Broadcast Sent', `Title: ${title}\nMessage: ${message}\nImage: ${selectedImage ? 'Yes' : 'No Image'}`);
      setTitle('');
      setMessage('');
      setSelectedImage(null);
    } else {
      Alert.alert('Error', 'Please fill in both fields.');
    }
  };

  const handleChooseImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else if (response.assets) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
      }
    });
  };

  return (
    <View style={ss.container}>
      <Text style={ss.headerText}>Broadcast Message</Text>

      <TextInput
        style={ss.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />

      <TextInput
        style={ss.textArea}
        placeholder="Enter your message..."
        value={message}
        onChangeText={(text) => setMessage(text)}
        multiline={true}
        numberOfLines={4}
      />

      <View style={ss.imagePickerContainer}>
        <TouchableOpacity style={ss.imageButton} onPress={handleChooseImage}>
          <Text style={ss.buttonText}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={ss.imageButton} onPress={handleTakePhoto}>
          <Text style={ss.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={ss.previewImage} />
      )}

      <TouchableOpacity style={ss.button} onPress={handleSendBroadcast}>
        <Text style={ss.buttonText}>Send Broadcast</Text>
      </TouchableOpacity>
    </View>
  );
};

const ss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default BroadcastPage;
