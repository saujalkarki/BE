import app from "./app"
import connectDB from "./config/database"

import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT

connectDB()

app.listen(PORT, ()=>{
  console.log(`Server started successfully on port ${PORT}`)
})