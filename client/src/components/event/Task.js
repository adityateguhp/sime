import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Subheading, Divider, Checkbox, Caption } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import { FETCH_TASKS_QUERY, FETCH_TASK_QUERY, COMPLETED_TASK } from '../../util/graphql';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const Task = props => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [checked, setCheked] = useState(props.completed);
    const [due_date, setDue_date] = useState('');
    const [completedValue, setCompletedValue] = useState({
        taskId: props.taskId,
        completed: props.completed
    });

    const [completedTask, { loading }] = useMutation(COMPLETED_TASK, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_TASKS_QUERY,
                variables: { roadmapId: props.roadmapId },
            });
            props.completedTasksStateUpdate(result.data.completedTask);
            proxy.writeQuery({ query: FETCH_TASKS_QUERY, data, variables: { roadmapId: props.roadmapId } });
        },
        onError(err) {
            console.log(err)
            return err;
        },
        variables: { ...completedValue, completed: !completedValue.completed }
    });


    const onPressCheck = (event) => {
        event.preventDefault();
        setCompletedValue({ ...completedValue, completed: !completedValue.completed });
        completedTask();
    }

    function durationAsString(start, end) {
        const duration = moment.duration(moment(end).diff(moment(start)));
        //Get Days
        const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
        const daysFormatted = days ? `${days} Days ` : ''; // if no full days then do not display it at all

        //Get Hours
        const hours = duration.hours();
        const hoursFormatted = `${hours} Hours `;

        //Get Minutes
        const minutes = duration.minutes();
        const minutesFormatted = `${minutes} Minutes`;

        return [daysFormatted, hoursFormatted, minutesFormatted].join('');
    }

    const nowDate = new Date();
    const dueDate = new Date(props.due_date)

    useEffect(() => {
        if (props.due_date !== '') {
            if (dueDate > nowDate) {
                setDue_date(moment(props.due_date).format('ddd, MMM D YYYY h:mm a'));
            } else {
                setDue_date(durationAsString(props.due_date, nowDate));
            }
        }
    }, [props.due_date])

    return (

        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <View style={styles.checkTask}>
                    <Checkbox onPress={onPressCheck} status={props.completed === true ? 'checked' : 'unchecked'} color='white' uncheckedColor='white' />
                </View>
                <TouchableCmp>
                    <View style={styles.task}>
                        <View>
                            <Subheading style={{ ...styles.nameTask, ...{ textDecorationLine: props.completed === true ? 'line-through' : 'none', opacity: props.completed === true ? 0.6 : 1 } }}>{props.name}</Subheading>
                            {props.due_date === null || props.due_date === '' || props.completed === true ? null :
                                dueDate > nowDate ?
                                    <Caption style={{ ...styles.statusTask, ...{ textDecorationLine: props.completed === true ? 'line-through' : 'none', opacity: props.completed === true ? 0.6 : 1 } }}>{"Due on " + due_date}</Caption>
                                    :
                                    <Caption style={{ ...styles.statusTask, ...{ textDecorationLine: props.completed === true ? 'line-through' : 'none', opacity: props.completed === true ? 0.6 : 1, color: theme.colors.error } }}>{"Overdue by " + due_date}</Caption>}
                        </View>
                        <View style={styles.taskSub}>
                            <View style={{ ...styles.comment, ...{ opacity: props.completed === true ? 0.6 : 1 } }}>
                                <Icon name="comment-multiple" size={16} color="grey" />
                                <Caption style={{ marginLeft: 3 }}>5</Caption>
                            </View>
                            <View style={{ ...styles.people, ...{ opacity: props.completed === true ? 0.6 : 1 } }}>
                                <Icon name="account-multiple" size={16} color="grey" />
                                <Caption style={{ marginLeft: 3 }}>5</Caption>
                            </View>
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 4
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 4
    },
    task: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingVertical: 10,
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4
    },
    taskSub: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    comment: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    people: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    nameTask: {
        fontWeight: 'bold',
        color: 'black'
    },
    statusTask: {

    },
    checkTask:{
        marginHorizontal: 5
    }

});


export default Task;