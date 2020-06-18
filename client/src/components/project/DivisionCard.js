import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';

import Colors from '../../constants/Colors';

const DivisionCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const label = props.division_name.substring(0,2).toUpperCase();

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.division_name}
                        left={() => <Avatar.Text size={45} label={label} style={{backgroundColor: Colors.primaryColor}}/>}
                    />
                </Card >
            </TouchableCmp>
        </View>

    );
};

const styles = StyleSheet.create({
    event: {
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 3
    },
    task: {
        display: "flex"
    },
    status: {
        fontSize: 11
    }
});


export default DivisionCard;