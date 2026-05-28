import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Remove client-side GoogleGenAI initialization
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBot({ isDarkMode }: { isDarkMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de **VinculaTec**. Estoy aquí para resolver tus dudas sobre el portal y los trámites de Servicio Social. ¿En qué puedo apoyarte?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: userMessage.content }] }
          ],
          systemInstruction: `Eres un asistente virtual experto y estrictamente enfocado en la plataforma 'VinculaTec'. Tu única misión es guiar a los estudiantes en su proceso administrativo de Servicio Social dentro del portal.

REGLAS CRÍTICAS DE COMPORTAMIENTO:
1. TONO: Profesional, ejecutivo, empático pero muy concreto. Usa listas claras y negritas para resaltar puntos clave.
2. LÍMITE DE DOMINIO: Solo respondes dudas sobre:
   - Requisitos de acceso (70% de créditos, créditos complementarios).
   - Documentación técnica (Cartas de Aceptación, Compromiso, Reportes Bimestrales, Liberación).
   - Uso de la plataforma VinculaTec (Problemas de acceso, carga de archivos, navegación).
   - Catálogo de dependencias disponibles.
3. RECHAZO DE TAREAS AJENAS: Si el usuario pide cosas no relacionadas con el portal o el servicio social (ej: pedir comida, chistes, programación, temas personales), debes responder con cortesía: "Lo lamento, mi función se limita exclusivamente a la orientación técnica del portal VinculaTec y trámites de Servicio Social. ¿Tienes alguna duda sobre tu proceso?"
4. ESTILO: Evita introducciones largas. Ve directo al grano. Formatea las respuestas usando Markdown (listas, negritas, saltos de línea) para que sean fáciles de leer en una ventana de chat pequeña.
5. IDIOMA: Español de México.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Gemini API');
      }

      const data = await response.json();
      const text = data.text;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text || "Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías intentar de nuevo?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Lo siento, parece que hay un problema con mi conexión. Por favor, intenta más tarde.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[200] transition-colors duration-500`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`absolute bottom-20 right-0 w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border transition-colors duration-500 ${
              isDarkMode 
                ? 'bg-[#121926] border-neutral-800' 
                : 'bg-white border-neutral-100'
            }`}
          >
            {/* Header */}
            <div className={`p-6 flex items-center justify-between relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333]' : 'bg-brand-blue'} text-white`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-transparent opacity-50"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-brand-teal/10' : 'bg-brand-teal/20'}`}>
                  <Bot size={24} className="text-brand-teal" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-none mb-1">Asistente VinculaTec</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">En línea</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                id="close-chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-neutral-50/50'}`}>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-500 ${
                      message.role === 'user' 
                        ? 'bg-brand-blue text-white' 
                        : isDarkMode 
                          ? 'bg-[#1a2333] text-brand-teal border border-neutral-800'
                          : 'bg-white text-brand-blue border border-neutral-100'
                    }`}>
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed transition-colors duration-500 ${
                      message.role === 'user' 
                        ? 'bg-brand-blue text-white font-medium rounded-tr-none shadow-md shadow-brand-blue/10' 
                        : isDarkMode
                          ? 'bg-[#121926] text-neutral-300 font-medium rounded-tl-none shadow-sm border border-neutral-800'
                          : 'bg-white text-neutral-600 font-medium rounded-tl-none shadow-sm border border-neutral-100'
                    }`}>
                      <div className={`markdown-body prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-neutral-300' : 'prose-neutral text-neutral-600'}`}>
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800 text-brand-teal' : 'bg-white border-neutral-100 text-brand-blue'}`}>
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                    <div className={`p-4 rounded-2xl rounded-tl-none border shadow-sm flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-6 border-t transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu duda aquí..."
                  className={`w-full pl-6 pr-14 py-4 border rounded-3xl outline-none focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal transition-all text-sm font-bold ${
                    isDarkMode 
                      ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' 
                      : 'bg-neutral-50 border-neutral-100 text-neutral-800 placeholder:text-neutral-300'
                  }`}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode 
                      ? 'bg-brand-teal text-[#0a0f18] hover:bg-brand-teal/80 shadow-brand-teal/10' 
                      : 'bg-brand-blue text-white hover:bg-[#162a45] shadow-brand-blue/10'
                  }`}
                  id="send-message"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-brand-orange" />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>IA impulsada por Gemini</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center relative overflow-hidden group border-2 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#1a2333] text-brand-teal border-neutral-700 shadow-brand-teal/10' 
            : 'bg-brand-blue text-white border-white/10 shadow-brand-blue/30'
        }`}
        id="toggle-chat"
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-brand-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="translate-y-0.5" />}
      </motion.button>
    </div>
  );
}
