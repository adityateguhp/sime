import gql from 'graphql-tag';

export const FETCH_DEPARTMENT_QUERY = gql`
  {
    getDepartments{
    id
    department_name
    organization_id
    createdAt
  }
  }
`;
