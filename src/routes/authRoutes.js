import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router=express.Router()

//Register a new user endpoint
router.post('/register',(req,res)=>{
    const {user_name,password}= req.body
    //Encrypt the password
    const hashedPassword=bcrypt.hashSync(password,8)
    
    //Save the user_name and hashedPassword in the db

    try{
        const insertUser=db.prepare(`INSERT INTO users (user_name,password) VALUES (?,?)`)
        const result = insertUser.run(user_name,hashedPassword)
        
        //Add their first todo for them
        const defaultTodo=`Hello! Add your first todo`
        const insertTodo=db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`)
        insertTodo.run(result.lastInsertRowid,defaultTodo)

        //Create a token
        const token=jwt.sign({id:result.lastInsertRowid},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token})
        // res.sendStatus(200)
    }
    catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
    res.sendStatus(201)
})
router.post('/login',(req,res)=>{
    const {user_name, password}=req.body
    try{
        const getUser=db.prepare('SELECT * FROM users WHERE user_name=?')
        const user=getUser.get(user_name)
        if(!user){
            return res.status(404).send({message:"User not found"})
        }
        const passwordIsValid = bcrypt.compareSync(password,user.password)
        if(!passwordIsValid){
            return res.status(401).send({message:"Invalid password"})
        }
        console.log(user)
        //We have a successful authentication

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'24h'})

        res.json({token})
    }
    catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
})
export default router