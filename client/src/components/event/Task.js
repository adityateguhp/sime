import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Subheading, Divider, Checkbox, Caption } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import Colors from '../../constants/Colors';

const Task = props => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [checked, setCheked] = useState(false);
    const [due_date, setDue_date] = useState('');


    const onPressCheck = () => {
        setCheked(!checked);
    }

    useEffect(() => {
        if (props.due_date) {
            const date = moment(props.due_date).format('dddd, MMM D YYYY')
            setDue_date(date);
        }
    }, [props.due_date])

    return (
        <TouchableCmp>
            <View style={styles.container}>
                <View style={styles.taskContainer}>
                    <View>
                        <Checkbox onPress={onPressCheck} status={checked ? 'checked' : 'unchecked'} color={Colors.primaryColor} />
                    </View>
                    <View style={styles.task}>
                        <View>
                            <Subheading style={{ ...styles.nameTask, ...{ textDecorationLine: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 } }}>{props.name}</Subheading>
                            {props.due_date === null || props.due_date === '' ? null : <Caption style={{ ...styles.statusTask, ...{ textDecorationLine: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 } }}>{"Due on " + date}</Caption>}
                        </View>
                        <View style={styles.taskSub}>
                            <View style={{ ...styles.comment, ...{ opacity: checked ? 0.6 : 1 } }}>
                                <Icon name="comment-multiple" size={16} color="grey" />
                                <Caption style={{ marginLeft: 3 }}>5</Caption>
                            </View>
                            <View style={{ ...styles.people, ...{ opacity: checked ? 0.6 : 1 } }}>
                                <Icon name="account-multiple" size={16} color="grey" />
                                <Caption style={{ marginLeft: 3 }}>5</Caption>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableCmp>

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
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    task: {
        marginLeft: 10
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


});


export default Task;