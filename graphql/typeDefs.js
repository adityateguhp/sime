const { gql } = require('apollo-server');

module.exports = gql`
    type Organization {
        id: ID
        name: String
        email: String	
        description: String
        picture: String
        address: String
        phone_number: String
        createdAt: String
    }
    type Department {
        id: ID
        name: String
        organization_id: ID
        createdAt: String
    }
    type Staff {
        id: ID!
        name: String!
        department_position_id: ID
        organization_id: ID
        department_id: ID 	
        email: String!
        token: String! 
        phone_number: String
        password: String!
        picture: String
        isAdmin: Boolean!
        createdAt: String!
    }
    type Project {
        id: ID!
        name: String!
        description: String
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
        organization_id: ID!
        createdAt: String!
        order: String!
    }

    type Committee {
        id: ID!
        name: String!
        core: Boolean!
        organization_id: ID!
        createdAt: String!
    }
    
    type Person_in_charge {
        id: ID!
        staff_id: ID!
        position_id: ID!
        committee_id: ID!
        project_id: ID!
        organization_id: ID!
        order: String!
        createdAt: String!
    }

    type External {
        id: ID!
        name: String!
        external_type: ID!
        event_id: ID!
        project_id: ID!
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
        project_id: ID!
        committee_id: ID!
        start_date: String!
        end_date: String!
        createdAt: String!
    }

    type Rundown {
        id: ID!
        agenda: String!
        event_id: ID!
        project_id: ID!
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
        completed_date: String
        priority: String
        roadmap_id: ID!
        project_id: ID!
        event_id: ID!
        createdAt: String!
        createdBy: ID!
    }

    type Task_assigned_to {
        id: ID!
        task_id: ID!
        staff_id: ID!
        person_in_charge_id: ID!
        project_id: ID!
        event_id: ID!
        roadmap_id: ID!
        createdAt: String!
    }

    type Department_position {
        id: ID
        name: String
        organization_id: ID
        createdAt: String
    }

    type Query {
        getOrganization(organizationId: ID!): Organization
        
        getDepartments(organizationId: ID!): [Department]
        getDepartment(departmentId: ID): Department
        
        getStaffs(organizationId: ID!): [Staff]
        getStaffsByDepartment(departmentId: ID): [Staff]
        getStaff(staffId: ID!): Staff
        
        getProjects(organizationId: ID!): [Project]
        getProject(projectId: ID!): Project
        
        getPositions(organizationId: ID!): [Position]
        getPosition(positionId: ID!): Position
        
        getCommittees(organizationId: ID!): [Committee]
        getCommittee(committeeId: ID!): Committee
        
        getPersonInCharges(projectId: ID!): [Person_in_charge]
        getPersonInChargesByStaff(staffId: ID!): [Person_in_charge]
        getPersonInChargesByOrganization(organizationId: ID!): [Person_in_charge]
        getPersonInChargesByStaffProject(staffId: ID!, projectId: ID!): Person_in_charge
        getPersonInCharge(personInChargeId: ID!): Person_in_charge 
        getHeadProject(projectId: ID!, order: String!): Person_in_charge
        getPersonInChargesInCommittee(committeeId: ID!): [Person_in_charge] 
        
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
        getTasksCreatedBy(createdBy: ID!): [Task]
        getTask(taskId: ID!): Task
        
        getAssignedTasks(roadmapId: ID!): [Task_assigned_to]
        getAssignedTask(assignedId: ID!): Task_assigned_to
        getAssignedTasksByPersonInCharge(personInChargeId: ID!): [Task_assigned_to]
        getAssignedTasksByStaff(staffId: ID!): [Task_assigned_to]
        
        getDepartmentPositions(organizationId: ID): [Department_position]
        getDepartmentPosition(departmentPositionId: ID): Department_position
    }
    type Mutation {
       addOrganization(
            name: String
            email: String
            description: String
            picture: String
            address: String
            phone_number: String): Organization!

        updateOrganization(
            organizationId: ID!
            name: String!
            email: String!
            description: String
            picture: String
            address: String
            phone_number: String): Organization!
        
        addDepartment(name: String!, organizationId: ID!): Department!
        
        updateDepartment(departmentId: ID!, name: String!): Department!
        
        deleteDepartment(departmentId: ID!, organizationId: ID!): String!
        
        loginStaff(email: String!, password: String!): Staff!

        registerStaff(
            name: String!,
            email: String!,
            password: String!,
            confirmPassword: String!
        ): Staff!

        addOrganizationStaff(
            staffId: ID!,
            organizationId: ID!
        ): Staff!

        addStaff(
            name: String!,
            department_position_id: ID,
            department_id: ID, 	
            email: String!,
            phone_number: String,
            password: String!,
            picture: String,
            organizationId: ID!,
            isAdmin: Boolean!
        ): Staff!
        
        updateStaff( 
            staffId: ID!,
            name: String!,
            department_position_id: ID,	
            department_id: ID, 
            email: String!,
            phone_number: String,
            picture: String,
            isAdmin: Boolean!
        ): Staff!
        
        updatePasswordStaff( 
            staffId: ID!,
            currentPassword: String!,
            newPassword: String!,
            confirmNewPassword: String!
        ): Staff!

        resetPasswordStaff( 
            staffId: ID!
        ): Staff!
        
        deleteStaff(staffId: ID!): String!

        deleteStaffByDepartment(departmentId: ID!): String!

        addProject(
            name: String!,
            description: String,
            start_date: String!,
            end_date: String!,
            picture: String,
            organizationId: ID!
        ): Project!

        updateProject(
            projectId: ID!,
            name: String!,
            description: String,
            start_date: String!,
            end_date: String!,
            picture: String
        ): Project!

        deleteProject(projectId: ID!): String!

        addEvent(
            name: String!,
            description: String,
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
            location: String,
            start_date: String!,
            end_date: String!,
            picture: String
        ): Event!

        deleteEvent(eventId: ID!): String!

        addPosition(name: String!, core: Boolean!, organizationId: ID!, order: String!): Position!
        
        updatePosition(positionId: ID!, name: String!, core: Boolean!): Position!
        
        deletePosition(positionId: ID!): String!

        addCommittee(name: String!, core: Boolean!, organizationId:ID!): Committee!
        
        updateCommittee(committeeId: ID!, name: String!): Committee!
        
        deleteCommittee(committeeId: ID!): String!

        addPersonInCharge(staffId: ID!, positionId: ID!, committeeId: ID!, projectId: ID!, organizationId: ID!, order: String!): Person_in_charge!
        
        updatePersonInCharge(personInChargeId: ID!, staffId: ID!, positionId: ID!, committeeId: ID!, order: String!): Person_in_charge!
        
        deletePersonInCharge(personInChargeId: ID!): String!

        deletePersonInChargeByCommittee(committeeId: ID!): String!

        deletePersonInChargeByStaff(staffId: ID!): String!

        addExternalType(name: String!): ExternalType!
        
        updateExternalType(externalTypeId: ID!, name: String!): ExternalType!
        
        deleteExternalType(externalTypeId: ID!): String!

        addExternal(
            name: String!,
            external_type: ID!,
            event_id: ID!,
            project_id: ID!,
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
            project_id: ID!,
            committee_id: ID!,
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
            project_id: ID!
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
            completed_date: String
            priority: String
            roadmapId: ID!
            projectId: ID!
            eventId: ID!
            createdBy: ID!
        ): Task!

        updateTask(
            taskId: ID!
            name: String!
            description: String
            completed: Boolean!
            due_date: String
            completed_date: String
            priority: String
        ): Task!

        deleteTask(taskId: ID!): String!

        completedTask(taskId: ID!, completed: Boolean!, completed_date: String): Task!

        assignedTask(
            taskId: ID!
            staffId: ID!
            personInChargeId: ID!
            projectId: ID!
            eventId: ID!
            roadmapId: ID!
        ): Task_assigned_to!

        deleteAssignedTask(
            assignedId: ID!
        ): String!

        deleteAssignedTaskByPersonInCharge(
            personInChargeId: ID!
        ): [Task_assigned_to]

        deleteAssignedTaskByTask(
            taskId: ID!
        ): String!

        addDepartmentPosition(
            name: String!
            organizationId: ID!
        ):Department_position!

        updateDepartmentPosition(
            departmentPositionId: ID!
            name: String!
        ):Department_position!

        deleteDepartmentPosition(
            departmentPositionId: ID!
        ):String!

    }
`;