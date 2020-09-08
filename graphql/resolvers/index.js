const organizationResolvers = require('./organizations');
const departmentsResolvers = require('./departments');
const staffsResolvers = require('./staffs');
const projectsResolvers = require('./projects');

module.exports = {
    Query: {
        ...organizationResolvers.Query,
        ...departmentsResolvers.Query,
        ...staffsResolvers.Query,
        ...projectsResolvers.Query
    },
    Mutation: {
        ...organizationResolvers.Mutation,
        ...departmentsResolvers.Mutation,
        ...staffsResolvers.Mutation,
        ...projectsResolvers.Mutation
    }
}