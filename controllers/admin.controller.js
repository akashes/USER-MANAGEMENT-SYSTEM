import { User } from "../models/user.model.js"
import bcrypt from 'bcrypt'
import randomString from 'randomstring'
import { AdminSendVerifyMail, resetPassword, sendVerifyMail } from "../utils/nodemailer.util.js"
import excelJs from 'exceljs'
import { application } from "express"

import { dirname, format } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Get the file path
const __dirname = dirname(__filename); // Get the directory name


console.log(__dirname)


//html to pdf requirements
import ejs from 'ejs'
import pdf from 'html-pdf'
import fs from 'fs'
import path from 'path'

const verifyPassword = async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}
const loadAdminLogin=async(req,res)=>{
    try {
        res.render('./admin/login')
    } catch (error) {
        console.log(error)
    }
}

const adminLogin =async(req,res)=>{
    try {
        const{email,password}=req.body
        const user =await User.findOne({email})
        if(user){
            const isPasswordMatch = await verifyPassword(password,user.password)
            if(isPasswordMatch){
                if(user.isAdmin===0){
                    res.render('./admin/login',{message:"Sorry you are not an Admin"})

                }else{
                    req.session.userId = user._id

                    res.redirect('/api/v1/admin/home')
                }
            }else{
                res.render('./admin/login',{message:"Wrong Password"})

            }

        }else{
            res.render('./admin/login',{message:"Email doesnt exists"})
        }
    } catch (error) {
        console.log(error)
        
    }
}
const loadAdminHome=async(req,res)=>{
    try {
    const user =   await User.findById(req.session.userId)

        res.render('./admin/home',{user})
    } catch (error) {
        console.log(error)
        
    }
}

const adminLogout=async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/api/v1/admin')
    } catch (error) {
        console.log(error)
    }
}

const loadForget=async(req,res)=>{
    try {
        res.render('./admin/forget')
    } catch (error) {
        console.log(error)
        
    }
} 

const handleResetAdminPassword=async(req,res)=>{
    try {
        const{email}=req.body
        const user = await User.findOne({email})
        if(!user){
          return  res.render('./admin/forget',{message:"email doesnt exists in our database"})
        }
        if(user.isAdmin === 0){
           return res.render('./admin/forget',{message:"You are not an admin user"})
        }
        const randomstring = randomString.generate()
        await User.updateOne({email},{$set:{token:randomstring}})
        const isAdmin = user.isAdmin===1?true:false

       await resetPassword(user.username,user.email,randomstring,isAdmin)
       res.render('./admin/forget',{message:"please check your mail to reset password"})

    } catch (error) { 
        console.log(error)
    }
}

const showAdminResetPasswordPage=async(req,res)=>{
    console.log('insidee')
    try {
        const {token}=req.query
            const user = await User.findOne({token})
            if(!user){
                return res.render('./admin/forget',{message:"Invalid token"})
            }
                return res.render('./admin/reset',{userId:user._id})
        
        res.render('./admin/reset',)
    } catch (error) {
        
        console.log(error)
    }
}

const resetPasswordController=async(req,res)=>{
    const{userId,password}=req.body
    const user = await User.findById(userId)
    if(!user){
        return res.render('./admin/forget',{message:"Invalid user id"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword}})

    res.render('./admin/login',{message:"password reset successfully"})


}
const loadDashboard=async(req,res)=>{
    console.log('inside loaddashboard')
    try {
        let search = ''
        if(req.query.search){
            search=req.query.search
        }
        let page = 1
        if(req.query.page){
            page=req.query.page
        }
        const limit =2
 

        const usersData = await User.find(
            {
                isAdmin:0,
                $or:[
                    {name: {$regex: '.*' + search + '.*',$options:'i'}},
                    {email: {$regex: '.*' + search + '.*',$options:'i'}},
                    {mobile: {$regex: '.*' + search + '.*',$options:'i'}}
                    
                ]
            }
        ).limit(limit*1)
        .skip((page-1)*limit)
        .exec()
        const count = await User.find(
            { 
                isAdmin:0,
                $or:[
                    {name: {$regex: '.*' + search + '.*',$options:'i'}},
                    {email: {$regex: '.*' + search + '.*',$options:'i'}},
                    {mobile: {$regex: '.*' + search + '.*',$options:'i'}}
                    
                ]
            }
        ).countDocuments()
        res.render('./admin/dashboard',{
            userList:usersData,
            totalPages:Math.ceil(count/limit),
            currentPage:page,
            previous:page-1,
            next:page+1,
            search
        })
    } catch (error) {
        console.log(error)
    }

}

const createNewUser=async(req,res)=>{
    try {
        res.render('./admin/new-user')
    } catch (error) {
        
    }
} 

const handleCreateUser=async(req,res)=>{
    try {
        const{username,email,mobile}=req.body
        const avatar = req.file? req.file?.filename : ""
        const password = randomString.generate(8)
        let user
        if(avatar){
             user = await User.create({username,email,mobile,avatar,password})
        }else{
             user = await User.create({username,email,mobile,password})
        }
        AdminSendVerifyMail(user.username,user.email,password,user._id)
        res.redirect('/api/v1/admin/dashboard')
    } catch (error) {
        console.log(error)
        
    }
}  

const loadEditUser=async(req,res)=>{
    try {
        const {id}=req.query
        const user =await User.findById(id)
        if(user){

            res.render('./admin/editUser',{user})
        }
    } catch (error) {
        console.log(error)
        
    }
}

const editUser=async(req,res)=>{
    try {
        const{username,email,mobile,id,verify}=req.body
        console.log(username,email,mobile,id,verify)
        const updatedUser =   await User.findByIdAndUpdate(id,{$set:{username,email,mobile,isVerified:verify}})

        // res.render('./admin/updateSuccessful')
        res.redirect('/api/v1/admin/dashboard')
    } catch (error) {
        console.log(error)
        
    }
}
const deleteUser=async(req,res)=>{
    try {
        const {id}=req.query
        await User.findByIdAndDelete(id)
        res.redirect('/api/v1/admin/dashboard')
        
    } catch (error) {
        console.log(error)
        
    }
}
const exportUsersData=async(req,res)=>{
    try {
     const Workbook=new excelJs.Workbook()
     const worksheet=  Workbook.addWorksheet("User Details")

     worksheet.columns=[
        {header:'S no.',key:"s_no"},
        {header:'Name',key:"username"},
        {header:'Email',key:"email"},
        {header:'Mobile',key:"mobile"},
        {header:'Image',key:"avatar"},
        {header:'Is Admin',key:"isAdmin"},
        {header:'Is verified',key:"isVerified"},
     ]
     let counter = 1
   const userData= await User.find({isAdmin:0})
   userData.forEach((user)=>{
    user.s_no=counter
    worksheet.addRow(user)
    counter++
   })

   worksheet.getRow(1).eachCell((cell)=>{
    cell.font={bold:true}
   })

   res.setHeader(
    'Content-Type',
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
   )
   res.setHeader(
    'Content-Disposition', 
    `attachment; filename="users.xlsx`
   )
   return Workbook.xlsx.write(res).then(()=>{
    res.status(200)
   })

    } catch (error) {
        console.log(error)
    }
}
//html to pdf 
const exportUsersPdf=async(req,res)=>{
    try {
       const users=  await User.find({isAdmin:0})
       const data ={
        userList:users
       }
    const filePathName=   path.resolve(__dirname,'../views/admin/htmltopdf.ejs')
   const htmlString= fs.readFileSync(filePathName).toString()
  let options={
    format:'Letter'
    // format:"A3",
    // orientation:'portrait',
    // border:'10mm'
  }
   const ejsData= ejs.render(htmlString,data)
   pdf.create(ejsData,options).toFile('users.pdf',(err,response)=>{
    if(err) console.log(err)

       const filePath= path.resolve(__dirname,'../users.pdf')
       fs.readFile(filePath,(err,file)=>{
        if(err){
            console.log(err)
            return res.status(500).send("Could not download file")
        }

        res.setHeader('Content-Type','application/pdf')
        res.setHeader('Content-Disposition','attachment;filename="users.pdf"')

        res.send(file)

       })
    
   })
    } catch (error) {
        console.log(error)
    }

}

const logoutAdmin=async(req,res)=>{
    try {
            req.session.destroy()
            res.redirect('/api/v1/admin/login')
        
    } catch (error) {
        console.log(error)
        
    }
}
export {loadAdminLogin,adminLogin,loadAdminHome,adminLogout,loadForget,handleResetAdminPassword,showAdminResetPasswordPage,resetPasswordController,loadDashboard,createNewUser,handleCreateUser,loadEditUser,editUser,deleteUser,exportUsersData,exportUsersPdf,logoutAdmin} 