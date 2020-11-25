import React, { useContext, useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ProjectCard from '../../components/project/ProjectCard';
import FormEditProject from '../../components/project/FormEditProject';
import { theme } from '../../constants/Theme';
import { SimeContext } from '../../context/SimePovider';
import {
    FETCH_PROJECTS_QUERY,
    FETCH_PROJECT_QUERY,
    FETCH_PICS_BYSTAFF_QUERY,
} from '../../util/graphql';

const ProjectListStaffScreen = ({ navigation }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);


    const selectItemHandler = (id, name, picture) => {
        navigation.navigate('Project Menu', {
            projectName: name,
            projectCoverImage: picture
        }
        );
        sime.setProject_id(id);
        sime.setProject_name(name);
    };

    const [projectsValue, setProjectsValue] = useState([]);

    const [picsStaff, setPicsStaff] = useState([]);

    const { data: picsByStaff, error: error1, loading: loading1, refetch: refetchPicStaff } = useQuery(
        FETCH_PICS_BYSTAFF_QUERY,
        {
            variables: { staffId: sime.user.id },
            onCompleted: () => {
                setPicsStaff(picsByStaff.getPersonInChargesByStaff)
            }
        });

    const { data: projects, error: error2, loading: loading2, refetch } = useQuery(
        FETCH_PROJECTS_QUERY,
        {
            variables: { organizationId: sime.user.organization_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setProjectsValue(projects.getProjects) }
        }
    );

    let projectsStaff = []
    picsStaff.map((pic) =>
        projectsValue.map((project) => {
            if (project.id === pic.project_id) {
                projectsStaff.push(project);
            } else {
                return null;
            }
            return null;
        }))

    const [loadExistData, { called2, data: project, error: error3 }] = useLazyQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: sime.project_id }
        });

    const [projectVal, setProjectVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    useEffect(() => {
        if (project) setProjectVal(project.getProject);
        return () => {
            console.log("This will be logged on unmount");
          }
    }, [project])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (id, name) => {
        setVisible(true);
        sime.setProject_name(name);
        sime.setProject_id(id);

        loadExistData();
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const updateProjectsStateUpdate = (e) => {
        const temp = [...projectsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        setProjectsValue(temp)
        onToggleSnackBarUpdate();
    }

    const updateProjectStateUpdate = (e) => {
        setProjectVal(e)
    }

    const onRefresh = () => {
        refetch();
        refetchPicStaff();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const numColumns = 2;

    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    if (error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (called2 & error3) {
        console.error(error3);
        return <Text>Error</Text>;
    }


    if (projectsStaff.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1 && loading2}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No projects found</Text>
            </ScrollView>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1 && loading2}
                        onRefresh={onRefresh} />
                }
                data={projectsStaff}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProjectCard
                        projectId={itemData.item.id}
                        name={itemData.item.name}
                        start_date={itemData.item.start_date}
                        end_date={itemData.item.end_date}
                        picture={itemData.item.picture}
                        onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.name, itemData.item.picture) }}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name) }}
                        loading={loading1}
                    >
                    </ProjectCard>
                )}
                numColumns={numColumns}
            />
            <Portal>
                <Modal
                    useNativeDriver={true}
                    isVisible={visible}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    onBackButtonPress={closeModal}
                    onBackdropPress={closeModal}
                    statusBarTranslucent>
                    <View style={styles.modalView}>
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }} numberOfLines={1} ellipsizeMode='tail'>{sime.project_name}</Title>
                        <TouchableCmp onPress={openFormEdit}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FormEditProject
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                closeButton={closeModalFormEdit}
                project={projectVal}
                updateProjectsStateUpdate={updateProjectsStateUpdate}
                updateProjectStateUpdate={updateProjectStateUpdate}
            />
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
                action={{
                    label: 'dismiss',
                    onPress: () => {
                        onDismissSnackBarUpdate();
                    },
                }}>
                Project updated!
        </Snackbar>
        </Provider>
    );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(35);


const styles = StyleSheet.create({
    screen: {
        marginTop: 5,
    },
    container: {
        justifyContent: "space-between",
        alignSelf: 'flex-start',
        marginLeft: 7
    },
    modalView: {
        backgroundColor: 'white',
        height: modalMenuHeight,
        width: modalMenuWidth,
        alignSelf: 'center',
        justifyContent: 'flex-start',
    },
    textView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 5
    },
    text: {
        marginLeft: wp(5.6),
        fontSize: wp(3.65)
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ProjectListStaffScreen;