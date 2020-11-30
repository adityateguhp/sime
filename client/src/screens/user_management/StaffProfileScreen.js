import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_DEPARTMENT_QUERY, FETCH_STAFF_QUERY, FETCH_DEPARTMENT_POSITION_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';
import { theme } from '../../constants/Theme';

const StaffProfileScreen = ({ route, navigation }) => {

    const [staffVal, setStaffVal] = useState(null);
    const [departmenName, setDepartmentName] = useState('');
    const [positionName, setPositionName] = useState('');

    const sId = route.params?.staffId;
    const dId = route.params?.departmentId;
    const pId = route.params?.positionId;

    const { data: staff, error: error1, loading: loading1, refetch: refetchStaff } = useQuery(
        FETCH_STAFF_QUERY, {
        variables: {
            staffId: sId
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            setStaffVal(staff.getStaff)
        }
    });

    const { data: department, error: error2, loading: loading2, refetch: refetchDepartment } = useQuery(
        FETCH_DEPARTMENT_QUERY, {
        variables: {
            departmentId: dId
        },
        onCompleted: () => {
          if(department.getDepartment){
              setDepartmentName(department.getDepartment.name)
          }else{
            setDepartmentName('')
          }
        },
        notifyOnNetworkStatusChange: true,
    });

    const { data: position, error: error4, loading: loading4, refetch: refetchPosition } = useQuery(
        FETCH_DEPARTMENT_POSITION_QUERY, {
        variables: {
            departmentPositionId: pId
        },
        onCompleted: () => {
          if(position.getDepartmentPosition){
              setPositionName(position.getDepartmentPosition.name)
          }else{
              setPositionName('')
          }
        },
        notifyOnNetworkStatusChange: true,
    });

    // const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    // const closeModalFormEdit = () => {
    //     setVisibleFormEdit(false);
    // }

    // const openFormEdit = () => {
    //     setVisibleFormEdit(true);
    // }

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //                 <Item
    //                     iconName="pencil"
    //                     onPress={openFormEdit}
    //                 />
    //             </HeaderButtons>
    //         ),
    //     });
    // }, [navigation]);

    const onRefresh = () => {
        refetchStaff();
        refetchDepartment();
        refetchPosition();
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

    if (error2) {
        console.error(error2);
        return <Text>Error 2</Text>;
    }

    if (error4) {
        console.error(error4);
        return <Text>Error 4</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (loading2) {
        return <CenterSpinner />;
    }

    if (loading4) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView 
            style={styles.screen}
            refreshControl={
                <RefreshControl
                    refreshing={loading1 && loading2 && loading4}
                    onRefresh={onRefresh} />
            }
            >
                <View style={styles.profilePicture}>
                    <Avatar.Image style={{ marginBottom: 10 }} size={150} source={staff.getStaff.picture ? { uri: staff.getStaff.picture } : require('../../assets/avatar.png')} />
                    <Headline style={{marginHorizontal: 15}} numberOfLines={1} ellipsizeMode='tail'>{staff.getStaff.name}</Headline>
                </View>
                <Divider />
                <View style={styles.profileDetails}>
                    <Title style={styles.titleInfo}>
                        Department
                </Title>
                    <Paragraph numberOfLines={1} ellipsizeMode='tail'>
                        {departmenName}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Position
                </Title>
                    <Paragraph>
                        {positionName}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Email Address
                </Title>
                    <Paragraph>
                        {staff.getStaff.email}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Phone Number
                </Title>
                    <Paragraph> 
                        {staff.getStaff.phone_number}
                    </Paragraph>
                </View>
                <Divider style={{ marginBottom: 20 }} />
            </ScrollView>
            {/* <FormEditStaff
                closeModalForm={closeModalFormEdit}
                visibleForm={visibleFormEdit}
                staff={staffVal}
                deleteButtonVisible={false}
                closeButton={closeModalFormEdit}
            /> */}
        </Provider>
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