import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for retrieving user data
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../Header'; // Import the Header component

import AccountDetailsScreen from '../screens/AccountDetailsScreen'; // Shared screen
import DeliveriesScreen from '../screens/DeliveriesScreen'; // Courier screen
import OrderHistoryScreen from '../screens/OrderHistoryScreen'; // Customer screen
import RestaurantsStackNavigator from './RestaurantsStackNavigator'; // Customer stack navigator

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [userType, setUserType] = useState(null); // State to store user type

  useEffect(() => {
    // Fetch the user type from AsyncStorage or a global state
    const fetchUserType = async () => {
      const selectedUserType = await AsyncStorage.getItem('selectedUserType');
      setUserType(selectedUserType);
    };

    fetchUserType();
  }, []);

  if (!userType) {
    return null; // Prevent rendering until userType is determined
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          let solid = false; // Use solid style for the Account icon

          if (route.name === 'Restaurants') {
            iconName = 'hamburger';
          } else if (route.name === 'OrderHistory' || route.name === 'Deliveries') {
            iconName = 'history'; // Use history icon for both OrderHistory and Deliveries
          } else if (route.name === 'Account') {
            iconName = 'user';
            solid = true; // Fill out the Account icon
          }

          return (
            <View style={focused ? styles.iconContainerFocused : styles.iconContainer}>
              <FontAwesome5 name={iconName} size={15} color={color} solid={solid} />
            </View>
          );
        },
        tabBarActiveTintColor: '#222126',
        tabBarInactiveTintColor: '#222126',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          color: '#222126',
          letterSpacing: 0.8,
          marginBottom: 10,
        },
      })}
    >
      {userType === 'customer' && (
        <>
          <Tab.Screen
            name="Restaurants"
            component={RestaurantsStackNavigator}
            options={{
              headerShown: false,
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

      <Tab.Screen
        name="Account"
        component={AccountDetailsScreen}
        options={{
          header: () => <Header />, // Show custom header for AccountDetailsScreen
        }}
      />

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

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  iconContainerFocused: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(222, 184, 255, 0.5)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
});

export default TabNavigator;
