// src/Chatbot.js
import React, { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user's message locally
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Send message to backend (GROQ API)
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        const botMessage = { text: data.reply, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Error from backend:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Chatbot</h1>
      <div style={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              textAlign: message.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                ...styles.bubble,
                backgroundColor: message.sender === "user" ? "#DCF8C6" : "#EEE",
              }}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form style={styles.form} onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    padding: "20px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f7f7f7",
  },
  chatContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  message: {
    marginBottom: "10px",
  },
  bubble: {
    display: "inline-block",
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: "80%",
  },
  form: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "15px",
    border: "none",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "15px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Chatbot;
