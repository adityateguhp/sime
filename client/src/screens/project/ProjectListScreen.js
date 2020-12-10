import React, { useContext, useState, useEffect } from 'react';
import { FlatList, Alert, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Provider, Portal, Text, Snackbar } from 'react-native-paper';

import FABbutton from '../../components/common/FABbutton';
import ProjectCard from '../../components/project/ProjectCard';
import FormProject from '../../components/project/FormProject';
import FormEditProject from '../../components/project/FormEditProject';
import { theme } from '../../constants/Theme';
import { SimeContext } from '../../context/SimePovider';
import { 
    FETCH_PROJECTS_QUERY, 
    FETCH_PROJECT_QUERY, 
    DELETE_PROJECT,
    DELETE_ASSIGNED_TASK_BYPROJECT,
    DELETE_EVENT_BYPROJECT,
    DELETE_EXTERNAL_BYPROJECT,
    DELETE_PIC_BYPROJECT,
    DELETE_ROADMAP_BYPROJECT,
    DELETE_RUNDOWN_BYPROJECT,
    DELETE_TASK_BYPROJECT 
} from '../../util/graphql';
import LoadingModal from '../../components/common/LoadingModal';
import OptionModal from '../../components/common/OptionModal';

const ProjectListScreen = ({ navigation }) => {

    const sime = useContext(SimeContext);

    const [visibleDelete, setVisibleDelete] = useState(false);

    const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

    const onDismissSnackBarDelete = () => setVisibleDelete(false);


    const [visibleAdd, setVisibleAdd] = useState(false);

    const onToggleSnackBarAdd = () => setVisibleAdd(!visibleAdd);

    const onDismissSnackBarAdd = () => setVisibleAdd(false);


    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

    const onDismissSnackBarUpdate = () => setVisibleUpdate(false);


    const [projectsValue, setProjectsValue] = useState([]);

    const selectItemHandler = (id, name) => {
        navigation.navigate('Project Menu', {
            projectName: name,
        }
        );
        sime.setProject_id(id);
        sime.setProject_name(name);
    };

    const { data: projects, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_PROJECTS_QUERY,
        {
            variables: { organizationId: sime.user.organization_id },
            notifyOnNetworkStatusChange: true,
            onCompleted: () => { setProjectsValue(projects.getProjects) }
        }
    );

    const [loadExistData, { called, data: project, error: error2 }] = useLazyQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: sime.project_id }
        });

    const [projectVal, setProjectVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
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

    const closeModalForm = () => {
        setVisibleForm(false);
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

    const openForm = () => {
        setVisibleForm(true);
    }

    const openFormEdit = () => {
        closeModal();
        setVisibleFormEdit(true);
    }

    const projectId = sime.project_id;

    const [deleteEventByProject] = useMutation(DELETE_EVENT_BYPROJECT)

    const [deletePersonInChargeByProject] = useMutation(DELETE_PIC_BYPROJECT)

    const [deleteRoadmapByProject] = useMutation(DELETE_ROADMAP_BYPROJECT)

    const [deleteAssignedTaskByProject] = useMutation(DELETE_ASSIGNED_TASK_BYPROJECT)

    const [deleteTaskByProject] = useMutation(DELETE_TASK_BYPROJECT)

    const [deleteRundownByProject] = useMutation(DELETE_RUNDOWN_BYPROJECT)

    const [deleteExternalByProject] = useMutation(DELETE_EXTERNAL_BYPROJECT)

    const [deleteProject, { loading: loadingDelete }] = useMutation(DELETE_PROJECT, {
        update(proxy) {
            const data = proxy.readQuery({
                query: FETCH_PROJECTS_QUERY,
                variables: { organizationId: sime.user.organization_id }
            });
            deleteEventByProject({variables: {projectId: projectId}})
            deletePersonInChargeByProject({variables: {projectId: projectId}})
            deleteRoadmapByProject({variables: {projectId: projectId}})
            deleteAssignedTaskByProject({variables: {projectId: projectId}})
            deleteTaskByProject({variables: {projectId: projectId}})
            deleteRundownByProject({variables: {projectId: projectId}})
            deleteExternalByProject({variables: {projectId: projectId}})
            projects.getProjects = projects.getProjects.filter((p) => p.id !== projectId);
            deleteProjectsStateUpdate(projectId)
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data, variables: { organizationId: sime.user.organization_id }, });
        },
        variables: {
            projectId
        }
    });

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

    const onRefresh = () => {
        refetch();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const deleteHandler = () => {
        closeModal();
        closeModalFormEdit();
        Alert.alert('Are you sure?', 'Do you really want to delete this project?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: confirmToDeleteAll
            }
        ]);
    };

    const confirmToDeleteAll = () => {
        Alert.alert('Wait... are you really sure?', "By deleting this project, it's also delete all inside this project", [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Agree',
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

    if (called & error2) {
        console.error(error2);
        return <Text>Error</Text>;
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
                <FABbutton Icon="plus" onPress={openForm} />
                <FormProject
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                    addProjectsStateUpdate={addProjectsStateUpdate}
                />
                <Portal>
                    <Snackbar
                        visible={visibleDelete}
                        onDismiss={onDismissSnackBarDelete}
                        action={{
                            label: 'dismiss',
                            onPress: () => {
                                onDismissSnackBarDelete();
                            },
                        }}>
                        Project deleted!
                </Snackbar>
                    <Snackbar
                        visible={visibleAdd}
                        onDismiss={onDismissSnackBarAdd}
                        action={{
                            label: 'dismiss',
                            onPress: () => {
                                onDismissSnackBarAdd();
                            },
                        }}>
                        Project added!
            </Snackbar>
                </Portal>
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
                        refreshing={loading1}
                        onRefresh={onRefresh} />
                }
                data={projectsValue}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProjectCard
                        projectId={itemData.item.id}
                        name={itemData.item.name}
                        start_date={itemData.item.start_date}
                        end_date={itemData.item.end_date}
                        picture={itemData.item.picture}
                        onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.name) }}
                        onLongPress={() => { longPressHandler(itemData.item.id, itemData.item.name) }}
                        loading={loading1}
                    >
                    </ProjectCard>
                )}
                numColumns={numColumns}
            />
            <Portal>
                <OptionModal
                    visible={visible}
                    closeModal={closeModal}
                    title={sime.project_name}
                    openFormEdit={openFormEdit}
                    deleteHandler={deleteHandler}
                />
            </Portal>
            <FABbutton Icon="plus" onPress={openForm} />
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
            <Portal>
                <Snackbar
                    visible={visibleDelete}
                    onDismiss={onDismissSnackBarDelete}
                    action={{
                        label: 'dismiss',
                        onPress: () => {
                            onDismissSnackBarDelete();
                        },
                    }}>
                    Project deleted!
            </Snackbar>
                <Snackbar
                    visible={visibleAdd}
                    onDismiss={onDismissSnackBarAdd}
                    action={{
                        label: 'dismiss',
                        onPress: () => {
                            onDismissSnackBarAdd();
                        },
                    }}>
                    Project added!
            </Snackbar>
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
            </Portal>
            <LoadingModal loading={loadingDelete} />
        </Provider>
    );
}


const styles = StyleSheet.create({
    screen: {
        marginTop: 5,
    },
    container: {
        justifyContent: "space-between",
        alignSelf: 'flex-start',
        marginLeft: 7
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ProjectListScreen;