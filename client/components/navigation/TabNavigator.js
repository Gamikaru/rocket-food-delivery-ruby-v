import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../Header'; // Import the Header component if needed for the custom header
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import RestaurantsStackNavigator from './RestaurantsStackNavigator'; // Use the stack navigator here

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Restaurants') {
            iconName = 'hamburger';
          } else if (route.name === 'OrderHistory') {
            iconName = 'history';
          }

          return (
            <View style={focused ? styles.iconContainerFocused : styles.iconContainer}>
              <FontAwesome5 name={iconName} size={15} color={color} />
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
      <Tab.Screen
        name="Restaurants"
        component={RestaurantsStackNavigator} // Correctly use stack navigator
        options={{
          headerShown: false, // Set this to false if no global header is needed
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          header: () => <Header />, // Show custom header for OrderHistoryScreen
        }}
      />
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
