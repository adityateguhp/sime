import gql from 'graphql-tag';

export const FETCH_ORGANIZATION_QUERY = gql`
   query($organizationId: ID!) {
    getOrganization(organizationId: $organizationId){
        id
        organization_name
        description
        email
        token
        password
        picture
        createdAt
  }
  }
`;

export const LOGIN_ORGANIZATION = gql`
  mutation loginOrganization($email: String!, $password: String!) {
    loginOrganization(email: $email, password: $password) {
      id
      organization_name
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
  $organization_name: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
  $description: String
  $picture: String
) {
  registerOrganization(
      organization_name: $organization_name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      description: $description
      picture: $picture
  ) {
      id
      organization_name
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
    department_name
    organization_id
    createdAt
  }
  }
`;

export const FETCH_DEPARTMENT_QUERY = gql`
   query($departmentId: ID!) {
    getDepartment(departmentId: $departmentId){
    id
    department_name
    organization_id
    createdAt
  }
  }
`;

export const ADD_DEPARTMENT_MUTATION = gql`
  mutation addDepartment($department_name: String!) {
    addDepartment(department_name: $department_name) {
      id
      department_name
      organization_id
      createdAt
  }
  } 
`;

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation updateDepartment($departmentId: ID!, $department_name: String!) {
    updateDepartment(departmentId: $departmentId ,department_name: $department_name) {
      id
      department_name
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
    staff_name
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
    staff_name
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
    $staff_name: String!,
    $position_name: String!,
    $department_id: ID!, 	
    $email: String!,
    $phone_number: String!,
    $password: String!,
    $picture: String
  ) {
  addStaff(
    staff_name: $staff_name,
    position_name: $position_name,
    department_id: $department_id, 	
    email: $email,
    phone_number: $phone_number,
    password: $password,
    picture: $picture
  ) {
    id
    staff_name
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
    $staff_name: String!,
    $position_name: String!,	
    $email: String!,
    $phone_number: String!,
    $picture: String
  ) {
  updateStaff(
    staffId: $staffId,
    staff_name: $staff_name,
    position_name: $position_name,
    email: $email,
    phone_number: $phone_number,
    picture: $picture
  ) {
    id
    staff_name
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
    staff_name
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
