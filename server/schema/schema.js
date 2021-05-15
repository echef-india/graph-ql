const graphql = require('graphql');
//var  _ = require('lodash');

const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

// var UsersData = [
//     {id:'1', name:'kadir', age:30, profession: "Teacher"},
//     {id:'2', name:'james', age:24, profession: "Engineer"},
//     {id:'3', name:'krish', age:50, profession: "Doctor"},
//     {id:'4', name:'athar', age:6, profession: "Sports Teacher"}
// ]

// var HobbyData = [
//     {id:'1', title:'Running', description: "Good Runner.", userId: '1'},
//     {id:'2', title:'Cycling', description: "Amazing cycler.", userId: '2'},
//     {id:'3', title:'Guitar', description: "Plays good guitar.", userId: '2'},
//     {id:'4', title:'Cricket', description: "Opening batsman.", userId: '3'}
// ]

// var postData = [
//     {id: '1', comment: 'hello', userId: '1'},
//     {id: '2', comment: 'hi', userId: '2'},
//     {id: '3', comment: 'hola', userId: '2'},
//     {id: '4', comment: 'Guten Tag!', userId: '4'},
// ]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documenatation for Users',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(postType),
            resolve(parent, args){
                //return _.filter(postData, {userId: parent.id});
                return Post.find({});
            }
        },
        
        hobbies:{
            type: new GraphQLList(hobbyType),
            resolve(parent, args){
                //return _.filter(HobbyData, {userId: parent.id});
                return Hobby.find({});
            }
        }
    })
});

const hobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby of Users',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                //return _.find(UsersData, {id: parent.userId})
                return User.findById(parent.userId);
            }
        }
    })
});

const postType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post from Users',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user:{
            type: UserType,
            resolve(parent, args){
                //return _.find(UsersData, {id: parent.userId})
                return User.findById(parent.userId);
            }
        }
    })
});

const Mutation = new GraphQLObjectType(
    {
        name: "Mutation",
        fields: {
            createUser: {
                type: UserType,
                args: {
                    name: {type: new graphql.GraphQLNonNull(GraphQLString)},
                    age: {type:GraphQLString},
                    profession: {type: GraphQLString}
                },
                // Saving into local dummy data
                // resolve(parent, args){
                //     let user = {
                //         name: args.name,
                //         age: args.age,
                //         profession: args.profession
                //     }
                //     return user;

                // Saving into MongoDB
                resolve(parent, args){
                    let user = new User({
                        name: args.name,
                        age: args.age,
                        profession: args.profession
                    });
                    user.save();
                    return user;
                }
            },

            updateUser:{
                type: UserType,
                args:{
                    id: {type: new GraphQLNonNull(GraphQLString)},
                    name: {type: GraphQLString},
                    age: {type: GraphQLInt},
                    profession: {type: GraphQLString}
                },
                resolve(parent, args){
                    return updatedUser = User.findByIdAndUpdate(args.id,
                     {
                        $set:{
                            name: args.name,
                            age : args.age,
                            profession : args.profession
                        }
                     },
                     {new: true}
                     );
                }
            },

            removeUser:{
                type: UserType,
                args:{
                    id: {type: new GraphQLNonNull(GraphQLString)},
                },
                resolve(parent, args){
                    let removeUser = User.findByIdAndRemove(args.id).exec();
                
                    if(!removeUser){
                        throw new("error removing user!");
                    }
                return removeUser;
                }
            },


            createPost: {
                type: postType,
                args: {
                    comment: {type: GraphQLNonNull(GraphQLString)},
                    userId: {type: GraphQLNonNull(GraphQLID)}
                },
                resolve(parent, args){
                    let post = new Post({
                        comment: args.comment,
                        userId: args.comment
                    });
                    post.save();
                    return post;
                }
            },

            updatePost:{
                type: postType,
                args:{
                    id: {type: new GraphQLNonNull(GraphQLString)},
                    comment: {type: new GraphQLNonNull(GraphQLString)},
                   // userId: {type:  new GraphQLNonNull(GraphQLString)}
                },
                resolve(parent, args){
                    return updatedPost = Post.findByIdAndUpdate(args.id,
                     {
                        $set:{
                            comment: args.comment,
                            //userId : args.userId
                        }
                     },
                     {new: true}
                     );
                }
            },

            removePost:{
                type: postType,
                args:{
                    id: {type: new GraphQLNonNull(GraphQLString)},
                },
                resolve(parent, args){
                    let removePost =  User.findByIdAndRemove(args.id).exec();
                    if(!removePost){
                        throw new error("Error removing post");
                    }
                    return removePost;
                }
            },

            createHobby: {
                type: hobbyType,
                args: {
                    //id: {type: GraphQLID},
                    title: {type: GraphQLString},
                    description: {type: GraphQLNonNull(GraphQLString)},
                    userId: {type: GraphQLNonNull(GraphQLID)}
                },

                resolve(parent, args){
                    let hobby = new Hobby({
                        title: args.title,
                        description: args.description,
                        userId: args.userId
                    });
                    hobby.save();
                    return hobby;
                }
            },

            updateHobby:{
                type: hobbyType,
                args:{
                    id: {type: new GraphQLNonNull(GraphQLID)},
                    title: {type: GraphQLString},
                    description: {type: GraphQLString}
                },
                resolve(parent, args){
                    return updatedHobby = Hobby.findByIdAndUpdate(
                        args.id,
                        {
                         $set:{
                            title: args.title,
                            description: args.description
                         }
                        },
                        {new: true}
                    );
                }
            },
            removeHobby:{
                type: hobbyType,
                args:{
                    id: {type: new GraphQLNonNull(GraphQLID)},
                },
                resolve(parent, args){
                    let removeHobby = User.findByIdAndRemove(args.id).exec();
                    if(!removeHobby){
                        throw new error("Error removing hobby");
                    }
                    return removeHobby;
                }
            }
        }
}
);

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args){
               //return _.find(UsersData, {id: args.id})
               return User.findById(args.id);
            }
        },

        users:{
            type: new GraphQLList(UserType),
            resolve(parent, args){
                //return UsersData;
                return User.find();
            }
        },

        hobby: {
            type: hobbyType,
            args: {id: {type: GraphQLID}},
            
            resolve(parent, args){
                //return _.find(HobbyData, {id: args.id})
                return Hobby.findById(args.id);
            }
        },

        hobbies: {
            type: new GraphQLList(hobbyType),
            resolve(parent, args){
                //return HobbyData;
                return Hobby.find();
            }
        },

        post: {
            type: postType,
            args: {id: {type: GraphQLID}},
            
            resolve(parent, args){
                //return _.find(postData, {id: args.id})
                return Post.findById(args.id);
            }
        },

        posts:{
            type: new GraphQLList(postType),
            resolve(parent, args){
                //return postData;
                return Post.find();
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});