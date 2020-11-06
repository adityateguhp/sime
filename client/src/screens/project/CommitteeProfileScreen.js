import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import CenterSpinner from '../../components/common/CenterSpinner';
import { 
    FETCH_COMMITTEE_QUERY, 
    FETCH_STAFF_QUERY, 
    FETCH_DEPARTMENT_QUERY, 
    FETCH_POSITION_QUERY, 
    FETCH_DIVISION_QUERY 
} from '../../util/graphql';

const CommitteeProfileScreen = ({ route }) => {

    const [committee, setCommittee] = useState({
        staff_id: '',
        position_id: '',
        division_id: ''
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

    const [division, setDivision] = useState({
        name: ''
    });

    const [department, setDepartment] = useState({
        name: ''
    });

    const cId = route.params?.committeeId;

    const { data: committeeData, error: error1, loading: loading1 } = useQuery(
        FETCH_COMMITTEE_QUERY, {
        variables: {
            committeeId: cId
        },
        onCompleted: () => {
            setCommittee({
                position_id: committeeData.getCommittee.position_id,
                division_id: committeeData.getCommittee.division_id,
                staff_id: committeeData.getCommittee.staff_id
            })
            loadStaffData();
            loadPositionData();
            loaDivisionData();
        }
    });


    const [loadStaffData, { called: called1, data: staffData, error: error2, loading: loading2 }] = useLazyQuery(
        FETCH_STAFF_QUERY, {
        variables: {
            staffId: committee.staff_id
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
            positionId: committee.position_id
        },
        onCompleted: () => {
            setPosition({
                name: positionData.getPosition.name
            })
        }
    });

    const [loaDivisionData, { called: called4, data: divisionData, error: error5, loading: loading5 }] = useLazyQuery(
        FETCH_DIVISION_QUERY, {
        variables: {
            divisionId: committee.division_id
        },
        onCompleted: () => {
            setDivision({
                name: divisionData.getDivision.name
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
                <Avatar.Image style={{ marginBottom: 10 }} size={150} source={staff.picture === null || staff.picture === '' ? require('../../assets/avatar.png') : { uri: staff.picture }} />
                <Headline>{staff.name}</Headline>
            </View>
            <Divider />
            <View style={styles.profileDetails}>
                <Title style={styles.titleInfo}>
                    Position in {division.name}
                </Title>
                <Paragraph>
                    {position.name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
                    Department
                </Title>
                <Paragraph>
                    {department.name}
                </Paragraph>
                <Divider />
                <Title style={styles.titleInfo}>
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

export default CommitteeProfileScreen;