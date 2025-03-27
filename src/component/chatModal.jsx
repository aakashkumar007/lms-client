import { useState, useRef, useEffect } from "react";
import { X, Loader2, Send } from "lucide-react";
import axios from "axios";

export default function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hello! I am Lexi. How can I assist you?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const api_url = import.meta.env.VITE_API_URL;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${api_url}/chat`, { message: input });

      setMessages([...newMessages, { role: "bot", text: response.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", text: "Error: Unable to connect to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-2 lg:right-8">
      <div className=" w-[100%] h-[32rem] bg-white shadow-2xl rounded-2xl p-4 flex flex-col border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Lexi - Your Library Assistant</h3>
          <button onClick={onClose} className="hover:text-red-500 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] text-sm ${
                msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Lexi is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t pt-2 flex">
          <input
            type="text"
            className="flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition"
            onClick={sendMessage}
            disabled={loading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
