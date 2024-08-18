import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage to persist user data
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import the bottom tab navigator
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native'; // Import platform-specific utilities and Dimensions API
import Header from '../Header'; // Import the Header component

import AccountDetailsScreen from '../screens/AccountDetailsScreen'; // Import the AccountDetails screen
import DeliveriesScreen from '../screens/DeliveriesScreen'; // Import the Deliveries screen for couriers
import OrderHistoryScreen from '../screens/OrderHistoryScreen'; // Import the OrderHistory screen for customers
import RestaurantsStackNavigator from './RestaurantsStackNavigator'; // Import the stack navigator for Restaurants

const Tab = createBottomTabNavigator(); // Create an instance of the bottom tab navigator

const { width, height } = Dimensions.get('window'); // Get the device's width and height for relative sizing

const TabNavigator = () => {
  const [userType, setUserType] = useState(null); // State to store the user type (customer or courier)

  useEffect(() => {
    // Function to fetch the user type from AsyncStorage
    const fetchUserType = async () => {
      const selectedUserType = await AsyncStorage.getItem('selectedUserType');
      setUserType(selectedUserType); // Set the retrieved user type in state
    };

    fetchUserType(); // Call the function on component mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // If userType is not yet determined, don't render anything
  if (!userType) {
    return null;
  }

  // Function to get the appropriate icon name based on the route name
  const getIconName = (routeName) => {
    switch (routeName) {
      case 'Restaurants':
        return 'hamburger';
      case 'OrderHistory':
      case 'Deliveries':
        return 'history'; // Use the history icon for both OrderHistory and Deliveries
      case 'Account':
        return 'user';
      default:
        return 'circle'; // Default icon if route name doesn't match known routes
    }
  };

  // Screen options for the tab navigator
  const screenOptions = ({ route }) => ({
    // Define the icon for each tab
    tabBarIcon: ({ color, focused }) => (
      <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        <FontAwesome5
          name={getIconName(route.name)}
          size={width * 0.04} // Set icon size relative to screen width (approximately 15px on iPhone SE)
          color={color}
          solid={route.name === 'Account'} // Make the Account icon solid
        />
      </View>
    ),
    tabBarActiveTintColor: '#222126', // Active tab icon and label color
    tabBarInactiveTintColor: '#222126', // Inactive tab icon and label color
    tabBarStyle: styles.tabBarStyle, // Apply styles to the tab bar
    tabBarLabelStyle: styles.tabBarLabelStyle, // Apply styles to the tab labels
    tabBarIconStyle: { marginBottom: height * 0.005 }, // Reduced margin to bring icon closer to the label
    tabBarLabelPosition: 'below-icon', // Ensure the label appears below the icon
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {/* Render customer-specific screens if the user is a customer */}
      {userType === 'customer' && (
        <>
          <Tab.Screen
            name="Restaurants"
            component={RestaurantsStackNavigator}
            options={{
              headerShown: false, // Hide the header for the Restaurants screen
            }}
          />
          <Tab.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{
              header: () => <Header />, // Show custom header for OrderHistoryScreen
            }}
          />
        </>
      )}

      {/* Render Account screen for all users */}
      <Tab.Screen
        name="Account"
        component={AccountDetailsScreen}
        options={{
          header: () => <Header />, // Show custom header for AccountDetailsScreen
        }}
      />

      {/* Render courier-specific screens if the user is a courier */}
      {userType === 'courier' && (
        <Tab.Screen
          name="Deliveries"
          component={DeliveriesScreen}
          options={{
            header: () => <Header />, // Show custom header for DeliveriesScreen
          }}
        />
      )}
    </Tab.Navigator>
  );
};

// Styles for the tab navigator
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center', // Center the icons horizontally
    justifyContent: 'center', // Center the icons vertically
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(222, 184, 255, 0.5)', // Highlight color when tab is focused
    borderRadius: width * 0.2, // Border radius relative to screen width (approximately 8px on iPhone SE)
    paddingVertical: height * 0.01, // Vertical padding relative to screen height (approximately 8px on iPhone SE)
    paddingHorizontal: width * 0.065, // Horizontal padding relative to screen width (approximately 25px on iPhone SE)
    marginTop: height * 0.01, // Adjusted margin below the icon to reduce space (approximately 10px on iPhone SE)
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF', // White background for the tab bar
    height: height * 0.12, // Tab bar height relative to screen height (approximately 100px on iPhone SE)
    shadowColor: '#000', // Shadow color for the tab bar
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for the tab bar
    shadowOpacity: 0.1, // Shadow opacity for the tab bar
    shadowRadius: 5, // Shadow radius for the tab bar
    elevation: 5, // Elevation for Android to create shadow
  },
  tabBarLabelStyle: {
    fontSize: height * 0.013, // Font size relative to screen height (approximately 12px on iPhone SE)
    fontFamily: Platform.OS === 'ios' || Platform.OS === 'android' ? 'Arial' : 'Arial-BoldMT', // Platform-specific font family
    fontWeight: 'bold', // Bold text for the tab labels
    color: '#222126', // Dark gray text color for the tab labels
    letterSpacing: 0.8, // Spacing between letters in the tab labels
    marginBottom: height * 0.015, // Adjusted margin below the tab labels to reduce space (approximately 10px on iPhone SE)
  },
});

export default TabNavigator;
