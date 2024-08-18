import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../Header'; // Importing the custom Header component
import MenuScreen from '../screens/MenuScreen'; // Importing the MenuScreen component
import RestaurantsScreen from '../screens/RestaurantsScreen'; // Importing the RestaurantsScreen component

// Creating an instance of the stack navigator for the Restaurants flow
const RestaurantsStack = createStackNavigator();

const RestaurantsStackNavigator = () => {
    return (
        <RestaurantsStack.Navigator>
            <RestaurantsStack.Screen
                name="RestaurantsMain" // Renaming the route to avoid naming conflicts
                component={RestaurantsScreen}
                options={{
                    header: () => <Header /> // Setting the custom header for the RestaurantsScreen
                }}
            />
            <RestaurantsStack.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                    header: () => <Header /> // Setting the custom header for the MenuScreen
                }}
            />
        </RestaurantsStack.Navigator>
    );
};

export default RestaurantsStackNavigator;
