const organizationResolvers = require('./organizations');
const departmentsResolvers = require('./departments');
const staffsResolvers = require('./staffs');
const projectsResolvers = require('./projects');
const positionResolvers = require('./positions');
const divisionResolvers = require('./divisions');
const committeeResolvers = require('./committees');
const eventResolvers = require('./events');
const externalResolvers = require('./externals');
const externalTypeResolvers = require('./externalTypes');
const roadmapResolvers = require('./roadmaps');
const rundownResolvers = require('./rundowns');
const taskResolvers = require('./tasks');
const task_assigned_to_Resolvers = require('./task_assigned_tos');

module.exports = {
    Query: {
        ...organizationResolvers.Query,
        ...departmentsResolvers.Query,
        ...staffsResolvers.Query,
        ...projectsResolvers.Query,
        ...positionResolvers.Query,
        ...divisionResolvers.Query,
        ...committeeResolvers.Query,
        ...eventResolvers.Query,
        ...externalResolvers.Query,
        ...externalTypeResolvers.Query,
        ...roadmapResolvers.Query,
        ...rundownResolvers.Query,
        ...taskResolvers.Query,
        ...task_assigned_to_Resolvers.Query
    },
    Mutation: {
        ...organizationResolvers.Mutation,
        ...departmentsResolvers.Mutation,
        ...staffsResolvers.Mutation,
        ...projectsResolvers.Mutation,
        ...positionResolvers.Mutation,
        ...divisionResolvers.Mutation,
        ...committeeResolvers.Mutation,
        ...eventResolvers.Mutation,
        ...externalResolvers.Mutation,
        ...externalTypeResolvers.Mutation,
        ...roadmapResolvers.Mutation,
        ...rundownResolvers.Mutation,
        ...taskResolvers.Mutation,
        ...task_assigned_to_Resolvers.Mutation
    }
}