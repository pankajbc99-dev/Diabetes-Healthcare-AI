
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chatWithCapsule } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const CapsuleChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Capsule, your DHCP health assistant. How can I help you understand your diabetes risk or manage your well-being today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithCapsule(input, messages);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "I'm sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Capsule AI</h3>
            <p className="text-xs text-emerald-500 font-medium">Online • AI Health Assistant</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-blue-400" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100 text-blue-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 shadow-sm text-slate-700'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Capsule about diabetes symptoms, management..."
          className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default CapsuleChat;
