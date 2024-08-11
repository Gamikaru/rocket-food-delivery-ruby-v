import { FontAwesome } from '@expo/vector-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const OrderModal = ({ visible, onClose, menuItems, order, restaurantId }) => {
    const [total, setTotal] = useState(0); // State to track the total cost of the order
    const [isProcessing, setIsProcessing] = useState(false); // State to track if the order is being processed
    const [orderStatus, setOrderStatus] = useState(null); // State to track the outcome of the order ('success', 'failure')
    const [isOrderValid, setIsOrderValid] = useState(false); // State to check if there is any item selected

    useEffect(() => {
        const totalCost = Object.keys(order).reduce((sum, key) => {
            const item = menuItems.find(menuItem => menuItem.id === parseInt(key));
            return sum + (order[key] * (item ? item.cost : 0));
        }, 0);
        setTotal(totalCost); // Update the total state

        const hasItems = Object.values(order).some(quantity => quantity > 0);
        setIsOrderValid(hasItems); // Update the isOrderValid state
    }, [order, menuItems]);

    const handleOrder = async () => {
        if (!isOrderValid) {
            Alert.alert('Order Error', 'Please select at least one item to place an order.');
            return;
        }

        setIsProcessing(true);
        setOrderStatus(null);

        const orderData = {
            restaurant_id: restaurantId,  // Use the dynamic restaurant ID passed as a prop
            customer_id: 3,   // Replace with the correct dynamic ID if necessary
            products: Object.keys(order)
                .filter(key => order[key] > 0) // Filter out products with quantity 0
                .map(key => ({
                    id: parseInt(key),
                    quantity: order[key]
                }))
        };

        console.log('Order data:', JSON.stringify(orderData));

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            console.log('API Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Response Error:', errorText);

                if (response.headers.get('content-type').includes('text/html')) {
                    throw new Error('Unexpected HTML response received. Possible server error.');
                }

                throw new Error(`Failed to place order: ${errorText}`);
            }

            const responseData = await response.json();
            console.log('Order created successfully:', responseData);
            setOrderStatus('success');
        } catch (error) {
            console.error('Error placing order:', error.message);
            setOrderStatus('failure');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderOrderSummary = () => {
        return menuItems.map(item => {
            if (order[item.id] > 0) {
                return (
                    <View style={styles.orderItem} key={item.id}>
                        <Text style={styles.orderItemText}>{item.name}</Text>
                        <Text style={styles.orderItemQuantity}>x{order[item.id]}</Text>
                        <Text style={styles.orderItemPrice}>${(order[item.id] * item.cost / 100).toFixed(2)}</Text>
                    </View>
                );
            }
            return null; // Do not render items with 0 quantity
        });
    };

    return (
        <Modal
            visible={visible} // Control the visibility of the modal
            animationType="slide"
            transparent={true}
            onRequestClose={onClose} // Close the modal when requested
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Order Confirmation</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesomeIcon icon={faX} size={24} color="grey" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    {renderOrderSummary()}
                    <View style={styles.orderTotal}>
                        <Text style={styles.orderTotalTextBold}>TOTAL:</Text>
                        <Text style={styles.orderTotalTextRegular}>${(total / 100).toFixed(2)}</Text>
                    </View>
                    {/* Conditionally render the confirm button */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.separator} />
                    </View>
                    {orderStatus !== 'success' && (
                        <TouchableOpacity
                            style={[styles.confirmButton, (!isOrderValid || isProcessing || orderStatus === 'success') && { backgroundColor: '#999999' }]}
                            onPress={handleOrder}
                            disabled={!isOrderValid || isProcessing || orderStatus === 'success'}
                        >
                            <Text style={styles.confirmButtonText}>
                                {isProcessing ? 'PROCESSING ORDER...' : 'CONFIRM ORDER'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {orderStatus === 'success' && (
                        <View style={styles.statusContainer}>
                            <FontAwesome name="check-circle" size={40} color="green" />
                            <Text style={styles.statusMessage}>Order Successful!</Text>
                        </View>
                    )}
                    {orderStatus === 'failure' && (
                        <View style={styles.statusContainer}>
                            <FontAwesome name="times-circle" size={40} color="red" />
                            <Text style={styles.statusMessage}>Order Failed. Please try again.</Text>
                        </View>
                    )}
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
        padding: 10,
        alignItems: 'center',

    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222126',
        padding: 20,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: 'black', // Shadow color
        shadowOffset: { width: -2, height: 2 }, // Offset the shadow to the left and bottom
        shadowOpacity: 0.4, // Set the opacity to create a subtle effect
        shadowRadius: 1, // Blurring radius of the shadow
        elevation: 5, // Elevation for Android shadow rendering
    },

    modalTitle: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
    orderSummaryTitle: {
        fontSize: 18,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Bold',
        alignSelf: 'flex-start', // Align 'Order Summary' to the left
        marginTop: 20,
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
        fontFamily: 'Helvetica', // Use Helvetica for the item info
        flex: 1,
    },
    orderItemQuantity: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Helvetica', // Use Helvetica for the item quantity
        textAlign: 'center',
        width: 30,
    },
    orderItemPrice: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Helvetica', // Use Helvetica for the item price
        textAlign: 'right',
        width: 80,
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#222126',
        marginTop: 5,
    },
    orderTotalTextBold: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Oswald-Bold', // Use Oswald-Bold for the 'TOTAL:' label
        fontWeight: 'bold',
    },
    orderTotalTextRegular: {
        fontSize: 16,
        color: '#222126',
        fontFamily: 'Oswald-Regular', // Use Oswald-Regular for the total value
        marginLeft: 5, // Add a small margin if needed to space the $ value from the 'TOTAL:' label
    },
    confirmButton: {
        backgroundColor: '#DA583B',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
        width: '100%',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        textTransform: 'uppercase',
    },
    statusContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    statusMessage: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        marginTop: 10,
    },
    separatorContainer: {
        width: '100%',         // Make sure the container is full width
        paddingHorizontal: 0,  // Remove any padding
        marginVertical: 10,    // Keep the vertical margin as needed
    },
    separator: {
        borderBottomColor: '#EEEEEE', // Light grey color
        borderBottomWidth: 1,         // Thin line
        width: '100%',                // Explicitly set the width to 100%
    },
    


});

export default OrderModal;
