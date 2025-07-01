import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
      }),
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response";
    setMessages([...messages, { user: input, bot: reply }]);
    setInput("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>AsadGPT</h1>
      {messages.map((msg, i) => (
        <div key={i}>
          <b>You:</b> {msg.user} <br />
          <b>AsadGPT:</b> {msg.bot}
          <hr />
        </div>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;