import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const StaffList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
            <View style={styles.wrap}>
                <List.Item
                    style={styles.staff}
                    title={props.staff_name}
                    description={props.position_name}
                    left={() => <Avatar.Image size={50} source={{ uri: props.picture }} />}
                />
            </View>
        </TouchableCmp>

    );
};

const styles = StyleSheet.create({
    staff: {
        marginLeft: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    }
});


export default StaffList;