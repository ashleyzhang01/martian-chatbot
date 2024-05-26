import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';

type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export default function Home() {
    const [message, setMessage] = useState('');
    const [willingnessToPay, setWillingnessToPay] = useState('0.1');
    const [maxCost, setMaxCost] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const sendMessage = async () => {
        setIsLoading(true);
        var requestBody = {
            message,
            willingnessToPay: parseFloat(willingnessToPay),
            maxCost: maxCost ? parseFloat(maxCost) : 0.0,
            chatHistory: chatHistory
        };

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'assistant', content: data }]);
        } catch (error) {
            console.error('Failed to fetch:', error);
            setChatHistory([...chatHistory, { role: 'system', content: 'Failed to communicate with the API.' }]);
        }
        setMessage('');
        setIsLoading(false);
    };

    return (
        <>
        <h1 className="text-4xl mt-24 text-center">Chatbot</h1>
        <div className="max-w-5xl h-3/4 mx-auto mt-8 p-4 space-y-4 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between">
                <label className="block w-3/5">
                    <span className="text-gray-700 ">Willingness to Pay</span>
                    <div className="relative w-full mt-1 mb-4">
                        <input
                            type="range"
                            min="0.00"
                            max="1"
                            step="0.05"
                            value={willingnessToPay}
                            onChange={e => setWillingnessToPay(e.target.value)}
                            className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer slider-thumb text-black"
                        />
                            <div
                                style={{ position: 'absolute', bottom: '-20px', left: `${parseFloat(willingnessToPay) * 100}%`, transform: 'translateX(-50%)' }}
                                className="text-sm text-black"
                            >
                                {willingnessToPay}
                            </div>
                    </div>
                </label>
                <input
                    type="number"
                    value={maxCost}
                    onChange={e => setMaxCost(e.target.value)}
                    placeholder="Max Cost ($)"
                    step="0.01"
                    className="w-1/3 h-12 mt-2 p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500 text-black"
                />
            </div>
            <div className="space-y-2 overflow-y-auto h-96 bg-gray-50 p-2 rounded text-black">
                {chatHistory.map((chat, index) => (<>
                    <div key={index} className={`text-sm p-2 rounded-lg ${chat.role === 'user' ? 'bg-blue-100 text-blue-800 self-end' : 'bg-gray-100 text-gray-800 self-start'} inline-block`} style={{marginLeft: chat.role === 'user' ? '24px' : '0', float: chat.role === 'user' ? 'right' : 'left', marginRight: chat.role === 'assistant' ? '24px' : '0'}}>
                        {chat.content}
                    </div>
                    <br></br></>
                ))}
                <div ref={endOfMessagesRef}></div>
            </div>
            {isLoading && (
                <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                        <span className="visually-hidden">...</span>
                    </div>
                </div>
            )}
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here"
                className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500 text-black"
                style={{ resize: 'none', height: '100px' }}
            ></textarea>
            <button 
                onClick={sendMessage}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Send Message
            </button>
        </div>
        </>
    );
}