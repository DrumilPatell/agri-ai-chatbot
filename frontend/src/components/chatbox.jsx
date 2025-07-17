import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import ReactMarkdown from "react-markdown";

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome! Ask me about crop yield or farming help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestions = [
    "Which fertilizer is best for tomatoes?",
    "How much rainfall is good for rice?",
    "Tips for wheat cultivation?",
    "Predict crop yield for maize",
  ];

  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSend = async (msgToSend) => {
    const message = msgToSend || input;
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setShowSuggestions(false); // Hide suggestions after first interaction

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setTyping(false);

      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Failed to connect to server." },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(false); // Hide if user starts typing
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 sm:h-[80vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-lime-500 text-white p-4 font-semibold text-lg">
        🌾 AgriBot Chat Assistant
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={`relative w-fit px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-green-100 self-end text-right ml-auto tail-user"
                  : "bg-white self-start text-left mr-auto border tail-bot"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </motion.div>
          ))}

          {/* 🌱 Suggestions inside chat area */}
          {showSuggestions && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <div className="flex flex-wrap justify-center gap-3 backdrop-blur-sm bg-white/30 px-2 py-3 rounded-xl">
                {suggestions.map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sugg)}
                    className="px-4 py-2 text-sm text-green-800 bg-green-100/80 hover:bg-green-200/80 rounded-full shadow transition-all"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Typing Indicator */}
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white w-fit self-start mr-auto px-4 py-3 rounded-2xl text-sm border flex gap-1"
            >
              <span className="animate-pulse">🤖</span>
              <span className="animate-pulse">Typing</span>
              <span className="animate-pulse">.</span>
              <span className="animate-pulse">.</span>
              <span className="animate-pulse">.</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <div className="border-t px-4 py-3 flex items-center gap-2 bg-white">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        />
        <button
          onClick={() => handleSend()}
          className="bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
