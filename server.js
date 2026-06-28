import express from "express";
import router from "./src/routes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port=3000;
const app=express();

app.use(express.json());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
})

app.get("/status",(req,res)=>{
    res.json({status:'ok'});
})

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`);
})