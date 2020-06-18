const organizationResolvers = require('./organizations');
const departmentsResolvers = require('./departments');

module.exports = {
    Query: {
        ...departmentsResolvers.Query
    },
    Mutation: {
        ...organizationResolvers.Mutation,
        ...departmentsResolvers.Mutation
    }
}