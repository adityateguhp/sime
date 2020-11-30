import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider } from 'react-native-paper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import CenterSpinner from '../../components/common/CenterSpinner';
import {
    FETCH_PIC_QUERY,
    FETCH_STAFF_QUERY,
    FETCH_DEPARTMENT_QUERY,
    FETCH_DEPARTMENT_POSITION_QUERY,
    FETCH_POSITION_QUERY,
    FETCH_COMMITTEE_QUERY
} from '../../util/graphql';

const PersonInChargeProfileScreen = ({ route, navigation }) => {

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
        department_position_id: '',
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

    const [departmentPosition, setDepartmentPosition] = useState({
        name: ''
    });

    const picId = route.params?.personInChargeId;

    const { data: personInChargeData, error: error1, loading: loading1, refetch } = useQuery(
        FETCH_PIC_QUERY, {
        variables: {
            personInChargeId: picId
        },
        notifyOnNetworkStatusChange: true,
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
        }
    });

    const [loadDepartmentData, { called: called2, data: departmentData, error: error3, loading: loading3 }] = useLazyQuery(
        FETCH_DEPARTMENT_QUERY, {
        variables: {
            departmentId: staff.department_id
        }
    });

    const [loadDepartmentPositionData, { called: called5, data: departmentPositionData, error: error6, loading: loading6 }] = useLazyQuery(
        FETCH_DEPARTMENT_POSITION_QUERY, {
        variables: {
            departmentPositionId: staff.department_position_id
        }
    });

    const [loadPositionData, { called: called3, data: positionData, error: error4, loading: loading4 }] = useLazyQuery(
        FETCH_POSITION_QUERY, {
        variables: {
            positionId: personInCharge.position_id
        }
    });

    const [loaCommitteeData, { called: called4, data: committeeData, error: error5, loading: loading5 }] = useLazyQuery(
        FETCH_COMMITTEE_QUERY, {
        variables: {
            committeeId: personInCharge.committee_id
        }
    });

    useEffect(() => {
        if (staffData) {
            setStaff({
                name: staffData.getStaff.name,
                email: staffData.getStaff.email,
                phone_number: staffData.getStaff.phone_number,
                picture: staffData.getStaff.picture,
                department_id: staffData.getStaff.department_id,
                department_position_id: staffData.getStaff.department_position_id
            })
            loadDepartmentData();
            loadDepartmentPositionData();
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [staffData])


    useEffect(() => {
        if (departmentData) {
            if (departmentData.getDepartment) {
                setDepartment({
                    name: departmentData.getDepartment.name
                })
            } else {
                setDepartment({
                    name: ''
                })
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [departmentData])


    useEffect(() => {
        if (departmentPositionData) {
            if (departmentPositionData.getDepartmentPosition) {
                setDepartmentPosition({
                    name: departmentPositionData.getDepartmentPosition.name
                })
            } else {
                setDepartmentPosition({
                    name: ''
                })
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [departmentPositionData])


    useEffect(() => {
        if (positionData) {
            if (positionData.getPosition) {
                setPosition({
                    name: positionData.getPosition.name
                })
            } else {
                setPosition({
                    name: ''
                })
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [positionData])


    useEffect(() => {
        if (committeeData) {
            if (committeeData.getCommittee) {
                setCommittee({
                    name: committeeData.getCommittee.name
                })
            } else {
                setCommittee({
                    name: ''
                })
            }
        }
        return () => {
            console.log("This will be logged on unmount");
        }
    }, [committeeData])


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
        console.error(error5);
        return <Text>Error 5</Text>;
    }

    if (called5 && error6) {
        console.error(error6);
        return <Text>Error 6</Text>;
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

    if (loading6) {
        return <CenterSpinner />;
    }

    return (
        <ScrollView
            style={styles.screen}
            refreshControl={
                <RefreshControl
                    refreshing={loading1 && loading2 && loading3 && loading4 && loading5 && loading6}
                    onRefresh={onRefresh} />
            }
        >
            <View style={styles.profilePicture}>
                <Avatar.Image style={{ marginBottom: 10 }} size={150} source={staff.picture ? { uri: staff.picture } : require('../../assets/avatar.png')} />
                <Headline style={{ marginHorizontal: 15 }} numberOfLines={1} ellipsizeMode='tail'>{staff.name}</Headline>
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
                    {departmentPosition.name}
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