import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider } from 'react-native-paper';

import { STAFFS, DEPARTMENTS } from '../../data/dummy-data';

const StaffProfileScreen = ({route}) => {

    const sId = route.params?.staffId;

    const selectedStaff = STAFFS.find(staff => staff._id.indexOf(sId) >= 0);
    
    const staffDepatment = DEPARTMENTS.find(depart => depart._id.indexOf(selectedStaff.department_id)>=0);

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.profilePicture}>
                <Avatar.Image style={{ marginBottom: 10 }} size={150} source={{ uri: selectedStaff.picture }} />
                <Headline>{selectedStaff.staff_name}</Headline>
            </View>
            <Divider />
            <View style={styles.profileDetails}>
                <Title style={styles.titleInfo}>
                    Department
                </Title>
                <Paragraph>
                    {staffDepatment.department_name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Position
                </Title>
                <Paragraph>
                    {selectedStaff.position_name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    E-mail Address
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
            <Divider style={{marginBottom: 20}} />
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

export default StaffProfileScreen;