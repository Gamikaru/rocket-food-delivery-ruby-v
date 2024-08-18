import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderHistoryDetailModal from '../modals/OrderHistoryDetailModal';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

const OrderHistoryScreen = ({ navigation }) => {
    // State to hold fetched orders and track the selected order for modal display
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Retrieve the user token from AsyncStorage
                const userToken = await AsyncStorage.getItem('userToken');
                if (userToken) {
                    const { user_id } = JSON.parse(userToken);
                    // Make an API request to fetch orders associated with the logged-in user
                    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders?id=${user_id}&type=customer`);
                    if (response.ok) {
                        const data = await response.json();
                        setOrders(data); // Store the fetched orders in the state
                    } else {
                        Alert.alert('Error', 'Failed to fetch orders. Please try again later.');
                    }
                } else {
                    Alert.alert('Error', 'User not authenticated. Please log in again.');
                    navigation.navigate('Login');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                Alert.alert('Error', 'An error occurred while fetching your order history.');
            }
        };

        fetchOrders(); // Fetch orders on component mount
    }, []);

    // Handle the selection of an order, triggering the modal to open
    const handleOrderPress = (order) => {
        setSelectedOrder(order); // Set the selected order in the state
        setModalVisible(true); // Show the order details modal
    };

    // Render each order in the FlatList
    const renderOrder = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{item.restaurant_name}</Text>
            <Text style={styles.tableCellStatus}>{item.status.toUpperCase()}</Text>
            <TouchableOpacity onPress={() => handleOrderPress(item)} style={styles.tableCellView}>
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} size={width * 0.05} color="#222126" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>MY ORDERS</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderTextName}>ORDER</Text>
                    <Text style={styles.tableHeaderTextStatus}>STATUS</Text>
                    <Text style={styles.tableHeaderTextView}>VIEW</Text>
                </View>
                {/* FlatList to display the list of orders */}
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id.toString()}
                    style={styles.scrollableList}
                />
            </View>
            {selectedOrder && (
                <OrderHistoryDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    orderDetail={selectedOrder}
                />
            )}
        </View>
    );
};

// Styles for the OrderHistoryScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1,  // Full screen height
        backgroundColor: '#FFFFFF',  // White background color
        paddingHorizontal: width * 0.053,  // Responsive horizontal padding
    },
    pageTitle: {
        fontSize: width * 0.07,  // Responsive font size
        color: '#222126',  // Dark text color
        fontWeight: 'bold',  // Bold text
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Platform-specific font family
        marginTop: height * 0.04,  // Top margin relative to screen height
        marginBottom: height * 0.025,  // Bottom margin relative to screen height
        marginLeft: width * 0.027,  // Left margin relative to screen width
    },
    table: {
        width: '100%',  // Full width of the screen
        flex: 1,  // Occupy the remaining space for scrollable content
    },
    tableHeader: {
        flexDirection: 'row',  // Horizontal row for header columns
        backgroundColor: '#222126',  // Dark background color
        padding: height * 0.01,  // Padding relative to screen height
    },
    tableHeaderTextName: {
        flex: 2,  // Larger space for the order name column
        fontSize: width * 0.043,  // Responsive font size
        color: '#FFFFFF',  // White text color
        fontWeight: 'bold',  // Bold text
        fontFamily: 'Arial',  // Arial font
        paddingLeft: width * 0.027,  // Left padding relative to screen width
        paddingRight: width * 0.027,  // Right padding relative to screen width
    },
    tableHeaderTextStatus: {
        flex: 1,  // Moderate space for the status column
        fontSize: width * 0.04,  // Responsive font size
        color: '#FFFFFF',  // White text color
        fontWeight: 'bold',  // Bold text
        fontFamily: 'Arial',  // Arial font
        paddingLeft: width * 0.027,  // Left padding relative to screen width
        paddingRight: width * 0.085,  // Right padding relative to screen width
    },
    tableHeaderTextView: {
        flex: 0.5,  // Smaller space for the view column
        fontSize: width * 0.04,  // Responsive font size
        color: '#FFFFFF',  // White text color
        fontWeight: 'bold',  // Bold text
        fontFamily: 'Arial',  // Arial font
        paddingLeft: width * 0.027,  // Left padding relative to screen width
        paddingRight: width * 0.027,  // Right padding relative to screen width
        textAlign: 'center',  // Center align text
        minWidth: width * 0.133,  // Ensure enough space for the column
    },
    tableRow: {
        flexDirection: 'row',  // Horizontal row for content columns
        backgroundColor: '#FFFFFF',  // White background color
        padding: height * 0.012,  // Padding relative to screen height
    },
    tableCellName: {
        flex: 2,  // Larger space for the order name
        fontSize: width * 0.04,  // Responsive font size
        color: '#222126',  // Dark text color
        fontFamily: 'Arial',  // Arial font
        paddingLeft: width * 0.027,  // Left padding relative to screen width
        paddingRight: width * 0.027,  // Right padding relative to screen width
        flexShrink: 1,  // Prevent text from shrinking too much
        minWidth: width * 0.267,  // Ensure enough space for the column
    },
    tableCellStatus: {
        flex: 1,  // Moderate space for the status
        fontSize: width * 0.04,  // Responsive font size
        color: '#222126',  // Dark text color
        fontFamily: 'Arial',  // Arial font
        flexShrink: 1,  // Prevent text from shrinking too much
        minWidth: width * 0.24,  // Ensure enough space for the column
    },
    tableCellView: {
        flex: 0.5,  // Smaller space for the view icon
        justifyContent: 'center',  // Center align vertically
        alignItems: 'center',  // Center align horizontally
        minWidth: width * 0.133,  // Ensure enough space for the icon
    },
    scrollableList: {
        maxHeight: height * 0.53,  // Maximum height for scrollable list relative to screen height
    },
});

export default OrderHistoryScreen;
