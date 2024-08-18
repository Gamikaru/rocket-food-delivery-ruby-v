import { createStackNavigator } from '@react-navigation/stack'; // Importing the stack navigator from React Navigation
import React from 'react'; // Importing React
import AccountSelectionScreen from '../screens/AccountSelectionScreen'; // Importing the Account Selection screen
import AppNavigator from './AppNavigator'; // Importing the main App Navigator
import AuthNavigator from './AuthNavigator'; // Importing the Authentication Navigator

// Creating a stack navigator for the root of the application
const RootStack = createStackNavigator();

const RootNavigator = () => {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Screen for the authentication flow */}
            <RootStack.Screen name="Auth" component={AuthNavigator} />

            {/* Screen for the main application flow */}
            <RootStack.Screen name="App" component={AppNavigator} />

            {/* Screen for account selection when the user has both Customer and Courier accounts */}
            <RootStack.Screen name="AccountSelection" component={AccountSelectionScreen} />
        </RootStack.Navigator>
    );
};

export default RootNavigator; // Exporting the RootNavigator for use in the application
