import React, {useContext, useState} from 'react';
import { Alert, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Image } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FETCH_STAFF_QUERY, DELETE_ASSIGNED_TASK, FETCH_ASSIGNED_TASKS_QUERY } from '../../util/graphql';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';
import { SimeContext } from '../../context/SimePovider';


const PersonInChargeChip = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [staffValue, setStaffValue] = useState({
        name: '',
        picture: '',
        isAdmin: false,
        email: '',
        phone_number: ''
    })

    const { data: staff, error: errorStaff, loading: loadingStaff, refetch: refetchStaff } = useQuery(
        FETCH_STAFF_QUERY,
        {
            variables: { staffId: props.staffId },
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

    const [deleteAssignedTask] = useMutation(DELETE_ASSIGNED_TASK, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_ASSIGNED_TASKS_QUERY,
                variables: { roadmapId: props.roadmapId }
            });
            data.getAssignedTasks = data.getAssignedTasks.filter((e) => e.id !== props.assignedId);
            props.deleteAssignedTasksStateUpdate(props.assignedId)
            proxy.writeQuery({ query: FETCH_ASSIGNED_TASKS_QUERY, data, variables: { roadmapId: props.roadmapId } });
        },
        variables: {
            assignedId: props.assignedId
        }
    });

    const deleteHandler = () => {
        Alert.alert('Are you sure?', 'Do you really want to delete this?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteAssignedTask
            }
        ]);
    };

    if (errorStaff) {
        console.error(errorStaff);
        return <Text>errorStaff</Text>;
    }


    if (loadingStaff) {
        return <CenterSpinnerSmall />;
    }

    return (
        sime.user_type === "Organization"
            || props.userPersonInCharge.order === '1'
            || props.userPersonInCharge.order === '2'
            || props.userPersonInCharge.order === '3'
            || props.userPersonInCharge.order === '6' && props.userPersonInCharge.committee_id === props.committeeId
            || props.userPersonInCharge.order === '7' && props.userPersonInCharge.committee_id === props.committeeId ?
            <Chip avatar={<Image source={staffValue.picture ? { uri: staffValue.picture } : require('../../assets/avatar.png')} />} onClose={deleteHandler}>{staffValue.name}</Chip>
            :
            <Chip avatar={<Image source={staffValue.picture ? { uri: staffValue.picture } : require('../../assets/avatar.png')} />} >{staffValue.name}</Chip>
    );
};

const styles = StyleSheet.create({

});


export default PersonInChargeChip;