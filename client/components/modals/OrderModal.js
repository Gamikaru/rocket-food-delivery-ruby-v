import { FontAwesome5 } from '@expo/vector-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Easing, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { width, height } = Dimensions.get('window');

const CustomCheckbox = ({ isChecked, onChange, disabled }) => {
    const [scaleValue] = useState(new Animated.Value(0));
    const [colorValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: isChecked ? 1 : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        Animated.timing(colorValue, {
            toValue: isChecked ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isChecked]);

    const scale = scaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const backgroundColor = colorValue.interpolate({
        inputRange: [0, 1],
        outputRange: disabled ? ['#F0F0F0', '#F0F0F0'] : ['#FFFFFF', '#222126'],  // Grey out when disabled
    });

    const borderColor = colorValue.interpolate({
        inputRange: [0, 1],
        outputRange: disabled ? ['#CCCCCC', '#CCCCCC'] : ['#DDDDDD', '#222126'],  // Thin grey border when disabled
    });

    return (
        <TouchableOpacity onPress={!disabled ? onChange : null} style={styles.checkboxContainer}>
            <Animated.View style={[styles.checkbox, { backgroundColor, borderColor }]}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    {isChecked && <FontAwesome5 name="check" size={12} color="#FFFFFF" />}
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const OrderModal = ({ visible, onClose, menuItems, order, restaurantId }) => {
    const [total, setTotal] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const [isOrderValid, setIsOrderValid] = useState(false);
    const [notifyByEmail, setNotifyByEmail] = useState(false);
    const [notifyByPhone, setNotifyByPhone] = useState(false);

    useEffect(() => {
        const totalCost = Object.keys(order).reduce((sum, key) => {
            const item = menuItems.find(menuItem => menuItem.id === parseInt(key));
            return sum + (order[key] * (item ? item.cost : 0));
        }, 0);
        setTotal(totalCost);

        const hasItems = Object.values(order).some(quantity => quantity > 0);
        setIsOrderValid(hasItems);
    }, [order, menuItems]);

    const handleOrder = async () => {
        if (!isOrderValid) {
            Alert.alert('Order Error', 'Please select at least one item to place an order.');
            return;
        }

        setIsProcessing(true);
        setOrderStatus(null);

        try {
            const customerToken = await AsyncStorage.getItem('userToken');
            const { customer_id } = JSON.parse(customerToken);
            console.log('Retrieved customer_id:', customer_id);


            const orderData = {
                restaurant_id: restaurantId,
                customer_id: customer_id, // Use the retrieved customer_id
                products: Object.keys(order)
                    .filter(key => order[key] > 0)
                    .map(key => ({
                        id: parseInt(key),
                        quantity: order[key]
                    })),
                notify_by_email: notifyByEmail,
                notify_by_phone: notifyByPhone,
                send_sms: notifyByPhone,
                send_email: notifyByEmail
            };

            console.log('Order data:', JSON.stringify(orderData));

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
                            <FontAwesomeIcon icon={faX} size={30} color="grey" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    {renderOrderSummary()}
                    <View style={styles.orderTotal}>
                        <Text style={styles.orderTotalTextBold}>TOTAL:</Text>
                        <Text style={styles.orderTotalTextRegular}>$ {(total / 100).toFixed(2)}</Text>
                    </View>
                    <View style={styles.separatorContainer}>
                        <View style={styles.separator} />
                    </View>

                    <View style={styles.notificationSeparator} />

                    <Text style={styles.notificationTitle}>Would you like to receive your order confirmation by email and/or text?</Text>
                    <View style={styles.notificationOptionsContainer}>
                        <View style={styles.notificationOption}>
                            <CustomCheckbox
                                isChecked={notifyByEmail}
                                onChange={() => setNotifyByEmail(!notifyByEmail)}
                                disabled={isProcessing} // Disable when processing
                            />
                            <Text style={[styles.notificationOptionText, isProcessing && styles.disabledText]}>
                                By Email
                            </Text>
                        </View>
                        <View style={styles.notificationOption}>
                            <CustomCheckbox
                                isChecked={notifyByPhone}
                                onChange={() => setNotifyByPhone(!notifyByPhone)}
                                disabled={isProcessing} // Disable when processing
                            />
                            <Text style={[styles.notificationOptionText, isProcessing && styles.disabledText]}>
                                By Phone
                            </Text>
                        </View>
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
        paddingTop: Platform.select({
            ios: 300,
            android: 280,
            default: 300,
        }),
    },
    modalContent: {
        width: '95%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: Platform.select({
            ios: 15,
            android: 15,
            default: 15,
        }),
        alignItems: 'center',
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222126',
        padding: Platform.select({
            ios: 20,
            android: 16,
            default: 18,
        }),
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 5,
    },
    modalTitle: {
        fontSize: Platform.select({
            ios: 25,
            android: 23,
            default: 24,
        }),
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
    },
    orderSummaryTitle: {
        fontSize: Platform.select({
            ios: 20,
            android: 18,
            default: 20,
        }),
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }),
        alignSelf: 'flex-start',
        marginTop: Platform.select({
            ios: 20,
            android: 18,
            default: 20,
        }),
        marginBottom: 10,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: Platform.select({
            ios: 5,
            android: 5,
            default: 5,
        }),
    },
    orderItemText: {
        fontSize: Platform.select({
            ios: 18,
            android: 16,
            default: 18,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        flex: 1,
    },
    orderItemQuantity: {
        fontSize: Platform.select({
            ios: 18,
            android: 16,
            default: 18,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'left',
        width: 40,
        letterSpacing: 1,
        paddingRight: Platform.select({
            ios: 10,
            android: 8,
            default: 10,
        }),
    },
    orderItemPrice: {
        fontSize: Platform.select({
            ios: 18,
            android: 16,
            default: 18,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        textAlign: 'right',
        width: 80,
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#222126',
        marginTop: Platform.select({
            ios: 10,
            android: 8,
            default: 10,
        }),
    },
    orderTotalTextBold: {
        fontSize: Platform.select({
            ios: 20,
            android: 18,
            default: 20,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }),
        fontWeight: 'bold',
        paddingTop: Platform.select({
            ios: 5,
            android: 4,
            default: 5,
        }),
    },
    orderTotalTextRegular: {
        fontSize: Platform.select({
            ios: 20,
            android: 18,
            default: 20,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial',
        }),
        marginLeft: 5,
        paddingTop: Platform.select({
            ios: 5,
            android: 4,
            default: 5,
        }),
    },
    confirmButton: {
        backgroundColor: '#DA583B',
        paddingVertical: Platform.select({
            ios: 8,
            android: 6,
            default: 8,
        }),
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        width: '100%',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: Platform.select({
            ios: 20,
            android: 18,
            default: 20,
        }),
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
        textTransform: 'uppercase',
        paddingVertical: 2,
    },
    circleCheck: {
        width: Platform.select({
            ios: 45,
            android: 40,
            default: 45,
        }),
        height: Platform.select({
            ios: 45,
            android: 40,
            default: 45,
        }),
        borderRadius: 25,
        backgroundColor: '#609475',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleFail: {
        width: Platform.select({
            ios: 45,
            android: 40,
            default: 45,
        }),
        height: Platform.select({
            ios: 45,
            android: 40,
            default: 45,
        }),
        borderRadius: 25,
        backgroundColor: '#851919',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMark: {
        fontSize: Platform.select({
            ios: 20,
            android: 18,
            default: 20,
        }),
        color: 'white',
    },
    failMark: {
        fontSize: Platform.select({
            ios: 25,
            android: 23,
            default: 25,
        }),
        color: 'white',
        thickness: 2,
    },

    statusContainer: {
        alignItems: 'center',
        marginVertical: 0,
    },
    statusMessage: {
        fontSize: Platform.select({
            ios: 18,
            android: 16,
            default: 18,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginTop: 0,
        paddingVertical: 2,
    },
    separator: {
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 1,
        width: '100%',
    },
    notificationTitle: {
        fontSize: Platform.select({
            ios: 16,
            android: 14,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginBottom: 30,
        alignSelf: 'center',
        textAlign: 'center',
    },
    notificationOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    notificationOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Platform.select({
            ios: 50,
            android: 45,
            default: 50,
        }),
    },
    notificationOptionText: {
        fontSize: Platform.select({
            ios: 16,
            android: 14,
            default: 16,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginLeft: 8,
    },
    checkboxContainer: {
        width: 20,
        height: 20,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,  // Thin border
        borderColor: Platform.select({
            ios: '#DDDDDD',
            android: '#CCCCCC',
            default: '#DDDDDD',
        }),
    },
    notificationSeparator: {
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 1,
        marginVertical: 24,
        alignSelf: 'stretch',
        marginLeft: -15,
        marginRight: -15,
    },
    disabledText: {
        color: '#CCCCCC', // Light grey color for disabled text
    },


});




export default OrderModal;
