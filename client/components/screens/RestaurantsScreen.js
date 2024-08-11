import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Correct import for FontAwesome and MaterialIcons
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import all restaurant images
import cuisineGreek from '../../assets/images/restaurants/cuisineGreek.jpg';
import cuisineJapanese from '../../assets/images/restaurants/cuisineJapanese.jpg';
import cuisinePasta from '../../assets/images/restaurants/cuisinePasta.jpg';
import cuisinePizza from '../../assets/images/restaurants/cuisinePizza.jpg';
import cuisineSoutheast from '../../assets/images/restaurants/cuisineSoutheast.jpg';
import cuisineViet from '../../assets/images/restaurants/cuisineViet.jpg';

const { width, height } = Dimensions.get('window');

// Array of all imported images
const restaurantImages = [
    cuisineGreek,
    cuisineJapanese,
    cuisinePasta,
    cuisinePizza,
    cuisineSoutheast,
    cuisineViet
];

// Helper function to select a random image
const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * restaurantImages.length);
    return restaurantImages[randomIndex];
};

const RestaurantsScreen = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]); // State for filtered restaurants
    const [selectedRating, setSelectedRating] = useState(null); // State for selected rating filter
    const [selectedPrice, setSelectedPrice] = useState(null); // State for selected price filter

    const [ratingModalVisible, setRatingModalVisible] = useState(false); // State to control rating modal visibility
    const [priceModalVisible, setPriceModalVisible] = useState(false); // State to control price modal visibility

    // Fetch restaurants data from the API
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Use the correct IP address depending on the environment
                const baseUrl = process.env.EXPO_PUBLIC_URL;
                const url = `${baseUrl}/api/restaurants`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }
                const data = await response.json();

                setRestaurants(data);
                setFilteredRestaurants(data); // Initially, show all restaurants
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('Failed to fetch restaurants. Please check your network connection.');
            }
        };

        fetchRestaurants();
    }, []);

    // Apply filters after fetching restaurants to ensure all are displayed by default
    useEffect(() => {
        applyFilters();
    }, [restaurants]);

    // Re-apply filters whenever a selection changes
    useEffect(() => {
        applyFilters(); // Re-apply filters when any filter is selected
    }, [selectedRating, selectedPrice]);

    // Apply filters to restaurants based on selected Rating and Price
    const applyFilters = () => {
        if (!selectedRating && !selectedPrice) {
            setFilteredRestaurants(restaurants); // Show all restaurants if no filters are selected
            return;
        }

        let filtered = restaurants;

        if (selectedRating) {
            filtered = filtered.filter(restaurant => restaurant.rating === selectedRating);
        }

        if (selectedPrice) {
            // Convert selectedPrice from dollar signs to numeric value for comparison
            const priceValue = selectedPrice.length; // Convert '$', '$$', '$$$' to 1, 2, 3
            filtered = filtered.filter(restaurant => restaurant.price_range === priceValue);
        }

        setFilteredRestaurants(filtered); // Update the filtered restaurants state
    };

    // Render each restaurant item
    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Menu', { restaurantId: item.id })}
            style={styles.restaurantCard}
        >
            <Image source={getRandomImage()} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name} ({priceRangeToDollarSigns(item.price_range)})</Text>
                <View style={styles.ratingContainer}>
                    {[...Array(item.rating)].map((_, index) => (
                        <FontAwesome
                            key={index}
                            name='star'
                            size={16}
                            color='#000000' // Only render black stars based on the rating
                        />
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Helper function to convert price range to dollar signs
    const priceRangeToDollarSigns = (priceRange) => {
        return '$'.repeat(priceRange);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>NEARBY RESTAURANTS</Text>
            <View style={styles.filterContainer}>
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>Rating</Text>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setRatingModalVisible(true)} // Show the rating modal
                    >
                        <View style={styles.filterButtonContent}>
                            {selectedRating ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {[...Array(selectedRating)].map((_, index) => (
                                        <MaterialIcons
                                            key={index}
                                            name='star'
                                            size={16}
                                            color='#FFFFFF'
                                            style={styles.iconSpacing} // Add spacing between the stars
                                        />
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.filterButtonText}>-- Select --</Text>
                            )}
                            <View style={{ width: 8 }} />
                            <FontAwesome name='caret-down' size={16} color='#FFFFFF' />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>Price</Text>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setPriceModalVisible(true)} // Show the price modal
                    >
                        <View style={styles.filterButtonContent}>
                            <Text style={styles.filterButtonText}>
                                {selectedPrice ? selectedPrice : '-- Select --'}
                            </Text>
                            <View style={{ width: 8 }} />
                            <FontAwesome name='caret-down' size={16} color='#FFFFFF' style={styles.iconSpacing} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>RESTAURANTS</Text>
            <FlatList
                data={filteredRestaurants} // Use filtered restaurants list
                renderItem={renderRestaurant}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.restaurantList}
                numColumns={2}
            />

            {/* Rating Modal */}
            <Modal
                visible={ratingModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setRatingModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setSelectedRating(null); // Reset the rating filter
                            setRatingModalVisible(false); // Hide the modal
                        }}
                    >
                        <Text style={styles.modalText}>All</Text>
                    </TouchableOpacity>
                    {[1, 2, 3, 4, 5].map(rating => (
                        <TouchableOpacity
                            key={rating}
                            style={styles.modalItem}
                            onPress={() => {
                                setSelectedRating(rating);
                                setRatingModalVisible(false); // Hide the modal
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                {[...Array(rating)].map((_, index) => (
                                    <MaterialIcons
                                        key={index}
                                        name='star'
                                        size={20}
                                        color='#222126'
                                    />
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
                animationType="slide"
                onRequestClose={() => setPriceModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setSelectedPrice(null); // Reset the price filter
                            setPriceModalVisible(false); // Hide the modal
                        }}
                    >
                        <Text style={styles.modalText}>All</Text>
                    </TouchableOpacity>
                    {['$', '$$', '$$$'].map(price => (
                        <TouchableOpacity
                            key={price}
                            style={styles.modalItem}
                            onPress={() => {
                                setSelectedPrice(price);
                                setPriceModalVisible(false); // Hide the modal
                            }}
                        >
                            <Text style={styles.modalText}>{price}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -20
    },
    pageTitle: {
        fontSize: 30,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginLeft: 20,
        marginTop: 50,
        marginBottom: 30,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    filterGroup: {
        width: '45%',
    },
    filterTitle: {
        fontSize: 28,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DA583B',
        padding: 10,
        paddingBottom: 12,
        borderRadius: 5,
        width: '100%',
        marginBottom: 20
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'helvetica',
    },
    filterButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginRight: 0,
    },
    sectionTitle: {
        fontSize: 30,
        color: '#222126',
        fontWeight: 'Bold',
        fontFamily: 'Oswald-Regular',
        marginLeft: 20,
        marginBottom: 10,
    },
    restaurantList: {
        alignItems: 'center',
    },
    restaurantCard: {
        width: width * 0.4,
        margin: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        height: height * 0.25,
    },
    restaurantImage: {
        width: '100%',
        height: '50%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    restaurantInfo: {
        padding: 10,
        height: '50%',
    },
    restaurantName: {
        fontSize: 20,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginBottom: 15,
        textAlign: 'left',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    restaurantRating: {
        color: '#000000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalItem: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginVertical: 5,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
    },
});

export default RestaurantsScreen;
