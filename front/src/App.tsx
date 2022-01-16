import React from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';

const ws = new WebSocket('ws://localhost:5000');
ws.binaryType = 'arraybuffer';

const STATUS_OFFLINE = 'Disconnected';
const STATUS_ONNLINE = 'Online';

function App() {
    const [messages, setMessages] = React.useState<string[]>([]);
    const [input, setInput] = React.useState<string>('');
    const [status, setStatus] = React.useState<string>(STATUS_OFFLINE);

    ws.onopen = () => setStatus(STATUS_ONNLINE);

    ws.onclose = () => setStatus(STATUS_OFFLINE);

    ws.onmessage = (response) => {
        console.log('response', response.data);
        setMessages((prev) => [...prev, response.data]);
    };

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        ws.send(input);
        setInput('');
    };

    return (
        <div>
            <form onSubmit={sendMessage}>
                <div className={styles.status}>{status}</div>
                <div className={styles.item}>
                    <div className={styles.message}>
                        {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                </div>
                <div className={styles.item}>
                    <input
                        type="text"
                        placeholder="Введите текст и нажмите Enter"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            </form>
        </div>
    );
}

export default App;
