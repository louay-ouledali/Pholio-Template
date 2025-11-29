import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./styles/chatWidget.css";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: "user", content: message };
        setHistory((prev) => [...prev, userMessage]);
        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: history,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();
            const botMessage = { role: "assistant", content: data.reply };
            setHistory((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setHistory((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I'm having trouble connecting right now." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            <button className="chat-toggle-btn" onClick={toggleChat} aria-label="Toggle Chat">
                <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
            </button>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>AI Assistant</h3>
                    </div>
                    <div className="chat-body">
                        {history.length === 0 && (
                            <p className="chat-welcome" style={{ textAlign: 'center', color: 'var(--secondary-color)', marginTop: '20px' }}>
                                Hi! I'm Louay's AI assistant. Ask me anything about his work!
                            </p>
                        )}
                        {history.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                                <p style={{ margin: 0 }}>{msg.content}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-loading">
                                Thinking...
                            </div>
                        )}
                    </div>
                    <form className="chat-footer" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !message.trim()}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
