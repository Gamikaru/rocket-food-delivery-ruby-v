// DeliveriesScreen.js

import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

const DeliveriesScreen = () => {
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/api/deliveries`);
            const data = await response.json();
            setDeliveries(data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            Alert.alert('Error', 'Unable to fetch deliveries. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deliveries</Text>
            <FlatList
                data={deliveries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.delivery}>
                        <Text style={styles.deliveryText}>Order ID: {item.order_id}</Text>
                        <Text style={styles.deliveryText}>Courier ID: {item.courier_id}</Text>
                        <Text style={styles.deliveryText}>Status: {item.status}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222126',
        marginBottom: 20,
    },
    delivery: {
        backgroundColor: '#F0F0F0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    deliveryText: {
        fontSize: 16,
        color: '#222126',
    },
});

export default DeliveriesScreen;