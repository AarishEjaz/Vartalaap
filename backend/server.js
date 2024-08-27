const express = require('express');
const app = express()

const {chats} = require('./data/data')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoute  =require("./routes/messageRoutes")

const {notFound,errorHandler} = require('./middleware/errorMiddleware')
dotenv.config()
connectDB()

app.use(express.json())
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message",messageRoute)

app.use(notFound)
app.use(errorHandler)



const PORT = process.env.PORT ||5000

app.get('/',(req,res)=>{
    res.send("api is running")
})

const server = app.listen(PORT,console.log(`server is running on port ${PORT}`))

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("connectet to socket.io ")
    socket.on("setup",(userData)=>{
        console.log(userData._id)
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("user joined room: " + room)
    })

    socket.on('new message',(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat
        if(!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user=>{
            if(user._id == newMessageRecieved.sender._id) return

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })


    })

})

// const express = require('express');
// const app = express();

// const { chats } = require('./data/data');
// const dotenv = require('dotenv');
// const connectDB = require("./config/db");
// const userRoutes = require('./routes/userRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const messageRoute = require("./routes/messageRoutes");

// const { notFound, errorHandler } = require('./middleware/errorMiddleware');
// dotenv.config();
// connectDB();

// app.use(express.json());

// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoute);

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.send("API is running");
// });

// // Initialize the server
// const server = app.listen(PORT, console.log(`Server is running on port ${PORT}`));

// // Initialize Socket.IO
// const io = require('socket.io')(server, {
//     pingTimeout: 60000,
//     cors: {
//         origin: "http://localhost:3000",
//     }
// });

// // Listen for connection event
// io.on("connection", (socket) => {
//     console.log("A user connected");
// });
