import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Divider, Text } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { 
    FETCH_STAFF_QUERY, 
    FETCH_POSITION_QUERY, 
    DELETE_ASSIGNED_TASK, 
    FETCH_ASSIGNED_TASKS_QUERY, 
    ASSIGNED_TASK_MUTATION 
} from '../../util/graphql';
import CenterSpinner from '../common/CenterSpinner';
import { theme } from '../../constants/Theme';
import Colors from '../../constants/Colors';

const AssignedToPicList = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    let assignedCommitteeId = null;

    props.assignedTasks.map((e) => {
        if (e.person_in_charge_id === props.person_in_charge_id) {
            assignedCommitteeId = e.id
        }
    }
    );

    const [selected, setSelected] = useState(false);

    const { data: staff, error: errorStaff, loading: loadingStaff } = useQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: props.staff_id }
        }
    );

    const { data: position, error: errorPosition, loading: loadingPosition } = useQuery(
        FETCH_POSITION_QUERY,
        {
            variables: { positionId: props.position_id }
        }
    );

    const [deleteAssignedTask] = useMutation(DELETE_ASSIGNED_TASK, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_ASSIGNED_TASKS_QUERY,
                variables: { taskId: props.taskId }
            });
            data.getAssignedTasks = data.getAssignedTasks.filter((e) => e.id !== assignedCommitteeId);
            props.deleteAssignedTasksStateUpdate(assignedCommitteeId)
            proxy.writeQuery({ query: FETCH_ASSIGNED_TASKS_QUERY, data, variables: { taskId: props.taskId } });
        },
        variables: {
            assignedId: assignedCommitteeId
        }
    });

    const [assignedTask] = useMutation(ASSIGNED_TASK_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_ASSIGNED_TASKS_QUERY,
                variables: { taskId: props.taskId }
            });
            data.getAssignedTasks = [result.data.assignedTask, ...data.getAssignedTasks];
            props.assignedTasksStateUpdate(result.data.assignedTask);
            proxy.writeQuery({ query: FETCH_ASSIGNED_TASKS_QUERY, data, variables: { taskId: props.taskId } });
        },
        variables: {
            taskId: props.taskId,
            personInChargeId: props.person_in_charge_id
        }
    });

    const onPressDeleteAssignedTask =  () => {
        deleteAssignedTask();
        setSelected(false);
    }

    const onPressAssignedTask =  (event) => {
        event.preventDefault();
        assignedTask();
        setSelected(true);
    }

    const deleteHandler = () => {
        Alert.alert('Are you sure?', 'Do you really want to delete this?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: onPressDeleteAssignedTask
            }
        ]);
    };

    if (errorStaff) {
        console.error(errorStaff);
        return <Text>errorStaff</Text>;
    }

    if (errorPosition) {
        console.error(errorPosition);
        return <Text>errorPosition</Text>;
    }

    if (loadingStaff) {
        return <CenterSpinner />;
    }

    if (loadingPosition) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <TouchableCmp>
                <View style={styles.wrap}>
                    <List.Item
                        onPress={assignedCommitteeId || selected ? deleteHandler : onPressAssignedTask}
                        style={styles.staffs}
                        title={staff.getStaff.name}
                        description={<Caption>{position.getPosition.name}</Caption>}
                        left={() => <Avatar.Image size={50} source={staff.getStaff.picture? { uri: staff.getStaff.picture } : require('../../assets/avatar.png')} />}
                        right={assignedCommitteeId || selected ? () => <Icon style={{ alignSelf: "center" }} name="check" size={25} color={Colors.primaryColor} /> : null}
                    />
                    <Divider />
                </View>
            </TouchableCmp>
        </Provider>
    );
};

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);

const styles = StyleSheet.create({
    staffs: {
        marginHorizontal: 10,
        marginTop: 3
    },
    wrap: {
        marginTop: 1,
    },
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start'
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 5
    },
    text: {
        marginLeft: wp(5.6),
        fontSize: wp(3.65)
    }
});


export default AssignedToPicList;