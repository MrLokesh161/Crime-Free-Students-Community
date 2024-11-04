import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const SearchableTable = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.tableContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Location</Text>
          <Text style={styles.headerText}>Age</Text>
        </View>
        {filteredData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={styles.cellText}>{item.name}</Text>
            <Text style={styles.cellText}>{item.location}</Text>
            <Text style={styles.cellText}>{item.age}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tableContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Header background color
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF', // Header text color
  },
  row: {
    flexDirection: 'row',
    padding: 10,
  },
  evenRow: {
    backgroundColor: '#E8F5E9', // Even row background color
  },
  oddRow: {
    backgroundColor: '#C8E6C9', // Odd row background color
  },
  cellText: {
    flex: 1,
    color: '#333', // Cell text color
  },
});

export default SearchableTable;
