import gql from 'graphql-tag';

//ORGANIZATION

export const FETCH_ORGANIZATION_QUERY = gql`
   query($organizationId: ID!){
    getOrganization(organizationId: $organizationId){
        id
        name
        email
        description
        picture
        address
        phone_number
        createdAt
  }
}
`;

export const ADD_ORGANIZATION = gql`
  mutation addOrganization($name: String!, $email: String!, $description: String, $picture: String, $address: String, $phone_number:String) {
    addOrganization(name: $name, email: $email, description: $description, picture: $picture, address: $address, phone_number: $phone_number) {
      id
      name
      email
      description
      picture
      address
      phone_number
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
  $address: String
  $phone_number:String
) {
  updateOrganization(
      organizationId: $organizationId
      name: $name
      email: $email
      description: $description
      picture: $picture
      address: $address
      phone_number: $phone_number
  ) {
      id
      name
      description
      email
      picture
      address
      phone_number
      createdAt
  }
}
`;


//STAFF

export const LOGIN_STAFF = gql`
  mutation loginStaff($email: String!, $password: String!) {
    loginStaff(email: $email, password: $password) {
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    token
    phone_number
    picture
    isAdmin
    createdAt
    }
  }
`;

export const REGISTER_STAFF = gql`
mutation registerStaff(
  $name: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
) {
  registerStaff(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
  ) {
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    token
    phone_number
    picture
    isAdmin
    createdAt
  }
}
`;

export const FETCH_STAFFS_QUERY = gql`
  query($organizationId: ID!){
    getStaffs(organizationId: $organizationId){
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
    createdAt
  }
  }
`;

export const FETCH_STAFFSBYDEPARTMENT_QUERY = gql`
  query($departmentId: ID) {
    getStaffsByDepartment(departmentId: $departmentId){
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
    createdAt
  }
  }
`;

export const FETCH_STAFF_QUERY = gql`
   query($staffId: ID!) {
    getStaff(staffId: $staffId){
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
    createdAt
  }
  }
`;

export const ADD_STAFF_MUTATION = gql`
  mutation 
  addStaff(
    $name: String!,
    $department_position_id: ID,
    $department_id: ID, 	
    $email: String!,
    $phone_number: String,
    $password: String!,
    $picture: String,
    $organizationId: ID!,
    $isAdmin: Boolean!
  ) {
  addStaff(
    name: $name,
    department_position_id: $department_position_id,
    department_id: $department_id, 	
    email: $email,
    phone_number: $phone_number,
    password: $password,
    picture: $picture,
    organizationId: $organizationId,
    isAdmin: $isAdmin
  ) {
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
    createdAt
  }
  } 
`;

export const ADD_ORGANIZATION_STAFF_MUTATION = gql`
  mutation 
  addOrganizationStaff(
    $staffId: ID!,
    $organizationId: ID!
  ) {
  addOrganizationStaff(
    staffId: $staffId,
    organizationId: $organizationId, 
  ) {
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
    createdAt
  }
  } 
`;

export const UPDATE_STAFF_MUTATION = gql`
  mutation 
  updateStaff(
    $staffId: ID!,
    $name: String!,
    $department_position_id: ID,
    $department_id: ID, 	
    $email: String!,
    $phone_number: String,
    $picture: String,
    $isAdmin: Boolean!
  ) {
  updateStaff(
    staffId: $staffId,
    name: $name,
    department_position_id: $department_position_id,
    department_id: $department_id, 
    email: $email,
    phone_number: $phone_number,
    picture: $picture,
    isAdmin: $isAdmin
  ) {
    id
    name
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
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
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
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
    department_position_id
    organization_id
    department_id 	
    email
    phone_number
    picture
    isAdmin
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


//DEPARTMENT

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
   query($departmentId: ID) {
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


//PROJECT

export const FETCH_PROJECTS_QUERY = gql`
query($organizationId: ID!){
    getProjects(organizationId: $organizationId){
    id
    name
    description
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
    $start_date: String!,
    $end_date: String!,
    $picture: String,
    $organizationId: ID!
  ) {
  addProject(
    name: $name,
    description: $description,
    start_date: $start_date,
    end_date: $end_date,
    picture: $picture,
    organizationId: $organizationId
  ) {
    id
    name
    description
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
    $start_date: String!,
    $end_date: String!,
    $picture: String,
  ) {
  updateProject(
    projectId: $projectId,
    name: $name,
    description: $description,
    start_date: $start_date,
    end_date: $end_date,
    picture: $picture
  ) {
    id
    name
    description
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


//EVENT

export const FETCH_EVENTS_QUERY = gql`
  query($projectId: ID!) {
    getEvents(projectId: $projectId){
    id
    name
    description
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
    $location: String,
    $start_date: String!,
    $end_date: String!,
    $project_id: ID!,
    $picture: String,
  ) {
  addEvent(
    name: $name,
    description: $description,	
    location: $location,
    start_date: $start_date,
    end_date: $end_date,
    project_id: $project_id
    picture: $picture
  ) {
    id
    name
    description
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
    $location: String,
    $start_date: String!,
    $end_date: String!,
    $picture: String,
  ) {
  updateEvent(
    eventId: $eventId,
    name: $name,
    description: $description,	
    location: $location,
    start_date: $start_date,
    end_date: $end_date,
    picture: $picture
  ) {
    id
    name
    description
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


//POSITION

export const FETCH_POSITIONS_QUERY = gql`
  query($organizationId: ID!){
    getPositions(organizationId: $organizationId){
    id
    name
    core
    organization_id
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
    organization_id
    order
    createdAt
  }
  }
`;

export const ADD_POSITION_MUTATION = gql`
  mutation addPosition($name: String!, $core: Boolean!, $organizationId: ID!, $order: String!) {
    addPosition(name: $name, core: $core, organizationId: $organizationId, order: $order) {
    id
    name
    core
    organization_id
    order
    createdAt
  }
  } 
`;

export const UPDATE_POSITION_MUTATION = gql`
  mutation updatePosition($positionId: ID!, $name: String!, $core: Boolean!) {
    updatePosition(positionId: $positionId, name: $name, core: $core) {
    id
    name
    core
    organization_id
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


//COMMITTEE

export const FETCH_COMMITTEES_QUERY = gql`
   query($organizationId: ID!){
    getCommittees(organizationId: $organizationId){
      id
      name
      core
      organization_id
      createdAt
  }
  }
`;

export const FETCH_COMMITTEE_QUERY = gql`
   query($committeeId: ID!) {
    getCommittee(committeeId: $committeeId){
      id
      name
      core
      organization_id
      createdAt
  }
  }
`;

export const ADD_COMMITTEE_MUTATION = gql`
  mutation addCommittee($name: String!, $core:Boolean!, $organizationId: ID!) {
    addCommittee(name: $name, core: $core, organizationId: $organizationId) {
      id
      name
      core
      organization_id
      createdAt
  }
  } 
`;

export const UPDATE_COMMITTEE_MUTATION = gql`
  mutation updateCommittee($committeeId: ID!, $name: String!) {
    updateCommittee(committeeId: $committeeId, name: $name) {
      id
      name
      core
      organization_id
      createdAt
  }
  } 
`;

export const DELETE_COMMITTEE = gql`
  mutation deleteCommittee($committeeId: ID!) {
    deleteCommittee(committeeId: $committeeId)
  }
`;


//PIC

export const FETCH_PICS_QUERY = gql`
  query($projectId: ID!){
    getPersonInCharges(projectId: $projectId){
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_PICS_BYSTAFF_QUERY = gql`
  query($staffId: ID!){
    getPersonInChargesByStaff(staffId: $staffId){
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_PICS_BYSTAFF_PROJECT_QUERY = gql`
  query($staffId: ID!, $projectId: ID!){
    getPersonInChargesByStaffProject(staffId: $staffId, projectId: $projectId){
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_PICS_BYORGANIZATION_QUERY = gql`
  query($organizationId: ID!){
    getPersonInChargesByOrganization(organizationId: $organizationId){
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_PIC_QUERY = gql`
   query($personInChargeId: ID!) {
    getPersonInCharge(personInChargeId: $personInChargeId){
      id
      staff_id
      position_id
      committee_id
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
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const FETCH_PICS_IN_COMMITTEE_QUERY = gql`
   query($committeeId: ID!) {
    getPersonInChargesInCommittee(committeeId: $committeeId){
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  }
`;

export const ADD_PIC_MUTATION = gql`
  mutation addPersonInCharge($staffId: ID!, $positionId: ID!, $committeeId: ID!, $projectId: ID!, $organizationId: ID!, $order: String!) {
    addPersonInCharge(staffId: $staffId, positionId: $positionId, committeeId: $committeeId, projectId: $projectId, organizationId: $organizationId, order: $order) {
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  } 
`;

export const UPDATE_PIC_MUTATION = gql`
  mutation updatePersonInCharge($personInChargeId: ID!, $staffId: ID!, $positionId: ID!, $committeeId: ID!, $order: String!) {
    updatePersonInCharge(personInChargeId: $personInChargeId, staffId: $staffId, positionId: $positionId, committeeId: $committeeId, order:$order) {
      id
      staff_id
      position_id
      committee_id
      project_id
      organization_id
      order
      createdAt
  }
  } 
`;

export const DELETE_PIC = gql`
  mutation deletePersonInCharge($personInChargeId: ID!) {
    deletePersonInCharge(personInChargeId: $personInChargeId)
  }
`;

export const DELETE_PIC_BYCOMMITTEE = gql`
  mutation deletePersonInChargeByStaff($committeeId: ID!) {
    deletePersonInChargeByCommittee(committeeId: $committeeId)
  }
`;

export const DELETE_PIC_BYSTAFF = gql`
  mutation deletePersonInChargeByStaff($staffId: ID!) {
    deletePersonInChargeByStaff(staffId: $staffId)
  }
`;


//EXTERNAL_TYPE

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


//EXTERNAL

export const FETCH_EXTERNALS_QUERY = gql`
  query($eventId: ID!){
    getExternals(eventId: $eventId){
      id
      name
      external_type
      event_id
      project_id
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
      project_id
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
      project_id
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
    $project_id: ID!,
    $email: String!,
    $phone_number: String!,
    $details: String,
    $picture: String
    ) {
    addExternal(
      name: $name,
      external_type: $external_type,
      event_id: $event_id,
      project_id: $project_id,
      email: $email,
      phone_number: $phone_number,
      details: $details,
      picture: $picture
    ) {
      id
      name
      external_type
      event_id
      project_id
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
      project_id
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


//ROADMAP

export const FETCH_ROADMAPS_QUERY = gql`
  query($eventId: ID!) {
    getRoadmaps(eventId: $eventId){
    id
    name
    event_id
    project_id
    committee_id
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
    project_id
    committee_id
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
    $project_id: ID!,
    $committee_id: ID!,
    $start_date: String!,
    $end_date: String!
  ) {
  addRoadmap(
    name: $name,
    event_id: $event_id,
    project_id: $project_id,
    committee_id: $committee_id,
    start_date: $start_date,
    end_date: $end_date
  ) {
    id
    name
    event_id
    project_id
    committee_id
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
    project_id
    committee_id
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


//RUNDOWN

export const FETCH_RUNDOWNS_QUERY = gql`
  query($eventId: ID!) {
    getRundowns(eventId: $eventId){
    id
    agenda
    event_id
    project_id
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
    project_id
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
    $project_id: ID!,
    $date: String!,
    $start_time: String!,
    $end_time: String!,
    $details: String
  ) {
  addRundown(
    agenda: $agenda,
    event_id: $event_id,
    project_id: $project_id,
    date: $date,
    start_time: $start_time,
    end_time: $end_time,
    details: $details
  ) {
    id
    agenda
    event_id
    project_id
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
    project_id
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


//TASK

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
    project_id
    event_id
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
    project_id
    event_id
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
    project_id
    event_id
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
    $projectId: ID!,
    $eventId: ID!,
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
    projectId: $projectId,
    eventId: $eventId,
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
    project_id
    event_id
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
    project_id
    event_id
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
    project_id
    event_id
    createdAt
    createdBy
    }
  }
`;


//TASK_ASSIGNED_TO

export const FETCH_ASSIGNED_TASKS_QUERY = gql`
  query($roadmapId: ID!){
    getAssignedTasks(roadmapId: $roadmapId){
      id
      task_id
      staff_id
      person_in_charge_id
      project_id
      event_id
      roadmap_id
      createdAt
  }
  }
`;


export const FETCH_ASSIGNED_TASK_QUERY = gql`
  query($assignedId: ID!){
    getAssignedTask(assignedId: $assignedId){
      id
      task_id
      staff_id
      person_in_charge_id
      project_id
      event_id
      roadmap_id
      createdAt
  }
  }
`;


export const FETCH_ASSIGNED_TASKS_QUERY_BYPIC = gql`
  query($personInChargeId: ID!){
    getAssignedTasksByPersonInCharge(personInChargeId: $personInChargeId){
      id
      task_id
      staff_id
      person_in_charge_id
      project_id
      event_id
      roadmap_id
      createdAt
  }
  }
`;


export const FETCH_ASSIGNED_TASKS_QUERY_BYSTAFF = gql`
  query($staffId: ID!){
    getAssignedTasksByStaff(staffId: $staffId){
      id
      task_id
      staff_id
      person_in_charge_id
      project_id
      event_id
      roadmap_id
      createdAt
  }
  }
`;


export const ASSIGNED_TASK_MUTATION = gql`
  mutation assignedTask($taskId: ID!, $staffId:ID!, $personInChargeId: ID!, $projectId: ID!, $eventId: ID!, $roadmapId: ID!) {
    assignedTask(taskId: $taskId, staffId: $staffId, personInChargeId: $personInChargeId, projectId: $projectId, eventId: $eventId, roadmapId: $roadmapId) {
      id
      task_id
      staff_id
      person_in_charge_id
      project_id
      event_id
      roadmap_id
      createdAt
  }
  } 
`;

export const UPDATE_STAFF_ASSIGNED_TASK_MUTATION = gql`
  mutation updateStaffAssignedTask($personInChargeId: ID!, $staffId:ID!) {
    updateStaffAssignedTask(personInChargeId: $personInChargeId, staffId: $staffId) 
  } 
`;

export const DELETE_ASSIGNED_TASK = gql`
  mutation deleteAssignedTask($assignedId: ID!) {
    deleteAssignedTask(assignedId: $assignedId)
  }
`;

export const DELETE_ASSIGNED_TASK_BYPIC = gql`
  mutation deleteAssignedTaskByPersonInCharge($personInChargeId: ID!) {
    deleteAssignedTaskByPersonInCharge(personInChargeId: $personInChargeId)
  }
`;

export const DELETE_ASSIGNED_TASK_BYTASK = gql`
  mutation deleteAssignedTaskByTask($taskId: ID!) {
    deleteAssignedTaskByTask(taskId: $taskId)
  }
`;


//DEPARTMENT_POSITION

export const FETCH_DEPARTMENT_POSITIONS_QUERY = gql`
  query($organizationId: ID){
    getDepartmentPositions(organizationId: $organizationId){
    id
    name
    organization_id
    createdAt
  }
  }
`;

export const FETCH_DEPARTMENT_POSITION_QUERY = gql`
   query($departmentPositionId: ID!) {
    getDepartmentPosition(departmentPositionId: $departmentPositionId){
    id
    name
    organization_id
    createdAt
  }
  }
`;

export const ADD_DEPARTMENT_POSITION_MUTATION = gql`
  mutation addDepartmentPosition($name: String!, $organizationId: ID!) {
    addDepartmentPosition(name: $name, organizationId: $organizationId) {
    id
    name
    organization_id
    createdAt
  }
  } 
`;

export const UPDATE_DEPARTMENT_POSITION_MUTATION = gql`
  mutation updateDepartmentPosition($departmentPositionId: ID!, $name: String!) {
    updateDepartmentPosition(departmentPositionId: $departmentPositionId, name: $name) {
    id
    name
    organization_id
    createdAt
  }
  } 
`;

export const DELETE_DEPARTMENT_POSITION = gql`
  mutation deleteDepartmentPosition($departmentPositionId: ID!) {
    deleteDepartmentPosition(departmentPositionId: $departmentPositionId)
  }
`;