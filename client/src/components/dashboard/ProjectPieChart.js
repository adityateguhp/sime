import React from 'react';
import { StyleSheet, View} from 'react-native';
import { VictoryPie } from "victory-native";
import moment from 'moment';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProjectPieChart = props => {

    const nowDate = moment().format();

    let preparingCounter = [];
    let activeCounter = [];
    let completedCounter = [];

    props.projects.forEach((project) => {
        const preparing = moment(nowDate).isBefore(project.start_date);
        const active = moment(nowDate).isBetween(project.start_date, project.end_date, undefined, '[]');
        const completed = moment(nowDate).isAfter(project.end_date);
        if (preparing === true) {
            preparingCounter.push(project);

        } else if (active === true) {
            activeCounter.push(project);

        } else if (completed === true) {
            completedCounter.push(project);
        }
    })

    const preparing = (preparingCounter.length / props.projects.length).toFixed(2) * 100
    const active = (activeCounter.length / props.projects.length).toFixed(2) * 100
    const completed = (completedCounter.length / props.projects.length).toFixed(2) * 100

    const graphicData = [
        { y: preparing, x: preparing + "%" },
        { y: active, x: active + "%" },
        { y: completed, x: completed + "%" },
    ]


    return (
        <View style={styles.pieContainer}>
            <View style={styles.pie}>
                <Text style={{
                    position: 'absolute',
                    color: 'black',
                    fontWeight: "bold",
                }}>Total: {props.projects.length}</Text>
                <VictoryPie
                    colorScale={["blue", "orange", "green"]}
                    data={graphicData}
                    width={220}
                    height={220}
                    innerRadius={40}
                    padding={{ top: 30, bottom: 30 }}
                    style={{
                        labels: {
                            fill: 'white', fontSize: 0
                        },
                    }}
                />
            </View>
            <View>
                <View style={styles.legend}>
                    <Icon name="folder" size={20} color="blue" />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 13 }}>{preparingCounter.length}</Text>
                    <Text style={{ marginLeft: 5, fontSize: 13 }}>Preparing</Text>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 13 }}>({preparing ? preparing : 0}%)</Text>
                </View>
                <View style={styles.legend}>
                    <Icon name="folder" size={20} color="orange" />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 13 }}>{activeCounter.length}</Text>
                    <Text style={{ marginLeft: 5, fontSize: 13 }}>Active</Text>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 13 }}>({active ? active : 0}%)</Text>
                </View>
                <View style={styles.legend}>
                    <Icon name="folder" size={20} color="green" />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 13 }}>{completedCounter.length}</Text>
                    <Text style={{ marginLeft: 5, fontSize: 13 }}>Completed</Text>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 13 }}>({completed ? completed : 0}%)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pieContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',

    },
    pie: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    legend: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
    },
});

export default ProjectPieChart;