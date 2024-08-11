import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderModal from '../modals/OrderModal';

const { width, height } = Dimensions.get('window');

const MenuScreen = ({ route, navigation }) => {
    const { restaurantId } = route.params;
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const baseUrl = process.env.EXPO_PUBLIC_URL;
                const url = `${baseUrl}/api/products?restaurant=${restaurantId}`;
                console.log('Fetching menu items from URL:', url); // Log the URL

                const response = await fetch(url);
                console.log('Response status:', response.status); // Log the response status

                if (!response.ok) {
                    throw new Error(`Failed to fetch menu items, status code: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched menu items:', JSON.stringify(data)); // Log the fetched data

                // Manually associate each product with the restaurant_id
                const productsWithRestaurant = data.map(item => ({
                    ...item,
                    restaurant_id: restaurantId // Add the restaurant_id to each product
                }));

                console.log('Setting menu items with restaurant ID:', productsWithRestaurant); // Log data before setting it
                setMenuItems(productsWithRestaurant);

                const initialOrder = {};
                productsWithRestaurant.forEach(item => {
                    initialOrder[item.id] = 0;
                });
                setOrder(initialOrder);
            } catch (error) {
                console.error('Error fetching menu items:', error.message);
            }
        };

        fetchMenuItems();
    }, [restaurantId]);

    // Function to increase the quantity of a selected menu item
    const increaseQuantity = (item) => {
        setOrder({ ...order, [item.id]: (order[item.id] || 0) + 1 });
    };

    // Function to decrease the quantity of a selected menu item
    const decreaseQuantity = (item) => {
        if (order[item.id] > 0) {
            setOrder({ ...order, [item.id]: order[item.id] - 1 });
        }
    };

    // Function to render each menu item
    const renderMenuItem = ({ item }) => (
        <View style={styles.menuCard}>
            <Image source={require('../../assets/images/restaurants/cuisinePizza.jpg')} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>${(item.cost / 100).toFixed(2)}</Text>
                <Text style={styles.menuItemDescription}>Lorem ipsum dolor sit amet.</Text>
            </View>
            <View style={styles.menuItemControls}>
                <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.quantityButton}>
                    <FontAwesome name="minus" size={20} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.menuItemQuantity}>{order[item.id] || 0}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.quantityButton}>
                    <FontAwesome name="plus" size={20} color="#000000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>RESTAURANT MENU</Text>
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.menuList}
            />
            <TouchableOpacity style={styles.orderButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.orderButtonText}>Create Order</Text>
            </TouchableOpacity>
            <OrderModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                restaurantId={restaurantId}
                menuItems={menuItems}
                order={order} // Pass the order state to the modal
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    pageTitle: {
        fontSize: 30,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        marginTop: 30,
        marginBottom: 20,
    },
    menuList: {
        alignItems: 'center',
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    menuItemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    menuItemInfo: {
        flex: 1,
        paddingLeft: 15,
    },
    menuItemName: {
        fontSize: 18,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
    menuItemPrice: {
        fontSize: 16,
        color: '#DA583B',
        fontFamily: 'Oswald-Regular',
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
    },
    menuItemControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
    },
    menuItemQuantity: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        marginHorizontal: 10,
    },
    orderButton: {
        backgroundColor: '#DA583B',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    orderButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
        textTransform: 'uppercase',
    },
});

export default MenuScreen;
