const organizationResolvers = require('./organizations');
const departmentsResolvers = require('./departments');
const staffsResolvers = require('./staffs');
const projectsResolvers = require('./projects');
const positionResolvers = require('./positions');
const divisionResolvers = require('./divisions');
const comiteeResolvers = require('./comitees');
const eventResolvers = require('./events');
const externalResolvers = require('./externals');
const externalTypeResolvers = require('./externalTypes');
const roadmapResolvers = require('./roadmap');
const rundownResolvers = require('./rundown');

module.exports = {
    Query: {
        ...organizationResolvers.Query,
        ...departmentsResolvers.Query,
        ...staffsResolvers.Query,
        ...projectsResolvers.Query,
        ...positionResolvers.Query,
        ...divisionResolvers.Query,
        ...comiteeResolvers.Query,
        ...eventResolvers.Query,
        ...externalResolvers.Query,
        ...externalTypeResolvers.Query,
        ...roadmapResolvers.Query,
        ...rundownResolvers.Query
    },
    Mutation: {
        ...organizationResolvers.Mutation,
        ...departmentsResolvers.Mutation,
        ...staffsResolvers.Mutation,
        ...projectsResolvers.Mutation,
        ...positionResolvers.Mutation,
        ...divisionResolvers.Mutation,
        ...comiteeResolvers.Mutation,
        ...eventResolvers.Mutation,
        ...externalResolvers.Mutation,
        ...roadmapResolvers.Mutation,
        ...rundownResolvers.Mutation
    }
}