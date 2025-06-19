'use client';
import { useState } from 'react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';

export default function ChatSupport() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi. My name is Sam. How can I help you?' }
  ]);
  const [isOpen, setIsOpen] = useState(true);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulated bot reply
    setTimeout(() => {
      const botMessage = {
        sender: 'bot',
        text: `You said: "${input}"`
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);

    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 bg-[#0e1240] text-white rounded-xl shadow-xl overflow-hidden border border-[#1f2a4b]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0b0f2c] to-[#1f2a4b] text-white p-4 flex items-center gap-2">
            <div className="bg-[#1f2a4b] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              👩‍💼
            </div>
            <div>
              <p className="text-sm font-semibold">Chat Support</p>
              <p className="text-xs text-gray-300">Hi. My name is Sam. How can I help you?</p>
            </div>
          </div>

          {/* Message Area */}
          <div className="h-64 p-3 overflow-y-auto bg-[#0b0f2c] space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] p-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-[#1f2a4b] text-gray-100'
                } shadow`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 p-2 bg-[#1f2a4b]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Write a message..."
              className="flex-1 px-3 py-1 rounded-full text-sm bg-[#0b0f2c] text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="text-white hover:opacity-80"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <FiMessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
