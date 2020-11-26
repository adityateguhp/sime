const organizationResolvers = require('./organizations');
const departmentsResolvers = require('./departments');
const staffsResolvers = require('./staffs');
const projectsResolvers = require('./projects');
const positionResolvers = require('./positions');
const committeeResolvers = require('./committees');
const person_in_chargeResolvers = require('./person_in_charges');
const eventResolvers = require('./events');
const externalResolvers = require('./externals');
const externalTypeResolvers = require('./externalTypes');
const roadmapResolvers = require('./roadmaps');
const rundownResolvers = require('./rundowns');
const taskResolvers = require('./tasks');
const task_assigned_toResolvers = require('./task_assigned_tos');
const department_positionResolvers = require('./department_positions');

module.exports = {
    Query: {
        ...organizationResolvers.Query,
        ...departmentsResolvers.Query,
        ...staffsResolvers.Query,
        ...projectsResolvers.Query,
        ...positionResolvers.Query,
        ...committeeResolvers.Query,
        ...person_in_chargeResolvers.Query,
        ...eventResolvers.Query,
        ...externalResolvers.Query,
        ...externalTypeResolvers.Query,
        ...roadmapResolvers.Query,
        ...rundownResolvers.Query,
        ...taskResolvers.Query,
        ...task_assigned_toResolvers.Query,
        ...department_positionResolvers.Query
    },
    Mutation: {
        ...organizationResolvers.Mutation,
        ...departmentsResolvers.Mutation,
        ...staffsResolvers.Mutation,
        ...projectsResolvers.Mutation,
        ...positionResolvers.Mutation,
        ...committeeResolvers.Mutation,
        ...person_in_chargeResolvers.Mutation,
        ...eventResolvers.Mutation,
        ...externalResolvers.Mutation,
        ...externalTypeResolvers.Mutation,
        ...roadmapResolvers.Mutation,
        ...rundownResolvers.Mutation,
        ...taskResolvers.Mutation,
        ...task_assigned_toResolvers.Mutation,
        ...department_positionResolvers.Mutation
    }
}