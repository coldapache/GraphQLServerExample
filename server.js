const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const app = express();

const make = [
	{ id: 1, name: 'Honda' },
	{ id: 2, name: 'Toyota' },
	{ id: 3, name: 'Ford' }
]

const model = [
	{ id: 1, name: 'CRV', makeId: 1 },
	{ id: 2, name: 'Accord', makeId: 1 },
	{ id: 3, name: 'Civic', makeId: 1 },
	{ id: 4, name: 'Tacoma', makeId: 2 },
	{ id: 5, name: 'Corolla', makeId: 2 },
	{ id: 6, name: 'Camry', makeId: 2 },
	{ id: 7, name: 'Explorer', makeId: 3 },
	{ id: 8, name: 'F150', makeId: 3 }
]

const ModelType = new GraphQLObjectType({
    /* this constructs the output for all car models */
    name: 'Model',
    description: 'This is a model of car',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        makeId: { type: GraphQLNonNull(GraphQLInt) },
        make: { 
            type: MakeType,
            resolve: (model) => {
                return make.find(make =>  make.id === model.makeId)
            }
        }
    })
})

const MakeType = new GraphQLObjectType({
    /* this constructs the output for all car makes */
    name: 'Make',
    description: 'This is a make of car',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        models: { 
            type: new GraphQLList(ModelType),
            resolve: (make) => {
                return model.filter(model => model.makeId === make.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        singleModel: {
            type: ModelType,
            description: 'Just one car model',
            args: {
                id: { type: GraphQLInt }
            }, /* this argument can be passed an id that will search for the model with that id */
            resolve: (parent, args) => model.find(model => model.makeId === args.id)
        },
        singleMake: {
            type: MakeType,
            description: 'Just one car make',
            args: {
                id: { type: GraphQLInt }
            }, /* this argument can be passed an id that will search for the make with that id */
            resolve: (parent, args) => make.find(make => make.id === args.id)
        },
        model: {
            type: new GraphQLList(ModelType),
            description: 'List of all available models',
            resolve: () => model
        },
        make: {
            type: new GraphQLList(MakeType),
            description: 'List of all available makes',
            resolve: () => make
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(5000., () => console.log('Server Running'));