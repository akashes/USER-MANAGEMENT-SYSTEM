import nodemailer from 'nodemailer'
import { emailUser,emailPassword } from '../config/config.js'



//helper functions
export const sendVerifyMail=async(name,email,id)=>{
    console.log('inside serndverify util')
    console.log(name,email,id)

    try {

      const transporter=  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:emailUser,
                pass:emailPassword,
            }
        })

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to:email,
            subject:'For Verification mail',
            html:'<p>Hi '+ name +' , please click here to <a href="http://127.0.0.1:8080/api/v1/user/verify?id='+id+'"> Verify </a> your mail. </p> '
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent :- ", info.response)
            }

        })
        
    } catch (error) {
        console.log(error)
        
    }

}


//for password reset

export const resetPassword=async(name,email,token,isAdmin)=>{
    console.log('inside resetPassword util')

    try {

      const transporter=  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:emailUser,
                pass:emailPassword,
            }
        })

        const mailOptions = {
            from: emailUser,
            to:email,
            subject:'For Reset Password',
            
            html: isAdmin ?  '<p>Hi '+ name +' , please click here to <a href="http://127.0.0.1:8080/api/v1/admin/reset-password?token='+token+'"> Reset </a> your Password. </p> '
            : '<p>Hi '+ name +' , please click here to <a href="http://127.0.0.1:8080/api/v1/user/reset-password?token='+token+'"> Reset </a> your Password. </p> '

        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent :- ", info.response)
            }

        })
        
    } catch (error) {
        console.log(error)
        
    }

}


export const AdminSendVerifyMail=async(name,email,password,id)=>{
    console.log('inside serndverify util')
    console.log(name,email,id)

    try {

      const transporter=  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:emailUser,
                pass:emailPassword,
            }
        })

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to:email,
            subject:'For verify your mail, by admin',
            html:'<p>Hi '+ name +' , please click here to <a href="http://127.0.0.1:8080/api/v1/user/verify?id='+id+'"> Verify </a> your mail. </p> <br><br> <b>Email:</b>'+email+'<br><b>Password:</b>'+password+''
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent :- ", info.response)
            }

        })
        
    } catch (error) {
        console.log(error)
        
    }

}