import React, { useContext, useState } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { Divider, Provider } from 'react-native-paper';

import FABbutton from '../../components/common/FABbutton';
import { SimeContext } from '../../provider/SimePovider';
import { TASKS } from '../../data/dummy-data';
import Task from '../../components/event/Task';
import Colors from '../../constants/Colors';
import {theme} from '../../constants/Theme';

const TaskScreen = ({ route }, props) => {
    const sime = useContext(SimeContext);

    const divId = route.params?.divisionId;

    const [visibleForm, setVisibleForm] = useState(false);

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const TaskOnRoadmap = TASKS.filter(task => task.division_id.indexOf(divId) >= 0 && task.roadmap_id.indexOf(sime.roadmap_id) >= 0)

    const headerTask = (pending, completed) => {
        return (
            <View style={styles.taskStatusContainer}>
                <View style={styles.pending}>
                    <Text style={styles.textStatus}>Pending: {pending} Task</Text>
                </View>
                <Divider style={[styles.dividerStatus, {
                    transform: [
                        { rotate: "90deg" }
                    ]
                }]} />
                <View style={styles.completed}>
                    <Text style={styles.textStatus}>Completed: {completed} Task</Text>
                </View>
            </View>
        )
    }

    return (
        <Provider theme={theme}>
        <FlatList
            ListHeaderComponentStyle={styles.screen}
            data={TaskOnRoadmap}
            keyExtractor={item => item._id}
            ListHeaderComponent={headerTask(2, 1)}
            renderItem={itemData => (
                <Task
                    task_name={itemData.item.task_name}
                >
                </Task>
            )}
        />
         <FABbutton Icon="plus" label="task" onPress={openForm} />
        </Provider>

    );
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 5
    },
    pending: {
        backgroundColor: 'white',
        marginLeft: 55,
        marginVertical: 10
    },
    completed: {
        backgroundColor: 'white',
        marginRight: 55,
        marginVertical: 10
    },
    taskStatusContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 3,
    },
    dividerStatus: {
        width: 25,
        height: 1
    },
    textStatus: {
        color: 'grey'
    }
});

export default TaskScreen;