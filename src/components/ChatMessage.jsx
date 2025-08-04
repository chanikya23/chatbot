import ChatboatIcon from "./chatboatIcon";

const ChatMessage =({chat})=> {
    return (
        <>
             <div className={`message ${chat.role === "model" ? "bot": "user"}-message ${chat.isError ? 'error' : ""}`}>
                {chat.role === "model" && <ChatboatIcon />}
            <p className="message-text">{chat.text}</p>
          </div>
        </>
    )
}

export default ChatMessage;