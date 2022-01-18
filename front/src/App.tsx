import React from 'react';
import { PlayOnlinePage } from './components/virtualPiano/PlayOnlinePage';


function App() {
    // const [messages, setMessages] = React.useState<string[]>([]);
    // const [input, setInput] = React.useState<string>('');
    // const [status, setStatus] = React.useState<string>(STATUS_OFFLINE);

    // ws.onopen = () => setStatus(STATUS_ONNLINE);

    // ws.onclose = () => setStatus(STATUS_OFFLINE);

    // ws.onmessage = (response) => {
    //     console.log('response', response.data);
    //     setMessages((prev) => [...prev, response.data]);
    // };

    // const sendMessage = (event: React.FormEvent) => {
    //     event.preventDefault();
    //     ws.send(input);
    //     setInput('');
    // };

    return (
        <div>
            <PlayOnlinePage />
        </div>
    );
}

export default App;
