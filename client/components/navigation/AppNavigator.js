import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TabNavigator from './TabNavigator'; // Import TabNavigator

const AppStack = createStackNavigator();

const AppNavigator = () => {
    return (
        <AppStack.Navigator
            screenOptions={{ headerShown: false }} // Disable global header
        >
            <AppStack.Screen
                name="Home"
                component={TabNavigator}
            />
        </AppStack.Navigator>
    );
};

export default AppNavigator;
