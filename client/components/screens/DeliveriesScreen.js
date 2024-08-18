import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderDetailModal from '../modals/DeliveryDetailModal';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// DELIVERIES SCREEN COMPONENT: Manages delivery orders display and status updates
const DeliveriesScreen = () => {
    // STATE MANAGEMENT: Store deliveries, selected order, and modal visibility
    const [deliveries, setDeliveries] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // EFFECT: Fetch deliveries when the component mounts
    useEffect(() => {
        fetchDeliveries();
    }, []);

    // FUNCTION: Fetches deliveries data from the API
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

    // FUNCTION: Handles press on an order to display its details in a modal
    const handleOrderPress = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    // FUNCTION: Handles status change of an order
    const handleStatusChange = async (order) => {
        const nextStatus = getNextStatus(order.status);

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

    // FUNCTION: Determines the next status in the order lifecycle
    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'pending':
                return 'in progress';
            case 'in progress':
                return 'delivered';
            default:
                return currentStatus;
        }
    };

    // FUNCTION: Formats address to show only the first part (before the first comma)
    const formatAddress = (address) => address.split(',')[0];

    // FUNCTION: Renders each order in the list
    const renderOrder = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCellId}>{item.id}</Text>
            <Text style={styles.tableCellAddress}>{formatAddress(item.customer_address)}</Text>
            <TouchableOpacity
                style={[
                    styles.tableCellStatus,
                    getStatusStyle(item.status),
                ]}
                onPress={() => handleStatusChange(item)}
            >
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleOrderPress(item)}
                style={styles.tableCellView}
            >
                <View style={styles.iconContainer}>
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} size={width * 0.05} color="#222126" />
                </View>
            </TouchableOpacity>
        </View>
    );

    // FUNCTION: Returns the corresponding style based on order status
    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return styles.statusPending;
            case 'in progress':
                return styles.statusInProgress;
            case 'delivered':
                return styles.statusDelivered;
            default:
                return {};
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>MY DELIVERIES</Text>
            <View style={styles.table}>
                {/* TABLE HEADER */}
                <View style={styles.tableHeader}>
                    <Text style={styles.headerTextId}>ORDER ID</Text>
                    <Text style={styles.headerTextAddress}>ADDRESS</Text>
                    <Text style={styles.headerTextStatus}>STATUS</Text>
                    <Text style={styles.headerTextView}>VIEW</Text>
                </View>
                {/* DELIVERY LIST */}
                <FlatList
                    data={deliveries}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id.toString()}
                    style={styles.scrollableList}
                />
            </View>
            {/* ORDER DETAIL MODAL */}
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

// STYLES: Define styles for various components used in the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,  // Ensures the container takes up the full screen height
        backgroundColor: '#FFFFFF',  // White background color for the screen
        paddingHorizontal: width * 0.053,  // Padding as a percentage of screen width for consistency
    },
    pageTitle: {
        fontSize: width * 0.07,  // Font size relative to screen width
        color: '#222126',  // Dark grey text color
        fontWeight: 'bold',  // Bold font weight for emphasis
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',  // 'Oswald-Regular' on iOS
            android: 'Oswald-Regular',  // 'Oswald-Regular' on Android
            default: 'Arial',  // Fallback font for other platforms
        }),
        marginTop: height * 0.037,  // Top margin relative to screen height
        marginBottom: height * 0.025,  // Bottom margin relative to screen height
        marginLeft: width * 0.027,  // Left margin relative to screen width
    },
    table: {
        width: '100%',  // Table width takes up full container width
        overflow: 'hidden',  // Prevent content overflow
        flex: 1,  // Allows the table to expand vertically
    },
    tableHeader: {
        flexDirection: 'row',  // Arrange header elements in a horizontal row
        backgroundColor: '#222126',  // Dark background for the header
        paddingVertical: height * 0.016,  // Vertical padding relative to screen height
        paddingHorizontal: width * 0.027,  // Horizontal padding relative to screen width
        alignItems: 'center',  // Center align header content vertically
    },
    headerTextId: {
        flex: 0.9,  // Flex value to control width relative to other header elements
        fontSize: width * 0.03,  // Font size relative to screen width
        color: '#FFFFFF',  // White text color for contrast against dark background
        fontWeight: 'bold',  // Bold font weight for emphasis
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'center',  // Center align text horizontally
        maxWidth: width * 0.15,  // Restrict the maximum width of the header element
    },
    headerTextAddress: {
        flex: 2,  // Flex value to control width relative to other header elements
        fontSize: width * 0.03,  // Font size relative to screen width
        color: '#FFFFFF',  // White text color for contrast against dark background
        fontWeight: 'bold',  // Bold font weight for emphasis
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'center',  // Center align text horizontally
        maxWidth: width * 0.3,  // Restrict the maximum width of the header element
    },
    headerTextStatus: {
        flex: 1.2,  // Flex value to control width relative to other header elements
        fontSize: width * 0.03,  // Font size relative to screen width
        color: '#FFFFFF',  // White text color for contrast against dark background
        fontWeight: 'bold',  // Bold font weight for emphasis
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'center',  // Center align text horizontally
        maxWidth: width * 0.22,  // Restrict the maximum width of the header element
    },
    headerTextView: {
        flex: 0.5,  // Flex value to control width relative to other header elements
        fontSize: width * 0.03,  // Font size relative to screen width
        color: '#FFFFFF',  // White text color for contrast against dark background
        fontWeight: 'bold',  // Bold font weight for emphasis
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'center',  // Center align text horizontally
        maxWidth: width * 0.15,  // Restrict the maximum width of the header element
        marginLeft: width * 0.015,  // Left margin relative to screen width
    },
    tableRow: {
        flexDirection: 'row',  // Arrange row elements in a horizontal row
        backgroundColor: '#FFFFFF',  // White background color for the row
        paddingVertical: height * 0.013,  // Vertical padding relative to screen height
        alignItems: 'center',  // Center align row content vertically
    },
    tableCellId: {
        flex: 0.9,  // Flex value to control width relative to other row elements
        textAlign: 'center',  // Center align text horizontally
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        fontSize: width * 0.035,  // Font size relative to screen width
        maxWidth: width * 0.2  // Restrict the maximum width of the cell
    },
    tableCellAddress: {
        flex: 2,  // Flex value to control width relative to other row elements
        textAlign: 'center',  // Center align text horizontally
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        fontSize: width * 0.03,  // Font size relative to screen width
        paddingHorizontal: width * 0.027,  // Horizontal padding relative to screen width
        maxWidth: width * 0.25,  // Restrict the maximum width of the cell
        flexWrap: 'wrap',  // Ensure the text wraps within the cell
    },
    tableCellStatus: {
        flex: 1.2,  // Flex value to control width relative to other row elements
        justifyContent: 'center',  // Center align content horizontally
        alignItems: 'center',  // Center align content vertically
        borderRadius: height * 0.006,  // Slightly rounded corners relative to screen height
        paddingVertical: height * 0.007,  // Vertical padding relative to screen height
        textAlign: 'center',  // Center align text horizontally
        maxWidth: width * 0.4  // Restrict the maximum width of the cell
    },
    tableCellView: {
        flex: 0.5,  // Flex value to control width relative to other row elements
        justifyContent: 'center',  // Center align content horizontally
        alignItems: 'center',  // Center align content vertically
        textAlign: 'center',  // Center align text horizontally
        maxWidth: width * 0.15,  // Restrict the maximum width of the cell
        marginLeft: width * 0.027,  // Left margin relative to screen width
    },
    iconContainer: {
        justifyContent: 'center',  // Center align content horizontally
        alignItems: 'center',  // Center align content vertically
        width: width * 0.1,  // Width relative to screen width
        height: height * 0.04,  // Height relative to screen height
    },
    statusPending: {
        backgroundColor: '#851919',  // Background color for 'pending' status
    },
    statusInProgress: {
        backgroundColor: '#DA583B',  // Background color for 'in progress' status
    },
    statusDelivered: {
        backgroundColor: '#609475',  // Background color for 'delivered' status
    },
    statusText: {
        fontSize: width * 0.035,  // Font size relative to screen width
        color: '#FFFFFF',  // White text color for contrast against colored background
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial',
        }),
        textAlign: 'center',  // Center align text horizontally
    },
    scrollableList: {
        maxHeight: height * 0.53,  // Restrict maximum height to allow scrolling
    },
});

export default DeliveriesScreen;
