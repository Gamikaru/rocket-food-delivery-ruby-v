import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootStack = createStackNavigator();

const RootNavigator = () => {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Auth" component={AuthNavigator} />
            <RootStack.Screen name="App" component={AppNavigator} />
        </RootStack.Navigator>
    );
};

export default RootNavigator;
