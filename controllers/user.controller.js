import { response } from "express"
import { User } from "../models/user.model.js"
import { sendVerifyMail,resetPassword } from "../utils/nodemailer.util.js"
import bcrypt from 'bcrypt'
import randomstring from "randomstring"

const getUserRegisterForm=async(req,res)=>{
    try {
        console.log('inside')
        res.render('user/register',{message:""})
    } catch (error) {
        
    }
}


const userRegister=async(req,res)=>{
   try {
     console.log('user register')
     const{username,email,password,mobile}=req.body
     console.log(username,email,password)
     if([username,email,password,mobile].some(item=>item===null || item===undefined || item?.trim()==="" || item.length===0)){
         res.status(400).json('please provide all details')
         
     }
     console.log( req.file)
     const avatar= req.file? req.file.filename : null
 
     const existingUser = await User.findOne({email})
     if(existingUser) res.status(404).json("user already exists")
 
 
 
     const user = new User({
         username,email,password,mobile,avatar,isAdmin:0,
     }) 
    const userData= await user.save()
    if(userData){
        sendVerifyMail(username,email,userData._id)
        // res.session.user= userData.username
        // req.session.save()
     res.render('./user/register',{message:"Your registration is successful . Please verify your mail"})
    }else{
     res.render('./user/register',{message:" Registration failed"})
 
    }
   } catch (error) {
    console.log(error)
    
   }
 
   
   
} 


const verifyMail=async(req,res)=>{
    try {
      const updatedInfo= await User.updateOne({_id:req.query.id},{$set:{isVerified:1}})
        
      console.log(updatedInfo)
      res.render('./user/emailVerified')

    } catch (error) {
        console.log(error)
        
    }
}

const getLoginPageController=async(req,res)=>{
    try {
        console.log('login page contorller')
        console.log(req.session.userId)
        if(req.session.userId){
            res.render('./user/home')
        }else{
            res.render('./user/login')
        }
    } catch (error) {
        console.log(error)

        
    } 
} 
 

const loginController=async(req,res)=>{
    try {
        const{email,password}=req.body
        if(!email || !password){

        }else{
            const user = await User.findOne({email})
            if(user){
                const validUser = await bcrypt.compare(password,user.password)
                if(validUser){ 
                    if(user.isVerified===0){
                        res.render('./user/login',{message:"please verify your mail"})
                    }else{
                        req.session.userId = user._id

                        res.redirect('/api/v1/user/home')
                    }
                }else{
                    res.render('./user/login',{message:"Wrong Password"})
                } 
            }else{
                res.render('./user/login',{message:"Email doesn't exists"})
            }
        
        }
    } catch (error) {
        console.log(error)
        
    }
}


const getHome=async(req,res)=>{
   
    try {
    const user = await User.findById(req.session.userId)
  
        res.render('./user/home',{user})
    } catch (error) {
        console.log(error)
        
    }
}

const logoutController=async(req,res)=>{
    try {
        
        req.session.destroy()
        res.redirect('/api/v1/user/login')
    } catch (error) {
        console.log(error)
        
    }

}
const forgetPasswordController=async(req,res)=>{
    try {
        res.render('./user/forget')
    } catch (error) {
        console.log(error)
    }

}

const handleForgetPassword=async(req,res)=>{
    console.log('inside forget password contooller')
    try {
        const{email}=req.body
       const user =  await User.findOne({email})
       if(!user){
        console.log('user doesnt exists')
       return res.render('./user/forget',{message:"Email is invalid"})
       }

       if(user.isVerified===0){
           res.render('./user/forget',{message:"Please verify your email first"})
        }else{
           const randomString = randomstring.generate()
           const isAdmin = user.isAdmin===1?true:false
           console.log(randomString)
         const updatedUser=  await User.updateOne({email},{$set:{token:randomString}})
         console.log(updatedUser)
        await resetPassword(user.username,user.email,randomString,isAdmin)
        res.render("./user/forget",{message:"please check your email to reset your password"})

       }

    } catch (error) {
        console.log(error)
    }
}

const showResetPasswordPage=async(req,res)=>{
    console.log('inside showreset password page')
    const {token}=req.query
    const validUser = await User.findOne({token})
    if(validUser){
        res.render('./user/reset',{userId:validUser._id})

    }else{
        console.log('invalid token')
    }
}
const resetPasswordController=async(req,res)=>{
    console.log('inside reset password controller')
  try {
    const {password,userId} = req.body
    console.log(password,userId)
    const hashedPassword = await bcrypt.hash(password,10)
  const updatedUser =   await User.updateOne({_id:userId},{$set:{password:hashedPassword}},{new:true})
  console.log(updatedUser)
    res.render('./user/login',{message:"password reset successfully"})
  } catch (error) {
    console.log(error)
    
  }
}

const loadVerification=async(req,res)=>{
    try {
        res.render('./user/verification')
    } catch (error) {
        console.log(error)
    }
}

const sendVerification=async(req,res)=>{
    try {
        const {email}=req.body
        const user = await User.findOne({email})
        if(user){
          await  sendVerifyMail(user.username,user.email,user._id)
            
          res.render('./user/verification',{message:"verification mail sent to your email , please check"})
        }else{
            res.render('./user/verification',{message:"this email is not registered"})
        }
        
    } catch (error) {
        console.log(error)
    }
}
const loadEditpage=async(req,res)=>{
    console.log('inside edit controller')
    try {
        const {id} = req.query
        console.log(id)
        const user = await User.findById(id)
        res.render('./user/editPage',{user})
    } catch (error) {
        
    }
}
const editProfile=async(req,res)=>{
    try {
        const{id,username,email,mobile}=req.body
        console.log(username,email,mobile)
        const avatar  = req.file?.filename || null
        const user = await User.findById(id)
        if(avatar){
            console.log('avatar present')
        await User.updateOne({_id:id},{$set:{username,email,mobile,avatar}})

            
        }else{
            console.log('no avatar')
           await User.updateOne({_id:id},{$set:{username,email,mobile}})
        }
        const updateUser = await User.findById(id)
        res.render('./user/home',{user:updateUser})
    } catch (error) {
        console.log(error)
    }
}

export {userRegister,getUserRegisterForm,verifyMail,getLoginPageController,loginController,getHome,logoutController,forgetPasswordController,handleForgetPassword,resetPasswordController,showResetPasswordPage,loadVerification,sendVerification,loadEditpage,editProfile} 