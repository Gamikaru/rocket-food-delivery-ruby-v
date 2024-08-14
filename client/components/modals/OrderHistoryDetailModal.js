import { FontAwesome } from '@expo/vector-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const OrderHistoryDetailModal = ({ visible, onClose, orderDetail }) => {
    const [rating, setRating] = useState(orderDetail.restaurant_rating || 0);
    const [initialAvgRating, setInitialAvgRating] = useState(null);
    const [updatedAvgRating, setUpdatedAvgRating] = useState(null);

    useEffect(() => {
        const fetchInitialRating = async () => {
            try {
                console.log(`Fetching initial rating for restaurant ID: ${orderDetail.restaurant_id}`);
                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/restaurants?id=${orderDetail.restaurant_id}`);
                if (response.ok) {
                    const restaurant = await response.json();
                    const matchingRestaurant = restaurant.find(rest => rest.id === orderDetail.restaurant_id);
                    console.log('Initial restaurant data:', matchingRestaurant);
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

    const submitRating = async () => {
        try {
            console.log(`Submitting rating: ${rating} for order ID: ${orderDetail.id}`);
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/order/${orderDetail.id}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ restaurant_rating: rating }),
            });

            if (response.ok) {
                console.log(`Rating submitted successfully for order ID: ${orderDetail.id}.`);

                // Add a 4-second delay before fetching the updated rating
                await new Promise(resolve => setTimeout(resolve, 4000));

                console.log(`Fetching updated rating for restaurant ID: ${orderDetail.restaurant_id}`);
                const updatedResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/restaurants?id=${orderDetail.restaurant_id}`);
                if (updatedResponse.ok) {
                    const updatedRestaurant = await updatedResponse.json();
                    const matchingRestaurant = updatedRestaurant.find(rest => rest.id === orderDetail.restaurant_id);
                    console.log('Fetched Updated Restaurant Data:', updatedRestaurant);
                    setUpdatedAvgRating(matchingRestaurant?.rating);

                    if (initialAvgRating !== matchingRestaurant?.rating) {
                        Alert.alert('Success', `Your rating has been submitted. The average rating changed from ${initialAvgRating} to ${matchingRestaurant?.rating}.`);
                    } else {
                        Alert.alert('No Change', 'Your rating was submitted, but the average rating did not change.');
                    }
                } else {
                    console.error('Failed to fetch updated rating.');
                }

                onClose();  // Close the modal after submission
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
                        {/* Rating Section */}
                        <View style={styles.ratingContainer}>
                            <Text style={styles.sectionTitle}>Rate Your Order</Text>
                            <View style={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => setRating(star)}
                                    >
                                        <FontAwesome
                                            name={star <= rating ? 'star' : 'star-o'}
                                            size={30}
                                            color="#FFD700"
                                            style={styles.star}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Button
                                title="Submit Rating"
                                onPress={submitRating}
                                disabled={rating === 0}
                            />
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
        padding: Platform.select({
            ios: 8,
            android: 8,
            default: 8, // White border thickness
        }),
        marginTop: Platform.select({
            ios: height * 0.15,
            android: height * 0.15,
            default: height * 0.15, // Centered vertically
        }),
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
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20,
        }),
        paddingTop: Platform.select({
            ios: 15,
            android: 15,
            default: 15,
        }),
        paddingBottom: Platform.select({
            ios: 5,
            android: 5,
            default: 5,
        }),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    restaurantName: {
        fontSize: Platform.select({
            ios: 28,
            android: 28,
            default: 28,
        }),
        color: '#E95420',
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }),
        marginLeft: 10,
    },
    headerInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align items to the start (top)
        backgroundColor: '#222126',
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20,
        }),
        paddingTop: Platform.select({
            ios: 5,
            android: 5,
            default: 5,
        }),
        paddingBottom: Platform.select({
            ios: 15,
            android: 15,
            default: 15,
        }),
    },
    headerInfo: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 5,
    },
    orderInfo: {
        fontSize: Platform.select({
            ios: 16,
            android: 16,
            default: 16,
        }),
        color: '#FFFFFF',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginVertical: 2,
    },
    closeButton: {
        paddingTop: 0, // Adjust padding to align with text
    },
    contentContainer: {
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20,
        }),
        paddingVertical: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
    },
    itemsContainer: {
        marginVertical: 10,
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
            ios: 16,
            android: 16,
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
            ios: 18,
            android: 18,
            default: 18,
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
            ios: 18,
            android: 18,
            default: 18,
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
        marginVertical: 0,
    },
    total: {
        fontSize: Platform.select({
            ios: 18,
            android: 18,
            default: 18,
        }),
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }),
        textAlign: 'right',
        marginTop: 2,
        marginBottom: 12,
    },
    totalLabel: {
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }),
    },
    ratingContainer: {
        paddingHorizontal: Platform.select({
            ios: 20,
            android: 20,
            default: 20,
        }),
        paddingVertical: Platform.select({
            ios: 10,
            android: 10,
            default: 10,
        }),
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 5,
    },
});

export default OrderHistoryDetailModal;
