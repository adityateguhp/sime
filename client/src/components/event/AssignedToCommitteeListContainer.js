import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList, Text } from 'react-native';

import AssignedToCommitteeList from './AssignedToCommitteeList';

const AssignedToCommitteeListContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const comiteeInDivision = props.committees.filter((e) => e.division_id === props.divisionId);
        
    if (comiteeInDivision.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No committees in here</Text>
            </View>
        );
    }

    return (
                <FlatList
                     data={comiteeInDivision}
                     keyExtractor={item => item.id}
                     renderItem={itemData => (
                         <AssignedToCommitteeList
                            committee_id = {itemData.item.id}
                            staff_id = {itemData.item.staff_id}
                            position_id = {itemData.item.position_id} 
                            assignedTasks={props.assignedTasks}   
                            taskId={props.taskId}
                            roadmapId={props.roadmapId}
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


export default AssignedToCommitteeListContainer;