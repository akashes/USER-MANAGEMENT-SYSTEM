import multer from "multer"

//to store multer data
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads/userImages')
    },
    //create a new file name for images
    filename:(req,file,callback)=>{
        const filename=file.originalname
        callback(null,filename)
    }
})

//filter
const fileFilter = (req,file,callback)=>{
    const allowedMimeTypes = ['image/png','image/jpeg','image/jpg']
    if(allowedMimeTypes.includes(file.mimetype)){
        callback(null,true)
    }else{
        // callback(null,false)
        return callback(new Error("Invalid file type... must be image/png , image/jpeg or image/jpg"))
    }
}

const multerConfig=multer(
    {
        storage,fileFilter
    }
)

export default multerConfig