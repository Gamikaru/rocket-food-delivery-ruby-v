import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const DeliveryDetailModal = ({ visible, onClose, orderDetail }) => {
    if (!orderDetail) return null; // Return nothing if no order details are provided

    // Extracts the primary part of an address (before the first comma)
    const formatAddress = (address) => {
        const parts = address.split(',');
        return parts[0];
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose} // Closes the modal when the user presses the back button
        >
            <View style={styles.modalContainer}>
                <View style={styles.outerBorder}>
                    <View style={styles.modalContent}>
                        {/* Modal Header with Title and Status */}
                        <View style={styles.modalHeader}>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.mainTitle}>DELIVERY DETAILS</Text>
                                <Text style={styles.deliveryStatus}>Status: {orderDetail.status.toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <FontAwesomeIcon icon={faX} size={24} color="grey" />
                            </TouchableOpacity>
                        </View>

                        {/* Main Content Area */}
                        <View style={styles.contentContainer}>
                            <View style={styles.orderInfoGroup}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.orderInfoLabel}>Delivery Address: </Text>
                                    <Text style={styles.orderInfoValue}>{formatAddress(orderDetail.customer_address)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.orderInfoLabel}>Restaurant: </Text>
                                    <Text style={styles.orderInfoValue}>{orderDetail.restaurant_name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.orderInfoLabel}>Order Date: </Text>
                                    <Text style={styles.orderInfoValue}>
                                        {new Date(orderDetail.created_at).toISOString().slice(0, 10).replace(/-/g, '/')}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.sectionTitle}>Order Details:</Text>
                            <View style={styles.itemsContainer}>
                                {orderDetail.products.map(item => (
                                    <View key={item.product_id} style={styles.itemRow}>
                                        <Text style={styles.itemName}>{item.product_name}</Text>
                                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                        <Text style={styles.itemPrice}>$ {(item.total_cost / 100).toFixed(2)}</Text>
                                    </View>
                                ))}
                                <View style={styles.separator} />
                            </View>
                            <Text style={styles.total}>
                                <Text style={styles.totalLabel}>TOTAL: </Text>
                                <Text style={styles.totalAmount}>$ {((orderDetail.total_cost || 0) / 100).toFixed(2)}</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black background for overlay
    },
    outerBorder: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        padding: 8, // White border thickness
        marginTop: height * 0.15, // Positioning to center the modal vertically
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#EEEEEE', // Light gray border color
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center', // Centers the header content
        alignItems: 'center',
        backgroundColor: '#222126', // Dark background for header
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headerTextContainer: {
        flexDirection: 'column',
        alignItems: 'center', // Center the title and status vertically
    },
    orderInfoGroup: {
        paddingVertical: 10,  // Vertical padding for spacing
        paddingLeft: 10,  // Slight indent from the left
        flexDirection: 'column',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6,  // Space between rows
    },
    orderInfoLabel: {
        fontSize: width * 0.035, // 3.5% of screen width for consistent scaling
        color: '#222126', // Dark text color
        fontFamily: 'Arial',
    },
    orderInfoValue: {
        fontSize: width * 0.035,
        color: '#222126',
        fontFamily: 'Arial',
    },
    mainTitle: {
        fontSize: width * 0.06, // 6% of screen width for large title
        color: '#DA583B', // Accent color for the title
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
    },
    deliveryStatus: {
        fontSize: width * 0.04, // Smaller size for status text
        color: '#FFFFFF', // White text for contrast against dark background
        fontFamily: 'Arial',
        marginTop: 5, // Space between title and status
    },
    closeButton: {
        position: 'absolute', // Position in the top-right corner
        right: 20,
        top: 25,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: width * 0.04,
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }),
        marginTop: 10, // Space above section title
    },
    itemsContainer: {
        marginTop: 15, // Space above the order items list
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 5,
    },
    itemName: {
        fontSize: width * 0.04,
        color: '#222126',
        fontFamily: 'Arial',
        flex: 3, // Take up more space for the name
    },
    itemQuantity: {
        fontSize: width * 0.04,
        color: '#222126',
        fontFamily: 'Arial',
        textAlign: 'left',
        flex: 1,
    },
    itemPrice: {
        fontSize: width * 0.04,
        color: '#222126',
        fontFamily: 'Arial',
        textAlign: 'right',
        flex: 1,
    },
    separator: {
        borderBottomColor: '#000000', // Darker separator line
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    total: {
        fontSize: width * 0.04,
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial',
        }),
        textAlign: 'right',
        marginTop: 2,
        marginBottom: 12,
    },
    totalLabel: {
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    totalAmount: {
        fontFamily: 'Arial',
    },
});

export default DeliveryDetailModal;
