import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const DeliveryDetailModal = ({ visible, onClose, orderDetail }) => {
    if (!orderDetail) return null;

    const formatAddress = (address) => {
        const parts = address.split(',');
        return parts[0];
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    outerBorder: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        padding: 8, // This will be the white border thickness
        marginTop: height * 0.15, // Lowered the position to be more centered
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,          // Make the border width consistent with OrderHistoryDetailModal
        borderColor: '#EEEEEE',  // Use the same grey border color as in OrderHistoryDetailModal
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center',
        backgroundColor: '#222126',
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20,
        }),
        paddingTop: Platform.select({
            ios: 25,
            android: 25,
            default: 25,
        }),
        paddingBottom: Platform.select({
            ios: 15,
            android: 15,
            default: 15,
        }),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headerTextContainer: {
        flexDirection: 'column',
        alignItems: 'center', // Center the title and status
    },
    orderInfoGroup: {
        paddingVertical: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),  // Increased vertical padding
        paddingLeft: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }), // Indent to the right
        flexDirection: 'column', // Ensure each label and value pair is stacked
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: Platform.select({
            ios: 6,
            android: 6,
            default: 6,
        }), // Space between rows
    },
    orderInfoLabel: {
        fontSize: Platform.select({
            ios: width * 0.035, // 3.5% of the screen width
            android: width * 0.035,
            default: 14,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
    },
    orderInfoValue: {
        fontSize: Platform.select({
            ios: width * 0.035, // 3.5% of the screen width
            android: width * 0.035,
            default: 14,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
    },
    mainTitle: {
        fontSize: Platform.select({
            ios: width * 0.06, // 6% of the screen width
            android: width * 0.06,
            default: 25, // Default fallback size
        }),
        color: '#DA583B',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
    },
    deliveryStatus: {
        fontSize: Platform.select({
            ios: width * 0.04, // 4% of the screen width
            android: width * 0.04,
            default: 18,
        }),
        color: '#FFFFFF',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginTop: Platform.select({
            ios: 5,
            android: 5,
            default: 5,
        }),
    },
    closeButton: {
        position: 'absolute', // Positioned close button to the right
        right: 20,
        top: 25,
    },
    contentContainer: {
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20,
        }),
        paddingVertical: Platform.select({
            ios: 15,
            android: 15,
            default: 15,
        }),
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: Platform.select({
            ios: width * 0.04, // 4% of the screen width
            android: width * 0.04,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }),
        marginTop: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
    },
    itemsContainer: {
        marginTop: Platform.select({
            ios: 15,
            android: 15,
            default: 15,
        }),
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: Platform.select({
            ios: 5,
            android: 5,
            default: 5,
        }),
    },
    itemName: {
        fontSize: Platform.select({
            ios: width * 0.04, // 4% of the screen width
            android: width * 0.04,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        flex: 3,
    },
    itemQuantity: {
        fontSize: Platform.select({
            ios: width * 0.04, // 4% of the screen width
            android: width * 0.04,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'left',
        flex: 1,
    },
    itemPrice: {
        fontSize: Platform.select({
            ios: width * 0.04, // 4% of the screen width
            android: width * 0.04,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'right',
        flex: 1,
    },
    separator: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginVertical: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
    },
    total: {
        fontSize: Platform.select({
            ios: width * 0.04, // 4% of the screen width
            android: width * 0.04,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial',
        }),
        textAlign: 'right',
        marginTop: Platform.select({
            ios: 2,
            android: 2,
            default: 2,
        }),
        marginBottom: Platform.select({
            ios: 12,
            android: 12,
            default: 12,
        }),
    },
    totalLabel: {
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
    },
    totalAmount: {
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
    },
});

export default DeliveryDetailModal;
