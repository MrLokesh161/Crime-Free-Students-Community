import React, { useState, useEffect } from "react";
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
  Image
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppConfig from "../AppConfig";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

interface Broadcast {
  id: string;
  title: string;
  description: string;
  place: string;
  date: string;
  image: string | null;
  dateFormatted: string;
}

const { width } = Dimensions.get("window");

const TaskManagementScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [token, setToken] = useState("");
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate); // Set date only if a valid date is selected
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    getToken();
    fetchBroadcasts();
  }, []);

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
  };

  const fetchBroadcasts = async () => {
    setIsLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${AppConfig.apiBaseUrl}/broadcast/`);
      const data = await response.json();
  
      if (response.ok) {
        const updatedBroadcasts = data.map((broadcast) => ({
          ...broadcast,
          dateFormatted: format(new Date(broadcast.date), 'yyyy-MM-dd'), // Format the date if needed
          image: broadcast.image ? `${AppConfig.apiBaseUrl}${broadcast.image}` : null, // Prepend the base URL to image URL
        }));
        console.log(updatedBroadcasts);
        setBroadcasts(updatedBroadcasts);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch broadcasts");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleBroadcastSubmit = async () => {
    if (!title.trim() || !description.trim() || !place.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("place", place);
    formData.append("date", formattedDate);

    if (image) {
      const filename = image.split("/").pop();
      const type = `image/${filename.split(".").pop()}`;
      formData.append("image", {
        uri: image,
        name: filename,
        type,
      });
    }

    try {
      const response = await fetch(
        `${AppConfig.apiBaseUrl}/broadcast/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Broadcast created successfully");
        setModalVisible(false);
        setTitle("");
        setDescription("");
        setPlace("");
        setDate(new Date()); // Reset date to today's date
        setImage(null);
        fetchBroadcasts(); // Refresh broadcasts if needed
      } else {
        Alert.alert("Error", data.message || "Failed to create broadcast");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderBroadcastItem = ({ item }: { item: Broadcast }) => (
    <View style={styles.broadcastItem}>
      <View style={styles.broadcastHeader}>
        <Text style={styles.broadcastTitle}>{item.title}</Text>
        <Text style={styles.broadcastDate}>{item.dateFormatted}</Text>
      </View>
  
      <Text style={styles.broadcastDescription}>{item.description}</Text>
      <Text style={styles.broadcastPlace}>Place: {item.place}</Text>
  
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.broadcastImage} />
      )}
  
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e293b" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>BroadCast</Text>
          <Text style={styles.headerSubtitle}>
            {title.length} {title.length === 1 ? "Event" : "Events"} active
          </Text>
        </View>
      </View>

      {isLoading && !modalVisible ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={broadcasts} // Pass the state data here
          renderItem={renderBroadcastItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isLoading}
          onRefresh={fetchBroadcasts}  // Pull to refresh functionality
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add-task" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Broadcast</Text>
                <Text style={styles.modalSubtitle}>
                  Fill in the broadcast details below
                </Text>
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
                {/* Title Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Broadcast Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter broadcast title..."
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* Description Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Broadcast Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter broadcast description..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* Place Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Place</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter location of broadcast..."
                    value={place}
                    onChangeText={setPlace}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* Date Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateInput}
                  >
                    <Text style={styles.dateText}>
                      {date ? format(date, "yyyy-MM-dd") : "Select Date"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date || new Date()} // Show today's date in the picker if no date is selected
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>

                {/* Image Picker */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Image</Text>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.imagePickerButton}
                  >
                    <Icon
                      name="photo"
                      size={20}
                      color="#64748b"
                      style={styles.pickerIcon}
                    />
                    <Text style={styles.imagePickerText}>Pick an image</Text>
                  </TouchableOpacity>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleBroadcastSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon
                      name="check"
                      size={24}
                      color="#fff"
                      style={styles.submitIcon}
                    />
                    <Text style={styles.submitText}>Create Broadcast</Text>
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
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e293b",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    flexDirection: "row", // Change to row to align items horizontally
    alignItems: "center", // Center items vertically
  },
  backButton: {
    // Fixed size for the back button
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16, // Space between back button and title
  },
  titleContainer: {
    flexGrow: 1, // Allow this container to grow and fill available space
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#ffffff",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskList: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  taskStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  taskContent: {
    padding: 16,
  },
  officerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  policeId: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  taskStatus: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  taskDescription: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  completeIcon: {
    marginRight: 8,
  },
  completeButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#3b82f6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#f1f5f9",
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
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  pickerIcon: {
    padding: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    height: 50,
    color: "#1e293b",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
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
    color: "#1e293b",
    padding: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  submitIcon: {
    marginRight: 8,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    marginTop: 10,
  },
  imagePickerText: {
    color: "#64748b",
    marginLeft: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginTop: 10,
    borderRadius: 5,
  },
  broadcastItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  broadcastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  broadcastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  broadcastDate: {
    fontSize: 14,
    color: '#64748b',
  },
  broadcastDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  broadcastPlace: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  broadcastImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  actionsContainer: {
    alignItems: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TaskManagementScreen;
