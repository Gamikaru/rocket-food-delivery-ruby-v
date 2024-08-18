import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome icons
import { faX } from '@fortawesome/free-solid-svg-icons'; // Import specific FontAwesome icon for close button
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Import FontAwesome component for React Native
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for retrieving user data
import React, { useEffect, useState } from 'react'; // Import React and hooks
import { Alert, Animated, Dimensions, Easing, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Import necessary React Native components

// Get the dimensions of the window for responsive design
const { width, height } = Dimensions.get('window');

// CustomCheckbox component: Renders a checkbox with animation effects
const CustomCheckbox = ({ isChecked, onChange, disabled }) => {
    const [scaleValue] = useState(new Animated.Value(0)); // Scale animation state
    const [colorValue] = useState(new Animated.Value(0)); // Color animation state

    // useEffect to handle animation on isChecked change
    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: isChecked ? 1 : 0, // Scale up if checked, otherwise scale down
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        Animated.timing(colorValue, {
            toValue: isChecked ? 1 : 0, // Change color if checked
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isChecked]);

    // Interpolate scale value for the checkmark animation
    const scale = scaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    // Interpolate background color based on disabled state and isChecked
    const backgroundColor = colorValue.interpolate({
        inputRange: [0, 1],
        outputRange: disabled ? ['#F0F0F0', '#F0F0F0'] : ['#FFFFFF', '#DA583B'], // Light grey background if disabled, red background if enabled
    });

    // Interpolate border color based on disabled state and isChecked
    const borderColor = colorValue.interpolate({
        inputRange: [0, 1],
        outputRange: disabled ? ['#DDDDDD', '#DDDDDD'] : ['#DDDDDD', '#DA583B'], // Light grey border if disabled, red border if enabled
    });

    return (
        <TouchableOpacity onPress={!disabled ? onChange : null} style={styles.checkboxContainer}>
            <Animated.View style={[styles.checkbox, { backgroundColor, borderColor }]}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    {isChecked && <FontAwesome5 name="check" size={width * 0.04} color="#FFFFFF" />}
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// OrderModal component: Manages the display and functionality of the order confirmation modal
const OrderModal = ({ visible, onClose, menuItems, order, restaurantId }) => {
    const [total, setTotal] = useState(0); // State to store the total cost of the order
    const [isProcessing, setIsProcessing] = useState(false); // State to track if the order is being processed
    const [orderStatus, setOrderStatus] = useState(null); // State to track the status of the order
    const [isOrderValid, setIsOrderValid] = useState(false); // State to check if the order is valid
    const [notifyByEmail, setNotifyByEmail] = useState(false); // State to track if the user wants email notifications
    const [notifyByPhone, setNotifyByPhone] = useState(false); // State to track if the user wants phone notifications

    // useEffect to calculate total cost and validate order whenever the order or menuItems change
    useEffect(() => {
        const totalCost = Object.keys(order).reduce((sum, key) => {
            const item = menuItems.find(menuItem => menuItem.id === parseInt(key));
            return sum + (order[key] * (item ? item.cost : 0));
        }, 0);
        setTotal(totalCost);

        const hasItems = Object.values(order).some(quantity => quantity > 0);
        setIsOrderValid(hasItems);
    }, [order, menuItems]);

    // handleOrder function: Manages the order process, including API interaction
    const handleOrder = async () => {
        if (!isOrderValid) {
            Alert.alert('Order Error', 'Please select at least one item to place an order.');
            return;
        }

        setIsProcessing(true); // Set processing state to true
        setOrderStatus(null); // Reset order status

        try {
            const customerToken = await AsyncStorage.getItem('userToken');
            const { customer_id } = JSON.parse(customerToken);

            // Prepare order data for API request
            const orderData = {
                restaurant_id: restaurantId,
                customer_id: customer_id,
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

            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to place order: ${errorText}`);
            }

            setOrderStatus('success');
        } catch (error) {
            console.error('Error placing order:', error.message);
            setOrderStatus('failure');
        } finally {
            setIsProcessing(false);
        }
    };

    // renderOrderSummary function: Renders the summary of the items in the order
    const renderOrderSummary = () => {
        return menuItems.map(item => {
            if (order[item.id] > 0) {
                return (
                    <View style={styles.orderItem} key={item.id}>
                        <Text style={styles.orderItemText}>{item.name}</Text>
                        <Text style={styles.orderItemQuantity}>x {order[item.id]}</Text>
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
                        <FontAwesomeIcon icon={faX} size={width * 0.08} color="grey" />
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

                <Text style={styles.notificationTitle}>Would you like to receive your order confirmation by email and/or text?</Text>
                <View style={styles.notificationOptionsContainer}>
                    <View style={styles.notificationOption}>
                        <CustomCheckbox
                            isChecked={notifyByEmail}
                            onChange={() => setNotifyByEmail(!notifyByEmail)}
                            disabled={isProcessing}
                        />
                        <Text style={[styles.notificationOptionText, isProcessing && styles.disabledText]}>
                            By Email
                        </Text>
                    </View>
                    <View style={styles.notificationOption}>
                        <CustomCheckbox
                            isChecked={notifyByPhone}
                            onChange={() => setNotifyByPhone(!notifyByPhone)}
                            disabled={isProcessing}
                        />
                        <Text style={[styles.notificationOptionText, isProcessing && styles.disabledText]}>
                            By Phone
                        </Text>
                    </View>
                </View>

                <View style={styles.fullWidthSeparator} /> 

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
    // Container for the modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
        paddingTop: height * 0.1, // 10% padding from the top relative to screen height
    },
    modalContent: {
        width: '95%', // Modal content width set to 95% of the screen width
        backgroundColor: '#FFFFFF', // White background for the modal content
        borderRadius: 8, // Rounded corners for the modal content
        paddingVertical: height * 0.02, // Vertical padding relative to screen height
        paddingHorizontal: width * 0.04, // Horizontal padding relative to screen width
        alignItems: 'center', // Center align content horizontally
    },
    modalHeader: {
        width: '100%', // Header takes the full width of the modal content
        flexDirection: 'row', // Align items in a row
        justifyContent: 'space-between', // Space out elements evenly
        alignItems: 'center', // Center elements vertically
        backgroundColor: '#222126', // Dark background color for the header
        paddingVertical: height * 0.012, // Vertical padding relative to screen height
        paddingHorizontal: width * 0.04, // Horizontal padding relative to screen width
        borderTopLeftRadius: 8, // Top left corner rounded to match the modal content
        borderTopRightRadius: 8, // Top right corner rounded to match the modal content
        shadowColor: 'black', // Shadow color set to black
        shadowOffset: { width: -2, height: 2 }, // Offset shadow to create depth
        shadowOpacity: 0.4, // Set shadow opacity to 40%
        shadowRadius: 1, // Set shadow blur radius
        elevation: 5, // Android elevation for shadow
    },
    modalTitle: {
        fontSize: width * 0.065, // Font size set relative to screen width
        color: '#FFFFFF', // White color for the title text
        fontWeight: 'bold', // Bold font weight for emphasis
        fontFamily: Platform.OS === 'ios' ? 'Oswald-Regular' : 'Arial', // Use Oswald for iOS and Arial for others
    },
    orderSummaryTitle: {
        fontSize: width * 0.045, // Font size set relative to screen width
        color: '#222126', // Dark text color for summary title
        fontWeight: 'bold', // Bold font weight for emphasis
        fontFamily: Platform.OS === 'ios' ? 'Oswald-Bold' : 'Arial-BoldMT', // Use Oswald-Bold for iOS and Arial-BoldMT for others
        alignSelf: 'flex-start', // Align the summary title to the start of its container
        marginTop: height * 0.02, // Margin above the title, relative to screen height
        marginBottom: height * 0.015, // Margin below the title, relative to screen height
    },
    orderItem: {
        flexDirection: 'row', // Arrange items in a horizontal row
        justifyContent: 'space-between', // Space out elements evenly
        width: '100%', // Set width to 100% of the container
        paddingVertical: height * 0.01, // Vertical padding relative to screen height
    },
    orderItemText: {
        fontSize: width * 0.04, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Arial', // Use Arial font on all platforms
        flex: 1, // Allow text to take up remaining space in the row
    },
    orderItemQuantity: {
        fontSize: width * 0.04, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Arial', // Use Arial font on all platforms
        textAlign: 'left', // Align text to the left
        width: width * 0.1, // Set width relative to screen width
        letterSpacing: 1, // Add slight spacing between letters
        paddingRight: width * 0.025, // Padding on the right relative to screen width
    },
    orderItemPrice: {
        fontSize: width * 0.04, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Arial', // Use Arial font on all platforms
        textAlign: 'right', // Align text to the right
        width: width * 0.2, // Set width relative to screen width
    },
    orderTotal: {
        flexDirection: 'row', // Arrange items in a horizontal row
        justifyContent: 'flex-end', // Align items to the end (right)
        width: '100%', // Set width to 100% of the container
        borderTopWidth: 1, // Add a top border to the total section
        borderTopColor: '#222126', // Border color matching the text color
        marginTop: height * 0.015, // Margin above the total, relative to screen height
    },
    orderTotalTextBold: {
        fontSize: width * 0.05, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Oswald-Bold' : 'Arial-BoldMT', // Use Oswald-Bold for iOS and Arial-BoldMT for others
        fontWeight: 'bold', // Bold font weight for emphasis
        paddingTop: height * 0.01, // Padding above the text, relative to screen height
    },
    orderTotalTextRegular: {
        fontSize: width * 0.05, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Oswald-Regular' : 'Arial', // Use Oswald-Regular for iOS and Arial for others
        marginLeft: width * 0.01, // Margin to the left of the text, relative to screen width
        paddingTop: height * 0.01, // Padding above the text, relative to screen height
    },
    confirmButton: {
        backgroundColor: '#DA583B', // Background color for the confirm button
        paddingVertical: height * 0.010, // Vertical padding relative to screen height
        borderRadius: 8, // Rounded corners for the button
        alignItems: 'center', // Center align text and icon horizontally
        marginTop: height * 0.015, // Margin above the button, relative to screen height
        width: '100%', // Button takes full width of the container
    },
    confirmButtonText: {
        color: '#FFFFFF', // White text color
        fontSize: width * 0.045, // Font size set relative to screen width
        fontWeight: 'bold', // Bold font weight for emphasis
        fontFamily: Platform.OS === 'ios' ? 'Oswald-Regular' : 'Arial-BoldMT', // Use Oswald-Regular for iOS and Arial-BoldMT for others
        textTransform: 'uppercase', // Uppercase text for emphasis
    },
    circleCheck: {
        width: width * 0.12, // Set width relative to screen width
        height: width * 0.12, // Set height relative to screen width
        borderRadius: width * 0.06, // Set border radius to half of width for perfect circle
        backgroundColor: '#609475', // Background color for the check circle
        justifyContent: 'center', // Center align content vertically
        alignItems: 'center', // Center align content horizontally
    },
    circleFail: {
        width: width * 0.12, // Set width relative to screen width
        height: width * 0.12, // Set height relative to screen width
        borderRadius: width * 0.06, // Set border radius to half of width for perfect circle
        backgroundColor: '#851919', // Background color for the fail circle
        justifyContent: 'center', // Center align content vertically
        alignItems: 'center', // Center align content horizontally
    },
    checkMark: {
        fontSize: width * 0.05, // Font size set relative to screen width
        color: 'white', // White color for the check mark
    },
    failMark: {
        fontSize: width * 0.05, // Font size set relative to screen width
        color: 'white', // White color for the fail mark
    },
    statusContainer: {
        alignItems: 'center', // Center align content horizontally
        marginVertical: height * 0.02, // Vertical margin for status container
    },
    statusMessage: {
        fontSize: width * 0.04, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Arial', // Use Arial font on all platforms
        marginTop: height * 0.01, // Margin above the message, relative to screen height
        paddingVertical: height * 0.005, // Vertical padding relative to screen height
    },
    separator: {
        borderBottomColor: '#EEEEEE', // Light grey color for the separator line
        borderBottomWidth: 1, // 1-pixel thick separator line
        width: '100%', // Separator takes the full width of the container
    },
    notificationTitle: {
        fontSize: width * 0.04, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Arial', // Use Arial font on all platforms
        marginBottom: height * 0.03, // Margin below the title, relative to screen height
        alignSelf: 'center', // Center align text within its container
        textAlign: 'center', // Center align text within its line
        marginTop: height * 0.02, // Margin above the title, relative to screen height
    },
    notificationOptionsContainer: {
        flexDirection: 'row', // Arrange options in a row
        justifyContent: 'center', // Center align options horizontally
        marginBottom: height * 0.01, // Margin below the options, relative to screen height
    },
    notificationOption: {
        flexDirection: 'row', // Arrange checkbox and text in a row
        alignItems: 'center', // Center align content vertically
        marginHorizontal: width * 0.1, // Horizontal margin relative to screen width
    },
    notificationOptionText: {
        fontSize: width * 0.04, // Font size set relative to screen width
        color: '#222126', // Dark text color
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Arial', // Use Arial font on all platforms
        marginLeft: width * 0.02, // Margin to the left of the text, relative to screen width
    },
    checkboxContainer: {
        width: width * 0.08, // Set width relative to screen width (8% of width)
        height: width * 0.08, // Set height relative to screen width (8% of width)
        borderRadius: 3, // Rounded corners for the checkbox container
        justifyContent: 'center', // Center align checkbox vertically
        alignItems: 'center', // Center align checkbox horizontally
    },
    checkbox: {
        width: '70%', // Checkbox takes full width of the container
        height: '70%', // Checkbox takes full height of the container
        borderRadius: 3, // Rounded corners for the checkbox
        justifyContent: 'center', // Center align content vertically
        alignItems: 'center', // Center align content horizontally
        borderWidth: 1, // 1-pixel thick border for the checkbox
        borderColor: '#DDDDDD', // Light grey color for the border
    },
    fullWidthSeparator: {
        borderBottomColor: '#DDDDDD', // Light grey color for the separator line
        borderBottomWidth: 1, // 1-pixel thick separator line
        width: '108%', // Takes full width of the container
        marginTop: height * 0.04, // Add margin above the separator relative to screen height
        marginBottom: height * 0.01, // Add margin below the separator relative to screen height
        opacity: 0.5, // Set opacity to 50%
    },
    disabledText: {
        color: '#CCCCCC', // Light grey color for disabled text
    },
});

export default OrderModal;
