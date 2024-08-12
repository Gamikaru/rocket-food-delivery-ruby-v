import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import all restaurant images
import cuisineGreek from '../../assets/images/restaurants/cuisineGreek.jpg';
import cuisineJapanese from '../../assets/images/restaurants/cuisineJapanese.jpg';
import cuisinePasta from '../../assets/images/restaurants/cuisinePasta.jpg';
import cuisinePizza from '../../assets/images/restaurants/cuisinePizza.jpg';
import cuisineSoutheast from '../../assets/images/restaurants/cuisineSoutheast.jpg';
import cuisineViet from '../../assets/images/restaurants/cuisineViet.jpg';

// Dynamic dimensions
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
            const priceValue = selectedPrice.length; // Convert '$', '$$', '$$$' to 1, 2, 3
            filtered = filtered.filter(restaurant => restaurant.price_range === priceValue);
        }

        setFilteredRestaurants(filtered); // Update the filtered restaurants state
    };

    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Menu', {
                restaurantId: item.id,
                restaurantName: item.name,
                priceRange: item.price_range,
                rating: item.rating
            })}
            style={styles.restaurantCard}
        >
            <Image source={getRandomImage()} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>
                    {item.name}&nbsp;<Text>({priceRangeToDollarSigns(item.price_range)})</Text>
                </Text>
                <View style={styles.ratingContainer}>
                    {[...Array(item.rating)].map((_, index) => (
                        <MaterialIcons
                            key={index}
                            name='star'
                            size={16}
                            color='#000000'
                        />
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

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
                        onPress={() => setRatingModalVisible(true)}
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
                                            style={styles.iconSpacing}
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
                        onPress={() => setPriceModalVisible(true)}
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
                keyExtractor={item => item.id.toString()}
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
                            setSelectedRating(null);
                            setRatingModalVisible(false);
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
                                setRatingModalVisible(false);
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
                            setSelectedPrice(null);
                            setPriceModalVisible(false);
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
                                setPriceModalVisible(false);
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
        paddingHorizontal: width > 360 ? 30 : 25,
        marginTop: height > 800 ? -20 : 0,
    },
    pageTitle: {
        fontSize: width > 360 ? 30 : 24,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginLeft: 0,
        marginTop: height > 800 ? 50 : 30,
        marginBottom: 20,
        adjustsFontSizeToFit: true,
        numberOfLines: 1,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        marginBottom: 20,
    },
    filterGroup: {
        width: '45%',
    },
    filterTitle: {
        fontSize: width > 360 ? 28 : 24,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        fontWeight: 'bold',
        marginBottom: 2,
        adjustsFontSizeToFit: true,
        numberOfLines: 1,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DA583B',
        padding: width > 360 ? 10 : 8,
        paddingBottom: 12,
        borderRadius: 5,
        width: '100%',
        marginBottom: 20
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontSize: width > 360 ? 16 : 14,
        fontFamily: 'Arial',
    },
    filterButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginRight: 0,
    },
    sectionTitle: {
        fontSize: width > 360 ? 30 : 24,
        color: '#222126',
        fontWeight: 'Bold',
        fontFamily: 'Oswald-Regular',
        marginLeft: '2.5%',
        marginBottom: 15,
        paddingBottom: 5,
        adjustsFontSizeToFit: true,
        numberOfLines: 1,
    },
    // Additional styles for FlatList container
    restaurantList: {
        alignItems: 'top',
        justifyContent: 'top',  // Center the cards in the FlatList
        flexGrow: 1, // Allow the container to grow and fill space
    },
    restaurantCard: {
        width: '45%',
        marginHorizontal: '2.5%',
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        height: height * 0.25,
        minHeight: 150,  // Add this to ensure minimum height
        justifyContent: 'space-between',  // Adjust this to ensure spacing
        flexGrow: 1, // Ensure that the card takes available space
    },
    restaurantImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1.5,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        resizeMode: 'cover',
    },
    restaurantInfo: {
        padding: 10,
        flex: 1, // Ensure it takes up the available space
    },
    restaurantName: {
        fontSize: width > 360 ? 18 : 16,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        marginBottom: 15,
        textAlign: 'left',
        letterSpacing: 0,
        flexWrap: 'nowrap',
        flexShrink: 1,
        overflow: 'hidden',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
        width: width > 360 ? '80%' : '90%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: width > 360 ? 18 : 16,
        color: '#222126',
        fontFamily: 'Arial',
    },
});

export default RestaurantsScreen;
