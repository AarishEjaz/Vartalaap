const { timeStamp } = require('console')
const mongoose = require('mongoose')

const messageModel = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
},
{
    timeStamp:true
}
)

const Message = mongoose.model("message",messageModel)

module.exports = Message