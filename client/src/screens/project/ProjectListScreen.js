import React, { useContext, useState } from 'react';
import { FlatList, Alert, StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Provider, Portal, Title, Text } from 'react-native-paper';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FABbutton from '../../components/common/FABbutton';
import ProjectCard from '../../components/project/ProjectCard';
import FormProject from '../../components/project/FormProject';
import {theme} from '../../constants/Theme';
import Colors from '../../constants/Colors';
import { PROJECTS } from '../../data/dummy-data';
import { SimeContext } from '../../provider/SimePovider';


const ProjectListScreen = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const sime = useContext(SimeContext);

    const selectItemHandler = (_id, project_name) => {
        props.navigation.navigate('Project Menu', {
            projectName: project_name
        }
        );
        sime.setProject_id(_id);
        sime.setProject_name(project_name);
    };

    const organizationProject = PROJECTS.filter(proj => proj.organization_id.indexOf('o1') >= 0);

    const [visible, setVisible] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);

    const closeModal = () => {
        setVisible(false);
    }

    const closeModalForm = () => {
        setVisibleForm(false);
    }

    const longPressHandler = (project_name) => {
        setVisible(true);
        sime.setProject_name(project_name);
    }

    const openForm = () => {
        setVisibleForm(true);
    }

    const deleteHandler = () => {
        setVisibleForm(false);
        setVisible(false);
        Alert.alert('Are you sure?', 'Do you really want to delete this event?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
            }
        ]);
    };

    const numColumns = 2;

    return (
        <Provider theme={theme}>
            <FlatList
                style={styles.screen}
                contentContainerStyle={styles.container}
                data={organizationProject}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <ProjectCard
                        project_name={itemData.item.project_name}
                        cancel={itemData.item.cancel}
                        project_start_date={itemData.item.project_start_date}
                        project_end_date={itemData.item.project_end_date}
                        picture={itemData.item.picture}
                        onSelect={() => { selectItemHandler(itemData.item._id, itemData.item.project_name) }}
                        onLongPress={() => { longPressHandler(itemData.item.project_name) }}
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
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Cancel project</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp onPress={deleteHandler}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Delete project</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </Modal>
            </Portal>
            <FABbutton Icon="plus"  label="project" onPress={openForm} />
            <FormProject 
            closeModalForm={closeModalForm} 
            visibleForm={visibleForm} 
            deleteButton={deleteHandler}
            closeButton={closeModalForm}
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
});

export default ProjectListScreen;