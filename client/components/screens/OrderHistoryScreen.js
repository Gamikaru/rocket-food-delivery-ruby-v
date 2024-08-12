import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderHistoryDetailModal from '../modals/OrderHistoryDetailModal';

const OrderHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                if (userToken) {
                    const { user_id } = JSON.parse(userToken);
                    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders?id=${user_id}&type=customer`);
                    if (response.ok) {
                        const data = await response.json();
                        setOrders(data);
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

        fetchOrders();
    }, []);

    const handleOrderPress = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const renderOrder = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{item.restaurant_name}</Text>
            <Text style={styles.tableCellStatus}>{item.status.toUpperCase()}</Text>
            <TouchableOpacity
                onPress={() => handleOrderPress(item)}
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
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id.toString()}
                    style={styles.scrollableList} // Added this style to control height and scroll
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
        flex: 1, // Makes the table take up remaining space for the scrollable content
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#222126',
        padding: 8,
    },
    tableHeaderTextName: {
        flex: 2,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        paddingLeft: 10,
        paddingRight: 10,
    },
    tableHeaderTextStatus: {
        flex: 1,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        paddingLeft: 10,
        paddingRight: 32,
    },
    tableHeaderTextView: {
        flex: 0.5,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Arial',
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
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Arial',
        paddingLeft: 10,
        paddingRight: 10,
        flexShrink: 1, // Prevents text from shrinking too much
        minWidth: 100, // Ensures the column has enough space
        flexWrap: 'nowrap', // Prevents text wrapping
    },
    tableCellStatus: {
        flex: 1,
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Arial',
        paddingLeft: 0,
        paddingRight: 0,
        flexShrink: 1, // Prevents text from shrinking too much
        minWidth: 90, // Ensures the column has enough space
        flexWrap: 'nowrap', // Prevents text wrapping
    },
    tableCellView: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        minWidth: 50, // Ensures the column has enough space
    },
    scrollableList: {
        maxHeight: 400, // You can adjust this height or remove it if you want it to flex with the container
    },
});

export default OrderHistoryScreen;
