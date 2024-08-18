import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAddress } from '../../utils/addressUtils';
import RestaurantAddressModal from '../modals/RestaurantAddressModal';

// Import restaurant images for random display
import cuisineGreek from '../../assets/images/restaurants/cuisineGreek.jpg';
import cuisineJapanese from '../../assets/images/restaurants/cuisineJapanese.jpg';
import cuisinePasta from '../../assets/images/restaurants/cuisinePasta.jpg';
import cuisinePizza from '../../assets/images/restaurants/cuisinePizza.jpg';
import cuisineSoutheast from '../../assets/images/restaurants/cuisineSoutheast.jpg';
import cuisineViet from '../../assets/images/restaurants/cuisineViet.jpg';

// Extract screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Array of all imported images for random selection
const restaurantImages = [
    cuisineGreek,
    cuisineJapanese,
    cuisinePasta,
    cuisinePizza,
    cuisineSoutheast,
    cuisineViet,
];

// Function to randomly select an image from the array
const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * restaurantImages.length);
    return restaurantImages[randomIndex];
};

// Main component for displaying nearby restaurants with filters and modals
const RestaurantsScreen = ({ navigation }) => {
    // State management for restaurants, filters, and modals
    const [restaurants, setRestaurants] = useState([]); // All restaurants data
    const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Filtered restaurants based on selected criteria
    const [selectedRating, setSelectedRating] = useState(null); // Selected rating filter
    const [selectedPrice, setSelectedPrice] = useState(null); // Selected price filter
    const [ratingModalVisible, setRatingModalVisible] = useState(false); // Visibility state of the rating filter modal
    const [priceModalVisible, setPriceModalVisible] = useState(false); // Visibility state of the price filter modal
    const [addressModalVisible, setAddressModalVisible] = useState(false); // Visibility state of the address modal
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Currently selected restaurant for the address modal

    // Fetch restaurants data from the API when the component mounts
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const baseUrl = process.env.EXPO_PUBLIC_URL; // Fetch base URL from environment variables
                const url = `${baseUrl}/api/restaurants`; // Construct the full API endpoint URL

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }
                const data = await response.json();

                // Attempt to load saved images from AsyncStorage
                const storedImages = await AsyncStorage.getItem('restaurantImages');
                let imagesToUse = JSON.parse(storedImages);

                if (!imagesToUse) {
                    // If no stored images, generate new random images for each restaurant
                    imagesToUse = data.map(() => getRandomImage());
                    await AsyncStorage.setItem('restaurantImages', JSON.stringify(imagesToUse));
                }

                // Combine restaurant data with their assigned images and addresses
                const restaurantsWithImages = data.map((restaurant, index) => ({
                    ...restaurant,
                    image: imagesToUse[index],
                    address: getAddress(restaurant.address || {}), // Ensure valid address data
                }));

                setRestaurants(restaurantsWithImages);
                setFilteredRestaurants(restaurantsWithImages); // Initialize filtered data with all restaurants
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                // Handle error appropriately, e.g., display an error message to the user
            }
        };

        fetchRestaurants();
    }, []);

    // Ensure that filters are applied after data is fetched
    useEffect(() => {
        applyFilters();
    }, [restaurants]);

    // Re-apply filters whenever a filter selection changes
    useEffect(() => {
        applyFilters();
    }, [selectedRating, selectedPrice]);

    // Function to apply filters based on the selected rating and price
    const applyFilters = () => {
        if (!selectedRating && !selectedPrice) {
            setFilteredRestaurants(restaurants); // Show all restaurants if no filters are selected
            return;
        }

        let filtered = restaurants;

        if (selectedRating) {
            filtered = filtered.filter((restaurant) => restaurant.rating === selectedRating);
        }

        if (selectedPrice) {
            const priceValue = selectedPrice.length; // Convert '$', '$$', '$$$' to 1, 2, 3
            filtered = filtered.filter((restaurant) => restaurant.price_range === priceValue);
        }

        setFilteredRestaurants(filtered); // Update the filtered restaurants state
    };

    // Function to open the address modal for a specific restaurant
    const openAddressModal = (restaurant) => {
        if (!restaurant || !restaurant.address) {
            alert('No address information available for this restaurant.');
            return;
        }

        const validatedAddress = getAddress(restaurant.address); // Validate the address

        // Update the selected restaurant and open the modal
        setSelectedRestaurant({ ...restaurant, address: validatedAddress });
        setAddressModalVisible(true);
    };

    // Function to handle closing the address modal
    const closeAddressModal = () => {
        setAddressModalVisible(false); // Close the address modal
        setSelectedRestaurant(null); // Clear the selected restaurant
    };

    // Function to render each restaurant in the FlatList
    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('Menu', {
                    restaurantId: item.id,
                    restaurantName: item.name,
                    priceRange: item.price_range,
                    rating: item.rating,
                })
            }
            style={styles.restaurantCard}
        >
            <Image source={item.image} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>
                    {item.name}&nbsp;<Text style={styles.priceRange}>({priceRangeToDollarSigns(item.price_range)})</Text>
                </Text>
                <View style={styles.ratingContainer}>
                    {[...Array(item.rating)].map((_, index) => (
                        <MaterialIcons
                            key={index}
                            name='star'
                            size={styles.filterButtonText.fontSize} // Match the size to the dollar signs
                            color='#000000'
                        />
                    ))}
                </View>

                {/* Pin button to show the restaurant's address */}
                <View style={styles.pinButtonContainer}>
                    <TouchableOpacity style={styles.pinButton} onPress={() => openAddressModal(item)}>
                        <FontAwesome name='map-marker' style={styles.pinIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Convert price range number to dollar signs (e.g., 1 to $, 2 to $$, 3 to $$$)
    const priceRangeToDollarSigns = (priceRange) => '$'.repeat(priceRange);

    // Main component rendering
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>NEARBY RESTAURANTS</Text>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
                {/* Rating Filter */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>Rating</Text>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setRatingModalVisible(true)}>
                        <View style={styles.filterButtonContent}>
                            {selectedRating ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {[...Array(selectedRating)].map((_, index) => (
                                        <MaterialIcons
                                            key={index}
                                            name='star'
                                            size={styles.filterButtonText.fontSize} // Match the size to the text
                                            color='#FFFFFF'
                                            style={styles.iconSpacing}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.filterButtonText}>-- Select --</Text>
                            )}
                            <View style={{ width: 8 }} />
                            <FontAwesome name='caret-down' size={styles.filterButtonText.fontSize} color='#FFFFFF' />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Price Filter */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>Price</Text>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setPriceModalVisible(true)}>
                        <View style={styles.filterButtonContent}>
                            <Text style={styles.filterButtonText}>
                                {selectedPrice ? selectedPrice : '-- Select --'}
                            </Text>
                            <View style={{ width: 8 }} />
                            <FontAwesome name='caret-down' size={styles.filterButtonText.fontSize} color='#FFFFFF' />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Restaurants Section */}
            <Text style={styles.sectionTitle}>RESTAURANTS</Text>
            <FlatList
                data={filteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.menuList,
                    { paddingRight: width > 768 ? width * 0.05 : width * 0.065 },
                ]}
                numColumns={2} // Display restaurants in a grid with 2 columns
            />

            {/* Rating Modal */}
            <Modal
                visible={ratingModalVisible}
                transparent={true}
                animationType='slide'
                onRequestClose={() => setRatingModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setSelectedRating(null);
                            setRatingModalVisible(false);
                        }}
                    >
                        <Text style={styles.modalText}>All</Text>
                    </TouchableOpacity>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <TouchableOpacity
                            key={rating}
                            style={styles.modalItem}
                            onPress={() => {
                                setSelectedRating(rating);
                                setRatingModalVisible(false);
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                {[...Array(rating)].map((_, index) => (
                                    <MaterialIcons key={index} name='star' size={width * 0.06} color='#222126' />
                                ))}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>

            {/* Price Modal */}
            <Modal
                visible={priceModalVisible}
                transparent={true}
                animationType='slide'
                onRequestClose={() => setPriceModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setSelectedPrice(null);
                            setPriceModalVisible(false);
                        }}
                    >
                        <Text style={styles.modalText}>All</Text>
                    </TouchableOpacity>
                    {['$', '$$', '$$$'].map((price) => (
                        <TouchableOpacity
                            key={price}
                            style={styles.modalItem}
                            onPress={() => {
                                setSelectedPrice(price);
                                setPriceModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalText}>{price}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>

            {/* Address Modal */}
            <Modal
                visible={addressModalVisible}
                transparent={true}
                animationType='slide'
                onRequestClose={closeAddressModal}
            >
                <RestaurantAddressModal restaurant={selectedRestaurant} onClose={closeAddressModal} />
            </Modal>
        </View>
    );
};

// Styles for the RestaurantsScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1, // Occupy full height of the screen
        backgroundColor: '#FFFFFF', // White background color
        paddingHorizontal: width > 768 ? width * 0.05 : width * 0.067, // Responsive horizontal padding
        marginTop: height > 800 ? -height * 0.025 : 0, // Adjust top margin for taller screens
    },

    pageTitle: {
        fontSize: width > 768 ? width * 0.05 : width > 375 && height > 800 ? width * 0.07 : width * 0.06, // Responsive font size
        color: '#222126', // Dark text color
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }), // Font selection based on platform
        marginTop: height > 800 ? height * 0.05 : height * 0.037, // Adjust top margin based on screen height
        marginBottom: height * 0.025, // Bottom margin relative to screen height
        adjustsFontSizeToFit: true, // Allow font size to adjust to fit
        numberOfLines: 1, // Single line text
        minimumFontScale: 0.8, // Minimum font scaling to 80% of original size
    },
    filterContainer: {
        flexDirection: 'row', // Arrange children horizontally
        justifyContent: 'space-between', // Space out the children
        paddingHorizontal: 0, // No extra horizontal padding
        marginBottom: height * 0.025, // Bottom margin relative to screen height
    },
    filterGroup: {
        width: '45%', // 45% width for each filter group
    },
    filterTitle: {
        fontSize: width > 768 ? width * 0.04 : width > 375 ? width * 0.045 : width * 0.04, // Responsive font size
        color: '#222126', // Dark text color
        fontWeight: 'bold', // Bold font weight
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
        marginBottom: height * 0.0025, // Small bottom margin
        adjustsFontSizeToFit: true,
        numberOfLines: 1, // Single line text
        minimumFontScale: 0.8, // Minimum font scaling to 80% of original size
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DA583B', // Button background color
        paddingVertical: width > 768 ? height * 0.009 : height * 0.012,
        paddingHorizontal: width > 768 ? width * 0.02 : width * 0.027,
        borderRadius: height * 0.006,
        width: '100%',
        marginBottom: height * 0.01,
        minWidth: width * 0.25, // Minimum width for consistency
    },
    filterButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center content
        width: '100%',
        maxWidth: width * 0.25, // Max width to avoid overflow
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontSize: width > 768 ? width * 0.035 : width > 360 ? width * 0.042 : width * 0.037,
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial-BoldMT',
        }),
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.8,
        textAlign: 'center', // Center text alignment
    },
    iconSpacing: {
        marginRight: 0, // No extra margin to the right of the icon
    },
    sectionTitle: {
        fontSize: width > 768 ? width * 0.05 : width > 375 ? width * 0.06 : width * 0.055, // Responsive font size
        color: '#222126', // Dark text color
        fontWeight: 'bold', // Bold font weight
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),
        marginLeft: '2.5%', // Left margin for alignment
        marginBottom: height * 0.018, // Bottom margin relative to screen height
        paddingBottom: height * 0.006, // Padding at the bottom
        adjustsFontSizeToFit: true,
        numberOfLines: 1, // Single line text
        minimumFontScale: 0.8, // Minimum font scaling to 80% of original size
    },
    restaurantList: {
        flexGrow: 1, // Allow list to grow and take up available space
    },
    restaurantCard: {
        width: width > 768 ? '48%' : '49%',
        marginHorizontal: width > 768 ? '1%' : '1.5%',
        marginBottom: height * 0.031,
        borderRadius: height * 0.01,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: height * 0.002 },
        shadowOpacity: 0.1,
        shadowRadius: height * 0.006,
        elevation: 5,
        height: height * 0.26,
        minHeight: 160,
        justifyContent: 'space-between',
        position: 'relative', // Relative position for pinButton
    },

    restaurantImage: {
        width: '100%', // Full width image
        height: '50%', // 50% of card height
        borderTopLeftRadius: height * 0.01, // Rounded top left corner
        borderTopRightRadius: height * 0.01, // Rounded top right corner
        resizeMode: 'cover', // Cover container while maintaining aspect ratio
    },
    restaurantInfo: {
        padding: height * 0.022, // Padding around text content
        paddingLeft: height * 0.0025, // Extra padding to the left
        paddingRight: height * 0.005, // Extra padding to the right
        flex: 1, // Allow info section to take up available space
        width: '100%', // Prevent overflow of content
    },
    restaurantName: {
        fontSize: width > 360 ? width * 0.044 : width * 0.037, // Responsive font size
        color: '#222126', // Dark text color
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }), // Font selection based on platform
        textAlign: 'left', // Align text to the left
        letterSpacing: 0, // No extra letter spacing
        flexWrap: 'wrap', // Allow text to wrap to the next line
        flexShrink: 1, // Allow text to shrink to avoid overflow
        overflow: 'hidden', // Hide any overflow text
        paddingHorizontal: height * 0.006, // Horizontal padding
        paddingBottom: height * 0.005, // Padding below the text
        width: '100%', // Full width of the container
    },
    priceRange: {
        flexWrap: 'nowrap', // Prevent wrapping of price range text
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: height * 0.006,
        marginTop: height * 0.006, // Adjust margin for rating stars
    },
    pinButton: {
        padding: width * 0.02,
        borderRadius: width * 0.04,
        backgroundColor: 'transparent',
    },
    pinIcon: {
        fontSize: width > 768 ? width * 0.035 : width * 0.05, // Responsive icon size
        color: '#DA583B', // Icon color
    },
    pinButtonContainer: {
        position: 'absolute',
        bottom: height * 0.015,
        right: width * 0.03,
    },

    modalContainer: {
        flex: 1, // Full screen height
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalItem: {
        backgroundColor: '#FFFFFF', // White background for modal item
        padding: height * 0.025, // Padding around content
        marginVertical: height * 0.006, // Vertical margin
        borderRadius: height * 0.01, // Rounded corners
        width: width > 360 ? '80%' : '90%', // Responsive width
        alignItems: 'center', // Center content
    },
    modalText: {
        fontSize: width > 360 ? width * 0.048 : width * 0.042, // Responsive font size
        color: '#222126', // Dark text color
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Arial-BoldMT',
            default: 'Arial-BoldMT',
        }), // Font selection based on platform
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.8, // Minimum font scaling to 80% of original size
    },
});

export default RestaurantsScreen;
