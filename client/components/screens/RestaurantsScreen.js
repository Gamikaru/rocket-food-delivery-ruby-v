import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const RestaurantsScreen = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            // Dummy data for example purposes
            const fetchedRestaurants = [
                { id: '1', name: 'Golden Bar & Grill', price: '$$', rating: 4, image: require('../../assets/images/restaurants/cuisinePizza.jpg') },
                { id: '2', name: 'WJU Eats', price: '$$', rating: 5, image: require('../../assets/images/restaurants/cuisineJapanese.jpg') },
                { id: '3', name: 'Sweet Dragon', price: '$', rating: 4, image: require('../../assets/images/restaurants/cuisinePasta.jpg') },
                { id: '4', name: 'Golden Creamery', price: '$', rating: 4, image: require('../../assets/images/restaurants/cuisineSoutheast.jpg') },
            ];
            setRestaurants(fetchedRestaurants);
        };

        fetchRestaurants();
    }, []);

    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Menu', { restaurantId: item.id })}
            style={styles.restaurantCard}
        >
            <Image source={item.image} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name} ({item.price})</Text>
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => (
                        <FontAwesome
                            key={index}
                            name='star'
                            size={16}
                            color={index < item.rating ? '#000000' : '#cccccc'}
                        />
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            
            <Text style={styles.pageTitle}>NEARBY RESTAURANTS</Text>
            <View style={styles.filterContainer}>
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>Rating</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterButtonText}>-- Select -- </Text>
                        <FontAwesome name='caret-down' size={16} color='#FFFFFF' />
                    </TouchableOpacity>
                </View>
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>Price</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterButtonText}>-- Select -- </Text>
                        <FontAwesome name='caret-down' size={16} color='#FFFFFF' />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.sectionTitle}>RESTAURANTS</Text>
            <FlatList
                data={restaurants}
                renderItem={renderRestaurant}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.restaurantList}
                numColumns={2}
            />
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
        marginTop: 30,
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
        marginBottom: 5,
        
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the text and icon together
        backgroundColor: '#DA583B', // Orange color for the filter buttons
        padding: 10,
        paddingBottom: 12, // Adjusting padding for better visual alignment
        borderRadius: 5,
        width: '100%',
        marginBottom: 20
    },
    
    filterButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'helvetica',
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
        height: height * 0.25, // Adjust the height to make the card vertically elongated
    },
    
    restaurantImage: {
        width: '100%',
        height: '50%', // 50% of the card height for the image
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    restaurantInfo: {
        padding: 10,
        height: '50%', // 50% of the card height for the text
    },
    restaurantName: {
        fontSize: 20,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginBottom: 15,
        textAlign: 'left', // Left justified text
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Left justified stars
    },
    restaurantRating: {
        color: '#000000',
    },
});

export default RestaurantsScreen;
