import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from '../screens/LoginScreen'; // Importing the LoginScreen component

// Creating an instance of the stack navigator for authentication flow
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{ headerShown: false }} // Disabling the header for all screens in the AuthStack
        >
            <AuthStack.Screen
                name="Login"
                component={LoginScreen} // Setting LoginScreen as the default screen in the AuthStack
            />
        </AuthStack.Navigator>
    );
};

export default AuthNavigator;
