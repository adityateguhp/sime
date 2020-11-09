import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List } from 'react-native-paper';

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
                    title={props.name}
                    description={props.email}
                    left={() => <Avatar.Image size={50} source={props.picture ? { uri: props.picture } : require('../../assets/avatar.png')} />}
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