import gql from 'graphql-tag';

export const LOGIN_ORGANIZATION = gql`
  mutation loginOrganization($email: String!, $password: String!) {
    loginOrganization(email: $email, password: $password) {
      id
      email
      organization_name
      createdAt
      token
    }
  }
`;

export const REGISTER_ORGANIZATION = gql`
mutation registerOrganization(
  $organization_name: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
) {
  registerOrganization(
      registerOrganizationInput: {
      organization_name: $organization_name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    }
  ) {
    id
    email
    organization_name
    createdAt
    token
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
