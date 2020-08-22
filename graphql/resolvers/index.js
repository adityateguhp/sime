const organizationResolvers = require('./organizations');
const departmentsResolvers = require('./departments');
const staffsResolvers = require('./staffs');

module.exports = {
    Query: {
        ...departmentsResolvers.Query,
        ...staffsResolvers.Query
    },
    Mutation: {
        ...organizationResolvers.Mutation,
        ...departmentsResolvers.Mutation,
        ...staffsResolvers.Mutation
    }
}