import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_PIC_QUERY } from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import PersonInChargeChip from './PersonInChargeChip';

const PersonInChargeChipContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const { data: personInCharge, error: errorPersonInCharge, loading: loadingPersonInCharge } = useQuery(
        FETCH_PIC_QUERY,
        {
            variables: { personInChargeId: props.personInChargeId }
        });

    if (errorPersonInCharge) {
        console.error(errorPersonInCharge);
        return <Text>errorPersonInCharge</Text>;
    }

    if (loadingPersonInCharge) {
        return <CenterSpinner />
    }

    return (
        <View style={styles.chipContainer}>
            <PersonInChargeChip
                roadmapId={props.roadmapId}
                personInChargeId={personInCharge.getPersonInCharge.id}
                staffId={personInCharge.getPersonInCharge.staff_id}
                assignedId={props.assignedId}
                taskId={props.taskId}
                deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
            />
        </View>
    );
};

const styles = StyleSheet.create({

});


export default PersonInChargeChipContainer;