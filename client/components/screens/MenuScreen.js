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
            const fetchedMenuItems = [
                { id: '1', name: 'Cheeseburger', price: 0.50, description: 'Lorem ipsum dolor sit amet.', image: require('../../assets/images/restaurants/cuisinePizza.jpg') },
                { id: '2', name: 'Scotch Eggs', price: 20.25, description: 'Lorem ipsum dolor sit amet.', image: require('../../assets/images/restaurants/cuisinePizza.jpg') },
                { id: '3', name: 'Cauliflower Penne', price: 9.00, description: 'Lorem ipsum dolor sit amet.', image: require('../../assets/images/restaurants/cuisinePizza.jpg') },
                { id: '4', name: 'French Toast', price: 19.74, description: 'Lorem ipsum dolor sit amet.', image: require('../../assets/images/restaurants/cuisinePizza.jpg') },
                { id: '5', name: 'Ricotta Stuffed Ravioli', price: 8.25, description: 'Lorem ipsum dolor sit amet.', image: require('../../assets/images/restaurants/cuisinePizza.jpg') },
            ];
            setMenuItems(fetchedMenuItems);

            const initialOrder = {};
            fetchedMenuItems.forEach(item => {
                initialOrder[item.id] = 0;
            });
            setOrder(initialOrder);
        };

        fetchMenuItems();
    }, [restaurantId]);

    const increaseQuantity = (item) => {
        setOrder({ ...order, [item.id]: (order[item.id] || 0) + 1 });
    };

    const decreaseQuantity = (item) => {
        if (order[item.id] > 0) {
            setOrder({ ...order, [item.id]: order[item.id] - 1 });
        }
    };

    const renderMenuItem = ({ item }) => (
        <View style={styles.menuCard}>
            <Image source={item.image} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
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
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>Sweet Dragon</Text>
                <Text style={styles.restaurantDetails}>Price: $</Text>
                <Text style={styles.restaurantDetails}>Rating: <FontAwesome name="star" size={16} color="#000000" /> <FontAwesome name="star" size={16} color="#000000" /> <FontAwesome name="star" size={16} color="#000000" /> <FontAwesome name="star" size={16} color="#000000" /> <FontAwesome name="star-half" size={16} color="#000000" /></Text>
            </View>
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
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
    restaurantInfo: {
        marginBottom: 20,
    },
    restaurantName: {
        fontSize: 24,
        color: '#222126',
        fontWeight: 'bold',
        fontFamily: 'Oswald-Regular',
    },
    restaurantDetails: {
        fontSize: 18,
        color: '#222126',
        fontFamily: 'Oswald-Regular',
        paddingHorizontal: 5,
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
