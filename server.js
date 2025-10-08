import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.static("public"));
const upload=multer({dest:"uploads/"});

// ⚡ Use GEMINI_API_KEY from .env or Replit/Render Secrets
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";

app.post("/ask", upload.single("image"), async (req,res)=>{
  const question=req.body.question||"";
  const image=req.file?fs.readFileSync(req.file.path):null;

  const payload={contents:[{parts:[{text:`Answer simply for DPS students 1–12: ${question}` }]}]};

  try{
    const response=await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key="+GEMINI_API_KEY,
      {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)}
    );
    const data=await response.json();
    const answer=data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";
    res.json({answer});
  }catch(err){res.json({answer:"Error: "+err.message});}
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("Server running on port "+PORT));
