import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../Header'; // Import the Header component
import MenuScreen from '../screens/MenuScreen'; // Import MenuScreen
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
            <AppStack.Screen
                name="Menu"
                component={MenuScreen}
                options={{ headerShown: true }}
            />
            

        </AppStack.Navigator>
    );
};

export default AppNavigator;
