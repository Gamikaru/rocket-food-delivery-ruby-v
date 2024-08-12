import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderModal from '../modals/OrderModal';

const { width, height } = Dimensions.get('window');

const MenuScreen = ({ route, navigation }) => {
    const { restaurantId, restaurantName, priceRange, rating } = route.params;
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [isOrderButtonEnabled, setIsOrderButtonEnabled] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const baseUrl = process.env.EXPO_PUBLIC_URL;
                const url = `${baseUrl}/api/products?restaurant=${restaurantId}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch menu items, status code: ${response.status}`);
                }

                const data = await response.json();
                const productsWithRestaurant = data.map(item => ({
                    ...item,
                    restaurant_id: restaurantId,
                }));

                setMenuItems(productsWithRestaurant);

                const initialOrder = {};
                productsWithRestaurant.forEach(item => {
                    initialOrder[item.id] = 0;
                });
                setOrder(initialOrder);
                setIsOrderButtonEnabled(false);
            } catch (error) {
                console.error('Error fetching menu items:', error.message);
            }
        };

        fetchMenuItems();
    }, [restaurantId]);

    const increaseQuantity = (item) => {
        const newOrder = { ...order, [item.id]: order[item.id] + 1 };
        setOrder(newOrder);
        checkOrderButtonState(newOrder);
    };

    const decreaseQuantity = (item) => {
        if (order[item.id] > 0) {
            const newOrder = { ...order, [item.id]: order[item.id] - 1 };
            setOrder(newOrder);
            checkOrderButtonState(newOrder);
        }
    };

    const checkOrderButtonState = (currentOrder) => {
        const totalQuantity = Object.values(currentOrder).reduce((sum, qty) => sum + qty, 0);
        setIsOrderButtonEnabled(totalQuantity > 0);
    };

    const renderMenuItem = ({ item }) => (
        <View style={styles.menuCard}>
            <Image source={require('../../assets/images/RestaurantMenu.jpg')} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>$ {(item.cost / 100).toFixed(2)}</Text>
                <Text style={styles.menuItemDescription}>Lorem ipsum dolor sit amet.</Text>
            </View>
            <View style={styles.menuItemControls}>
                <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.quantityButton}>
                    <FontAwesome name="minus" size={12} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.menuItemQuantity}>{order[item.id] || 0}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.quantityButton}>
                    <FontAwesome name="plus" size={12} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );


    const priceRangeToDollarSigns = (priceRange) => {
        return '$'.repeat(priceRange);
    };

    return (
        <View style={styles.container}>
            {/* Title Section */}
            <Text style={styles.mainTitle}>RESTAURANT MENU</Text>

            {/* Restaurant Info and Create Order Button */}
            <View style={styles.restaurantInfoContainer}>
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurantName}</Text>
                    <Text style={styles.restaurantDetails}>Price: {priceRangeToDollarSigns(priceRange)}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.restaurantDetails}>Rating: </Text>
                        {[...Array(rating)].map((_, index) => (
                            <MaterialIcons // Switch to MaterialIcons if you were using FontAwesome
                                key={index}
                                name='star'
                                size={18}
                                color='#000000'
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.orderButton, { backgroundColor: isOrderButtonEnabled ? '#DA583B' : '#CCCCCC' }]}
                    onPress={() => setModalVisible(true)}
                    disabled={!isOrderButtonEnabled} // Disable the button when order quantities are all 0
                >
                    <Text style={styles.orderButtonText}>Create Order</Text>
                </TouchableOpacity>
            </View>

            {/* Menu List */}
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.menuList}
            />
            <OrderModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                restaurantId={restaurantId}
                menuItems={menuItems}
                order={order}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 30, // Increased horizontal padding for more white space
        paddingTop: 10,
    },
    mainTitle: {
        fontSize: 30,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginBottom: 20,
        marginTop: 20,
    },
    restaurantInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    restaurantInfo: {
        flexDirection: 'column',
    },
    restaurantName: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Bold',
        color: '#222126',
    },
    restaurantDetails: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#222126',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuList: {
        alignItems: 'center',
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 12, // Adjusted for consistent spacing
        paddingHorizontal: 0, // Remove padding to make it more like a continuous list
        marginBottom: 0, // Remove bottom margin to eliminate the card-like gap
        borderRadius: 0, // Remove border radius to eliminate rounded corners
        backgroundColor: 'transparent', // Make background transparent
        shadowColor: 'transparent', // Remove shadow
        elevation: 0, // Remove elevation to remove any card effect
    },
    menuItemImage: {
        width: 100,
        height: 90,
        borderRadius: 0,
        paddingRight: 0,
    },
    menuItemInfo: {
        flex: 1,
        paddingLeft: 10,
        flexShrink: 1, // Prevent wrapping of the item info
    },
    menuItemName: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        flexWrap: 'nowrap', // Prevent wrapping
        overflow: 'hidden', // Hide overflow text
        whiteSpace: 'nowrap', // Ensure the name stays on one line
    },
    menuItemPrice: {
        fontSize: 20,
        color: '#000000', // Change color to black
        fontWeight: 'bold', // Make it bold
        fontFamily: 'Arial', // Ensure it uses Oswald font
        flexWrap: 'nowrap', // Ensure the price doesn't wrap
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#222126',
        fontFamily: 'Arial',
        flexWrap: 'nowrap', // Ensure the description doesn't wrap
    },
    menuItemControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120, // Adjust width to give more space for item names
        paddingLeft: 20, // Adjust left padding to center the controls
    },

    quantityButton: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#222126',
        paddingLeft: 2,
    },
    menuItemQuantity: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Arial',
        marginHorizontal: 10,
    },
    orderButton: {
        paddingVertical: 8,  // Make it thinner by reducing the padding
        paddingHorizontal: 35, // Make it longer without affecting alignment
        borderRadius: 8,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
});

export default MenuScreen;
