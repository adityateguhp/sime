const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req }) => ({ req })
});

mongoose.connect(MONGODB, { useNewUrlParser: true})
.then(() => {
    console.log('MongoDB Connected');
    return server.listen(process.env.PORT || 5000);
})
.then((res) => {
    console.log(`Server running at ${res.url}`);
})
