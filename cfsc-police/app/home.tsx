import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const HomePage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    fetchToken();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              navigation.replace('login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Maps - Scatter Area',
      icon: 'map',
      route: 'map',
      backgroundColor: '#2563eb',
    },
    {
      id: 2,
      title: 'Assign Duty',
      icon: 'assignment',
      route: 'assignDuty',
      backgroundColor: '#0891b2',
    },
    {
      id: 3,
      title: 'Mark a Flag',
      icon: 'flag',
      route: 'red',
      backgroundColor: '#dc2626',
    },
    {
      id: 4,
      title: 'Dashboard',
      icon: 'dashboard',
      route: 'dashboard',
      backgroundColor: '#4f46e5',
    },
    {
      id: 5,
      title: 'Self Assign Task',
      icon: 'person',
      route: 'selfAssignTask',
      backgroundColor: '#0d9488',
    },
    {
      id: 6,
      title: 'Feedback',
      icon: 'feedback',
      route: 'feedback',
      backgroundColor: '#7c3aed',
    },
    {
      id: 7,
      title: 'Broadcast',
      icon: 'campaign',
      route: 'broadcast',
      backgroundColor: '#c026d3',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e293b" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Icon name="logout" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerBottom}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.headerTitle}>Crime Free Students Community</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxMiddle]}>
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Menu Grid */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.backgroundColor }]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.9}
            >
              <Icon name={item.icon} size={32} color="#fff" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerBottom: {
    marginTop: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  welcomeText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    marginTop: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: 120,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default HomePage;