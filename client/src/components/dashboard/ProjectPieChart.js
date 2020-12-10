import React from 'react';
import { StyleSheet, View} from 'react-native';
import { VictoryPie } from "victory-native";
import moment from 'moment';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
                    width={wp(53)}
                    height={wp(53)}
                    innerRadius={wp(9.7)}
                    padding={{ top: wp(7.3), bottom: wp(7.3) }}
                    style={{
                        labels: {
                            fill: 'white', fontSize: 0
                        },
                    }}
                />
            </View>
            <View>
                <View style={styles.legend}>
                    <Icon name="folder" size={wp(4.8)} color="blue" />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: wp(3) }}>{preparingCounter.length}</Text>
                    <Text style={{ marginLeft: 5, fontSize: wp(3) }}>Preparing</Text>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: wp(3) }}>({preparing ? preparing : 0}%)</Text>
                </View>
                <View style={styles.legend}>
                    <Icon name="folder" size={wp(4.8)} color="orange" />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: wp(3) }}>{activeCounter.length}</Text>
                    <Text style={{ marginLeft: 5, fontSize: wp(3) }}>Active</Text>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: wp(3) }}>({active ? active : 0}%)</Text>
                </View>
                <View style={styles.legend}>
                    <Icon name="folder" size={wp(4.8)} color="green" />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize : wp(3) }}>{completedCounter.length}</Text>
                    <Text style={{ marginLeft: 5, fontSize: wp(3) }}>Completed</Text>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: wp(3) }}>({completed ? completed : 0}%)</Text>
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