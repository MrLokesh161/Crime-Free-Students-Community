import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();

  const handleOptionPress = (option) => {
    if (option === 'Map') {
      navigation.navigate('map');
    } else if (option === 'Assign Duty') {
      navigation.navigate('assignDuty');
    } else if (option === 'Flagging') {
      navigation.navigate('red');
    } else if (option === 'Dashboard') {
      navigation.navigate('dashboard');
    } else if (option === 'Self Assign Task') {
      navigation.navigate('selfAssignTask');
    } else if (option === 'Feedback') {
      navigation.navigate('feedback');
    } else if (option === 'Broadcast') {
      navigation.navigate('BroadcastPage');
    }
  };

  return (
    <View style={ss.container}>
      <View style={ss.topbar}>
        <Text style={ss.topbarText}>CFSC</Text>
        <Image source={require("../assets/images/icon.png")} style={ss.toplogo} />
      </View>
      <ScrollView contentContainerStyle={ss.scrollContainer}>
        <Image
          source={require("../assets/images/icon.png")}
          style={ss.logo}
        />
        <Text style={ss.welcomeText}>Welcome, Officer!</Text>
        <Text style={ss.title}>Select an Option</Text>
        <View style={ss.optionsGrid}>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Map')}>
            <Icon name="map" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Maps - Scatter Area</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Assign Duty')}>
            <Icon name="assignment" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Assign Duty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Flagging')}>
            <Icon name="flag" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Mark a Flag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Dashboard')}>
            <Icon name="dashboard" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Self Assign Task')}>
            <Icon name="person" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Self Assign Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Feedback')}>
            <Icon name="feedback" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.optionCard} onPress={() => handleOptionPress('Broadcast')}>
            <Icon name="broadcast-on-personal" size={32} color="#1E90FF" />
            <Text style={ss.optionText}>Broadcast</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const ss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  toplogo: {
    marginTop: 25,
    width: 50,
    height: 50,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
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
    marginBottom: 20,
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionCard: {
    width: '40%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E90FF',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default HomePage;
