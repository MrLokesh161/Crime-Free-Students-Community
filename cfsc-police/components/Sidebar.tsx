import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Sidebar = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.item}>Home</Text>
        <Text style={styles.item}>Profile</Text>
        <Text style={styles.item}>Settings</Text>
        {/* Add more items here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#fff',
    padding: 20,
    height: '100%',
  },
  closeButton: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 18,
    color: '#007BFF',
  },
  item: {
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default Sidebar;
