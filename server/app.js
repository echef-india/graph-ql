const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

var port = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://kaddy:987654321@cluster0.riami.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true });
mongoose.connection.once('open', ()=>{
    console.log("DB Connection Successful!");
});

const schema = require('./schema/schema');

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(port, () => {
    console.log("listening at port: "+ port);
});