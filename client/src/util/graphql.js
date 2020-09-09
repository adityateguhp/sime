import gql from 'graphql-tag';

export const FETCH_ORGANIZATION_QUERY = gql`
   {
    getUserOrganization{
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

export const FETCH_DEPARTMENTS_QUERY = gql`
  {
    getDepartments{
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
  mutation addDepartment($name: String!) {
    addDepartment(name: $name) {
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
  mutation deleteDepartment($departmentId: ID!) {
    deleteDepartment(departmentId: $departmentId)
  }
`;

export const FETCH_STAFFS_QUERY = gql`
  query($departmentId: ID!) {
    getStaffs(departmentId: $departmentId){
    id
    name
    position_name
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
    $picture: String
  ) {
  addStaff(
    name: $name,
    position_name: $position_name,
    department_id: $department_id, 	
    email: $email,
    phone_number: $phone_number,
    password: $password,
    picture: $picture
  ) {
    id
    name
    position_name
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
    $email: String!,
    $phone_number: String!,
    $picture: String
  ) {
  updateStaff(
    staffId: $staffId,
    name: $name,
    position_name: $position_name,
    email: $email,
    phone_number: $phone_number,
    picture: $picture
  ) {
    id
    name
    position_name
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
  updateStaff(
    $staffId: ID!,
    $password: String!,
    $confirmPassword: String!
  ) {
  updateStaff(
    staffId: $staffId,
    password: $password,
    confirmPassword: $confirmPassword
  ) {
    id
    name
    position_name
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

export const FETCH_PROJECTS_QUERY = gql`
  {
    getProjects{
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
  ) {
  addProject(
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

export const FETCH_POSITIONS_QUERY = gql`
  {
    getPositions{
    id
    name
    core
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
    createdAt
  }
  }
`;

export const ADD_POSITION_MUTATION = gql`
  mutation addPosition($name: String!, $core: Boolean!) {
    addPosition(name: $name, core: $core) {
    id
    name
    core
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
  mutation addDivision($name: String!, $projectId: String!) {
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

export const FETCH_COMITEES_QUERY = gql`
  query($projectId: ID!){
    getComitees(projectId: $projectId){
      id
      staff_id
      position_id
      division_id
      project_id
      createdAt
  }
  }
`;

export const FETCH_COMITEE_QUERY = gql`
   query($projectId: ID!) {
    getComitee(projectId: $projectId){
      id
      staff_id
      position_id
      division_id
      project_id
      createdAt
  }
  }
`;

export const FETCH_HEADPROJECT_QUERY = gql`
   query($projectId: ID!, $positionId: ID!) {
    getHeadProject(projectId: $projectId, positionId: $positionId){
      id
      staff_id
      position_id
      division_id
      project_id
      createdAt
  }
  }
`;

export const ADD_COMITEE_MUTATION = gql`
  mutation addComitee($staffId: ID!, $positionId: ID!, $divisionId: ID!, $projectId: ID!) {
    addComitee(staffId: $staffId, positionId: $positionId, divisionId: $divisionId, projectId: $projectId) {
      id
      staff_id
      position_id
      division_id
      project_id
      createdAt
  }
  } 
`;

export const UPDATE_COMITEE_MUTATION = gql`
  mutation updateComitee($comiteeId: ID!, $staffId: ID!, $positionId: ID!, $divisionId: ID!) {
    updateComitee(comiteeId: $comiteeId, taffId: $staffId, positionId: $positionId, divisionId: $divisionId) {
      id
      staff_id
      position_id
      division_id
      project_id
      createdAt
  }
  } 
`;

export const DELETE_COMITEE = gql`
  mutation deleteComitee($comiteeId: ID!) {
    deleteComitee(comiteeId: $comiteeId)
  }
`;