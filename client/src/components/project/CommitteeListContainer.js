import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { Avatar, List, Caption } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import {FETCH_COMMITTEES_IN_DIVISION_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import CommitteeList from './CommitteeList';


const CommitteeListContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const { data: committee, error: errorCommittee, loading: loadingCommittee } = useQuery(
        FETCH_COMMITTEES_IN_DIVISION_QUERY,
        {
            variables: { divisionId: props.division_id }
        }
    );


    if (errorCommittee) {
        console.error(errorCommittee);
        return <Text>errorCommittee</Text>;
    }
    if (loadingCommittee) {
        return <CenterSpinner />;
    }

    if (committee.getCommitteesInDivision.length === 0) {
        return (
                <Text>No committees found, let's add committees!</Text>
        );
    }

    return (
        <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
            <View style={styles.wrap}>
                <FlatList
                     data={committee.getCommitteesInDivision}
                     keyExtractor={item => item.id}
                     renderItem={itemData => (
                         <CommitteeList
                            staff_id = {itemData.item.staff_id}
                            position_id = {itemData.item.position_id}
                         />
                     )}
                />
            </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    staffs: {
        marginLeft: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1
    }
});


export default CommitteeListContainer;