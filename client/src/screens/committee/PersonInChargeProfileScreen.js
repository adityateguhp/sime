import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import CenterSpinner from '../../components/common/CenterSpinner';
import {
    FETCH_PIC_QUERY,
    FETCH_STAFF_QUERY,
    FETCH_DEPARTMENT_QUERY,
    FETCH_POSITION_QUERY,
    FETCH_COMMITTEE_QUERY
} from '../../util/graphql';

const PersonInChargeProfileScreen = ({ route }) => {

    const [personInCharge, setPersonInCharge] = useState({
        staff_id: '',
        position_id: '',
        committee_id: ''
    });

    const [staff, setStaff] = useState({
        name: '',
        email: '',
        phone_number: '',
        picture: '',
        position_name: '',
        department_id: ''
    });

    const [position, setPosition] = useState({
        name: ''
    });

    const [committee, setCommittee] = useState({
        name: ''
    });

    const [department, setDepartment] = useState({
        name: ''
    });

    const picId = route.params?.personInChargeId;

    const { data: personInChargeData, error: error1, loading: loading1 } = useQuery(
        FETCH_PIC_QUERY, {
        variables: {
            personInChargeId: picId
        },
        onCompleted: () => {
            setPersonInCharge({
                position_id: personInChargeData.getPersonInCharge.position_id,
                committee_id: personInChargeData.getPersonInCharge.committee_id,
                staff_id: personInChargeData.getPersonInCharge.staff_id
            })
            loadStaffData();
            loadPositionData();
            loaCommitteeData();
        }
    });


    const [loadStaffData, { called: called1, data: staffData, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_STAFF_QUERY, {
        variables: {
            staffId: personInCharge.staff_id
        },
        onCompleted: () => {
            setStaff({
                name: staffData.getStaff.name,
                email: staffData.getStaff.email,
                phone_number: staffData.getStaff.phone_number,
                picture: staffData.getStaff.picture,
                department_id: staffData.getStaff.department_id,
                position_name: staffData.getStaff.position_name
            })
            loadDepartmentData();
        }
    });

    const [loadDepartmentData, { called: called2, data: departmentData, error: error3, loading: loading3 }] = useLazyQuery(
        FETCH_DEPARTMENT_QUERY, {
        variables: {
            departmentId: staff.department_id
        },
        onCompleted: () => {
            setDepartment({
                name: departmentData.getDepartment.name
            })
        }
    });

    const [loadPositionData, { called: called3, data: positionData, error: error4, loading: loading4 }] = useLazyQuery(
        FETCH_POSITION_QUERY, {
        variables: {
            positionId: personInCharge.position_id
        },
        onCompleted: () => {
            setPosition({
                name: positionData.getPosition.name
            })
        }
    });

    const [loaCommitteeData, { called: called4, data: committeeData, error: error5, loading: loading5 }] = useLazyQuery(
        FETCH_COMMITTEE_QUERY, {
        variables: {
            committeeId: personInCharge.committee_id
        },
        onCompleted: () => {
            setCommittee({
                name: committeeData.getCommittee.name
            })
        }
    });

    if (error1) {
        console.error(error1);
        return <Text>Error 1</Text>;
    }

    if (called1 && error2) {
        console.error(error2);
        return <Text>Error 2</Text>;
    }

    if (called2 && error3) {
        console.error(error3);
        return <Text>Error 3</Text>;
    }

    if (called3 && error4) {
        console.error(error4);
        return <Text>Error 4</Text>;
    }

    if (called4 && error5) {
        console.error(error4);
        return <Text>Error 4</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (loading2) {
        return <CenterSpinner />;
    }

    if (loading3) {
        return <CenterSpinner />;
    }

    if (loading4) {
        return <CenterSpinner />;
    }

    if (loading5) {
        return <CenterSpinner />;
    }

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.profilePicture}>
                <Avatar.Image style={{ marginBottom: 10 }} size={150} source={staff.picture ? { uri: staff.picture } : require('../../assets/avatar.png')} />
                <Headline style={{marginHorizontal: 15}} numberOfLines={1} ellipsizeMode='tail'>{staff.name}</Headline>
            </View>
            <Divider />
            <View style={styles.profileDetails}>
                <Title style={styles.titleInfo} numberOfLines={1} ellipsizeMode='tail'>
                    Position in {committee.name}
                </Title>
                <Paragraph>
                    {position.name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Department
                </Title>
                <Paragraph numberOfLines={1} ellipsizeMode='tail'>
                    {department.name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo} numberOfLines={1} ellipsizeMode='tail'>
                    Position in {department.name}
                </Title>
                <Paragraph>
                    {staff.position_name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Email Address
                </Title>
                <Paragraph>
                    {staff.email}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Phone Number
                </Title>
                <Paragraph>
                    {staff.phone_number}
                </Paragraph>
            </View>
            <Divider style={{ marginBottom: 20 }} />
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

export default PersonInChargeProfileScreen;