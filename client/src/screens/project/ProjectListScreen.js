import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

    const selectItemHandler = (id, name, data) => {
        props.navigation.navigate('Project Menu', {
            projectName: name
        }
        );
        sime.setProject_id(id);
        sime.setProject_name(name);
        sime.setProjectData(data)
    };

    const { data: projects, error: error1, loading: loading1 } = useQuery(
        FETCH_PROJECTS_QUERY
    );

    const [loadExistData, { called, data: project, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_PROJECT_QUERY,
        {
            variables: { projectId: sime.project_id },
            onCompleted: () => {
                setProjectVal(project.getProject);
            }
        });

    const [projectVal, setProjectVal] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);
    const [cancelValue, setCancelValues] = useState({
        projectId: '',
        cancel: false
    });

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
                query: FETCH_PROJECTS_QUERY
            });
            projects.getProjects = projects.getProjects.filter((p) => p.id !== projectId);
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data });
        },
        variables: {
            projectId
        }
    });

    const [cancelProject, { loading }] = useMutation(CANCEL_PROJECT_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_PROJECTS_QUERY
            });
            proxy.writeQuery({ query: FETCH_PROJECTS_QUERY, data });
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

    if (projects.getProjects.length === 0) {
        return (
            <View style={styles.content}>
                <Text>No projects found, let's add projects!</Text>
                <FABbutton Icon="plus" label="staff" onPress={openForm} />
                <FormProject
                    closeModalForm={closeModalForm}
                    visibleForm={visibleForm}
                    closeButton={closeModalForm}
                />
            </View>
        );
    }

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                contentContainerStyle={styles.container}
                data={projects.getProjects}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProjectCard
                        name={itemData.item.name}
                        cancel={itemData.item.cancel}
                        start_date={itemData.item.start_date}
                        end_date={itemData.item.end_date}
                        picture={itemData.item.picture}
                        onSelect={() => { selectItemHandler(itemData.item.id, itemData.item.name, itemData.item) }}
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
                                <TouchableCmp onPress={onCancel}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>Active project</Text>
                                    </View>
                                </TouchableCmp>
                                :
                                <TouchableCmp onPress={onCancel}>
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
            />
            <FormEditProject
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                deleteButton={deleteHandler}
                closeButton={closeModalFormEdit}
                project={projectVal}
            />
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