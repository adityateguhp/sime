const { gql } = require('apollo-server');

module.exports = gql`
    type Organization {
        id: ID!
        name: String!	
        description: String
        email: String!
        token: String!
        password: String!
        picture: String
        createdAt: String!
    }
    type Department {
        id: ID!
        name: String!
        organization_id: ID!
        createdAt: String!
    }
    type Staff {
        id: ID!
        name: String!
        position_name: String!
        department_id: ID! 	
        email: String!
        phone_number: String!
        password: String!
        picture: String
        createdAt: String!
    }
    type Project {
        id: ID!
        name: String!
        description: String
        cancel: Boolean!
        start_date: String!
        end_date: String!
        organization_id: ID!
        picture: String
        createdAt: String!
    }
    type Position {
        id: ID!
        name: String!
        core: Boolean!
        createdAt: String!
    }

    type Division {
        id: ID!
        name: String!
        project_id: ID!
        createdAt: String!
    }
    
    type Comitee {
        id: ID!
        staff_id: ID!
        position_id: ID!
        division_id: ID!
        project_id: ID!
        createdAt: String!
    }

    type Query {
        getUserOrganization: Organization
        getDepartments: [Department]
        getDepartment(departmentId: ID!): Department
        getStaffs(departmentId: ID!): [Staff]
        getStaff(staffId: ID): Staff
        getProjects: [Project]
        getProject(projectId: ID!): Project
        getPositions: [Position]
        getPosition(positionId: ID): Position
        getDivisions(projectId: ID!): [Division]
        getDivision(divisionId: ID!): Division
        getComitees(projectId: ID!): [Comitee]
        getComitee(comiteeId: ID!): Comitee 
        getHeadProject(projectId: ID!, positionId: ID!): Comitee  
    }
    type Mutation {
        registerOrganization(
            name: String!
            email: String!
            password: String!
            confirmPassword: String!
            description: String
            picture: String): Organization!
        
        loginOrganization(email: String!, password: String!): Organization!
        
        addDepartment(name: String!): Department!
        
        updateDepartment(departmentId: ID!, name: String!): Department!
        
        deleteDepartment(departmentId: ID!): String!
        
        addStaff(
            name: String!,
            position_name: String!,
            department_id: ID!, 	
            email: String!,
            phone_number: String!,
            password: String!,
            picture: String
        ): Staff!
        
        updateStaff( 
            staffId: ID!,
            name: String!,
            position_name: String!,	
            email: String!,
            phone_number: String!,
            picture: String
        ): Staff!
        
        updatePasswordStaff( 
            staffId: ID!,
            password: String!,
            confirmPassword: String!
        ): Staff!
        
        deleteStaff(staffId: ID!): String!

        addProject(
            name: String!,
            description: String,
            cancel: Boolean!,
            start_date: String!,
            end_date: String!,
            picture: String,
        ): Project!

        updateProject(
            projectId: ID!,
            name: String!,
            description: String,
            cancel: Boolean!,
            start_date: String!,
            end_date: String!,
            picture: String
        ): Project!

        deleteProject(projectId: ID!): String!

        cancelProject(
            projectId: ID!,
            cancel: Boolean!
        ): Project!

        addPosition(name: String!, core: Boolean!): Position!
        
        updatePosition(positionId: ID!, name: String!, core: Boolean!): Position!
        
        deletePosition(positionId: ID!): String!

        addDivision(name: String!, projectId: String!): Division!
        
        updateDivision(divisionId: ID!, name: String!): Division!
        
        deleteDivision(divisionId: ID!): String!

        addComitee(staffId: ID!, positionId: ID!, divisionId: ID!, projectId: ID!): Comitee!
        
        updateComitee(comiteeId: ID!, staffId: ID!, positionId: ID!, divisionId: ID!): Comitee!
        
        deleteComitee(comiteeId: ID!): String!
    }
`;