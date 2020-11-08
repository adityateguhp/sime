import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';

import CommitteeList from './CommitteeList';

const CommitteeListContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const comiteeInDivision = props.committees.filter((e) => e.division_id === props.division_id);

    if (comiteeInDivision.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No committees found, let's add committees!</Text>
            </View>
        );
    }

    return (
                <FlatList
                     data={comiteeInDivision}
                     keyExtractor={item => item.id}
                     renderItem={itemData => (
                         <CommitteeList
                            committee_id = {itemData.item.id}
                            staff_id = {itemData.item.staff_id}
                            position_id = {itemData.item.position_id}
                            order = {itemData.item.order}
                            staffs={props.staffs}
                            divisions={props.divisions}
                            positions={props.positions}
                            committees={props.committees}
                            onSelect={props.onSelect}
                            deleteCommitteesStateUpdate={props.deleteCommitteesStateUpdate}
                            updateCommitteesStateUpdate={props.updateCommitteesStateUpdate}
                         />
                     )}
                />
    );
};

const styles = StyleSheet.create({
    staffs: {
        marginLeft: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
});


export default CommitteeListContainer;