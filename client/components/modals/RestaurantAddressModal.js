import { faCaretDown, faChevronDown, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import customMapStyle from '../../styles/mapStyle.json';

const { width, height } = Dimensions.get('window');

// Helper functions for scaling sizes relative to screen dimensions
const scaleSize = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 667) * size;

const RestaurantAddressModal = ({ visible, onClose, restaurant }) => {
    // `translateY` manages the vertical movement of the modal for drag gestures
    const translateY = useRef(new Animated.Value(height * 0.2)).current;
    const lastTranslateY = useRef(height * 0.2); // Track the last position of the modal

    // Initial map region centered on the restaurant's coordinates
    const [mapRegion, setMapRegion] = useState({
        latitude: restaurant?.address?.coordinates?.lat || 0,
        longitude: restaurant?.address?.coordinates?.lng || 0,
        latitudeDelta: 0.02, // Initial zoom level
        longitudeDelta: 0.02,
    });

    // State to store the positions of the chevron markers (dots) and their colors
    const [dots, setDots] = useState([]);
    const [dotColors, setDotColors] = useState([]);

    // Update dots and their colors when the restaurant or map region changes
    useEffect(() => {
        if (restaurant && restaurant.address && restaurant.address.coordinates) {
            const pathCoordinates = [
                { latitude: restaurant.address.coordinates.lat, longitude: restaurant.address.coordinates.lng },
                { latitude: restaurant.address.coordinates.lat + 0.015, longitude: restaurant.address.coordinates.lng + 0.015 }
            ];

            // Calculate the number of dots based on the zoom level
            const numberOfDots = Math.min(8, Math.max(10, Math.round(200 * (0.02 / mapRegion.latitudeDelta))));

            // Control the starting and ending positions of the dots
            const startOffset = 0.1; // Controls how far from the start the chevrons begin
            const endOffset = 0.9; // Controls how far from the end the chevrons stop

            // Generate the dots' positions along the path
            const newDots = Array.from({ length: numberOfDots }, (_, i) => {
                const t = startOffset + i * ((endOffset - startOffset) / (numberOfDots - 1));
                return {
                    latitude: pathCoordinates[0].latitude + t * (pathCoordinates[1].latitude - pathCoordinates[0].latitude),
                    longitude: pathCoordinates[0].longitude + t * (pathCoordinates[1].longitude - pathCoordinates[0].longitude),
                };
            });

            setDots(newDots); // Update the dots' positions
            setDotColors(newDots.map(() => '#DA583B')); // Set initial color for all dots
        }
    }, [restaurant, mapRegion]);

    // Animate the dots' colors to create a visual effect
    useEffect(() => {
        const animateDots = () => {
            dots.forEach((_, index) => {
                setTimeout(() => {
                    setDotColors((prevColors) =>
                        prevColors.map((color, i) =>
                            i === index ? (color === '#DA583B' ? '#FFFFFF' : '#DA583B') : color
                        )
                    );
                }, index * 40); // Stagger the animation for each dot
            });
        };

        const interval = setInterval(animateDots, dots.length * 40 + 200); // Repeat animation

        return () => clearInterval(interval); // Clean up the interval on unmount
    }, [dots]);

    // Handle the vertical drag gestures on the modal
    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: true }
    );

    // Handle the state changes of the drag gesture
    const onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            let offsetY = event.nativeEvent.translationY + lastTranslateY.current;

            // Close the modal if dragged down far enough or with enough speed
            if (offsetY >= height * 0.3 || event.nativeEvent.velocityY >= 1000) {
                onClose();
            } else {
                // Otherwise, snap the modal back to its previous position
                lastTranslateY.current = offsetY;
                Animated.spring(translateY, {
                    toValue: offsetY,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    // Dummy coordinates for user's address, used for display purposes
    const userAddressCoordinates = restaurant && restaurant.address && restaurant.address.coordinates
        ? {
            latitude: restaurant.address.coordinates.lat + 0.015,
            longitude: restaurant.address.coordinates.lng + 0.015,
        }
        : null;

    const estimatedDeliveryTime = '20 mins'; // Placeholder for estimated delivery time

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                >
                    <Animated.View style={[styles.outerBorder, { transform: [{ translateY }] }]}>
                        <MapView
                            style={styles.map}
                            initialRegion={mapRegion}
                            onRegionChangeComplete={region => setMapRegion(region)} // Update region on map movement
                            customMapStyle={customMapStyle} // Apply custom styling to the map
                        >
                            {/* Render the chevrons as markers along the path */}
                            {dots.map((coordinate, index) => {
                                let angle = 0; // Default rotation angle

                                if (index < dots.length - 1) {
                                    // Calculate angle based on the direction to the next dot
                                    const nextCoordinate = dots[index + 1];
                                    angle = Math.atan2(
                                        nextCoordinate.latitude - coordinate.latitude,
                                        nextCoordinate.longitude - coordinate.longitude
                                    ) * (180 / Math.PI) + 180; // Convert from radians to degrees
                                } else if (index > 0) {
                                    // For the last dot, use the angle from the previous one
                                    const previousCoordinate = dots[index - 1];
                                    angle = Math.atan2(
                                        coordinate.latitude - previousCoordinate.latitude,
                                        coordinate.longitude - previousCoordinate.longitude
                                    ) * (180 / Math.PI) + 180;
                                }

                                return (
                                    <Marker
                                        key={index}
                                        coordinate={coordinate}
                                        anchor={{ x: 0.5, y: 0.5 }}
                                        style={{ transform: [{ rotate: `${angle}deg` }] }} // Rotate the chevron
                                    >
                                        <FontAwesomeIcon icon={faCaretDown} size={scaleSize(width * 0.04)} color={dotColors[index]} />
                                    </Marker>
                                );
                            })}

                            {/* Restaurant marker */}
                            {restaurant && (
                                <Marker
                                    coordinate={{
                                        latitude: restaurant.address.coordinates.lat,
                                        longitude: restaurant.address.coordinates.lng,
                                    }}
                                    title={restaurant.name}
                                    description={restaurant.address.street_address}
                                >
                                    <Image
                                        source={require('../../assets/images/map-marker.png')}
                                        style={styles.customMarkerIcon} // Custom icon for restaurant marker
                                    />
                                </Marker>
                            )}

                            {/* User's address marker */}
                            {userAddressCoordinates && (
                                <Marker
                                    coordinate={userAddressCoordinates}
                                    title="Your Address"
                                    description="Dummy Address for Delivery"
                                >
                                    <FontAwesomeIcon icon={faHome} size={scaleSize(24)} color="#222126" />
                                </Marker>
                            )}
                        </MapView>
                        <View style={styles.additionalInfo}>
                            <View style={styles.pullDownIndicator}>
                                <FontAwesomeIcon icon={faChevronDown} size={scaleSize(24)} color="#D3D3D3" onPress={onClose} />
                            </View>
                            <Text style={styles.modalTitle}>{restaurant?.name || 'Unknown Restaurant'}</Text>
                            <Text style={styles.infoText}>Estimated Delivery Time: {estimatedDeliveryTime}</Text>
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </Modal>
    );
};

// Styles for the modal and its contents
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    outerBorder: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 8,
        marginTop: height * 0.15, // Position the modal lower on the screen
    },
    map: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 10,
        overflow: 'hidden', // Ensure map content stays within bounds
    },
    additionalInfo: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    pullDownIndicator: {
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    modalTitle: {
        fontSize: width * 0.065, // Larger font size for the modal title
        color: '#DA583B', // Primary color for the title
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }),
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    infoText: {
        fontSize: width * 0.045, // Slightly smaller text for additional info
        color: '#222126',
        fontFamily: Platform.select({
            ios: 'Oswald-Medium',
            android: 'Oswald-Medium',
            default: 'Arial-BoldMT',
        }),
        marginTop: height * 0.01, // Space above the info text
        textTransform: 'uppercase',
    },
    customMarkerIcon: {
        width: width * 0.08,
        height: width * 0.08,
        resizeMode: 'contain', // Keep the icon aspect ratio
    },
    errorText: {
        textAlign: 'center',
        fontSize: width * 0.04,
        color: '#DA583B',
        fontFamily: Platform.select({
            ios: 'Arial',
            android: 'Arial',
            default: 'Arial',
        }),
        marginVertical: height * 0.02,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4, // Fully circular dots
        backgroundColor: '#DA583B', // Default dot color
    },
});

export default RestaurantAddressModal;
