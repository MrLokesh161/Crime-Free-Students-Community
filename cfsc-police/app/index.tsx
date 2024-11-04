import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Make sure to replace this URL with your actual backend URL
      const response = await axios.post('http://192.168.10.83:8000/login/', {
        email: username,
        password: password
      });

      if (response.data.user_type === 'police') {
        router.push('/home'); // Navigate to home screen for police
      } else if (response.data.user_type === 'staff') {
        router.push('/staffhome'); // Navigate to staff home screen
      } else {
        Alert.alert('Login Failed', 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      Alert.alert('Login Failed', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/images/icon.png")}
        style={styles.logo} 
      />

      <Text style={styles.headerText}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 120,
    height: 130,
    marginBottom: 30,
    borderRadius: 10, 
    borderWidth: 2,
    borderColor: '#ddd', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700', 
    marginBottom: 20,
    color: '#333', 
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    color: '#1E90FF',
    fontSize: 14, 
    marginBottom: 20,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
