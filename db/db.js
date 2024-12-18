import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        const connectionInstance  = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MONGODB CONNECTION ERROR`,error)
        
    }
}