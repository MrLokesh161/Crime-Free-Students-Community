import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Button, ActivityIndicator, Image, TextInput } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import AppConfig from '../AppConfig';

export default class DashboardPage extends Component {
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

      // Implement pagination
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      // Format data to match table columns
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
      row[0].toLowerCase().includes(text.toLowerCase()) || // search by name
      row[4].toLowerCase().includes(text.toLowerCase())    // search by email
    );
    this.setState({ searchText: text, tableData: filteredData });
  };

  render() {
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
        {/* Topbar */}
        <View style={styles.topbar}>
          <Text style={styles.topbarText}>CFSC</Text>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} />
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

        {/* Container for Table Data */}
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

const styles = StyleSheet.create({
  pageContainer: {
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
  logo: {
    marginTop: 25,
    width: 50,
    height: 50,
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

