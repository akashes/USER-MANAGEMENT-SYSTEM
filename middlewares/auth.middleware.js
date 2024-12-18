export const isLoggedIn=async(req,res,next)=>{
    try {
        if(req.session.userId){
           
            
            next()
        }else{
            res.redirect('/api/v1/user/')
        }
    } catch (error) {
        console.log(error)
        
    }
}

export const isLoggedOut=async(req,res,next)=>{
try {
        if(req.session.userId){
            
            res.redirect('/api/v1/user/home')
        }
        next()
} catch (error) {
    console.log(error)
    
}

}

export const checkSession=async(req,res,next)=>{
    if(!req.session.userId){
        res.redirect('/api/v1/user')
    }
    next()
}


export const isAdminLoggedIn=async(req,res,next)=>{
    try {
        if(req.session.userId){
            res.redirect('/api/v1/admin/dashboard')
        }else{
            next()
        }
    } catch (error) {
        
    }
}