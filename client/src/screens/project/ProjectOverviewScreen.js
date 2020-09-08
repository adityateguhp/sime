import React, { useState, useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, List, Avatar, Subheading, Divider, Provider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import Status from '../../components/common/Status';
import ModalProfile from '../../components/common/ModalProfile';
import { COMITEES, STAFFS, PROJECTS, POSITIONS } from '../../data/dummy-data';
import { FETCH_PROJECT_QUERY } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider';
import Colors from '../../constants/Colors';
import { theme } from '../../constants/Theme';

const ProjectOverviewScreen = props => {
  const sime = useContext(SimeContext);

  const selectedProject = PROJECTS.find(proj => proj._id === sime.project_id);

  const selectItemHandler = (_id) => {
    props.navigation.navigate('Comitee Profile', {
        comiteeId: _id
    });
    setVisible(false);
  };

  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  }

  const closeModal = () => {
    setVisible(false);
  }

  const headOfProject = COMITEES.find(
    comitee => comitee.project_id.indexOf(sime.project_id) >= 0 &&
      comitee.position_id.indexOf('pos1') >= 0
  );

  const staff = STAFFS.find(stf => stf._id.indexOf(headOfProject.staff_id) >= 0)
  const position = POSITIONS.find(pos => pos._id.indexOf(headOfProject.position_id) >= 0);

  const startDate = moment(selectedProject.project_start_date).format('ddd, MMM D YYYY');
  const endDate = moment(selectedProject.project_end_date).format('ddd, MMM D YYYY');

  return (
    <Provider theme={theme}>
      <ScrollView style={styles.overviewContainer}>
        <View style={styles.overview}>
          <Subheading style={{ fontWeight: 'bold' }}>Head of Project</Subheading>
          <List.Item
            title={staff.name}
            left={() => <Avatar.Image size={35} source={{ uri: staff.picture }} />}
            onPress={openModal}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Status</Subheading>
          <List.Item
            left={() =>
              <Status start_date={selectedProject.project_start_date} end_date={selectedProject.project_end_date} cancel={selectedProject.cancel} fontSize={wp(3)} />}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Project Description</Subheading>
          <List.Item
            title={selectedProject.project_description}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
          <Divider style={styles.overviewDivider} />
          <Subheading style={{ fontWeight: 'bold' }}>Project Work Date</Subheading>
          <List.Item
            title={
              <Text>
                <Icon name="calendar" size={16} color='black' /> {startDate} - {endDate}
              </Text>}
            titleNumberOfLines={10}
            titleStyle={{ textAlign: 'justify' }}
          />
        </View>
      </ScrollView>
      <ModalProfile
        visible={visible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        name={staff.name}
        position_name={position.position_name}
        email={staff.email}
        phone_number={staff.phone_number}
        picture={staff.picture}
        positionName={true}
        onPressInfo={()=>{selectItemHandler(headOfProject._id)}}
      />
    </Provider>
  );
}

const overviewWidth = wp(100);
const overviewHeight = hp(100);

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 10
  },
  screen: {
    flex: 1
  },
  overviewContainer: {
    backgroundColor: 'white'
  },
  overview: {
    marginVertical: 10,
    marginHorizontal: 20
  },
  overviewDivider: {
    marginVertical: 5
  }
});

export default ProjectOverviewScreen;