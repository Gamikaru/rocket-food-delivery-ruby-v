import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const OrderHistoryDetailModal = ({ visible, onClose, orderDetail }) => {
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
                        {/* Modal Header with Restaurant Name */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.restaurantName}>{orderDetail.restaurant_name}</Text>
                        </View>
                        {/* Header Info with Order Date, Status, and Courier */}
                        <View style={styles.headerInfoContainer}>
                            <View style={styles.headerInfo}>
                                <Text style={styles.orderInfo}>Order Date: {new Date(orderDetail.created_at).toLocaleDateString()}</Text>
                                <Text style={styles.orderInfo}>Status: {orderDetail.status.toUpperCase()}</Text>
                                <Text style={styles.orderInfo}>Courier: {orderDetail.courier_name || 'N/A'}</Text>
                            </View>
                            {/* Close Button */}
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <FontAwesomeIcon icon={faX} size={24} color="grey" />
                            </TouchableOpacity>
                        </View>
                        {/* Content with Ordered Items and Total Cost */}
                        <View style={styles.contentContainer}>
                            <View style={styles.itemsContainer}>
                                {orderDetail.products.map(item => (
                                    <View key={item.product_id} style={styles.itemRow}>
                                        <Text style={styles.itemName}>{item.product_name}</Text>
                                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                        <Text style={styles.itemPrice}>${(item.total_cost / 100).toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.separator} />
                            <Text style={styles.total}>
                                <Text style={styles.totalLabel}>TOTAL: </Text>
                                ${((orderDetail.total_cost || 0) / 100).toFixed(2)}
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
        marginTop: 0.3 * height,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#EEEEEE', // Thin grey border
    },
    modalHeader: {
        backgroundColor: '#222126',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    restaurantName: {
        fontSize: 28,
        color: '#E95420',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Bold',
    },
    headerInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align items to the start (top)
        backgroundColor: '#222126',
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 15,
    },
    headerInfo: {
        flex: 1,
    },
    orderInfo: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'helvetica',
        marginVertical: 2,
    },
    closeButton: {
        paddingTop: 0, // Adjust padding to align with text
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    itemsContainer: {
        marginVertical: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 5,
    },
    itemName: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'helvetica',
        flex: 3,
    },
    itemQuantity: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'helvetica',
        textAlign: 'center',
        flex: 1,
    },
    itemPrice: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'helvetica',
        textAlign: 'right',
        flex: 1,
    },
    separator: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    total: {
        fontSize: 18,
        color: '#222126',
        fontWeight: 'normal',
        fontFamily: 'helvetica',
        textAlign: 'right',
        marginTop: 10,
    },
    totalLabel: {
        fontWeight: 'bold',
        fontFamily: 'Oswald-Bold',
    },
});

export default OrderHistoryDetailModal;
