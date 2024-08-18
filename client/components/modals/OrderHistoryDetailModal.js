import { FontAwesome } from '@expo/vector-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// GET DEVICE DIMENSIONS TO CALCULATE SCALING FACTORS
const { width, height } = Dimensions.get('window');

// ORDER HISTORY DETAIL MODAL COMPONENT
const OrderHistoryDetailModal = ({ visible, onClose, orderDetail }) => {
    // STATE FOR STORING THE CURRENT RATING, INITIAL AVERAGE RATING, AND UPDATED AVERAGE RATING
    const [rating, setRating] = useState(orderDetail.restaurant_rating || 0);
    const [initialAvgRating, setInitialAvgRating] = useState(null);
    const [updatedAvgRating, setUpdatedAvgRating] = useState(null);

    // FETCH THE INITIAL AVERAGE RATING OF THE RESTAURANT WHEN THE MODAL OPENS
    useEffect(() => {
        const fetchInitialRating = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/restaurants?id=${orderDetail.restaurant_id}`);
                if (response.ok) {
                    const restaurant = await response.json();
                    const matchingRestaurant = restaurant.find(rest => rest.id === orderDetail.restaurant_id);
                    setInitialAvgRating(matchingRestaurant?.rating);
                } else {
                    console.error('Failed to fetch initial rating.');
                }
            } catch (error) {
                console.error('Error fetching initial rating:', error);
            }
        };

        fetchInitialRating();
    }, [orderDetail.restaurant_id]);

    // HANDLE STAR RATING PRESS TO TOGGLE OR SET THE RATING
    const handleStarPress = (star) => {
        setRating(star === rating ? star - 1 : star);
    };

    // SUBMIT THE RATING AND FETCH THE UPDATED AVERAGE RATING AFTER A DELAY
    const submitRating = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/order/${orderDetail.id}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ restaurant_rating: rating }),
            });

            if (response.ok) {
                await new Promise(resolve => setTimeout(resolve, 4000)); // Wait 4 seconds before fetching updated rating

                const updatedResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/restaurants?id=${orderDetail.restaurant_id}`);
                if (updatedResponse.ok) {
                    const updatedRestaurant = await updatedResponse.json();
                    const matchingRestaurant = updatedRestaurant.find(rest => rest.id === orderDetail.restaurant_id);
                    setUpdatedAvgRating(matchingRestaurant?.rating);

                    // Show success or no change alert based on whether the average rating changed
                    if (initialAvgRating !== matchingRestaurant?.rating) {
                        Alert.alert('Success', `Your rating has been submitted. The average rating changed from ${initialAvgRating} to ${matchingRestaurant?.rating}.`);
                    } else {
                        Alert.alert('No Change', 'Your rating was submitted, but the average rating did not change.');
                    }
                } else {
                    console.error('Failed to fetch updated rating.');
                }

                onClose(); // Close the modal after submission
            } else {
                Alert.alert('Error', 'Failed to submit rating. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            Alert.alert('Error', 'An error occurred while submitting your rating.');
        }
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
                        <ScrollView contentContainerStyle={styles.ScrollViewContent}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.restaurantName}>{orderDetail.restaurant_name}</Text>
                                <Text style={styles.orderInfo}>Order Date: {new Date(orderDetail.created_at).toLocaleDateString()}</Text>
                                <Text style={styles.orderInfo}>Status: {orderDetail.status.toUpperCase()}</Text>
                                <Text style={styles.orderInfo}>Courier: {orderDetail.courier_name || 'N/A'}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <FontAwesomeIcon icon={faX} style={styles.closeIcon} size={width * 0.06} />
                                </TouchableOpacity>
                            </View>

                            {/* CONTENT WITH ORDERED ITEMS AND TOTAL COST */}
                            <View style={styles.contentContainer}>
                                <View style={styles.itemsContainer}>
                                    {orderDetail.products.map(item => (
                                        <View key={item.product_id} style={styles.itemRow}>
                                            <Text style={styles.itemName}>{item.product_name}</Text>
                                            <Text style={styles.itemQuantity}>x {item.quantity}</Text>
                                            <Text style={styles.itemPrice}>$ {(item.total_cost / 100).toFixed(2)}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.separator} />
                                <Text style={styles.total}>
                                    <Text style={styles.totalLabel}>TOTAL: </Text>
                                    $ {((orderDetail.total_cost || 0) / 100).toFixed(2)}
                                </Text>
                            </View>

                            {/* RATING SECTION */}
                            <View style={styles.ratingContainer}>
                                <Text style={styles.sectionTitle}>Rate Your Order</Text>
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity
                                            key={star}
                                            onPress={() => handleStarPress(star)}
                                        >
                                            <FontAwesome
                                                name={star <= rating ? 'star' : 'star-o'}
                                                style={styles.starIcon}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.separatorLine} />
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={submitRating}
                                    disabled={rating === 0}
                                >
                                    <Text style={styles.submitButtonText}>Submit Rating</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// STYLES FOR THE ORDERHISTORYDETAILMODAL
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, // Make the modal container fill the entire screen
        justifyContent: 'center', // Center the modal content vertically
        alignItems: 'center', // Center the modal content horizontally
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background color to darken the background
    },
    outerBorder: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        padding: width * 0.02,
    },
    modalContent: {
        backgroundColor: '#FFFFFF', // Set background color to white
        borderRadius: 10, // Round the corners of the modal content
        overflow: 'hidden', // Ensure content does not overflow out of the container
        borderWidth: 2, // Add a thin border
        borderColor: '#EEEEEE', // Light grey color for the border
    },
    headerContainer: {
        backgroundColor: '#222126', // Dark background for the entire header
        paddingHorizontal: width * 0.05, // Horizontal padding for the entire header
        paddingVertical: height * 0.02, // Vertical padding for the entire header
        borderTopLeftRadius: 10, // Round the top-left corner
        borderTopRightRadius: 10, // Round the top-right corner
        position: 'relative', // Allows the use of absolute positioning within the container
    },
    restaurantName: {
        fontSize: width * 0.075, // Font size for the restaurant name relative to screen width
        color: '#DA583B', // Custom orange color for the restaurant name
        fontWeight: 'bold', // Make the text bold
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }),
        marginBottom: height * 0.01, // Add a margin below the restaurant name to separate it from the order info
    },
    orderInfo: {
        fontSize: width * 0.035, // Font size for order information relative to screen width
        color: '#FFFFFF', // White color for the text
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginBottom: height * 0.003, // Add vertical margin below each order info
    },
    headerInfo: {
        flex: 1, // Allow the header info to take up the remaining space
        marginLeft: width * 0.03, // Add margin to the left relative to screen width
        marginBottom: height * 0.01, // Add margin to the bottom relative to screen height
    },
    closeButton: {
        position: 'absolute', // Position the button absolutely within the header container
        top: height * 0.08, // Position the button 1/3rd from the top of the header (adjust as necessary)
        right: width * 0.06, // Position the button on the right side with some margin
        fontSize: width * 0.08, // Increase the size of the close icon relative to screen width
    },
    closeIcon: {
        color: 'grey', // Grey color for the close icon
    },
    contentContainer: {
        paddingHorizontal: width * 0.05, // Horizontal padding inside the content container relative to screen width
        paddingVertical: height * 0.02, // Vertical padding inside the content container relative to screen height
    },
    itemsContainer: {
        marginVertical: height * 0.015, // Vertical margin around the items container relative to screen height
    },
    itemRow: {
        flexDirection: 'row', // Arrange the item details in a horizontal row
        justifyContent: 'space-between', // Space out the content evenly
        alignItems: 'center', // Center align the content within the row
        width: '100%', // Make the row span the full width of the container
        paddingVertical: height * 0.01, // Vertical padding inside the row relative to screen height
    },
    itemName: {
        fontSize: width * 0.042, // Font size for the item name relative to screen width
        color: '#222126', // Dark color for the item name text
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }), // Use Arial font on all platforms
        flex: 3, // Allow the item name to take up more space within the row
    },
    itemQuantity: {
        fontSize: width * 0.042, // Font size for the item quantity relative to screen width
        color: '#222126', // Dark color for the item quantity text
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }), // Use Arial font on all platforms
        textAlign: 'left', // Align the text to the left
        flex: 1, // Allow the item quantity to take up less space within the row
    },
    itemPrice: {
        fontSize: width * 0.042, // Font size for the item price relative to screen width
        color: '#222126', // Dark color for the item price text
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }), // Use Arial font on all platforms
        textAlign: 'right', // Align the text to the right
        flex: 1, // Allow the item price to take up less space within the row
    },
    separator: {
        borderBottomColor: '#A9A9A9', // Black color for the separator line
        borderBottomWidth: 1, // Thickness of the separator line
        marginVertical: 0, // No vertical margin around the separator
    },
    total: {
        fontSize: width * 0.048, // Font size for the total amount relative to screen width
        color: '#222126', // Dark color for the total amount text
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }), // Use Oswald-Medium on iOS/Android, Arial-BoldMT on other platforms
        textAlign: 'right', // Align the text to the right
        marginTop: height * 0.003, // Add margin to the top relative to screen height
        marginBottom: height * 0.02, // Add margin to the bottom relative to screen height
    },
    totalLabel: {
        fontWeight: 'bold', // Make the text bold
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }), // Use Oswald-Bold on iOS/Android, Arial-BoldMT on other platforms
    },
    ratingContainer: {
        paddingHorizontal: width * 0.05, // Horizontal padding inside the rating container relative to screen width
        paddingVertical: height * 0.02, // Vertical padding inside the rating container relative to screen height
    },
    sectionTitle: {
        fontSize: width * 0.06, // Font size for the section title relative to screen width
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }), // Use Oswald-Medium on iOS/Android, Arial-BoldMT on other platforms
        marginBottom: height * 0.02, // Add margin to the bottom relative to screen height
        textAlign: 'center', // Center align the text
        color: '#DA583B', // Custom orange color for the section title
    },
    starsContainer: {
        flexDirection: 'row', // Arrange the stars in a horizontal row
        justifyContent: 'center', // Center align the stars within the container
        marginBottom: height * 0.03, // Add margin to the bottom relative to screen height
    },
    starIcon: {
        fontSize: width * 0.08, // Font size for the star icon relative to screen width
        color: '#222126', // Dark color for the star icons
        marginHorizontal: width * 0.01, // Horizontal margin around each star relative to screen width
    },
    separatorLine: {
        borderBottomColor: '#A9A9A9', // Black color for the separator line
        borderBottomWidth: 1, // Thickness of the separator line
        marginVertical: height * 0.015, // Vertical margin around the separator relative to screen height
        marginHorizontal: width * 0.05, // Horizontal margin around the separator relative to screen width
    },
    submitButton: {
        backgroundColor: '#DA583B', // Custom orange color for the button background
        paddingVertical: height * 0.010, // Vertical padding inside the button relative to screen height
        marginBottom: height * 0.02, // Add margin to the bottom relative to screen height
        marginHorizontal: width * 0.05, // Add horizontal margin relative to screen width
        borderRadius: 5, // Round the corners of the button
        alignItems: 'center', // Center align the content within the button
    },
    submitButtonText: {
        color: '#FFFFFF', // White color for the button text
        fontSize: width * 0.05, // Font size for the button text relative to screen width
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Arial-MT',
            default: 'Arial-MT',
        }), // Use Oswald-Regular on iOS/Android, Arial-MT on other platforms
        textTransform: 'uppercase', // Transform text to uppercase
    },
});

export default OrderHistoryDetailModal;
