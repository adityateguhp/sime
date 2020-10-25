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
        organization_id: ID!
        department_id: ID! 	
        email: String!
        token: String! 
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
    },
    type Event {
        id: ID!
        name: String!
        description: String
        cancel: Boolean!
        location: String
        start_date: String!
        end_date: String!
        project_id: ID!
        picture: String
        createdAt: String!
    },
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
    
    type Committee {
        id: ID!
        staff_id: ID!
        position_id: ID!
        division_id: ID!
        project_id: ID!
        createdAt: String!
    }

    type External {
        id: ID!
        name: String!
        external_type: ID!
        event_id: ID!
        email: String!
        phone_number: String!
        details: String
        picture: String
        createdAt: String!
    }

    type ExternalType {
        id: ID!
        name: String!
    }

    type Roadmap {
        id: ID!
        name: String!
        event_id: ID!
        start_date: String!
        end_date: String!
        createdAt: String!
    }

    type Rundown {
        id: ID!
        agenda: String!
        event_id: ID!
        date: String!
        start_time: String!
        end_time: String!
        details: String
        createdAt: String!
    }

    type Task {
        id: ID!
        name: String!
        description: String
        completed: Boolean!
        due_date: String
        priority: String
        roadmap_id: ID!
        createdAt: String!
        createdBy: String!
    }

    type Query {
        getOrganization(organizationId: ID!): Organization
        getDepartments(organizationId: ID!): [Department]
        getDepartment(departmentId: ID!): Department
        getStaffs(organizationId: ID!): [Staff]
        getStaffsByDepartment(departmentId: ID!): [Staff]
        getStaff(staffId: ID!): Staff
        getProjects(organizationId: ID!): [Project]
        getProject(projectId: ID!): Project
        getPositions: [Position]
        getPosition(positionId: ID!): Position
        getDivisions(projectId: ID!): [Division]
        getDivision(divisionId: ID!): Division
        getCommittees(projectId: ID!): [Committee]
        getCommitteesByStaff(staffId: ID!): [Committee]
        getCommittee(committeeId: ID!): Committee 
        getHeadProject(projectId: ID!, positionId: ID!): Committee
        getCommitteesInDivision(divisionId: ID!): [Committee] 
        getEvents(projectId: ID!): [Event]
        getEvent(eventId: ID!): Event  
        getExternals(eventId: ID!): [External]
        getExternal(externalId: ID!): External 
        getExternalByType(eventId: ID!, externalType: ID!): [External] 
        getExternalTypes: [ExternalType]
        getExternalType(exTypeId: ID!): ExternalType
        getRoadmaps(eventId: ID!): [Roadmap]
        getRoadmap(roadmapId: ID!): Roadmap  
        getRundowns(eventId: ID!): [Rundown]
        getRundown(rundownId: ID!): Rundown 
        getTasks(roadmapId: ID!): [Task]
        getTask(taskId: ID!): Task
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

        updateOrganization(
            organizationId: ID!
            name: String!
            email: String!
            description: String
            picture: String): Organization!

        updatePasswordOrganization( 
            organizationId: ID!,
            currentPassword: String!,
            newPassword: String!,
            confirmNewPassword: String!
        ): Organization!
        
        addDepartment(name: String!, organizationId: ID!): Department!
        
        updateDepartment(departmentId: ID!, name: String!): Department!
        
        deleteDepartment(departmentId: ID!, organizationId: ID!): String!
        
        loginStaff(email: String!, password: String!): Staff!

        addStaff(
            name: String!,
            position_name: String!,
            department_id: ID!, 	
            email: String!,
            phone_number: String!,
            password: String!,
            picture: String,
            organizationId: ID!
        ): Staff!
        
        updateStaff( 
            staffId: ID!,
            name: String!,
            position_name: String!,	
            department_id: ID!, 
            email: String!,
            phone_number: String!,
            picture: String
        ): Staff!
        
        updatePasswordStaff( 
            staffId: ID!,
            currentPassword: String!,
            newPassword: String!,
            confirmNewPassword: String!
        ): Staff!
        
        deleteStaff(staffId: ID!): String!

        addProject(
            name: String!,
            description: String,
            cancel: Boolean!,
            start_date: String!,
            end_date: String!,
            picture: String,
            organizationId: ID!
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

        addEvent(
            name: String!,
            description: String,
            cancel: Boolean!,
            location: String,
            start_date: String!,
            end_date: String!,
            project_id: ID!
            picture: String
        ): Event!

        updateEvent(
            eventId: ID!,
            name: String!,
            description: String,
            cancel: Boolean!,
            location: String,
            start_date: String!,
            end_date: String!,
            picture: String
        ): Event!

        deleteEvent(eventId: ID!): String!

        cancelEvent(
            eventId: ID!,
            cancel: Boolean!
        ): Event!

        addPosition(name: String!, core: Boolean!): Position!
        
        updatePosition(positionId: ID!, name: String!, core: Boolean!): Position!
        
        deletePosition(positionId: ID!): String!

        addDivision(name: String!, projectId:ID!): Division!
        
        updateDivision(divisionId: ID!, name: String!): Division!
        
        deleteDivision(divisionId: ID!): String!

        addCommittee(staffId: ID!, positionId: ID!, divisionId: ID!, projectId: ID!): Committee!
        
        updateCommittee(committeeId: ID!, staffId: ID!, positionId: ID!, divisionId: ID!): Committee!
        
        deleteCommittee(committeeId: ID!): String!

        addExternalType(name: String!): ExternalType!
        
        updateExternalType(externalTypeId: ID!, name: String!): ExternalType!
        
        deleteExternalType(externalTypeId: ID!): String!

        addExternal(
            name: String!,
            external_type: ID!,
            event_id: ID!,
            email: String!,
            phone_number: String!,
            details: String,
            picture: String
        ): External!

        updateExternal(
            externalId: ID!,
            name: String!,
            email: String!,
            phone_number: String!,
            details: String,
            picture: String
        ): External!

        deleteExternal(externalId: ID!): String!

        addRoadmap(
            name: String!,
            event_id: ID!,
            start_date: String!,
            end_date: String!
        ): Roadmap!

        updateRoadmap(
            roadmapId: ID!,
            name: String!,
            start_date: String!,
            end_date: String!
        ): Roadmap!

        deleteRoadmap(roadmapId: ID!): String!

        addRundown(
            agenda: String!
            event_id: ID!
            date: String!
            start_time: String!
            end_time: String!
            details: String
        ): Rundown!

        updateRundown(
            rundownId: ID!
            agenda: String!
            date: String!
            start_time: String!
            end_time: String!
            details: String
        ): Rundown!

        deleteRundown(rundownId: ID!): String!

        addTask(
            name: String!
            description: String
            completed: Boolean!
            due_date: String
            priority: String
            roadmapId: ID!
            createdBy: String!
        ): Task!

        updateTask(
            taskId: ID!
            name: String!
            description: String
            completed: Boolean!
            due_date: String
            priority: String
        ): Task!

        deleteTask(taskId: ID!): String!

        completedTask(taskId: ID!, completed: Boolean!): Task!
    }
`;