const { gql } = require('apollo-server');

module.exports = gql`
    type Organization {
        id: ID!
        organization_name: String!	
        description: String
        email: String!
        token: String!
        password: String!
        picture: String
        createdAt: String!
    }
    type Department {
        id: ID!
        department_name: String!
        organization_id: String!
        createdAt: String!
    }
    type Staff {
        id: ID!
        staff_name: String!
        position_name: String!
        department_id: String! 	
        email: String!
        phone_number: String!
        password: String!
        picture: String
        createdAt: String!
    }
    input RegisterOrganizationInput {
        organization_name: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    type Query {
        getDepartments: [Department]
        getDepartment(departmentId: ID!): Department
        getStaffs(departmentId: ID!): [Staff]
        getStaff(staffId: ID!): Staff
    }
    type Mutation {
        registerOrganization(registerOrganizationInput: RegisterOrganizationInput): Organization!
        loginOrganization(email: String!, password: String!): Organization!
        addDepartment(department_name: String!): Department!
        updateDepartment(departmentId: ID!, department_name: String!): Department!
        deleteDepartment(departmentId: ID!): String!
        addStaff(
            staff_name: String!,
            position_name: String!,
            department_id: ID!, 	
            email: String!,
            phone_number: String!,
            password: String!,
            picture: String
        ): Staff!
        updateStaff( 
            staffId: ID!,
            staff_name: String!,
            position_name: String!,	
            email: String!,
            phone_number: String!,
            password: String!,
            confirmPassword: String!,
            picture: String
        ): Staff!
        deleteStaff(staffId: ID!): String!
    }
`;