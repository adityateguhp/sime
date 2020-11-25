import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { List } from 'react-native-paper';

import AssignedToPicListContainer from './AssignedToPicListContainer';

const AssignedToSeparator = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View>
            <List.Section
                style={styles.accordion}
                titleStyle={{ color: 'black', fontSize: 16 }}
                title={props.name}
            >
                <AssignedToPicListContainer
                    committeeId={props.committeeId}
                    personInCharges={props.personInCharges}
                    assignedTasks={props.assignedTasks}
                    taskId={props.taskId}
                    roadmapId={props.roadmapId}
                    eventId={props.eventId}
                    projectId={props.projectId}
                    deleteAssignedTasksStateUpdate={props.deleteAssignedTasksStateUpdate}
                    assignedTasksStateUpdate={props.assignedTasksStateUpdate}
                />
            </List.Section>
        </View >
    );
};

const styles = StyleSheet.create({
    accordion: {

    },
    task: {
        display: "flex"
    },
    status: {
        fontSize: 11
    }
});


export default AssignedToSeparator;