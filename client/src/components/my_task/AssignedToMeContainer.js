import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import {
    FETCH_ASSIGNED_TASKS_QUERY_BYPIC,
    FETCH_PICS_QUERY,
    FETCH_COMMITTEES_QUERY,
} from '../../util/graphql';
import AssignedToMe from './AssignedToMe'

const AssignedToMeContainer = props => {
    const [assignedTasksValue, setAssignedTasksValue] = useState([]);
    const [personInChargesValue, setPersonInChargesValue] = useState([]);
    const [committeesValue, setCommitteesValue] = useState([]);
    const [deleteCalled, setDeleteCalled] = useState(false)

    const { data: assignedTasksByPic, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_ASSIGNED_TASKS_QUERY_BYPIC,
        {
            variables: { personInChargeId: props.personInChargeId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                if (!deleteCalled) {
                    setAssignedTasksValue(assignedTasksByPic.getAssignedTasksByPersonInCharge)
                }
            }
        });

    const { data: personInCharges, error: errorPersonInCharges, loading: loadingPersonInCharges, refetch: refetchPersonInCharges } = useQuery(
        FETCH_PICS_QUERY,
        {
            variables: { projectId: props.projectId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                personInCharges.getPersonInCharges.sort(function (a, b) {
                    var textA = a.order;
                    var textB = b.order;

                    return textA.localeCompare(textB)
                });
                setPersonInChargesValue(personInCharges.getPersonInCharges)
            }
        }
    );

    const { data: committees, error: errorCommittees, loading: loadingCommittees, refetch: refetchCommittees } = useQuery(
        FETCH_COMMITTEES_QUERY,
        {
            variables: { projectId: props.projectId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setCommitteesValue(committees.getCommittees) }
        }
    );

    const deleteStateUpdate = (e) => {
        setDeleteCalled(true)
        const temp = [...assignedTasksValue];
        const index = temp.map(function (item) {
            return item.task_id
        }).indexOf(e);
        temp.splice(index, 1);
        setAssignedTasksValue(temp);
    }

    console.log(assignedTasksValue)

    const onRefresh = () => {
        refetch();
        refetchPersonInCharges();
        refetchCommittees();
    }

    useEffect(() => {
        onRefresh();
    }, [props.onRefresh]);

    return (
        <FlatList
            style={styles.screen}
            data={assignedTasksValue}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <AssignedToMe
                    personInCharges={personInChargesValue}
                    committees={committeesValue}
                    projectId={props.projectId}
                    taskId={itemData.item.task_id}
                    onRefresh={props.onRefresh}
                    deleteStateUpdate={deleteStateUpdate}
                    onToggleSnackBarDelete={props.onToggleSnackBarDelete}
                    onToggleSnackBarUpdate={props.onToggleSnackBarUpdate}
                    setDeleteCalled={setDeleteCalled}
                    deleteCalled={deleteCalled}
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


export default AssignedToMeContainer;