import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Alumno, Dependencia } from "./server/models.js";

dotenv.config();

let isDbConnected = false;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vinculatec";

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000, 
    });
    console.log("🔌 Connected successfully to MongoDB at " + MONGO_URI);
    isDbConnected = true;
  } catch (err: any) {
    console.warn("⚠️ Could not connect to MongoDB (running in offline/mock demo mode):", err.message);
    isDbConnected = false;
  }
}

async function startServer() {
  await connectMongo();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database Connection Status
  app.get("/api/db-status", (req, res) => {
    res.json({ connected: isDbConnected, uri: MONGO_URI });
  });

  // ==========================================================================
  // 🏢 DEPENDENCY ENDPOINTS
  // ==========================================================================
  app.get("/api/dependencias", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.json({ success: false, reason: "database_not_connected", data: [] });
      }
      const list = await Dependencia.find();
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/dependencias/:id", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }
      const dep = await Dependencia.findById(req.params.id);
      if (!dep) return res.status(404).json({ success: false, error: "Dependencia no encontrada" });
      res.json({ success: true, data: dep });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/dependencias", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }
      const depData = req.body;
      let dep;

      if (depData.id && mongoose.Types.ObjectId.isValid(depData.id)) {
        dep = await Dependencia.findByIdAndUpdate(depData.id, depData, { new: true });
      } else if (depData._id && mongoose.Types.ObjectId.isValid(depData._id)) {
        dep = await Dependencia.findByIdAndUpdate(depData._id, depData, { new: true });
      } else {
        // Remove empty ids to avoid casting errors
        delete depData.id;
        delete depData._id;
        dep = await Dependencia.create(depData);
      }

      res.json({ success: true, data: dep });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/dependencias/:id", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }
      await Dependencia.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================================================
  // 🎓 ALUMNO / STUDENT ENDPOINTS
  // ==========================================================================
  app.get("/api/alumnos", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.json({ success: false, reason: "database_not_connected", data: [] });
      }
      const list = await Alumno.find().populate('id_dependencia');
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/alumnos/:id", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }
      const student = await Alumno.findById(req.params.id).populate('id_dependencia');
      if (!student) return res.status(404).json({ success: false, error: "Alumno no encontrado" });
      res.json({ success: true, data: student });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/alumnos/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Standard local admin accounts
      if (email === 'admin@cancun.tecnm.mx' || email === 'ss_vinculacion@cancun.tecnm.mx' || email === 'admin') {
        if (password === 'admin' || password === 'TecCancun2026*') {
          return res.json({
            success: true,
            user: {
              id: 'admin_id',
              name: 'Administrador VinculaTec',
              role: 'admin',
              email: 'ss_vinculacion@cancun.tecnm.mx',
              profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
            }
          });
        }
      }

      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }

      // Check both credentials.correo, datos.no_control, or datos.correo_institucional
      const student = await Alumno.findOne({
        $or: [
          { 'credenciales.correo': email },
          { 'datos.no_control': email },
          { 'datos.correo_institucional': email }
        ]
      }).populate('id_dependencia');

      if (!student) {
        return res.status(404).json({ success: false, message: "Usuario o matrícula no encontrados" });
      }

      if (student.credenciales?.password !== password) {
        return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }

      res.json({ success: true, alumno: student });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/alumnos", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }
      const data = req.body;
      let student;

      if (data.id && mongoose.Types.ObjectId.isValid(data.id)) {
        student = await Alumno.findByIdAndUpdate(data.id, data, { new: true });
      } else if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        student = await Alumno.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        delete data.id;
        delete data._id;
        student = await Alumno.create(data);
      }

      res.json({ success: true, data: student });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/alumnos/:id", async (req, res) => {
    try {
      if (!isDbConnected) {
        return res.status(503).json({ success: false, reason: "database_not_connected" });
      }
      
      const student = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!student) return res.status(404).json({ success: false, error: "Alumno no encontrado" });
      
      res.json({ success: true, data: student });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================================================
  // 🧠 GEMINI DECORATOR ROUTE
  // ==========================================================================
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY as string,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages,
        config: {
          systemInstruction: systemInstruction as string
        }
      });

      const responseText = response.text;
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini Proxy Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // serve SPA frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
