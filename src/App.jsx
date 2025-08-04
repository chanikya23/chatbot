import React, {useRef, useEffect, useState} from "react";
import ChatboatIcon from "./components/chatboatIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

const App =() => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false)=>{
      setChatHistory(prev => [...prev.filter(msg =>msg.text !=="Thinking..."), {role: "model",text, isError}])
    }
  const contents = history.map(({ role, text }) => ({
    role,
    parts: [{ text }]
  }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({ contents })
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");
      // clean and update chat history with bot's response.
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
      return data;
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(()=>{
    //Auto-Scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" })
  },[chatHistory]);

  return (
    <>
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button id="chatbot-toggle" onClick={()=>setShowChatbot(prev => !prev)}>
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatboat-popup">
        {/* chatboat header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatboatIcon />
            <h1>Chatboat</h1>
          </div>
          <button className="material-symbols-rounded" onClick={()=>setShowChatbot(prev => !prev)}>keyboard_arrow_down</button>

        </div>
        {/* chatboat body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatboatIcon />
            <p className="message-text">Hello, I am your Chatboat 🤖</p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage  key = {index} chat ={chat}/>
          ))}

        </div>

          {/* chatboat - footer */}
          <div className="chat-footer">
           <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
          </div>
      </div>
    </div>
    </>
  )
}

export default App;