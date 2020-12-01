import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Avatar, List, Caption, Provider, Divider, Text, Chip } from 'react-native-paper';
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
import { SimeContext } from '../../context/SimePovider';

const AssignedToPicList = props => {
    const sime = useContext(SimeContext);

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

    const [staffValue, setStaffValue] = useState({
        name: '',
        picture: '',
        isAdmin: false,
        email: '',
        phone_number: ''
    })

    const [positionName, setPositionName] = useState('')

    const { data: staff, error: errorStaff, loading: loadingStaff, refetch: refetchStaff } = useQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: props.staff_id },
            onCompleted: () => {
                if (staff.getStaff) {
                    setStaffValue({
                        name: staff.getStaff.name,
                        picture: staff.getStaff.picture,
                        isAdmin: staff.getStaff.isAdmin,
                        email: staff.getStaff.email,
                        phone_number: staff.getStaff.phone_number
                    })
                } else {
                    setStaffValue({
                        name: '[staff not found]',
                        picture: '',
                        isAdmin: false,
                        email: '',
                        phone_number: ''
                    })
                }
            }
        }
    );

    useEffect(() => {
        if (staff) {
            if (staff.getStaff) {
                setStaffValue({
                    name: staff.getStaff.name,
                    picture: staff.getStaff.picture,
                    isAdmin: staff.getStaff.isAdmin,
                    email: staff.getStaff.email,
                    phone_number: staff.getStaff.phone_number
                })
            } else {
                setStaffValue({
                    name: '[staff not found]',
                    picture: '',
                    isAdmin: false,
                    email: '',
                    phone_number: ''
                })
            }
        }
    }, [staff])

    const { data: position, error: errorPosition, loading: loadingPosition, refetch: refetchPosition } = useQuery(
        FETCH_POSITION_QUERY,
        {
            variables: { positionId: props.position_id },
            onCompleted: () => {
                if (position.getPosition) {
                    setPositionName(position.getPosition.name)
                } else {
                    setPositionName('[position not found]')
                }
            }
        }
    );

    useEffect(() => {
        if (position) {
            if (position.getPosition) {
                setPositionName(position.getPosition.name)
            } else {
                setPositionName('[position not found]')
            }
        }
    }, [position])


    const [deleteAssignedTask] = useMutation(DELETE_ASSIGNED_TASK, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_ASSIGNED_TASKS_QUERY,
                variables: { roadmapId: props.roadmapId }
            });
            data.getAssignedTasks = data.getAssignedTasks.filter((e) => e.id !== assignedCommitteeId);
            props.deleteAssignedTasksStateUpdate(assignedCommitteeId)
            proxy.writeQuery({ query: FETCH_ASSIGNED_TASKS_QUERY, data, variables: { roadmapId: props.roadmapId } });
        },
        variables: {
            assignedId: assignedCommitteeId
        }
    });

    const [assignedTask] = useMutation(ASSIGNED_TASK_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_ASSIGNED_TASKS_QUERY,
                variables: { roadmapId: props.roadmapId }
            });
            data.getAssignedTasks = [result.data.assignedTask, ...data.getAssignedTasks];
            props.assignedTasksStateUpdate(result.data.assignedTask);
            proxy.writeQuery({ query: FETCH_ASSIGNED_TASKS_QUERY, data, variables: { roadmapId: props.roadmapId } });
        },
        variables: {
            taskId: props.taskId,
            staffId: props.staff_id,
            personInChargeId: props.person_in_charge_id,
            projectId: props.projectId,
            eventId: props.eventId,
            roadmapId: props.roadmapId,
        }
    });

    const onPressDeleteAssignedTask = () => {
        deleteAssignedTask();
        setSelected(false);
    }

    const onPressAssignedTask = (event) => {
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
                        title={staffValue.name}
                        description={<Caption>{positionName}</Caption>}
                        left={() => <Avatar.Image size={50} source={staffValue.picture ? { uri: staffValue.picture } : require('../../assets/avatar.png')} />}
                        right={() =>
                            <View style={{ alignSelf: "center", flexDirection: 'row' }}>
                                {staffValue.isAdmin ? <Chip mode="outlined" style={{ borderColor: Colors.primaryColor, marginRight: 10 }} textStyle={{ color: Colors.secondaryColor }}>Admin</Chip> : null}
                                {assignedCommitteeId || selected ? <Icon style={{ alignSelf: "center" }} name="check" size={25} color={Colors.primaryColor} /> : null}
                            </View>
                        }
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