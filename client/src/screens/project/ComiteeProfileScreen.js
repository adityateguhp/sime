import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider } from 'react-native-paper';

import { STAFFS, DEPARTMENTS, COMITEES, POSITIONS, DIVISIONS } from '../../data/dummy-data';

const ComiteeProfileScreen = ({ route }) => {

    const cId = route.params?.comiteeId;

    const selectedComitee = COMITEES.find(comitee => comitee._id.indexOf(cId) >= 0);

    const selectedStaff = STAFFS.find(staff => staff._id.indexOf(selectedComitee.staff_id) >= 0);

    const staffDepatment = DEPARTMENTS.find(depart => depart._id.indexOf(selectedStaff.department_id) >= 0);

    const comiteePosition = POSITIONS.find(pos => pos._id.indexOf(selectedComitee.position_id)>=0);

    const comiteeDivision = DIVISIONS.find(div => div._id.indexOf(selectedComitee.division_id)>=0 && div.project_id.indexOf(selectedComitee.project_id)>=0 )

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.profilePicture}>
                <Avatar.Image style={{ marginBottom: 10 }} size={150} source={{ uri: selectedStaff.picture }} />
                <Headline>{selectedStaff.staff_name}</Headline>
            </View>
            <Divider />
            <View style={styles.profileDetails}>
                <Title style={styles.titleInfo}>
                    Position in {comiteeDivision.division_name}
                </Title>
                <Paragraph>
                    {comiteePosition.position_name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Department
                </Title>
                <Paragraph>
                    {staffDepatment.department_name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Position in {staffDepatment.department_name}
                </Title>
                <Paragraph>
                    {selectedStaff.position_name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Email Address
                </Title>
                <Paragraph>
                    {selectedStaff.email}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Phone Number
                </Title>
                <Paragraph>
                    {selectedStaff.phone_number}
                </Paragraph>
            </View>
            <Divider style={{marginBottom: 20}}  />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
    },
    profilePicture: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    profileDetails: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    titleInfo: {
        fontSize: 16,
        marginTop: 20
    }
});

export default ComiteeProfileScreen;