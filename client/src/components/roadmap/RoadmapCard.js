import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Card, Caption, ProgressBar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';

import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { FETCH_TASKS_QUERY, FETCH_COMMITTEE_QUERY } from '../../util/graphql';

const RoadmapCard = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [tasksValue, setTasksValue] = useState([]);
    const [committeeName, setCommitteeName] = useState('')

    const { data: tasks, error: errorTasks, loading: loadingTasks, refetch } = useQuery(
        FETCH_TASKS_QUERY,
        {
            variables: { roadmapId: props.roadmapId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                tasks.getTasks.sort(function (x, y) {
                    return new Date(x.createdAt) - new Date(y.createdAt);
                }).reverse();
                tasks.getTasks.sort(function (x, y) {
                    return Number(x.completed) - Number(y.completed);
                });
                setTasksValue(tasks.getTasks)
            }
        }
    );

    const { data: committee, error: errorCommittee, loading: loadingCommittee, refetch: refetchCommittee } = useQuery(
        FETCH_COMMITTEE_QUERY,
        {
            variables: { committeeId: props.committeeId },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                setCommitteeName(committee.getCommittee.name)
            }
        }
    );

    useEffect(() => {
        refetch();
        refetchCommittee()
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.onRefresh]);

    const startDate = moment(props.start_date).format('ll');
    const endDate = moment(props.end_date).format('ll');

    let completeTask = tasksValue.filter((t) => t.completed === true);

    const percentage = Math.round((completeTask.length / tasksValue.length) * 100);
    const progress = completeTask.length / tasksValue.length;


    if (errorTasks) {
        console.error(errorTasks);
        return <Text>errorTasks</Text>;
    }

    return (
        <View>
            <TouchableCmp onPress={props.onSelect} onLongPress={props.onLongPress} useForeground>
                <Card style={styles.event}>
                    <Card.Title
                        title={props.name}
                        subtitle={
                            <Caption>
                                <Icon name="calendar" size={13} color='black' /> {startDate} - {endDate}
                            </Caption>}
                    />
                    <Card.Content>
                        <View style={styles.task}>
                            <Caption>{percentage ? percentage : 0}% Completed</Caption>
                            <Caption>{completeTask.length}/{tasksValue.length} Tasks</Caption>
                        </View>
                        <ProgressBar progress={progress ? progress : 0} color={Colors.primaryColor} />
                    </Card.Content>

                    <View>
                        <Card.Actions style={styles.cardAction}>
                            <Button mode="contained" labelStyle={{ fontSize: 8 }} color={Colors.secondaryColor}>{committeeName}</Button>
                        </Card.Actions>
                    </View>
                </Card >
            </TouchableCmp>
        </View>
    );
};

const styles = StyleSheet.create({
    event: {
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 3
    },
    task: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardAction: {
        flexDirection: "row",
        margin: 8

    },
    SkletonContainer: {
        width: '100%',
    },
});


export default RoadmapCard;