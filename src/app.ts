import express, {Application, Request, Response} from "express"

const app: Application= express()

app.use(express.json())

import routes from "./routes/index"

app.use("/api/v1", routes)

app.get("/", (req:Request, res:Response)=>{
  res.status(200).json({
    message:"Congratulations, you hit the correct server.",
    success:true
  })
})

export default app;