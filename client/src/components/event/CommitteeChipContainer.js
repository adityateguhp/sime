import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_COMMITTEE_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import CommitteeChip from './CommitteeChip';

const CommitteeChipContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const { data: committee, error: errorCommittee, loading: loadingCommittee } = useQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: props.committeeId }
        });

    if (errorCommittee) {
        console.error(errorCommittee);
        return <Text>errorCommittee</Text>;
    }

    if (loadingCommittee) {
        return <CenterSpinner />
    }

    return (
        <View style={styles.chipContainer}>
            <CommitteeChip
                roadmapId={props.roadmapId}
                committeeId={committee.getCommittee.id}
                staffId={committee.getCommittee.staff_id}
                assignedId={props.assignedId}
                taskId={props.taskId}
                deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
            />
        </View>
    );
};

const styles = StyleSheet.create({

});


export default CommitteeChipContainer;