import { FontAwesome5 } from '@expo/vector-icons';
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
                        <Text style={styles.orderItemPrice}>$ {(order[item.id] * item.cost / 100).toFixed(2)}</Text>
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
                            <FontAwesomeIcon icon={faX} size={30} color="grey" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    {renderOrderSummary()}
                    <View style={styles.orderTotal}>
                        <Text style={styles.orderTotalTextBold}>TOTAL:</Text>
                        <Text style={styles.orderTotalTextRegular}>$ {(total / 100).toFixed(2)}</Text>
                    </View>
                    {/* Conditionally render the confirm button */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.separator} />
                    </View>
                    {orderStatus !== 'success' && (
                        <TouchableOpacity
                            style={[styles.confirmButton, (!isOrderValid || isProcessing || orderStatus === 'success') && { backgroundColor: '#DA583B' }]}
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
                            <View style={styles.circleCheck}>
                                <FontAwesome5 name="check" style={styles.checkMark} />
                            </View>
                            <Text style={styles.statusMessage}>Thank you!</Text>
                            <Text style={styles.statusMessage}>Your order has been received.</Text>
                        </View>
                    )}

                    {orderStatus === 'failure' && (
                        <View style={styles.statusContainer}>
                            <View style={styles.circleFail}>
                                <FontAwesome5 name="times" style={styles.failMark} />
                            </View>
                            <Text style={styles.statusMessage}>Your order was not processed successfully.</Text>
                            <Text style={styles.statusMessage}>Please try again.</Text>
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
        paddingTop: 300,
    },
    modalContent: {
        width: '95%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 15,
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
        fontSize: 25,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
    orderSummaryTitle: {
        fontSize: 20,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Bold',
        alignSelf: 'flex-start', // Align 'Order Summary' to the left
        marginTop: 20,
        marginBottom: 10,
        // marginLeft: 3,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 5,
        // marginLeft: 5,
        // marginRight: 3,
    },
    orderItemText: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Arial', // Use Arial for the item info
        flex: 1,
    },
    orderItemQuantity: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Arial', // Use Arial for the item quantity
        textAlign: 'left',
        width: 40,
        letterSpacing: 1, // Add a small letter spacing to space the quantity from the 'x'
        paddingRight: 10, // Add a small padding to space the quantity from the price
    },
    orderItemPrice: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Arial', // Use Arial for the item price
        textAlign: 'right',
        width: 80,
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#222126',
        marginTop: 10,
    },
    orderTotalTextBold: {
        fontSize: 20,
        color: '#222126',
        fontFamily: 'Oswald-Bold', // Use Oswald-Bold for the 'TOTAL:' label
        fontWeight: 'bold',
        paddingTop: 5, // Add a small padding to space the 'TOTAL:' label from the $ value
    },
    orderTotalTextRegular: {
        fontSize: 20,
        color: '#222126',
        fontFamily: 'Oswald-Regular', // Use Oswald-Regular for the total value
        marginLeft: 5, // Add a small margin if needed to space the $ value from the 'TOTAL:' label
        paddingTop: 5, // Add a small padding to space the $ value from the 'TOTAL:' label
    },
    confirmButton: {
        backgroundColor: '#DA583B',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        width: '100%',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        textTransform: 'uppercase',
        paddingVertical: 2
    },
    circleCheck: {
        width: 45, // Outer circle size
        height: 45,
        borderRadius: 25,
        backgroundColor: '#609475', // Circle background color
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleFail: {
        width: 45, // Outer circle size
        height: 45,
        borderRadius: 25,
        backgroundColor: '#851919', // Circle background color
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMark: {
        fontSize: 20, // Smaller checkmark size
        color: 'white', // Checkmark color
    },
    failMark: {
        fontSize: 25, // Smaller  size
        color: 'white', //  color
        thickness: 2, //
    },

    statusContainer: {
        alignItems: 'center',
        marginVertical: 0,
    },
    statusMessage: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Arial',
        marginTop: 0,
        paddingVertical: 2,
    },
    separator: {
        borderBottomColor: '#EEEEEE', // Light grey color
        borderBottomWidth: 1,         // Thin line
        width: '100%',                // Explicitly set the width to 100%
    },



});

export default OrderModal;
