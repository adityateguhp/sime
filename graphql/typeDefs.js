const { gql } = require('apollo-server');

module.exports = gql`
    type Department{
        id: ID!,
        department_name: String!,
        organization_id: String!,
        createdAt: String!
    }
    type Organization {
        id: ID!
        organization_name: String!	
        description: String!
        email: String!
        token: String!
        password: String!
        picture: String!
        createdAt: String!
    }
    input RegisterOrganizationInput {
        organization_name: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    type Query{
        getDepartments: [Department]
    }
    type Mutation{
        registerOrganization(registerOrganizationInput: RegisterOrganizationInput): Organization!
        loginOrganization(email: String!, password: String!): Organization!
        addDepartment(department_name: String!): Department!
        deleteDepartment(departmentId: ID!): String!
    }
`;