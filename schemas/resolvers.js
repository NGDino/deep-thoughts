const { User, Thought } = require('../models')

const resolvers = {
    Query: {
        thoughts: async (parent, {username}) =>{
            const params = username ? {username} : {};
            return Thought.find().sort({ createdAt: -1 });
        },
        thought: async (parent, { _id}) =>{
            return Thought.findOne({ _id }) 
        },
        //get all users
        users: async () => {
            return User.find()
                .select('-__V -password')
                .populate('friends')
                .populate('thoughts');
        },
        //get a user by username
        user: async (parent, {username }) =>{
            return User.findOne({ username })
                .select('-__V -password')
                .populate('friends')
                .populate('thoughts')
        }
    }
}

module.exports = resolvers