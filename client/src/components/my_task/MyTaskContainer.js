import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Subheading, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@apollo/react-hooks';
import SkeletonContent from "react-native-skeleton-content-nonexpo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FETCH_PROJECT_QUERY } from '../../util/graphql';
import Colors from '../../constants/Colors';
import CenterSpinnerSmall from '../common/CenterSpinnerSmall';
import { SimeContext } from '../../context/SimePovider';

const MyTaskContainer = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState('');

    const { data: project, error: errorProject, loading: loadingProject, refetch: refetchProject } = useQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: props.project_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => {
                if (project.getProject) {
                    setProjectName(project.getProject.name)
                    setProjectId(project.getProject.id)
                } else {
                    setProjectName('[project not found]')
                }
            }
        }
    );

    const projectPressHandler = (id, name) => {
        props.navigation.navigate('Project Menu', {
            projectName: projectName
        }
        );
        sime.setProject_id(id);
        sime.setProject_name(name);
    };

    useEffect(() => {
        refetchProject();
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [props.onRefresh]);


    return (
        <TouchableCmp onPress={() => { projectPressHandler(projectId, projectName) }} useForeground>
            <View style={styles.container}>
                <View style={styles.date}>
                    <Icon name="folder" size={wp(4.86)} color={"white"} style={{ marginRight: 10 }} />
                    <Subheading style={{ fontWeight: 'bold', color: "white", fontSize: wp(3.89), marginRight: 20}} numberOfLines={1} ellipsizeMode='tail'>{projectName}</Subheading>
                </View>
                <Divider />
            </View>
        </TouchableCmp>

    );
};

const nameText = [
    {
        width: wp(40),
        height: wp(5),
    }
];

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 3,
        backgroundColor: Colors.primaryColor,

    },
    date: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    SkletonContainer: {
        width: '100%',
    },

});


export default MyTaskContainer;