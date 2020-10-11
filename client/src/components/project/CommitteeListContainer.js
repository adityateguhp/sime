import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { Avatar, List, Caption } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {DELETE_COMMITTEE, FETCH_COMMITTEES_IN_DIVISION_QUERY, FETCH_COMMITTEES_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import CommitteeList from './CommitteeList';
import { SimeContext } from '../../context/SimePovider';

const CommitteeListContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const { data: committee, error: errorCommittee, loading: loadingCommittee } = useQuery(
        FETCH_COMMITTEES_IN_DIVISION_QUERY,
        {
            variables: { divisionId: props.division_id }
        }
    );

    const committeeId = sime.committee_id;

    const [deleteCommittee] = useMutation(DELETE_COMMITTEE, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_IN_DIVISION_QUERY,
                variables: { divisionId: props.division_id }
            });
            data.getCommitteesInDivision = data.getCommitteesInDivision.filter((e) => e.id !== committeeId);
            
            const dataState = proxy.readQuery({
                query: FETCH_COMMITTEES_QUERY,
                variables: { projectId: sime.project_id }
            });
            dataState.getCommittees = dataState.getCommittees.filter((e) => e.id !== committeeId);
            
            props.deleteCommitteesStateUpdate(dataState.getCommittees)
            proxy.writeQuery({ query: FETCH_COMMITTEES_IN_DIVISION_QUERY, data, variables: { divisionId: props.division_id } });
        },
        variables: {
            committeeId
        }
    });

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
                <FlatList
                     data={committee.getCommitteesInDivision}
                     keyExtractor={item => item.id}
                     renderItem={itemData => (
                         <CommitteeList
                            committee_id = {itemData.item.id}
                            staff_id = {itemData.item.staff_id}
                            position_id = {itemData.item.position_id}
                            deleteFunction = {deleteCommittee}
                            onSelect={props.onSelect}
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
    }
});


export default CommitteeListContainer;