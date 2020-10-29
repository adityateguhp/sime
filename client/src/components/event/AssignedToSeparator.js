import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { List, Caption, IconButton, ProgressBar, Menu, Button, Divider } from 'react-native-paper';

import AssignedToCommitteeListContainer from './AssignedToCommitteeListContainer';
import Colors from '../../constants/Colors';

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
                <AssignedToCommitteeListContainer
                    divisionId={props.divisionId}
                    committees={props.committees}
                    assignedTasks={props.assignedTasks}
                    taskId={props.taskId}
                    roadmapId={props.roadmapId}
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