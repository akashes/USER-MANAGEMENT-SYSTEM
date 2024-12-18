import express from 'express'
import { loadAdminLogin,adminLogin,loadAdminHome,adminLogout,loadForget,handleResetAdminPassword,showAdminResetPasswordPage,resetPasswordController,loadDashboard,createNewUser,handleCreateUser, loadEditUser,editUser,deleteUser,exportUsersData, exportUsersPdf ,logoutAdmin} from '../controllers/admin.controller.js'
import multer from '../middlewares/multer.middleware.js'
import { isAdminLoggedIn } from '../middlewares/auth.middleware.js'

const router = new express.Router()
router.get('/home',loadAdminHome)
router.get('/',isAdminLoggedIn,loadAdminLogin)
router.post('/login',adminLogin)
router.get('/logout',adminLogout)

router.get('/forget',loadForget)
router.get('/reset-password',showAdminResetPasswordPage)
router.post('/reset',handleResetAdminPassword)
router.post('/reset-password',resetPasswordController)

router.get('/dashboard',loadDashboard)
router.get('/new-user',createNewUser)
router.post('/new-user',multer.single('avatar'),handleCreateUser)

router.get('/edit-user',loadEditUser)
router.post('/edit-user',editUser)
router.get('/delete-user',deleteUser)

//export users data
router.get('/export-users',exportUsersData)
router.get('/export-users-pdf',exportUsersPdf)

router.get('/logout',logoutAdmin)

router.get("*",(req,res)=>{
    res.redirect('/api/v1/admin')
})
export default router    