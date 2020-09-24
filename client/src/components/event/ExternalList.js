import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List} from 'react-native-paper';

const ExternalList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
            <View style={styles.wrap}>
                <List.Item
                    style={props.style}
                    title={props.name}
                    left={() => <Avatar.Image size={props.size} source={props.picture === null || props.picture === '' ? require('../../assets/avatar.png') : { uri: props.picture }} />}
                />
            </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    wrap: {
        marginTop: 1
    }
});


export default ExternalList;