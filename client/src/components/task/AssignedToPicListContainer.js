import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';

import AssignedToPicList from './AssignedToPicList';

const AssignedToPicListContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const picInCommittee = props.personInCharges.filter((e) => e.committee_id === props.committeeId);
        
    if (picInCommittee.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No person in charges in here</Text>
            </View>
        );
    }

    return (
                <FlatList
                     data={picInCommittee}
                     keyExtractor={item => item.id}
                     renderItem={itemData => (
                         <AssignedToPicList
                            person_in_charge_id = {itemData.item.id}
                            staff_id = {itemData.item.staff_id}
                            position_id = {itemData.item.position_id} 
                            assignedTasks={props.assignedTasks}   
                            taskId={props.taskId}
                            roadmapId={props.roadmapId}
                            eventId={props.eventId}
                            projectId={props.projectId}
                            deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                            assignedTasksStateUpdate={props.assignedTasksStateUpdate}
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


export default AssignedToPicListContainer;