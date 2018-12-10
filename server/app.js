const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');

const app = express();

const PORT = 8080;

mongoose.connect('mongodb://keyairra:test123@ds123454.mlab.com:23454/favorite-books', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('now connected to mongoose database');
});

//tells express-graphql to use the scheme whenever reuests meet this endpoint
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true //this always for the usage of the graphiql tool (for testing) to be used in the browser when we hit /graphql
}));

app.listen(PORT, () => {
    console.log(`listening for requests on port ${PORT}`);
});
