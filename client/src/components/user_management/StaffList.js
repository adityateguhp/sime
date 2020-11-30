import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Chip } from 'react-native-paper';
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
                    title={props.name}
                    description={props.email}
                    left={() => <Avatar.Image size={50} source={props.picture ? { uri: props.picture } : require('../../assets/avatar.png')} />}
                    right={() => props.isAdmin ?
                        <View style={{ alignSelf: "center" }}>
                            <Chip mode="outlined" style={{borderColor: Colors.primaryColor}} textStyle={{color: Colors.secondaryColor}}>Admin</Chip>
                        </View>
                        : null}
                />
            </View>
        </TouchableCmp>

    );
};

const styles = StyleSheet.create({
    staff: {
        marginHorizontal: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    }
});


export default StaffList;