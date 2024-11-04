import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();

  const handleOptionPress = (option) => {
    if (option === 'Dashboard') {
      navigation.navigate('dashboard');
    } else if (option === 'Add Student') {
      navigation.navigate('studentform'); 
    }
  };

  return (
    <View style={ss.container}>
        <View style={ss.topbar}>
          <Text style={ss.topbarText}>CFSC</Text>
          <Image source={require("../assets/images/icon.png")} style={ss.TOPlogo} />
        </View>
      <ScrollView contentContainerStyle={ss.scrollContainer}>
        <Image
          source={require("../assets/images/icon.png")}
          style={ss.logo}
        />
        <Text style={ss.welcomeText}>Welcome, Staff!</Text>

        {/* Replace Task Section with Quick Links */}
        <Text style={ss.title}>Quick Links</Text>
        <View style={ss.quickLinksContainer}>
          <TouchableOpacity style={ss.linkButton} onPress={() => navigation.navigate('studentform')}>
            <Text style={ss.linkText}>Student Form</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.linkButton} onPress={() => navigation.navigate('reports')}>
            <Text style={ss.linkText}>Generate Reports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={ss.optionsContainer}>
        <TouchableOpacity style={ss.optionButton} onPress={() => handleOptionPress('Dashboard')}>
          <Icon name="dashboard" size={24} color="#007BFF" />
          <Text style={ss.optionText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ss.optionButton} onPress={() => handleOptionPress('Add Student')}>
          <Icon name="person-add" size={24} color="#007BFF" />
          <Text style={ss.optionText}>Add Student</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ss = StyleSheet.create({
  container: {
    flex: 1,
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
  TOPlogo: {
    marginTop: 25,
    width: 50,
    height: 50,
  },
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    flexGrow: 1,
    marginTop: 80,
  },
  logo: {
    width: 115,
    height: 130,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  quickLinksContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20, 
  },
  linkButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionButton: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 5,
  },
});

export default HomePage;
