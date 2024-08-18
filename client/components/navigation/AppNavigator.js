import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TabNavigator from './TabNavigator'; // Importing the TabNavigator component

// Creating an instance of the stack navigator
const AppStack = createStackNavigator();

const AppNavigator = () => {
    return (
        <AppStack.Navigator
            screenOptions={{ headerShown: false }} // Disabling the header across all screens in this stack
        >
            <AppStack.Screen
                name="Home"
                component={TabNavigator} // The TabNavigator is set as the Home screen
            />
        </AppStack.Navigator>
    );
};

export default AppNavigator;
