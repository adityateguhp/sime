import gql from 'graphql-tag';

export const FETCH_ORGANIZATION_QUERY = gql`
   query($organizationId: ID!){
    getOrganization(organizationId: $organizationId){
        id
        name
        description
        email
        picture
        createdAt
  }
}
`;

export const LOGIN_ORGANIZATION = gql`
  mutation loginOrganization($email: String!, $password: String!) {
    loginOrganization(email: $email, password: $password) {
      id
      name
      description
      email
      token
      picture
      createdAt
    }
  }
`;

export const LOGIN_STAFF = gql`
  mutation loginStaff($email: String!, $password: String!) {
    loginStaff(email: $email, password: $password) {
    id
    name
    position_name
    organization_id
    department_id 	
    email
    token
    phone_number
    picture
    createdAt
    }
  }
`;

export const REGISTER_ORGANIZATION = gql`
mutation registerOrganization(
  $name: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
  $description: String
  $picture: String
) {
  registerOrganization(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      description: $description
      picture: $picture
  ) {
      id
      name
      description
      email
      token
      picture
      createdAt
  }
}
`;

export const UPDATE_ORGANIZATION_MUTATION = gql`
mutation updateOrganization(
  $organizationId: ID!
  $name: String!
  $email: String!
  $description: String
  $picture: String
) {
  updateOrganization(
      organizationId: $organizationId
      name: $name
      email: $email
      description: $description
      picture: $picture
  ) {
      id
      name
      description
      email
      picture
      createdAt
  }
}
`;

export const UPDATE_PASSWORD_ORGANIZATION_MUTATION = gql`
  mutation 
  updatePasswordOrganization(
    $organizationId: ID!,
    $currentPassword: String!,
    $newPassword: String!,
    $confirmNewPassword: String!
  ) {
  updatePasswordOrganization(
    organizationId: $organizationId,
    currentPassword: $currentPassword,
    newPassword: $newPassword,
    confirmNewPassword: $confirmNewPassword
  ) {
      id
      name
      description
      email
      picture
      createdAt
  }
  } 
`;


export const FETCH_DEPARTMENTS_QUERY = gql`
   query($organizationId: ID!){
    getDepartments(organizationId: $organizationId){
    id
    name
    organization_id
    createdAt
  }
  }
`;

export const FETCH_DEPARTMENT_QUERY = gql`
   query($departmentId: ID!) {
    getDepartment(departmentId: $departmentId){
    id
    name
    organization_id
    createdAt
  }
  }
`;

export const ADD_DEPARTMENT_MUTATION = gql`
  mutation addDepartment($name: String!, $organizationId: ID!) {
    addDepartment(name: $name, organizationId: $organizationId) {
      id
      name
      organization_id
      createdAt
  }
  } 
`;

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation updateDepartment($departmentId: ID!, $name: String!) {
    updateDepartment(departmentId: $departmentId ,name: $name) {
      id
      name
      organization_id
      createdAt
  }
  } 
`;

export const DELETE_DEPARTMENT = gql`
  mutation deleteDepartment($departmentId: ID!, $organizationId: ID!) {
    deleteDepartment(departmentId: $departmentId, organizationId: $organizationId)
  }
`;

export const FETCH_STAFFS_QUERY = gql`
  query($organizationId: ID!){
    getStaffs(organizationId: $organizationId){
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  }
`;

export const FETCH_STAFFSBYDEPARTMENT_QUERY = gql`
  query($departmentId: ID!) {
    getStaffsByDepartment(departmentId: $departmentId){
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  }
`;

export const FETCH_STAFF_QUERY = gql`
   query($staffId: ID!) {
    getStaff(staffId: $staffId){
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  }
`;

export const ADD_STAFF_MUTATION = gql`
  mutation 
  addStaff(
    $name: String!,
    $position_name: String!,
    $department_id: ID!, 	
    $email: String!,
    $phone_number: String!,
    $password: String!,
    $picture: String,
    $organizationId: ID!
  ) {
  addStaff(
    name: $name,
    position_name: $position_name,
    department_id: $department_id, 	
    email: $email,
    phone_number: $phone_number,
    password: $password,
    picture: $picture,
    organizationId: $organizationId
  ) {
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  } 
`;

export const UPDATE_STAFF_MUTATION = gql`
  mutation 
  updateStaff(
    $staffId: ID!,
    $name: String!,
    $position_name: String!,
    $department_id: ID!, 	
    $email: String!,
    $phone_number: String!,
    $picture: String
  ) {
  updateStaff(
    staffId: $staffId,
    name: $name,
    position_name: $position_name,
    department_id: $department_id, 
    email: $email,
    phone_number: $phone_number,
    picture: $picture
  ) {
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  } 
`;

export const UPDATE_PASSWORD_STAFF_MUTATION = gql`
  mutation 
  updatePasswordStaff(
    $staffId: ID!,
    $currentPassword: String!,
    $newPassword: String!,
    $confirmNewPassword: String!
  ) {
  updatePasswordStaff(
    staffId: $staffId,
    currentPassword: $currentPassword,
    newPassword: $newPassword,
    confirmNewPassword: $confirmNewPassword
  ) {
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  } 
`;

export const RESET_PASSWORD_STAFF_MUTATION = gql`
  mutation 
  resetPasswordStaff(
    $staffId: ID!
  ) {
    resetPasswordStaff(
    staffId: $staffId
  ) {
    id
    name
    position_name
    organization_id
    department_id 	
    email
    phone_number
    picture
    createdAt
  }
  } 
`;

export const DELETE_STAFF = gql`
  mutation deleteStaff($staffId: ID!) {
    deleteStaff(staffId: $staffId)
  }
`;

export const DELETE_STAFF_BYDEPARTMENT = gql`
  mutation deleteStaffByDepartment($departmentId: ID!) {
    deleteStaffByDepartment(departmentId: $departmentId)
  }
`;

export const FETCH_PROJECTS_QUERY = gql`
query($organizationId: ID!){
    getProjects(organizationId: $organizationId){
    id
    name
    description
    cancel
    start_date
    end_date
    picture
    organization_id
    createdAt
  }
  }
`;

export const FETCH_PROJECT_QUERY = gql`
   query($projectId: ID!) {
    getProject(projectId: $projectId){
    id
    name
    description
    cancel
    start_date
    end_date
    picture
    organization_id
    createdAt
  }
  }
`;

export const ADD_PROJECT_MUTATION = gql`
  mutation 
  addProject(
    $name: String!,
    $description: String,
    $cancel: Boolean!,
    $start_date: String!,
    $end_date: String!,
    $picture: String,
    $organizationId: ID!
  ) {
  addProject(
    name: $name,
    description: $description,
    cancel: $cancel, 	
    start_date: $start_date,
    end_date: $end_date,
    picture: $picture,
    organizationId: $organizationId
  ) {
    id
    name
    description
    cancel
    start_date
    end_date
    picture
    organization_id
    createdAt
  }
  } 
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation 
  updateProject(
    $projectId: ID!,
    $name: String!,
    $description: String,
    $cancel: Boolean!,
    $start_date: String!,
    $end_date: String!,
    $picture: String,
  ) {
  updateProject(
    projectId: $projectId,
    name: $name,
    description: $description,
    cancel: $cancel, 	
    start_date: $start_date,
    end_date: $end_date,
    picture: $picture
  ) {
    id
    name
    description
    cancel
    start_date
    end_date
    picture
    organization_id
    createdAt
  }
  } 
`;

export const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

export const CANCEL_PROJECT_MUTATION = gql`
  mutation 
  cancelProject(
    $projectId: ID!,
    $cancel: Boolean!
  ) {
  cancelProject(
    projectId: $projectId,
    cancel: $cancel
  ) {
    id
    name
    description
    cancel
    start_date
    end_date
    picture
    organization_id
    createdAt
  }
  } 
`;

export const FETCH_EVENTS_QUERY = gql`
  query($projectId: ID!) {
    getEvents(projectId: $projectId){
    id
    name
    description
    cancel
    location
    start_date
    end_date
    picture
    project_id
    createdAt
  }
  }
`;

export const FETCH_EVENT_QUERY = gql`
   query($eventId: ID!) {
    getEvent(eventId: $eventId){
    id
    name
    description
    cancel
    location
    start_date
    end_date
    picture
    project_id
    createdAt
  }
  }
`;

export const ADD_EVENT_MUTATION = gql`
  mutation 
  addEvent(
    $name: String!,
    $description: String,
    $cancel: Boolean!,
    $location: String,
    $start_date: String!,
    $end_date: String!,
    $project_id: ID!,
    $picture: String,
  ) {
  addEvent(
    name: $name,
    description: $description,
    cancel: $cancel, 	
    location: $location,
    start_date: $start_date,
    end_date: $end_date,
    project_id: $project_id
    picture: $picture
  ) {
    id
    name
    description
    cancel
    location
    start_date
    end_date
    picture
    project_id
    createdAt
  }
  } 
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation 
  updateEvent(
    $eventId: ID!,
    $name: String!,
    $description: String,
    $cancel: Boolean!,
    $location: String,
    $start_date: String!,
    $end_date: String!,
    $picture: String,
  ) {
  updateEvent(
    eventId: $eventId,
    name: $name,
    description: $description,
    cancel: $cancel, 	
    location: $location,
    start_date: $start_date,
    end_date: $end_date,
    picture: $picture
  ) {
    id
    name
    description
    cancel
    location
    start_date
    end_date
    picture
    project_id
    createdAt
  }
  } 
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId)
  }
`;

export const CANCEL_EVENT_MUTATION = gql`
  mutation 
  cancelEvent(
    $eventId: ID!,
    $cancel: Boolean!
  ) {
  cancelEvent(
    eventId: $eventId,
    cancel: $cancel
  ) {
    id
    name
    description
    cancel,
    location
    start_date
    end_date
    picture
    project_id
    createdAt
  }
  } 
`;

export const FETCH_POSITIONS_QUERY = gql`
  {
    getPositions{
    id
    name
    core
    order
    createdAt
  }
  }
`;

export const FETCH_POSITION_QUERY = gql`
   query($positionId: ID!) {
    getPosition(positionId: $positionId){
    id
    name
    core
    order
    createdAt
  }
  }
`;

export const ADD_POSITION_MUTATION = gql`
  mutation addPosition($name: String!, $core: Boolean!, $order: String!) {
    addPosition(name: $name, core: $core, order: $order) {
    id
    name
    core
    order
    createdAt
  }
  } 
`;

export const UPDATE_POSITION_MUTATION = gql`
  mutation updatePosition($positionId: ID!, $name: String!, $core: Boolean!, $order: String!) {
    updatePosition(positionId: $positionId, name: $name, core: $core, order: $order) {
    id
    name
    core
    order
    createdAt
  }
  } 
`;

export const DELETE_POSITION = gql`
  mutation deletePosition($positionId: ID!) {
    deletePosition(positionId: $positionId)
  }
`;

export const FETCH_DIVISIONS_QUERY = gql`
   query($projectId: ID!){
    getDivisions(projectId: $projectId){
      id
      name
      project_id
      createdAt
  }
  }
`;

export const FETCH_DIVISION_QUERY = gql`
   query($divisionId: ID!) {
    getDivision(divisionId: $divisionId){
      id
      name
      project_id
      createdAt
  }
  }
`;

export const ADD_DIVISION_MUTATION = gql`
  mutation addDivision($name: String!, $projectId: ID!) {
    addDivision(name: $name, projectId: $projectId) {
      id
      name
      project_id
      createdAt
  }
  } 
`;

export const UPDATE_DIVISION_MUTATION = gql`
  mutation updateDivision($divisionId: ID!, $name: String!) {
    updateDivision(divisionId: $divisionId, name: $name) {
      id
      name
      project_id
      createdAt
  }
  } 
`;

export const DELETE_DIVISION = gql`
  mutation deleteDivision($divisionId: ID!) {
    deleteDivision(divisionId: $divisionId)
  }
`;

export const FETCH_COMMITTEES_QUERY = gql`
  query($projectId: ID!){
    getCommittees(projectId: $projectId){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_COMMITTEES_BYSTAFF_QUERY = gql`
  query($staffId: ID!){
    getCommitteesByStaff(staffId: $staffId){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_COMMITTEES_BYSTAFF_PROJECT_QUERY = gql`
  query($staffId: ID!, $projectId: ID!){
    getCommitteesByStaffProject(staffId: $staffId, projectId: $projectId){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_COMMITTEES_BYORGANIZATION_QUERY = gql`
  query($organizationId: ID!){
    getCommitteesByOrganization(organizationId: $organizationId){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_COMMITTEE_QUERY = gql`
   query($committeeId: ID!) {
    getCommittee(committeeId: $committeeId){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_HEADPROJECT_QUERY = gql`
   query($projectId: ID!, $order: String!) {
    getHeadProject(projectId: $projectId, order: $order){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_COMMITTEES_IN_DIVISION_QUERY = gql`
   query($divisionId: ID!) {
    getCommitteesInDivision(divisionId: $divisionId){
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const ADD_COMMITTEE_MUTATION = gql`
  mutation addCommittee($staffId: ID!, $positionId: ID!, $divisionId: ID!, $projectId: ID!, $organizationId: ID!, $order: String!) {
    addCommittee(staffId: $staffId, positionId: $positionId, divisionId: $divisionId, projectId: $projectId, organizationId: $organizationId, order: $order) {
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  } 
`;

export const UPDATE_COMMITTEE_MUTATION = gql`
  mutation updateCommittee($committeeId: ID!, $staffId: ID!, $positionId: ID!, $divisionId: ID!, $order: String!) {
    updateCommittee(committeeId: $committeeId, staffId: $staffId, positionId: $positionId, divisionId: $divisionId, order:$order) {
      id
      staff_id
      position_id
      division_id
      project_id
      organization_id
      order
      createdAt
  }
  } 
`;

export const DELETE_COMMITTEE = gql`
  mutation deleteCommittee($committeeId: ID!) {
    deleteCommittee(committeeId: $committeeId)
  }
`;

export const DELETE_COMMITTEE_BYDIVISION = gql`
  mutation deleteCommitteeByStaff($divisionId: ID!) {
    deleteCommitteeByDivision(divisionId: $divisionId)
  }
`;

export const DELETE_COMMITTEE_BYSTAFF = gql`
  mutation deleteCommitteeByStaff($staffId: ID!) {
    deleteCommitteeByStaff(staffId: $staffId)
  }
`;

export const FETCH_EXTERNALTYPES_QUERY = gql`
  {
    getExternalTypes{
      id
      name
  }
  }
`;

export const FETCH_EXTERNALTYPE_QUERY = gql`
  query($exTypeId: ID!){
    getExternalType(exTypeId: $exTypeId){
      id
      name
  }
  }
`;

export const FETCH_EXTERNALS_QUERY = gql`
  query($eventId: ID!){
    getExternals(eventId: $eventId){
      id
      name
      external_type
      event_id
      email
      phone_number
      details
      picture
      createdAt
  }
  }
`;

export const FETCH_EXTERNAL_QUERY = gql`
   query($externalId: ID!) {
    getExternal(externalId: $externalId){
      id
      name
      external_type
      event_id
      email
      phone_number
      details
      picture
      createdAt
  }
  }
`;

export const FETCH_EXBYTYPE_QUERY = gql`
   query($eventId: ID!, $externalType: ID!) {
    getExternalByType(eventId: $eventId, externalType: $externalType){
      id
      name
      external_type
      event_id
      email
      phone_number
      details
      picture
      createdAt
  }
  }
`;

export const ADD_EXTERNAL_MUTATION = gql`
  mutation addExternal(
    $name: String!,
    $external_type: ID!,
    $event_id: ID!,
    $email: String!,
    $phone_number: String!,
    $details: String,
    $picture: String
    ) {
    addExternal(
      name: $name,
      external_type: $external_type,
      event_id: $event_id,
      email: $email,
      phone_number: $phone_number,
      details: $details,
      picture: $picture
    ) {
      id
      name
      external_type
      event_id
      email
      phone_number
      details
      picture
      createdAt
  }
  } 
`;

export const UPDATE_EXTERNAL_MUTATION = gql`
  mutation updateExternal(
    $externalId: ID!,
    $name: String!,
    $email: String!,
    $phone_number: String!,
    $details: String,
    $picture: String
  ) {
    updateExternal(
      externalId: $externalId,
      name: $name,
      email: $email,
      phone_number: $phone_number,
      details: $details,
      picture: $picture
    ) {
      id
      name
      external_type
      event_id
      email
      phone_number
      details
      picture
      createdAt
  }
  } 
`;

export const DELETE_EXTERNAL = gql`
  mutation deleteExternal($externalId: ID!) {
    deleteExternal(externalId: $externalId)
  }
`;

export const FETCH_ROADMAPS_QUERY = gql`
  query($eventId: ID!) {
    getRoadmaps(eventId: $eventId){
    id
    name
    event_id
    start_date
    end_date
    createdAt
  }
  }
`;

export const FETCH_ROADMAP_QUERY = gql`
   query($roadmapId: ID!) {
    getRoadmap(roadmapId: $roadmapId){
    id
    name
    event_id
    start_date
    end_date
    createdAt
  }
  }
`;

export const ADD_ROADMAP_MUTATION = gql`
  mutation 
  addRoadmap(
    $name: String!,
    $event_id: ID!,
    $start_date: String!,
    $end_date: String!
  ) {
  addRoadmap(
    name: $name,
    event_id: $event_id,
    start_date: $start_date,
    end_date: $end_date
  ) {
    id
    name
    event_id
    start_date
    end_date
    createdAt
  }
  } 
`;

export const UPDATE_ROADMAP_MUTATION = gql`
  mutation 
  updateRoadmap(
    $roadmapId: ID!,
    $name: String!,
    $start_date: String!,
    $end_date: String!
  ) {
  updateRoadmap(
    roadmapId: $roadmapId,
    name: $name,
    start_date: $start_date,
    end_date: $end_date
  ) {
    id
    name
    event_id
    start_date
    end_date
    createdAt
  }
  } 
`;

export const DELETE_ROADMAP = gql`
  mutation deleteRoadmap($roadmapId: ID!) {
    deleteRoadmap(roadmapId: $roadmapId)
  }
`;

export const FETCH_RUNDOWNS_QUERY = gql`
  query($eventId: ID!) {
    getRundowns(eventId: $eventId){
    id
    agenda
    event_id
    date
    start_time
    end_time
    details
    createdAt
  }
  }
`;

export const FETCH_RUNDOWN_QUERY = gql`
   query($rundownId: ID!) {
    getRundown(rundownId: $rundownId){
    id
    agenda
    event_id
    date
    start_time
    end_time
    details
    createdAt
  }
  }
`;

export const ADD_RUNDOWN_MUTATION = gql`
  mutation 
  addRundown(
    $agenda: String!,
    $event_id: ID!,
    $date: String!,
    $start_time: String!,
    $end_time: String!,
    $details: String
  ) {
  addRundown(
    agenda: $agenda,
    event_id: $event_id,
    date: $date,
    start_time: $start_time,
    end_time: $end_time,
    details: $details
  ) {
    id
    agenda
    event_id
    date
    start_time
    end_time
    details
    createdAt
  }
  } 
`;

export const UPDATE_RUNDOWN_MUTATION = gql`
  mutation 
  updateRundown(
    $rundownId: ID!,
    $agenda: String!,
    $date: String!,
    $start_time: String!,
    $end_time: String!,
    $details: String
  ) {
  updateRundown(
    rundownId: $rundownId,
    agenda: $agenda,
    date: $date,
    start_time: $start_time,
    end_time: $end_time,
    details: $details
  ) {
    id
    agenda
    event_id
    date
    start_time
    end_time
    details
    createdAt
  }
  } 
`;

export const DELETE_RUNDOWN = gql`
  mutation deleteRundown($rundownId: ID!) {
    deleteRundown(rundownId: $rundownId)
  }
`;


export const FETCH_TASKS_QUERY = gql`
  query($roadmapId: ID!) {
    getTasks(roadmapId: $roadmapId){
    id
    name
    description
    completed
    due_date
    completed_date
    priority
    roadmap_id
    createdAt
    createdBy
  }
  }
`;

export const FETCH_TASKS_CREATEDBY_QUERY = gql`
  query($createdBy: ID!) {
    getTasksCreatedBy(createdBy: $createdBy){
    id
    name
    description
    completed
    due_date
    completed_date
    priority
    roadmap_id
    createdAt
    createdBy
  }
  }
`;


export const FETCH_TASK_QUERY = gql`
   query($taskId: ID!) {
    getTask(taskId: $taskId){
    id
    name
    description
    completed
    due_date
    completed_date
    priority
    roadmap_id
    createdAt
    createdBy
  }
  }
`;

export const ADD_TASK_MUTATION = gql`
  mutation 
  addTask(
    $name: String!,
    $description: String,
    $completed: Boolean!,
    $due_date: String,
    $completed_date: String,
    $priority: String,
    $roadmapId: ID!,
    $createdBy: ID!
  ) {
  addTask(
    name: $name,
    description: $description,
    completed: $completed,
    due_date: $due_date,
    completed_date: $completed_date,
    priority: $priority,
    roadmapId: $roadmapId,
    createdBy: $createdBy
  ) {
    id
    name
    description
    completed
    due_date
    completed_date
    priority
    roadmap_id
    createdAt
    createdBy
  }
  } 
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation 
  updateTask(
    $taskId: ID!,
    $name: String!,
    $description: String,
    $completed: Boolean!,
    $due_date: String,
    $completed_date: String,
    $priority: String
  ) {
  updateTask(
    taskId: $taskId,
    name: $name,
    description: $description,
    completed: $completed,
    due_date: $due_date,
    completed_date: $completed_date,
    priority: $priority
  ) {
    id
    name
    description
    completed
    due_date
    completed_date
    priority
    roadmap_id
    createdAt
    createdBy
  }
  } 
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;

export const COMPLETED_TASK = gql`
  mutation completedTask(
    $taskId: ID!,
    $completed: Boolean!,
    $completed_date: String
    ) {
    completedTask(taskId: $taskId, completed: $completed, completed_date: $completed_date){
    id
    name
    description
    completed
    due_date
    completed_date
    priority
    roadmap_id
    createdAt
    createdBy
    }
  }
`;

export const FETCH_ASSIGNED_TASKS_QUERY = gql`
  query($taskId: ID!){
    getAssignedTasks(taskId: $taskId){
      id
      task_id
      committee_id
      createdAt
  }
  }
`;


export const FETCH_ASSIGNED_TASK_QUERY = gql`
  query($assignedId: ID!){
    getAssignedTask(assignedId: $assignedId){
      id
      task_id
      committee_id
      createdAt
  }
  }
`;


export const FETCH_ASSIGNED_TASKS_QUERY_BYCOMMITTEE = gql`
  query($committeeId: ID!){
    getAssignedTasksByCommittee(committeeId: $committeeId){
      id
      task_id
      committee_id
      createdAt
  }
  }
`;


export const ASSIGNED_TASK_MUTATION = gql`
  mutation assignedTask($taskId: ID!, $committeeId: ID!) {
    assignedTask(taskId: $taskId, committeeId: $committeeId) {
      id
      task_id
      committee_id
      createdAt
  }
  } 
`;

export const DELETE_ASSIGNED_TASK = gql`
  mutation deleteAssignedTask($assignedId: ID!) {
    deleteAssignedTask(assignedId: $assignedId)
  }
`;

export const DELETE_ASSIGNED_TASK_BYCOMMITTEE = gql`
  mutation deleteAssignedTaskByCommittee($committeeId: ID!) {
    deleteAssignedTaskByCommittee(committeeId: $committeeId)
  }
`;

export const DELETE_ASSIGNED_TASK_BYTASK = gql`
  mutation deleteAssignedTaskByTask($taskId: ID!) {
    deleteAssignedTaskByTask(taskId: $taskId)
  }
`;