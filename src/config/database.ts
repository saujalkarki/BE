import mongoose from "mongoose"

const connectDB =async (): Promise<void>=>{
  try{
const connection  = await mongoose.connect(process.env.MONGO_URI as string)

console.log(`Database Connection Success: ${connection.connection.host}`)
  }catch(err){
    console.log("Error while connecting DB",err)
  }
}

export default connectDB