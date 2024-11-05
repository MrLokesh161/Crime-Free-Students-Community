import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../AppConfig';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';


interface Task {
  id: string;
  description: string;
  policeUser: string;
  officerName?: string;
  status: string;
}

interface PoliceOfficer {
  id: string;
  name: string;
}

const { width } = Dimensions.get('window');

const TaskManagementScreen: React.FC = () => {
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedPoliceUser, setSelectedPoliceUser] = useState('');
  const [policeOfficers, setPoliceOfficers] = useState<PoliceOfficer[]>([]);
  const [token, setToken] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    getToken();
    fetchTasks();
    fetchPoliceOfficers();
  }, []);

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${AppConfig.apiBaseUrl}/tasks/?token=${storedToken}`);
      const data = await response.json();
      if (response.ok) {
        const updatedTasks = data.map((task) => ({
          ...task,
          officerName: task.police_user,
          status: task.completed ? 'Completed' : 'Pending',
        }));
        setTasks(updatedTasks);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPoliceOfficers = async () => {
    try {
      const response = await fetch(`${AppConfig.apiBaseUrl}/police/`);
      const data = await response.json();
      if (response.ok) {
        setPoliceOfficers(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch police officers');
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() || !selectedPoliceUser) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const requestBody = {
      token: token,
      police_user: selectedPoliceUser,
      description: description,
    };

    try {
      const response = await fetch(`${AppConfig.apiBaseUrl}/tasks/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Task assigned successfully');
        setModalVisible(false);
        setDescription('');
        setSelectedPoliceUser('');
        fetchTasks();
      } else {
        Alert.alert('Error', data.message || 'Failed to assign task');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskCompletion = async (taskId: string) => {
    setIsUpdating(true);
    const requestBody = {
      token: token,
      completed: true, // Assuming you want to mark the task as completed
    };

    console.log('Updating task:', taskId, 'with token:', token);

    try {
        const response = await fetch(`${AppConfig.apiBaseUrl}/tasks/update/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('Response:', data); // Log the response data

        if (response.ok) {
            Alert.alert('Success', 'Task marked as completed');
            fetchTasks();
        } else {
            Alert.alert('Error', data.message || 'Failed to update task');
        }
    } catch (error) {
        Alert.alert('Error', 'Network error. Please try again.');
    } finally {
        setIsUpdating(false);
    }
};

  const getStatusColor = (status: string) => {
    return status === 'Completed' ? '#10b981' : '#3b82f6';
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskStatusBadge}>
        <Icon 
          name={item.status === 'Completed' ? 'check-circle' : 'pending'} 
          size={20} 
          color={getStatusColor(item.status)}
        />
        <Text style={[styles.taskStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.taskContent}>
        <View style={styles.officerInfo}>
          <Icon name="person" size={20} color="#64748b" />
          <Text style={styles.policeId}>{item.officerName}</Text>
        </View>
        <Text style={styles.taskDescription}>{item.description}</Text>
        {item.status === 'Pending' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => updateTaskCompletion(item.id)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="done-all" size={20} color="#fff" style={styles.completeIcon} />
                <Text style={styles.completeButtonText}>Complete Task</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e293b" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Task Management</Text>
          <Text style={styles.headerSubtitle}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} assigned
          </Text>
        </View>
      </View>

      {isLoading && !modalVisible ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add-task" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Task Assignment</Text>
                <Text style={styles.modalSubtitle}>Fill in the task details below</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Select Officer</Text>
                  <View style={styles.pickerContainer}>
                    <Icon name="badge" size={20} color="#64748b" style={styles.pickerIcon} />
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={selectedPoliceUser}
                        onValueChange={(itemValue) => setSelectedPoliceUser(itemValue)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select Officer" value="" />
                        {policeOfficers.map((officer) => (
                          <Picker.Item key={officer.id} label={officer.Name} value={officer.Name} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Task Description</Text>
                  <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                    <Icon name="assignment" size={20} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Describe the task in detail..."
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="check" size={24} color="#fff" style={styles.submitIcon} />
                    <Text style={styles.submitText}>Assign Task</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row', // Change to row to align items horizontally
    alignItems: 'center',  // Center items vertically
  },
  backButton: {
    // Fixed size for the back button
    width: 40, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Space between back button and title
  },
  titleContainer: {
    flexGrow: 1, // Allow this container to grow and fill available space
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  taskStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  taskContent: {
    padding: 16,
  },
  officerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  policeId: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  taskStatus: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  completeIcon: {
    marginRight: 8,
  },
  completeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  formSection: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  pickerIcon: {
    padding: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    height: 50,
    color: '#1e293b',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  textAreaWrapper: {
    minHeight: 120,
  },
  inputIcon: {
    padding: 12,
    paddingTop: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    padding: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  submitIcon: {
    marginRight: 8,
  },
});

export default TaskManagementScreen;