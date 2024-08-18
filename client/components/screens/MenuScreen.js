import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderModal from '../modals/OrderModal';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// MENU SCREEN COMPONENT: Manages the restaurant menu display and order creation
const MenuScreen = ({ route, navigation }) => {
    const { restaurantId, restaurantName, priceRange, rating } = route.params;

    // STATE MANAGEMENT: Holds menu items, order details, modal visibility, order button state, loading, and error message
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [isOrderButtonEnabled, setIsOrderButtonEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // EFFECT: Fetch menu items from the API when the component mounts
    useEffect(() => {
        const fetchMenuItems = async () => {
            setIsLoading(true);
            try {
                const baseUrl = process.env.EXPO_PUBLIC_URL; // Use environment variable for the base URL
                const url = `${baseUrl}/api/products?restaurant=${restaurantId}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch menu items, status code: ${response.status}`);
                }

                const data = await response.json();
                setMenuItems(data);

                // Initialize order quantities to 0 for each menu item
                const initialOrder = data.reduce((acc, item) => {
                    acc[item.id] = 0;
                    return acc;
                }, {});
                setOrder(initialOrder);
                setIsOrderButtonEnabled(false); // Initially disable the order button
                setErrorMessage(''); // Clear any previous error messages on success
            } catch (error) {
                console.error('Error fetching menu items:', error.message);
                setErrorMessage('Failed to load menu items. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, [restaurantId]);

    // FUNCTION: Updates order quantity and checks if the order button should be enabled
    const updateQuantity = (itemId, delta) => {
        const newOrder = { ...order, [itemId]: Math.max(order[itemId] + delta, 0) }; // Ensure quantity doesn't go below 0
        setOrder(newOrder);
        const totalQuantity = Object.values(newOrder).reduce((sum, qty) => sum + qty, 0);
        setIsOrderButtonEnabled(totalQuantity > 0); // Enable button if at least one item is ordered
    };

    // FUNCTION: Renders each menu item in the list
    const renderMenuItem = ({ item }) => (
        <View style={styles.menuCard}>
            <Image source={require('../../assets/images/RestaurantMenu.jpg')} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>$ {(item.cost / 100).toFixed(2)}</Text>
                <Text style={styles.menuItemDescription}>Lorem ipsum dolor sit amet.</Text>
            </View>
            <View style={styles.menuItemControls}>
                <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                    accessibilityLabel={`Decrease quantity of ${item.name}`}
                    accessibilityHint={`Double tap to decrease the quantity of ${item.name}`}
                >
                    <FontAwesome name="minus" size={12} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.menuItemQuantity}>{order[item.id] || 0}</Text>
                <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                    accessibilityLabel={`Increase quantity of ${item.name}`}
                    accessibilityHint={`Double tap to increase the quantity of ${item.name}`}
                >
                    <FontAwesome name="plus" size={12} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // FUNCTION: Renders a skeleton loader while menu items are being fetched
    const renderSkeletonLoader = () => (
        <ContentLoader
            speed={2}
            width={width}
            height={height * 0.14}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <Rect x="0" y="0" rx="5" ry="5" width={width * 0.27} height={height * 0.14} />
            <Rect x={width * 0.30} y="10" rx="4" ry="4" width={width * 0.60} height="13" />
            <Rect x={width * 0.30} y="30" rx="3" ry="3" width={width * 0.40} height="10" />
            <Rect x={width * 0.30} y="50" rx="3" ry="3" width={width * 0.30} height="10" />
        </ContentLoader>
    );

    // FUNCTION: Converts price range number to dollar signs (e.g., 1 to $, 2 to $$, 3 to $$$)
    const priceRangeToDollarSigns = (priceRange) => '$'.repeat(priceRange);

    return (
        <View style={styles.container}>
            {/* TITLE SECTION */}
            <Text style={styles.mainTitle}>RESTAURANT MENU</Text>

            {/* RESTAURANT INFO AND CREATE ORDER BUTTON */}
            <View style={styles.restaurantInfoContainer}>
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurantName}</Text>
                    <Text style={styles.restaurantDetails}>
                        Price: <Text style={styles.boldDollarSigns}>{priceRangeToDollarSigns(priceRange)}</Text>
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.restaurantDetails}>Rating: </Text>
                        {[...Array(rating)].map((_, index) => (
                            <MaterialIcons
                                key={index}
                                name='star'
                                size={width * 0.04}
                                color='#000000'
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.orderButton, { backgroundColor: isOrderButtonEnabled ? '#DA583B' : '#CCCCCC' }]}
                    onPress={() => setModalVisible(true)}
                    disabled={!isOrderButtonEnabled}
                    accessibilityLabel="Create Order"
                    accessibilityHint="Double tap to create your order"
                >
                    <Text style={styles.orderButtonText}>Create Order</Text>
                </TouchableOpacity>
            </View>

            {/* MENU LIST OR LOADING/ERROR STATES */}
            {isLoading ? (
                <FlatList
                    data={[...Array(10).keys()]}  // Render skeleton loaders
                    renderItem={renderSkeletonLoader}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={[styles.menuList, { paddingRight: 15 }]}
                    initialNumToRender={10}  // Initial items to render
                    maxToRenderPerBatch={10}  // Number of items to render in one batch
                    windowSize={5}  // Number of items to keep in memory outside of viewable area
                />
            ) : errorMessage ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => fetchMenuItems()}>
                        <Text style={styles.retryButton}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={menuItems}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={[styles.menuList, { paddingRight: 15 }]}
                    initialNumToRender={10}  // Initial items to render
                    maxToRenderPerBatch={10}  // Number of items to render in one batch
                    windowSize={5}  // Number of items to keep in memory outside of viewable area
                />
            )}

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

// STYLES: Define styles for various components used in the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,  // Ensure the container takes up the full height of the screen
        backgroundColor: '#FFFFFF',  // Set background color to white
        paddingHorizontal: width > 360 ? width * 0.08 : width * 0.067,  // Adjust horizontal padding based on screen width
        paddingTop: height * 0.012,  // Add padding to the top of the container relative to screen height
    },
    mainTitle: {
        fontSize: width > 360 ? width * 0.07 : width * 0.064,  // Set font size relative to screen width
        color: '#222126',  // Set text color to a dark shade
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Use Oswald on iOS/Android, Arial-BoldMT on other platforms
        marginBottom: height * 0.025,  // Add margin below the title relative to screen height
        marginTop: height * 0.025,  // Add margin above the title relative to screen height
    },
    restaurantInfoContainer: {
        flexDirection: 'row',  // Arrange the restaurant info and rating in a horizontal row
        justifyContent: 'space-between',  // Distribute space between the info and rating
        alignItems: 'center',  // Center align the content vertically
        marginBottom: height * 0.025,  // Add margin below the container relative to screen height
    },
    restaurantInfo: {
        flexDirection: 'column',  // Arrange restaurant name and details in a vertical column
    },
    restaurantName: {
        fontSize: width > 360 ? width * 0.05 : width * 0.053,  // Set font size relative to screen width
        fontWeight: 'bold',  // Make the text bold
        fontFamily: Platform.select({
            ios: 'Oswald-Bold',
            android: 'Oswald-Bold',
            default: 'Arial-BoldMT',
        }),  // Use Oswald-Bold on iOS/Android, Arial-BoldMT on other platforms
        color: '#222126',  // Set text color to a dark shade
        paddingRight: width * 0.1,  // Add padding to the right of the restaurant name relative to screen width
    },
    restaurantDetails: {
        fontSize: width > 360 ? width * 0.043 : width * 0.037,  // Set font size relative to screen width
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial-BoldMT',
        }),  // Use Arial on iOS/Android, Arial-BoldMT on other platforms
        color: '#222126',  // Set text color to a dark shade
    },
    boldDollarSigns: {
        fontWeight: 'bold',  // Make the dollar signs bold
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }),  // Use Arial-BoldMT on all platforms
    },
    ratingContainer: {
        flexDirection: 'row',  // Arrange rating stars in a horizontal row
        alignItems: 'center',  // Center align the content vertically
    },
    menuList: {
        alignItems: 'center',  // Center align the menu items horizontally
    },
    menuCard: {
        flexDirection: 'row',  // Arrange image and info in a horizontal row
        alignItems: 'center',  // Center align the content vertically
        width: '100%',  // Set card width to 100% of the container width
        paddingVertical: height * 0.015,  // Add vertical padding inside the card relative to screen height
        backgroundColor: 'transparent',  // Set background color to transparent
    },
    menuItemImage: {
        width: width * 0.27,  // Set width for the menu item image relative to screen width
        height: height * 0.14,  // Set height for the menu item image relative to screen height
        resizeMode: 'cover',  // Cover the image area while maintaining aspect ratio
    },
    menuItemInfo: {
        flex: 1,  // Allow the info section to take up the available space
        paddingLeft: width * 0.025,  // Add padding to the left of the info section relative to screen width
        flexShrink: 1,  // Allow the content to shrink if necessary to avoid overflow
    },
    menuItemName: {
        fontSize: width > 360 ? width * 0.048 : width * 0.042,  // Set font size relative to screen width
        color: '#222126',  // Set text color to a dark shade
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial',
        }),  // Use Oswald-Regular on iOS/Android, Arial on other platforms
        overflow: 'hidden',  // Hide any overflow text
        marginRight: width * -0.08,  // Add margin to the right of the name relative to screen width
    },
    menuItemPrice: {
        fontSize: width > 360 ? width * 0.045 : width * 0.048,  // Set font size relative to screen width
        color: '#000000',  // Set text color to black
        fontWeight: 'bold',  // Make the text bold
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial',
        }),  // Use Arial on iOS/Android, Arial-BoldMT on other platforms
    },
    menuItemDescription: {
        fontSize: width > 360 ? width * 0.037 : width * 0.032,  // Set font size relative to screen width
        color: '#222126',  // Set text color to a dark shade
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),  // Use Arial on all platforms
        marginRight: width * -0.02,  // Add margin to the right of the description relative to screen width
    },
    menuItemControls: {
        flexDirection: 'row',  // Arrange quantity buttons in a horizontal row
        justifyContent: 'space-between',  // Distribute space between buttons
        width: width * 0.30,  // Set width for the control area relative to screen width
        paddingLeft: width * 0.07,  // Add padding to the left of the controls relative to screen width
    },
    quantityButton: {
        width: width * 0.067,  // Set width for the quantity button relative to screen width
        height: width * 0.067,  // Set height for the quantity button relative to screen width
        justifyContent: 'center',  // Center align content vertically
        alignItems: 'center',  // Center align content horizontally
        borderRadius: width * 0.04,  // Make the button circular relative to screen width
        backgroundColor: '#222126',  // Set background color to dark shade
    },
    menuItemQuantity: {
        fontSize: width > 360 ? width * 0.048 : width * 0.042,  // Set font size relative to screen width
        color: '#222126',  // Set text color to a dark shade
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),  // Use Arial on all platforms
        marginHorizontal: width * 0.027,  // Add horizontal margin around the quantity text relative to screen width
    },
    orderButton: {
        paddingVertical: height * 0.008,  // Vertical padding relative to screen height
        paddingHorizontal: width * 0.093,  // Horizontal padding relative to screen width
        borderRadius: height * 0.01,  // Round the corners of the button relative to screen height
        alignItems: 'center',  // Center align the content horizontally
    },
    orderButtonText: {
        color: '#FFFFFF',  // Set text color to white
        fontSize: width > 360 ? width * 0.04 : width * 0.04,  // Set font size relative to screen width
        fontFamily: Platform.select({
            ios: 'Oswald-Regular',
            android: 'Oswald-Regular',
            default: 'Arial-BoldMT',
        }),  // Use Oswald-Regular on iOS/Android, Arial-BoldMT on other platforms
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    errorText: {
        fontSize: width * 0.045,
        color: '#DA583B',
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    retryButton: {
        color: '#DA583B',
        fontSize: width * 0.04,
        textDecorationLine: 'underline',
    },
});

export default MenuScreen;
