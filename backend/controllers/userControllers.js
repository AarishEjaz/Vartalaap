const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')
const bcrypt = require('bcryptjs')

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,pic} = req.body

    if(!name||!password||!email){
        res.status(400)
        throw new Error("please provide all the fields")
    }
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('user already exist')
    }
    const user = await User.create({
        name,email,password,pic
    })
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
        }else{
            res.status(400)
            throw new Error('failed to create the user')
    }
})

const authUser = asyncHandler(async(req,res)=>{

    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({message:"user does not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(400).json({message:"wrong password"})
        }
        if(user && await user.matchPassword(password)){
            res.json({
             _id: user._id,
             name: user.name,
             email: user.email,
             isAdmin: user.isAdmin,
             pic: user.pic,
             token: generateToken(user._id),
        });

        // res.status(200).json({name:user.name,email:user.email,message:'logged in '})
    }}catch(error){
        res.status(500).json({message:error.message})
    }
})

// const authUser = asyncHandler(async(req,res)=>{ //this approach is shit use try catch block and few more if statements for test cases
//     const {email, password} = req.body

//     const user = await User.findOne({email})
//     const checkPassword = await bcrypt.compare(password,user.password)
//     console.log(password)
//     if(user && await user.matchPassword(password)){
//         res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       pic: user.pic,
//       token: generateToken(user._id),
//     });

//     }else if(checkPassword ===false){
//         res.status(400).json({message:"wrong password entered"})
//     }
//     else if(!user){
//         res.status(400).json({message:'user does not exist '})
//     }
// })


const allUser = asyncHandler(async(req,res)=>{
    console.log(req.query)

    const keyword = req.query.search ? {
        $or:[
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    }:{}

    const users = await User.find(keyword).select('-password') //this will hide the password and other stuff according to the need
    res.send(users)
})


module.exports = {registerUser,authUser,allUser}