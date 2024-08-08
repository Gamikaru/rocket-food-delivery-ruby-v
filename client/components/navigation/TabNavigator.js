import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';

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
          height: 100, // Increase height to allow more space for padding
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'helvetica',
          fontWeight: 'bold',
          color: '#222126',
          letterSpacing: 0.8,
          marginBottom: 10, // Adjust the spacing between the icon and label
        },
        headerShown: false, // Disable the default header
      })}
    >
      <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
      <Tab.Screen name="OrderHistory" component={OrderHistoryScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padingTop: 5
    },
  iconContainerFocused: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(222, 184, 255, 0.5)', // Pinkish/purply lilacy glow
    borderRadius: 20, // Adjust the size to make it more oval
    paddingVertical: 8, // Adjust padding for vertical spacing
    paddingHorizontal: 25, // Increase padding for horizontal spacing to make it more elongated
  },
});

export default TabNavigator;
