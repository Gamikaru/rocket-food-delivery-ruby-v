import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeliveryDetailModal from '../modals/DeliveryDetailModal'; // Assume this modal is similar to OrderHistoryDetailModal

const DeliveriesScreen = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders?id=1&type=courier`); // Adjusted for courier type
            const data = await response.json();
            setDeliveries(data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            Alert.alert('Error', 'Unable to fetch deliveries. Please try again later.');
        }
    };

    const handleDeliveryPress = (delivery) => {
        setSelectedDelivery(delivery);
        setModalVisible(true);
    };

    const handleStatusChange = async (delivery) => {
        const nextStatus = delivery.status === 'pending' ? 'in progress' : delivery.status === 'in progress' ? 'delivered' : delivery.status;

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders/${delivery.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (response.ok) {
                fetchDeliveries(); // Refresh the deliveries list after updating status
            } else {
                Alert.alert('Error', 'Failed to update the status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Unable to update status. Please try again later.');
        }
    };

    // Function to extract building number and street from the full address
    const formatAddress = (address) => {
        const parts = address.split(',');
        return parts[0]; // Return only the building number and street
    };

    const renderDelivery = ({ item }) => (
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
                onPress={() => handleDeliveryPress(item)}
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
                    <Text style={styles.tableHeaderTextId}>ORDER ID</Text>
                    <Text style={styles.tableHeaderTextAddress}>ADDRESS</Text>
                    <Text style={styles.tableHeaderTextStatus}>STATUS</Text>
                    <Text style={styles.tableHeaderTextView}>VIEW</Text>
                </View>
                <FlatList
                    data={deliveries}
                    renderItem={renderDelivery}
                    keyExtractor={item => item.id.toString()}
                    style={styles.scrollableList} // Added this style to control height and scroll
                />
            </View>
            {selectedDelivery && (
                <DeliveryDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    deliveryDetail={selectedDelivery}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Background color
        paddingHorizontal: 20,
    },
    pageTitle: {
        fontSize: 24, 
        color: '#222126', // Text color
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 10,
    },
    table: {
        width: '100%',
        // borderRadius: 8, 
        overflow: 'hidden',
        flex: 1,
        
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#222126', // Header background color
        padding: 8,
        // borderTopLeftRadius: 8,
        // borderTopRightRadius: 8,
        alignItems: 'center', // Align items to center
    },
    tableHeaderTextId: {
        flex: 0.5,
        fontSize: 12,
        color: '#FFFFFF', // Text color
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center', // Center align text
    },
    tableHeaderTextAddress: {
        flex: 1,
        fontSize: 12,
        color: '#FFFFFF', // Text color
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center', // Center align text
    },
    tableHeaderTextStatus: {
        flex: 2,
        fontSize: 12,
        color: '#FFFFFF', // Text color
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center', // Center align text
    },
    tableHeaderTextView: {
        flex: 0.3,
        fontSize: 12,
        color: '#FFFFFF', // Text color
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center', // Center align text
        minWidth: 50,
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF', 
        padding: 10,
        alignItems: 'center', // Align items to center
    },
    tableCellId: {
        flex: 0.5,
        fontSize: 14, 
        color: '#222126', // Text color
        fontFamily: 'Arial',
        textAlign: 'center', // Center align text
    },
    tableCellAddress: {
        flex: 1.3,
        fontSize: 14, 
        color: '#222126', // Text color
        fontFamily: 'Arial',
        textAlign: 'left', // Left align text
        marginLeft: 20,
        marginRight: 10
    },
    tableCellStatus: {
        flex: 1.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 5,
        minWidth: 40,
        
    },
    statusPending: {
        backgroundColor: '#851919', // Pending status color
    },
    statusInProgress: {
        backgroundColor: '#DA583B', // In Progress status color
    },
    statusDelivered: {
        backgroundColor: '#609475', // Delivered status color
    },
    statusText: {
        fontSize: 14,
        color: '#FFFFFF', // Text color
        fontFamily: 'Oswald-Regular',
        textAlign: 'center', // Center align text
    },
    tableCellView: {
        flex: 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
        textAlign: 'center', // Center align text
    },
    scrollableList: {
        maxHeight: 400,
    },
});

export default DeliveriesScreen;
