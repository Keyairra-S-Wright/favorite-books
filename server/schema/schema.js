const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLID
} = graphql;

//dummy data
let books = [
    {title: 'Count of Monte Cristo', genre: 'Adventure', id: '1', authorId: '1'},
    {title: 'The Bluest Eye', genre: 'Drama', id: '2', authorId: '2'},
    {title: 'Oh, the Places You\'ll Go', genre: 'Children\'s', id: '3', authorId: '3'},
    {title: 'Three Muskateers', genre: 'Adventure', id: '4', authorId: '1'},
    {title: 'Jazz', genre: 'Historical Fiction', id: '5', authorId: '2'},
    {title: 'I Know Why the Caged Bird Sings', genre: 'Autobiography', id: '6', authorId: '4'}
];

let authors = [
    {name: 'Alexander Dumas', age: 68, id: '1'},
    {name: 'Toni Morrison', age: 87, id: '2'},
    {name: 'Dr. Seuss', age: 87, id: '3'},
    {name: 'Maya Angelou', age: 86, id: '4'}
];

//Define schema - object types, relationships between them, and entry points into the graph.
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({//in this case, wrapping the fields property inside of a function becasue it always for the code to be run through, top to bottom, but does not execute our fields function until all of our Type variables have been both defined and recognized during run-time
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, {authorId: parent.id});
            }
        }
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){//parent is a necessary parameter when we utlize nested data
                console.log(parent);
                return _.find(authors, {id: parent.authorId}); //look through authors array to find the authorId of the parent book that we are searching for
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: {type: GraphQLID}}, //When BookType is queried, arguments are expected to be passed along
            resolve(parent, args){ //resolve function looks at the data and determines what is needed
                //code to get data from db  or dummy data
                return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(authors, {id: args.id}); //at the moment, with dummy data, this lodash function requires that we look inside of th authors array
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(){
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(){
                return authors;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
