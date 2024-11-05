import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import AppConfig from '../AppConfig';
import { useNavigation } from '@react-navigation/native';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      currentPage: 1,
      rowsPerPage: 30,
      tableHead: [
        'Name', 'Age', 'Aadhar Number', 'Phone Number', 'Email', 'Course', 'Course Year',
        'Passing Out Year', 'College Register No', 'College', 'Parents Address', 'Parents Phone',
        'Present Address', 'Latitude', 'Longitude', 'Residency', 'Owner Name', 'Owner Phone',
        'Room No', 'Previous Cases', 'Vehicle No', 'Flagged Reason', 'Flag Count'
      ],
      widthArr: [
        120, 50, 130, 120, 180, 150, 100, 120, 150, 200, 200, 150, 200, 150, 100,
        120, 130, 150, 150, 120, 150, 100, 150
      ],
      originalData: [],
      tableData: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { currentPage, rowsPerPage } = this.state;
    try {
      const response = await axios.get(`${AppConfig.apiBaseUrl}/userprofiles/`);
      const data = response.data;

      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      const formattedData = paginatedData.map(row => [
        row.name, row.age, row.aadhar_number, row.phone_number, row.email_id,
        row.course_name, row.course_year, row.passingout_year, row.college_register_number,
        row.college_name, row.parents_address, row.parents_phone_number, row.present_residential_address,
        row.latitude, row.longitude, row.residency_name, row.residency_ownername, row.owner_phone_number,
        row.room_number, row.previous_cases_count, row.vehicle_number, row.flagged_reason, row.flag_count
      ]);

      this.setState({ originalData: formattedData, tableData: formattedData, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  handlePageChange = (direction) => {
    this.setState(
      (prevState) => ({
        currentPage: direction === 'next' ? prevState.currentPage + 1 : prevState.currentPage - 1,
      }),
      this.fetchData
    );
  };

  handleSearch = (text) => {
    const { originalData } = this.state;
    const filteredData = originalData.filter(row =>
      row[0].toLowerCase().includes(text.toLowerCase()) ||
      row[4].toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ searchText: text, tableData: filteredData });
  };

  render() {
    const { navigation } = this.props;
    const { tableHead, widthArr, tableData, loading, error, currentPage, searchText } = this.state;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    return (
      <View style={styles.pageContainer}>
        <StatusBar backgroundColor="#1e293b" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            placeholder="Search by name or email"
            onChangeText={this.handleSearch}
          />
        </View>

        {/* Table and Pagination */}
        <View style={styles.container}>
          <ScrollView horizontal>
            <View>
              <Table borderStyle={styles.tableBorder}>
                <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.headText} />
                <Rows data={tableData} widthArr={widthArr} textStyle={styles.text} />
              </Table>
            </View>
          </ScrollView>

          {/* Pagination Controls */}
          <View style={styles.pagination}>
            <Button
              title="Previous"
              onPress={() => this.handlePageChange('prev')}
              disabled={currentPage === 1}
            />
            <Text style={styles.pageNumber}>Page {currentPage}</Text>
            <Button
              title="Next"
              onPress={() => this.handlePageChange('next')}
            />
          </View>
        </View>
      </View>
    );
  }
}

function DashboardPageWithNavigation(props) {
  const navigation = useNavigation();
  return <DashboardPage {...props} navigation={navigation} />;
}

export default DashboardPageWithNavigation;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  tableBorder: {
    borderColor: '#c8e1ff',
    borderWidth: 1,
  },
  head: {
    height: 50,
    backgroundColor: '#f1f8ff',
  },
  headText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  pageNumber: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});
