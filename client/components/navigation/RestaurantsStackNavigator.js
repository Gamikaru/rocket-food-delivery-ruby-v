import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../Header'; // Import the Header component
import MenuScreen from '../screens/MenuScreen'; // Import MenuScreen
import RestaurantsScreen from '../screens/RestaurantsScreen'; // Import RestaurantsScreen

const RestaurantsStack = createStackNavigator();

const RestaurantsStackNavigator = () => {
    return (
        <RestaurantsStack.Navigator>
            <RestaurantsStack.Screen
                name="RestaurantsMain" // Renamed to avoid conflict
                component={RestaurantsScreen}
                options={{
                    header: () => <Header /> // Use custom header here
                }}
            />
            <RestaurantsStack.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                    header: () => <Header /> // Use custom header here
                }}
            />
        </RestaurantsStack.Navigator>
    );
};

export default RestaurantsStackNavigator;
