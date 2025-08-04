import React, {useRef} from "react";

const ChatForm =({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();
    const handleFormSubmit =(e) => {
        e.preventDefault();
        const message = inputRef.current.value.trim();
        if(!message)return;
        inputRef.current.value = "";
        // Add the message to chat history users message
        setChatHistory(history => [...history, {role: 'user', text: message }]);

        setTimeout(()=> {
            // Add the "Thinking..." placeholder from the bot's response
            setChatHistory(history => [...history, { role: 'model', text: "Thinking..."}]);
            //call the function to generate the bot response
            generateBotResponse([...chatHistory, {role: 'user', text: message}])
        }, 500);


    }
    return (
        <>
         <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
              <input ref={inputRef} type="text" className="message-input" placeholder="Type your message..." required/>
          <button className="material-symbols-rounded">arrow_upward</button>
            </form>
        </>
    )
}

export default ChatForm;