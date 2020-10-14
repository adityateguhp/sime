import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';
import { Avatar, List, Caption } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {DELETE_COMMITTEE, FETCH_COMMITTEES_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import CommitteeList from './CommitteeList';
import { SimeContext } from '../../context/SimePovider';

const CommitteeListContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [committeeDivision, setCommitteeDivision] = useState([])

    const comiteeInDivision = props.committees.filter((e) => e.division_id === props.division_id);

    const committeeId = sime.committee_id;

    const [deleteCommittee] = useMutation(DELETE_COMMITTEE, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_COMMITTEES_QUERY,
                variables: {projectId: sime.project_id }
            });
            data.getCommittees = data.getCommittees.filter((e) => e.id !== committeeId);
            props.deleteCommitteesStateUpdate(committeeId)
            proxy.writeQuery({ query: FETCH_COMMITTEES_QUERY, data, variables: { projectId: sime.project_id } });
        },
        variables: {
            committeeId
        }
    });

    if (comiteeInDivision.length === 0) {
        return (
                <Text>No committees found, let's add committees!</Text>
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
                            staffs={props.staffs}
                            divisions={props.divisions}
                            positions={props.positions}
                            committees={props.committees}
                            deleteFunction = {deleteCommittee}
                            onSelect={props.onSelect}
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
    }
});


export default CommitteeListContainer;