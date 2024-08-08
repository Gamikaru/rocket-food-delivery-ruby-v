import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderHistoryDetailModal from '../modals/OrderHistoryDetailModal';

const OrderHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const fetchedOrders = [
                { id: '1', name: 'Sweet Dragon', status: 'PENDING' },
                { id: '2', name: 'Spice BBQ', status: 'PENDING' },
                { id: '3', name: 'Golden Bar & Grill', status: 'PENDING' },
                { id: '4', name: 'Sweet Dragon', status: 'PENDING' },
                { id: '5', name: 'WJU Eats', status: 'PENDING' },
            ];
            setOrders(fetchedOrders);
        };

        fetchOrders();
    }, []);

    const handleOrderPress = (order) => {
        // Dummy data for order details
        const orderDetail = {
            id: order.id,
            name: order.name,
            date: '2023-01-01',
            total: 20.75,
            items: [
                { id: '1', name: 'Cheeseburger', quantity: 1, price: 0.50 },
                { id: '2', name: 'Scotch Eggs', quantity: 1, price: 20.25 },
            ],
            courier: 'John Doe',
            status: 'PENDING'
        };
        setSelectedOrder(orderDetail);
        setModalVisible(true);
    };

    const renderOrder = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{item.name}</Text>
            <Text style={styles.tableCellStatus}>{item.status}</Text>
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
                    keyExtractor={item => item.id}
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
