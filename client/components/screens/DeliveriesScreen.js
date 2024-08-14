import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderDetailModal from '../modals/DeliveryDetailModal';

const { width } = Dimensions.get('window'); // Get the screen width

const DeliveriesScreen = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders?id=1&type=courier`);
            const data = await response.json();
            setDeliveries(data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            Alert.alert('Error', 'Unable to fetch deliveries. Please try again later.');
        }
    };

    const handleOrderPress = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleStatusChange = async (order) => {
        const nextStatus =
            order.status === 'pending' ? 'in progress' :
                order.status === 'in progress' ? 'delivered' :
                    order.status;

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/order/${order.id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (response.ok) {
                fetchDeliveries(); // Refresh the list after updating status
            } else {
                Alert.alert('Error', 'Failed to update the status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Unable to update status. Please try again later.');
        }
    };

    const formatAddress = (address) => {
        const parts = address.split(',');
        return parts[0];
    };

    const renderOrder = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCellId}>{item.id}</Text>
            <Text style={styles.tableCellAddress}>{formatAddress(item.customer_address)}</Text>
            <TouchableOpacity
                style={[
                    styles.tableCellStatus,
                    item.status === 'pending' ? styles.statusPending :
                        item.status === 'in progress' ? styles.statusInProgress :
                            styles.statusDelivered,
                ]}
                onPress={() => handleStatusChange(item)}
            >
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </TouchableOpacity>
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
            <Text style={styles.pageTitle}>MY DELIVERIES</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.tableCellId]}>ORDER ID</Text>
                    <Text style={[styles.tableHeaderText, styles.tableCellAddress]}>ADDRESS</Text>
                    <Text style={[styles.tableHeaderText, styles.tableCellStatus]}>STATUS</Text>
                    <Text style={[styles.tableHeaderText, styles.tableCellView]}>VIEW</Text>
                </View>
                <FlatList
                    data={deliveries}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id.toString()}
                    style={styles.scrollableList}
                />
            </View>
            {selectedOrder && (
                <OrderDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    orderDetail={selectedOrder}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20, // Ensure padding is consistent across platforms
        }),
    },
    pageTitle: {
        fontSize: Platform.select({
            ios: width * 0.06, // 6% of the screen width
            android: width * 0.06,
            default: 24, // Default fallback size
        }),
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial'
        }),
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 10,
    },
    table: {
        width: '100%',
        overflow: 'hidden',
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#222126',
        paddingVertical: Platform.select({
            ios: 13,
            android: 13,
            default: 13,
        }),
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    tableHeaderText: {
        fontSize: Platform.select({
            ios: width * 0.03, // 3% of the screen width
            android: width * 0.03,
            default: 12,
        }),
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
        alignItems: 'center',
    },
    tableCellId: {
        flex: 1,
        textAlign: 'center',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        fontSize: Platform.select({
            ios: width * 0.028, // Slightly smaller size, 2.8% of screen width
            android: width * 0.028,
            default: 11, // One size smaller than 12
        }),
    },
    tableCellAddress: {
        flex: 1.6,
        textAlign: 'center',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        fontSize: Platform.select({
            ios: width * 0.028, // Slightly smaller size, 2.8% of screen width
            android: width * 0.028,
            default: 11, // One size smaller than 12
        }),
        maxWidth: 80,
        paddingRight: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
    },
    tableCellStatus: {
        flex: 1.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: Platform.select({
            ios: 5,
            android: 5,
            default: 5,
        }),
        minWidth: 35,
    },
    tableCellView: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
        paddingLeft: 8,
    },
    statusPending: {
        backgroundColor: '#851919',
    },
    statusInProgress: {
        backgroundColor: '#DA583B',
    },
    statusDelivered: {
        backgroundColor: '#609475',
    },
    statusText: {
        fontSize: Platform.select({
            ios: width * 0.035, // 3.5% of the screen width
            android: width * 0.035,
            default: 14,
        }),
        color: '#FFFFFF',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial',
        }),
        textAlign: 'center',
    },
    scrollableList: {
        maxHeight: 400,
    },
});

export default DeliveriesScreen;
