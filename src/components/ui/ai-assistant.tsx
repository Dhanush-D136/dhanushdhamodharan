import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const suggestions = [
  "Who is Dhanush?",
  "Show his top projects",
  "His achievements?",
  "How can I contact him?",
];

const responses: Record<string, string> = {
  "who is dhanush?": 
    "Dhanush Dhamodharan (Dhanu) is a B.Tech Artificial Intelligence and Data Science undergraduate (CGPA: 8.91). He is an AI Developer, Instagram Tech Content Creator, and Placement Coordinator. He designs intelligent software and machine learning solutions.",
  
  "show his top projects": 
    "His main projects include:\n1. **Crop Yield Prediction:** A machine learning model using satellite imagery, soil, and historical climate weather metrics.\n2. **AI Student Tracking:** A computer vision CCTV model with automated facial recognition attendance.\n3. **EduSync AI:** A comprehensive digital campus administration system.",
  
  "his achievements?": 
    "Key milestones:\n- B.Tech CGPA of **8.91**.\n- Completed **Computer Vision Internship** at NSIC (National Small Industries Corp).\n- Class Representative & Engineering Placement Coordinator.\n- Certified in **Azure AI**, **Oracle Cloud AI**, and **SageMaker**.",
  
  "how can i contact him?": 
    "You can reach Dhanush instantly via:\n- **Email:** dhanushsinger872@gmail.com\n- **WhatsApp & Call:** +91 9994726807\n- **LinkedIn:** Dhanush Dhamodharan\n- **GitHub:** Dhanush-D136"
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      text: "Hello! I am Dhanu's Holographic Assistant. Ask me anything about his credentials, achievements, or tech stacks!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Dynamic NLP-like keyword extraction
    const query = text.toLowerCase().trim();
    let responseText = "I'm still learning! You can contact Dhanush directly at +91 9994726807 or check out his projects by using the suggestion chips below.";

    for (const key of Object.keys(responses)) {
      if (query.includes(key.replace("his ", "").replace("show ", "")) || key.includes(query)) {
        responseText = responses[key];
        break;
      }
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }, 900);
  };

  return (
    <>
      {/* Floating Holographic Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center bg-black border border-white/20 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group animate-hologram"
        aria-label="AI Chatbot Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#C3E41D]" />
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6 text-[#C3E41D] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Holographic Assistant Terminal */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[340px] sm:w-[380px] h-[480px] rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col z-[100] bg-neutral-950/90 backdrop-blur-xl animate-float-slow"
          style={{
            boxShadow: "0 20px 50px rgba(19, 24, 48, 0.4), inset 0 0 20px rgba(191, 149, 63, 0.05)"
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-900 bg-neutral-950 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative p-1.5 rounded-lg bg-neutral-900 border border-[#C3E41D]/20">
                <Sparkles className="w-4 h-4 text-[#C3E41D]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white font-space-grotesk tracking-wide">DHANU_AI_CORE</h3>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Interactive Hologram</span>
                </div>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Bubble Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-neutral-900 border-neutral-800 text-[#C3E41D]" : "bg-neutral-950 border-[#C3E41D]/15 text-white"}`}>
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${msg.sender === "user" ? "bg-[#C3E41D]/10 text-white rounded-tr-none border border-[#C3E41D]/20" : "bg-neutral-900/60 border border-neutral-900 text-neutral-200 rounded-tl-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full border bg-neutral-950 border-[#C3E41D]/15 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-900 rounded-tl-none flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3E41D] animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3E41D] animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3E41D] animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 border-t border-neutral-900/50 bg-neutral-950/20 flex flex-wrap gap-1.5">
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="text-[10px] px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-950 hover:border-[#C3E41D]/30 hover:bg-[#C3E41D]/5 transition-colors text-neutral-400 hover:text-white"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-neutral-900 bg-neutral-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask core AI about Dhanush..."
              className="flex-1 bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D]/55 transition-colors font-sans"
            />
            <button
              type="submit"
              className="p-2 bg-[#C3E41D] text-black hover:opacity-90 rounded-xl active:scale-95 transition-all"
            >
              <Send size={14} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
