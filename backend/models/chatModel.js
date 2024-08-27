// const { timeStamp } = require('console')
// const mongoose = require('mongoose')

// const chatModel = mongoose.Schema({
//     chatName:{
//         type:String,
//         trim:true
//     },
//     isGroupChat:{
//         type:Boolean,
//         default:false
//     },
//     users:[
//         {
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//         },
//     ],
//     latestMessage:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Message"
//     },
//     groupAdmin:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     }
// },
// {
//     timeStamp:true
// }
// )

// const Chat = mongoose.model("Chat",chatModel)

// module.exports = Chat

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true // Correct option for timestamps
});

const Chat = mongoose.model("Chat", chatSchema); // Ensure 'Chat' is the model name
module.exports = Chat;
