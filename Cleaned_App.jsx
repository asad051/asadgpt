// AsadGPT - A ChatGPT-style AI chatbot using OpenAI API

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const AsadGPT = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Assalamu Alaikum! Mein AsadGPT hoon, aap ki kya madad kar sakta hoon?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Kuch ghalti ho gayi hai.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Error: Jawab nahi aya." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">AsadGPT 🤖</h1>
      <Card className="space-y-4 p-4 bg-white shadow-xl rounded-2xl">
        <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={\`p-3 rounded-xl \${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}\`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.content}
            </motion.div>
          ))}
        </CardContent>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Yahan apna sawal likhein..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={loading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      <p className="text-center text-xs text-muted mt-4">AsadGPT powered by OpenAI</p>
    </div>
  );
};

export default AsadGPT;