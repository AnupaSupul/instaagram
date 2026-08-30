import { useEffect, useRef, useState } from 'react';
import { fetchMessages, createMessage } from '../../services/api';
import './Messages.css';

// The two known users for this first version
const USERS = [
    { id: '1', username: 'johndoe' },
    { id: '2', username: 'anupa' },
];

const WS_URL = 'ws://localhost:3001';

function Messages() {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    // ── Connect WebSocket once on mount ──────────────────────
    useEffect(() => {
        if (!currentUser) return;

        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'register', userId: currentUser.id }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'chat') {
                // Only append if the message belongs to the open conversation
                setMessages((prev) => {
                    const alreadyAdded = prev.some((m) => m.id === msg.id);
                    if (alreadyAdded) return prev;
                    return [...prev, msg];
                });
            }
        };

        ws.onerror = (err) => console.error('WebSocket error:', err);

        return () => {
            ws.close();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Load message history when conversation partner changes ─
    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        fetchMessages(currentUser.id, selectedUser.id)
            .then((data) => {
                // Sort oldest → newest
                const sorted = data.slice().sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
                setMessages(sorted);
            })
            .catch((err) => console.error('Error fetching messages:', err));
    }, [selectedUser]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Auto-scroll to newest message ────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Send ─────────────────────────────────────────────────
    const handleSend = async () => {
        if (!messageText.trim() || !selectedUser) return;

        const msg = {
            id: crypto.randomUUID(),
            type: 'chat',
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            text: messageText.trim(),
            timestamp: new Date().toISOString(),
        };

        // 1. Send real-time via WebSocket
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg));
        }

        // 2. Persist to json-server
        await createMessage(msg);

        // 3. Show in own chat immediately
        setMessages((prev) => [...prev, msg]);
        setMessageText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Conversation partners — everyone except yourself
    const conversationList = USERS.filter((u) => u.id !== currentUser?.id);

    return (
        <div className="messages-page">

            {/* ── LEFT: conversation list ── */}
            <aside className="messages-sidebar">
                <h2 className="messages-sidebar-title">Messages</h2>
                <ul className="conversation-list">
                    {conversationList.map((u) => (
                        <li
                            key={u.id}
                            className={`conversation-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                            onClick={() => setSelectedUser(u)}
                        >
                            <div className="conv-avatar">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="conv-username">{u.username}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* ── RIGHT: chat area ── */}
            <main className="messages-main">
                {!selectedUser ? (
                    <div className="messages-empty">
                        <div className="messages-empty-icon">
                            <i className="bi bi-chat-square-dots"></i>
                        </div>
                        <h3>Your messages</h3>
                        <p>Select a conversation to start chatting.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="chat-header">
                            <div className="conv-avatar small">
                                {selectedUser.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="chat-header-name">{selectedUser.username}</span>
                        </div>

                        {/* Message bubbles */}
                        <div className="chat-body">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`bubble-row ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
                                >
                                    <div className="bubble">
                                        {msg.text}
                                        <span className="bubble-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="chat-input-bar">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="chat-send-btn" onClick={handleSend}>
                                Send
                            </button>
                        </div>
                    </>
                )}
            </main>

        </div>
    );
}

export default Messages;