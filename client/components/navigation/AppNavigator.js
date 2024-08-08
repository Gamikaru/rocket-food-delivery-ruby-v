import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../Header'; // Import the Header component
import TabNavigator from './TabNavigator'; // Import TabNavigator

const AppStack = createStackNavigator();

const AppNavigator = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen
                name="Home"
                component={TabNavigator}
                options={({ navigation }) => ({
                    header: () => <Header navigation={navigation} />
                })}
            />
        </AppStack.Navigator>
    );
};

export default AppNavigator;
