import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';

import PicList from './PicList';

const PicListContainer = props => {

    const picInCommittee = props.personInCharges.filter((e) => e.committee_id === props.committee_id);

    if (picInCommittee.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No person in charges found</Text>
            </View>
        );
    }

    return (
                <FlatList
                     data={picInCommittee}
                     keyExtractor={item => item.id}
                     renderItem={itemData => (
                         <PicList
                            personInCharge_id = {itemData.item.id}
                            staff_id = {itemData.item.staff_id}
                            position_id = {itemData.item.position_id}
                            committee_id = {itemData.item.committee_id}
                            order = {itemData.item.order}
                            staffs={props.staffs}
                            committees={props.committees}
                            positions={props.positions}
                            personInCharges={props.personInCharges}
                            onSelect={props.onSelect}
                            deletePersonInChargesStateUpdate={props.deletePersonInChargesStateUpdate}
                            updatePersonInChargesStateUpdate={props.updatePersonInChargesStateUpdate}
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


export default PicListContainer;