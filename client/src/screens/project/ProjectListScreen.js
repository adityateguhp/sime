import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform, RefreshControl, ScrollView } from 'react-native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Provider, Portal, Title, Text, Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NetworkStatus } from '@apollo/client';

import FABbutton from '../../components/common/FABbutton';
import ProjectCard from '../../components/project/ProjectCard';
import CenterSpinner from '../../components/common/CenterSpinner';
import FormProject from '../../components/project/FormProject';
import FormEditProject from '../../components/project/FormEditProject';
import { theme } from '../../constants/Theme';
import Colors from '../../constants/Colors';
import { SimeContext } from '../../context/SimePovider';
import { FETCH_PROJECTS_QUERY, FETCH_PROJECT_QUERY, DELETE_PROJECT, CANCEL_PROJECT_MUTATION } from '../../util/graphql';

const ProjectListScreen = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleCancel, setVisibleCancel] = useState(false);

    const onToggleSnackBarCancel = () => setVisibleCancel(!visibleCancel);

    const onDismissSnackBarCancel = () => setVisibleCancel(false);


    const [visibleActivate, setVisibleActivate] = useState(false);

    const onToggleSnackBarActivate = () => setVisibleActivate(!visibleActivate);

    const onDismissSnackBarActivate = () => setVisibleActivate(false);


    const [visibleAdd, setVisibleAdd] = useState(false);

    const onToggleSnackBarAdd = () => setVisibleAdd(!visibleAdd);

    const onDismissSnackBarAdd = () => setVisibleAdd(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);


    const [projectsValue, setProjectsValue] = useState([]);

    const selectItemHandler = (id, name) => {
        props.navigation.navigate('Project Menu', {
            projectName: name
        }
        );
        sime.setProject_id(id);
        sime.setProject_name(name);
    };

    const { data: projects, error: error1, loading: loading1, refetch, networkStatus } = useQuery(
        FETCH_PROJECTS_QUERY,
        {
            variables: { organizationId: sime.user.id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setProjectsValue(projects.getProjects) }
        }
    );

    const [loadExistData, { called, data: project, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: sime.project_id }
        });

    const [projectVal, setProjectVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);
    const [cancelValue, setCancelValues] = useState({
        projectId: '',
        cancel: false
    });

    useEffect(() => {
        if (project) setProjectVal(project.getProject);
    }, [project])

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const closeModalFormEdit = () => {
        setVisibleFormEdit(false);
    }

    const longPressHandler = (id, name, cancel) => {
        setVisible(true);
        sime.setProject_name(name);
        sime.setProject_id(id);
        setCancelValues({ cancel: cancel, projectId: id })
        loadExistData();
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const projectId = sime.project_id;

    const [deleteProject] = useMutation(DELETE_PROJECT, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_PROJECTS_QUERY,
                variables: { organizationId: sime.user.id }
            });
            projects.getProjects = projects.getProjects.filter((p) => p.id !== projectId);
            deleteProjectsStateUpdate(projectId)
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data, variables: { organizationId: sime.user.id }, });
        },
        variables: {
            projectId
        }
    });

    const [cancelProject, { loading }] = useMutation(CANCEL_PROJECT_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_PROJECTS_QUERY,
                variables: { organizationId: sime.user.id },
            });
            cancelProjectsStateUpdate(result.data.cancelProject);
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data, variables: { organizationId: sime.user.id } });
            closeModal();
        },
        onError(err) {
            console.log(err)
            return err;
        },
        variables: { ...cancelValue, cancel: !cancelValue.cancel }
    });

    const onCancel = (event) => {
        event.preventDefault();
        cancelProject();
    };

    const addProjectsStateUpdate = (e) => {
        setProjectsValue([e, ...projectsValue]);
        onToggleSnackBarAdd();
    }

    const deleteProjectsStateUpdate = (e) => {
        const temp = [...projectsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e);
        temp.splice(index, 1);
        setProjectsValue(temp);
        onToggleSnackBarDelete();
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

    const cancelProjectsStateUpdate = (e) => {
        const temp = [...projectsValue];
        const index = temp.map(function (item) {
            return item.id
        }).indexOf(e.id);
        temp[index] = e
        setProjectsValue(temp)
    }

    const onRefresh = () => {
        refetch();
    };

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this project?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteProject
            }
        ]);
    };

    const numColumns = 2;

    if (error1) {
        console.error(error1);
        return <Text>Error</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
    }

    if (loading2) {

    }

    if (projectsValue.length === 0) {
        return (
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
            >
                <Text>No projects found, let's add projects!</Text>
                <FABbutton Icon="plus" label="staff" onPress={openForm} />
                <FormProject
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addProjectsStateUpdate={addProjectsStateUpdate}
                />
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                >
                    Project deleted!
                </Snackbar>
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                >
                    Project added!
            </Snackbar>
            </ScrollView>
        );
    }

    if (networkStatus === NetworkStatus.refetch) return console.log('Refetching projects!');

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                data={projectsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProjectCard
                        name={itemData.item.name}
                        cancel={itemData.item.cancel}
                        start_date={itemData.item.start_date}
                        end_date={itemData.item.end_date}
                        picture={itemData.item.picture}
                        onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.name) }}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name, itemData.item.cancel) }}
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
                        <Title style={{ marginTop: wp(4), marginHorizontal: wp(5), marginBottom: 5, fontSize: wp(4.86) }}>{sime.project_name}</Title>
                        <TouchableCmp onPress={openFormEdit}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        {
                            cancelValue.cancel === true ?
                                <TouchableCmp onPress={onToggleSnackBarActivate} onPressIn={onCancel}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Activate project</Text>
                                    </View>
                                </TouchableCmp>
                                :
                                <TouchableCmp onPress={onToggleSnackBarCancel} onPressIn={onCancel}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Cancel project</Text>
                                    </View>
                                </TouchableCmp>
                        }
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete project</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus" label="project" onPress={openForm} />
            <FormProject
                closeModalForm={closeModalForm}
                visibleForm={visibleForm}
                closeButton={closeModalForm}
                addProjectsStateUpdate={addProjectsStateUpdate}
            />
            <FormEditProject
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                project={projectVal}
                updateProjectsStateUpdate={updateProjectsStateUpdate}
                updateProjectStateUpdate={updateProjectStateUpdate}
            />
            <Snackbar
                visible={visibleDelete}
                onDismiss={onDismissSnackBarDelete}
            >
                Project deleted!
            </Snackbar>
            <Snackbar
                visible={visibleCancel}
                onDismiss={onDismissSnackBarCancel}
            >
                Project canceled!
            </Snackbar>
            <Snackbar
                visible={visibleActivate}
                onDismiss={onDismissSnackBarActivate}
            >
                Project activated!
            </Snackbar>
            <Snackbar
                visible={visibleAdd}
                onDismiss={onDismissSnackBarAdd}
            >
                Project added!
            </Snackbar>
            <Snackbar
                visible={visibleUpdate}
                onDismiss={onDismissSnackBarUpdate}
            >
                Project updated!
            </Snackbar>
        </Provider>
    );
}

const modalMenuWidth = wp(77);
const modalMenuHeight = wp(46.5);

const styles = StyleSheet.create({
    screen: {
        marginTop: 5
    },
    container: {
        justifyContent: "space-between",
        alignSelf: "center"
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

export default ProjectListScreen;