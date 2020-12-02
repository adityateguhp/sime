import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { Surface, Text, Title, Button, Snackbar, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AssignedToMeContainer from '../../components/my_task/AssignedToMeContainer';
import CreatedByMeContainer from '../../components/my_task/CreatedByMeContainer';
import ProjectPieChart from '../../components/dashboard/ProjectPieChart'
import ProjectCorousel from '../../components/dashboard/ProjectCorousel'
import { SimeContext } from '../../context/SimePovider';
import CenterSpinner from '../../components/common/CenterSpinner';
import { FETCH_PROJECTS_QUERY, FETCH_TASKS_CREATEDBY_QUERY, FETCH_ASSIGNED_TASKS_QUERY_BYSTAFF } from '../../util/graphql';
import Colors from '../../constants/Colors';

const DashboardScreen = ({ navigation }) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const sime = useContext(SimeContext);

  const [visibleDelete, setVisibleDelete] = useState(false);

  const onToggleSnackBarDelete = () => setVisibleDelete(!visibleDelete);

  const onDismissSnackBarDelete = () => setVisibleDelete(false);


  const [visibleUpdate, setVisibleUpdate] = useState(false);

  const onToggleSnackBarUpdate = () => setVisibleUpdate(!visibleUpdate);

  const onDismissSnackBarUpdate = () => setVisibleUpdate(false);

  //created by me

  const [tasksCreatedByValue, setTasksCreatedByValue] = useState([]);
  const [userId, setUserId] = useState('');

  const { data: tasksCreatedBy, error: error2, loading: loading2, refetch: refetchTask } = useQuery(
    FETCH_TASKS_CREATEDBY_QUERY,
    {
      variables: { createdBy: userId },
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        setTasksCreatedByValue(tasksCreatedBy.getTasksCreatedBy)
      }
    });

  const completedTasksStateUpdate = (e) => {
    const temp = [...tasksCreatedByValue];
    const index = temp.map(function (item) {
      return item.id
    }).indexOf(e.id);
    temp[index] = e
    temp.sort(function (x, y) {
      return new Date(x.createdAt) - new Date(y.createdAt);
    }).reverse();
    temp.sort(function (x, y) {
      return Number(x.completed) - Number(y.completed);
    });
    setTasksCreatedByValue(temp)
  }

  const deleteTasksStateUpdate = (e) => {
    const temp = [...tasksCreatedByValue];
    const index = temp.map(function (item) {
      return item.id
    }).indexOf(e);
    temp.splice(index, 1);
    setTasksCreatedByValue(temp);
    onToggleSnackBarDelete();
  }

  const updateTasksStateUpdate = (e) => {
    const temp = [...tasksCreatedByValue];
    const index = temp.map(function (item) {
      return item.id
    }).indexOf(e.id);
    temp[index] = e
    temp.sort(function (x, y) {
      return new Date(x.createdAt) - new Date(y.createdAt);
    }).reverse();
    temp.sort(function (x, y) {
      return Number(x.completed) - Number(y.completed);
    });
    setTasksCreatedByValue(temp);
    onToggleSnackBarUpdate();
  }

  //assigned to me

  const [assignedStaff, setAssignedStaff] = useState([]);

  const { data: assignedByStaff, error: error3, loading: loading3, refetch: refetchAssignedStaff } = useQuery(
    FETCH_ASSIGNED_TASKS_QUERY_BYSTAFF,
    {
      variables: { staffId: userId },
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        setAssignedStaff(assignedByStaff.getAssignedTasksByStaff)
      }
    });

  const deleteStateUpdate = (e) => {
    const temp = [...assignedStaff];
    const index = temp.map(function (item) {
      return item.task_id
    }).indexOf(e);
    temp.splice(index, 1);
    setAssignedStaff(temp);
  }


  //project

  const [projectsValue, setProjectsValue] = useState([]);
  const [organizationId, setOrganizationId] = useState('');

  const { data: projects, error: error1, loading: loading1, refetch: refetchProject } = useQuery(
    FETCH_PROJECTS_QUERY,
    {
      variables: { organizationId },
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        if (projects.getProjects) {
          setProjectsValue(projects.getProjects)
        }
      }
    }
  );

  useEffect(() => {
    if (sime.user) {
      setOrganizationId(sime.user.organization_id)
      setUserId(sime.user.id)
    }
  }, [sime.user])


  const onRefresh = () => {
    refetchProject();
    refetchTask();
    refetchAssignedStaff();
  };

  const selectItemHandler = (id, name, picture) => {
    navigation.navigate('Project Menu', {
      projectName: name,
      projectCoverImage: picture
    }
    );
    sime.setProject_id(id);
    sime.setProject_name(name);
  };

  const seeAllProjectHandler = () => {
    navigation.navigate('Projects')
  };

  const seeAllTaskHandler = () => {
    navigation.navigate('My Tasks')
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  if (error1) {
    return <CenterSpinner />
  }

  if (error2) {
    return <CenterSpinner />
  }

  if (error3) {
    return <CenterSpinner />
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={loading1 && loading2 && loading3}
          onRefresh={onRefresh} />
      }
    >

      <Surface style={styles.container}>
        <View style={{ marginLeft: 15, marginRight: 10, marginTop: 10, flexDirection: "row", alignItems: 'center', justifyContent: "flex-start" }}>
          <Icon name="chart-donut" size={30} color={Colors.primaryColor} />
          <Title style={{ marginLeft: 10 }}>Projects progress</Title>
        </View>
        <ProjectPieChart projects={projectsValue} />
      </Surface>

      <Surface style={styles.containerRecent}>
        <View style={{ marginLeft: 15, marginRight: 10, marginTop: 10, flexDirection: "row", alignItems: 'center', justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "flex-start" }}>
            <Icon name="folder-multiple" size={30} color={Colors.primaryColor} />
            <Title style={{ marginLeft: 10 }}>Recently added project</Title>
          </View>
          <Button labelStyle={{ fontWeight: "bold" }} color={Colors.secondaryColor} mode="text" compact={true} uppercase={false} onPress={() => { seeAllProjectHandler() }}>See All</Button>
        </View>
        {
          projectsValue.length !== 0 ?
            <View style={{ marginBottom: projectsValue.length === 1 ? 10 : 0 }}>
              <ProjectCorousel projects={projectsValue} loading={loading1} selectItemHandler={selectItemHandler} />
            </View>
            :
            <View style={styles.contentText}>
              <Text>No projects found, let's add projects!</Text>
            </View>
        }
      </Surface>

      <Surface style={styles.containerRecent}>
        <View style={{ marginLeft: 15, marginRight: 10, marginTop: 10, flexDirection: "row", alignItems: 'center', justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "flex-start" }}>
            <Icon name="account-arrow-left" size={30} color={Colors.primaryColor} />
            <Title style={{ marginLeft: 10 }}>Tasks assigned to me</Title>
          </View>
          <Button labelStyle={{ fontWeight: "bold" }} color={Colors.secondaryColor} mode="text" compact={true} uppercase={false} onPress={() => { seeAllTaskHandler() }}>See All</Button>
        </View>
        {
          assignedStaff.length !== 0 ?
            <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
              {assignedStaff.slice(0, 2).map((data) => (
                <AssignedToMeContainer
                  taskId={data.task_id}
                  projectId={data.project_id}
                  eventId={data.event_id}
                  roadmapId={data.roadmap_id}
                  personInChargeId={data.person_in_charge_id}
                  deleteStateUpdate={deleteStateUpdate}
                  onRefresh={onRefresh}
                  onToggleSnackBarDelete={onToggleSnackBarDelete}
                  onToggleSnackBarUpdate={onToggleSnackBarUpdate}
                />
              ))}
            </View>
            :
            <View style={styles.contentText}>
              <Text>No tasks found, let's add tasks!</Text>
            </View>
        }
      </Surface>

      <Surface style={styles.containerRecent}>
        <View style={{ marginLeft: 15, marginRight: 10, marginTop: 10, flexDirection: "row", alignItems: 'center', justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "flex-start" }}>
            <Icon name="shape-square-plus" size={30} color={Colors.primaryColor} />
            <Title style={{ marginLeft: 10 }}>Tasks created by me</Title>
          </View>
          <Button labelStyle={{ fontWeight: "bold" }} color={Colors.secondaryColor} mode="text" compact={true} uppercase={false} onPress={() => { seeAllTaskHandler() }}>See All</Button>
        </View>
        {
          tasksCreatedByValue.length !== 0 ?
            <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
              {tasksCreatedByValue.slice(0, 2).map((data) => (
                <CreatedByMeContainer
                  key={data.id}
                  tasks={tasksCreatedByValue}
                  task={data}
                  createdBy={data.createdBy}
                  onRefresh={onRefresh}
                  completedTasksStateUpdate={completedTasksStateUpdate}
                  deleteTasksStateUpdate={deleteTasksStateUpdate}
                  updateTasksStateUpdate={updateTasksStateUpdate}
                />
              ))}
            </View>
            :
            <View style={styles.contentText}>
              <Text>No tasks found, let's add tasks!</Text>
            </View>
        }
      </Surface>

      <Snackbar
        visible={visibleUpdate}
        onDismiss={onDismissSnackBarUpdate}
        action={{
          label: 'dismiss',
          onPress: () => {
            onDismissSnackBarUpdate();
          },
        }}>
        Task updated!
            </Snackbar>
      <Snackbar
        visible={visibleDelete}
        onDismiss={onDismissSnackBarDelete}
        action={{
          label: 'dismiss',
          onPress: () => {
            onDismissSnackBarDelete();
          },
        }}>
        Task deleted!
            </Snackbar>
    </ScrollView>
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
  container: {
    elevation: 3,
    borderRadius: 5,
    marginHorizontal: 15,
    marginTop: 15,
  },
  containerRecent: {
    elevation: 3,
    marginTop: 20,
  },
  content: {
    flex: 1,
  },
  contentText: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  },
});

export default DashboardScreen;