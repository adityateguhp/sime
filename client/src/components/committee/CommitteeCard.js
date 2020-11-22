import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const CommitteeCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const label = props.name.substring(0, 2).toUpperCase();

    return (
        <View>
            <TouchableCmp onLongPress={props.name === "Core Committee" ? null : props.onLongPress}>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.name}
                        left={() => <Avatar.Text size={45} label={label} style={{ backgroundColor: Colors.primaryColor }} />}
                        right={props.name === "Core Committee" ? null : ({ color, size }) => (
                            <Icon name="pencil" size={size} color={color} style={{ marginHorizontal: 10, opacity: 0.5 }} />
                        )}
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


export default CommitteeCard;