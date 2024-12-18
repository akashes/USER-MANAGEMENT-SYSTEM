import express from 'express'
import { userRegister , getUserRegisterForm, verifyMail,getLoginPageController,loginController,getHome,logoutController,forgetPasswordController,handleForgetPassword,showResetPasswordPage,resetPasswordController,loadVerification,sendVerification,loadEditpage,editProfile} from '../controllers/user.controller.js'
import multer from '../middlewares/multer.middleware.js'
import { isLoggedIn,isLoggedOut } from '../middlewares/auth.middleware.js'


const userRoute = new express.Router()


userRoute.get('/register',getUserRegisterForm)
userRoute.post('/register',multer.single('avatar'),userRegister)
userRoute.get('/verify',verifyMail)


userRoute.get('/home',isLoggedIn,getHome)
userRoute.get('/',getLoginPageController)
userRoute.get('/login',getLoginPageController)
userRoute.post('/login',loginController)

userRoute.get('/logout',logoutController)
userRoute.get('/forget',forgetPasswordController)

userRoute.post('/forget-password',handleForgetPassword)
userRoute.get('/reset-password',showResetPasswordPage)

//form submission for reset password
userRoute.post('/reset-password',resetPasswordController)




userRoute.get('/verification',loadVerification)
userRoute.post('/verification',sendVerification)

//edit profile
userRoute.get('/edit',isLoggedIn,loadEditpage)
userRoute.post('/edit',isLoggedIn,multer.single('avatar'),editProfile)

export{userRoute}     