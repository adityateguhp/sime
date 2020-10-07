import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption} from 'react-native-paper';
import { STAFFS, POSITIONS, DIVISIONS } from '../../data/dummy-data';


const CommitteeList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const staffOnDivision = STAFFS.find(staff => staff._id === props.staff_id);
    const positionOnDivision = POSITIONS.find(pos => pos._id === props.position_id);
    const division = DIVISIONS.find(div => div._id === props.division_id);


    return (
        <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
            <View style={styles.wrap}>
                <List.Item
                    style={styles.staff}
                    title={staffOnDivision.name}
                    description={<Caption>{positionOnDivision.position_name}</Caption>}
                    left={() => <Avatar.Image size={50} source={{ uri: staffOnDivision.picture }} />}
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


export default CommitteeList;