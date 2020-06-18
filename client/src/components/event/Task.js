import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Subheading, Divider, Checkbox, Caption } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

const Task = props => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [checked, setCheked] = useState(false);

    const onPressCheck = () => {
        setCheked(!checked);
    }

    return (
        <TouchableCmp>
            <View style={styles.container}>
                <View style={styles.taskContainer}>
                    <View>
                        <Checkbox onPress={onPressCheck} status={checked ? 'checked' : 'unchecked'} color={Colors.primaryColor} />
                    </View>
                    <View style={styles.task}>
                        <View>
                            <Subheading style={{ ...styles.nameTask, ...{ textDecorationLine: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 } }}>{props.task_name}</Subheading>
                            <Caption style={{ ...styles.statusTask, ...{ textDecorationLine: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 } }}>Due on Tue 09 June 2020</Caption>
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