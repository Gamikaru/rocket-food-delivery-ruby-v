import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing data locally
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderHistoryDetailModal from '../modals/OrderHistoryDetailModal';

const OrderHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]); // State to store the list of orders
    const [selectedOrder, setSelectedOrder] = useState(null); // State to store the currently selected order
    const [modalVisible, setModalVisible] = useState(false); // State to manage the visibility of the order detail modal

    // useEffect hook to fetch orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Get the stored user token (which includes the user_id)
                const userToken = await AsyncStorage.getItem('userToken');

                // Check if userToken is available
                if (userToken) {
                    const { user_id } = JSON.parse(userToken); // Extract user_id from the token

                    // Make an API request to fetch the order history for the logged-in user
                    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders?id=${user_id}&type=customer`);

                    // Check if the response is OK (status code 200-299)
                    if (response.ok) {
                        const data = await response.json(); // Parse the JSON response

                        // Set the fetched orders to the state
                        setOrders(data);
                    } else {
                        // Handle errors by showing an alert
                        Alert.alert('Error', 'Failed to fetch orders. Please try again later.');
                    }
                } else {
                    // Handle the case where userToken is missing
                    Alert.alert('Error', 'User not authenticated. Please log in again.');
                    navigation.navigate('Login'); // Navigate to the login screen
                }
            } catch (error) {
                // Handle any errors that occur during the fetch
                console.error('Error fetching orders:', error);
                Alert.alert('Error', 'An error occurred while fetching your order history.');
            }
        };

        fetchOrders(); // Call the function to fetch orders
    }, []);

    // Function to handle the selection of an order
    const handleOrderPress = (order) => {
        setSelectedOrder(order); // Set the selected order
        setModalVisible(true); // Show the order detail modal
    };

    // Function to render each order in the list
    const renderOrder = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{item.restaurant_name}</Text>
            <Text style={styles.tableCellStatus}>{item.status.toUpperCase()}</Text>
            <TouchableOpacity
                onPress={() => handleOrderPress(item)} // Pass the selected order to the handler
                style={styles.tableCellView}
            >
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} size={20} color="#222126" />
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
                {/* Render the list of orders using FlatList */}
                <FlatList
                    data={orders} // Pass the orders array to FlatList
                    renderItem={renderOrder} // Use renderOrder to render each item
                    keyExtractor={item => item.id.toString()} // Use the order ID as the key
                />
            </View>
            {/* Show the order detail modal when an order is selected */}
            {selectedOrder && (
                <OrderHistoryDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)} // Close the modal when requested
                    orderDetail={selectedOrder} // Pass the selected order details to the modal
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    pageTitle: {
        fontSize: 30,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 10,
    },
    table: {
        width: '100%',
        borderRadius: 0,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#222126',
        padding: 10,
    },
    tableHeaderTextName: {
        flex: 2,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'helvetica',
        paddingLeft: 10,
        paddingRight: 10,
    },
    tableHeaderTextStatus: {
        flex: 1,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'helvetica',
        paddingLeft: 10,
        paddingRight: 10,
    },
    tableHeaderTextView: {
        flex: 0.5,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'helvetica',
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
        minWidth: 50,
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    tableCellName: {
        flex: 2,
        fontSize: 16,
        color: '#222126',
        fontFamily: 'helvetica',
        paddingLeft: 10,
        paddingRight: 10,
    },
    tableCellStatus: {
        flex: 1,
        fontSize: 16,
        color: '#222126',
        fontFamily: 'helvetica',
        paddingLeft: 10,
        paddingRight: 10,
    },
    tableCellView: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        minWidth: 50,
    },
});

export default OrderHistoryScreen;
