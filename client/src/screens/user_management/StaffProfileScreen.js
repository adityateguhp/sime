import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, Avatar, Headline, Divider, Provider } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_DEPARTMENT_QUERY, FETCH_STAFF_QUERY } from '../../util/graphql';
import CenterSpinner from '../../components/common/CenterSpinner';
import { theme } from '../../constants/Theme';

const StaffProfileScreen = ({ route }) => {

    const sId = route.params?.staffId;
    const dId = route.params?.departmentId;

    const { data: staff, error: error1, loading: loading1 } = useQuery(
        FETCH_STAFF_QUERY, {
        variables: {
            staffId: sId
        }
    });

    const { data: department, error: error2, loading: loading2 } = useQuery(
        FETCH_DEPARTMENT_QUERY, {
        variables: {
            departmentId: dId
        },
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

    if (error1) {
        console.error(error1);
        return <Text>Error 1</Text>;
    }

    if (error2) {
        console.error(error1);
        return <Text>Error 2</Text>;
    }

    if (loading1) {
        return <CenterSpinner />;
    }

    if (loading2) {
        return <CenterSpinner />;
    }

    return (
        <Provider theme={theme}>
            <ScrollView style={styles.screen}>
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
                        {department.getDepartment.name}
                    </Paragraph>
                    <Divider />
                    <Title style={styles.titleInfo}>
                        Position
                </Title>
                    <Paragraph>
                        {staff.getStaff.position_name}
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