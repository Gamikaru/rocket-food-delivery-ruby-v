import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const OrderModal = ({ visible, onClose, menuItems, order }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const totalCost = Object.keys(order).reduce((sum, key) => {
            const item = menuItems.find(menuItem => menuItem.id === key);
            return sum + (order[key] * (item ? item.price : 0));
        }, 0);
        setTotal(totalCost);
    }, [order, menuItems]);

    const handleOrder = async () => {
        Alert.alert('Order placed successfully!');
        onClose();
    };

    const renderOrderSummary = () => {
        return menuItems.map(item => {
            if (order[item.id] > 0) {
                return (
                    <View style={styles.orderItem} key={item.id}>
                        <Text style={styles.orderItemText}>{item.name}</Text>
                        <Text style={styles.orderItemQuantity}>x{order[item.id]}</Text>
                        <Text style={styles.orderItemPrice}>${(order[item.id] * item.price).toFixed(2)}</Text>
                    </View>
                );
            }
            return null;
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Order Confirmation</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    {renderOrderSummary()}
                    <View style={styles.orderTotal}>
                        <Text style={styles.orderTotalText}>TOTAL:</Text>
                        <Text style={styles.orderTotalText}>${total.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleOrder}>
                        <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
                    </TouchableOpacity>
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
    modalContent: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222126',
        padding: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
    orderSummaryTitle: {
        fontSize: 16,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginVertical: 10,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 5,
    },
    orderItemText: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        flex: 1, // This ensures the text takes up available space
    },
    orderItemQuantity: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        textAlign: 'center',
        width: 30, // Fixed width for quantity to align vertically
    },
    orderItemPrice: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        textAlign: 'right',
        width: 80, // Fixed width for price to align vertically
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#222126',
        paddingTop: 10,
        marginTop: 10,
    },
    orderTotalText: {
        fontSize: 16,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
    confirmButton: {
        backgroundColor: '#DA583B',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
        width: '100%',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        textTransform: 'uppercase',
    },
});

export default OrderModal;
