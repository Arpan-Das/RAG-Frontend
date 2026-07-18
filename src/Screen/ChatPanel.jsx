import { useState } from "react";

// {
//             id: 3,
//             role: 'assistant',
//             content:
//                 'The roadmap highlights three major priorities: onboarding improvements, stronger retention workflows, and a phased rollout for the new search experience.',
//             source: 'roadmap.pdf , radmap2.pdf',
//         },
//         {
//             id: 4,
//             role: 'user',
//             content: 'Show me where the launch timeline is referenced.',
//         },

function ChatPanel() {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState("");
    const [id, setId] = useState(0);
    const [loadSystemMessage, setLoadsystemMessage] = useState(false)

    const handelQuery = async () => {
        console.log(query);  
        var last_id = id + 1;

        setMessages(prev => [
            ...prev,
            {
                id: last_id,
                role : 'user',
                content: query
            }
        ]);

        setLoadsystemMessage(true);

        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "question": query
            })
        });  
        
        const data = await response.json();

        last_id += 1;
        setMessages(prev => [
            ...prev,
            {
                id: last_id,
                role : 'assistant',
                content: data.answer,
                source: data.sources.join(", ")
            }
        ]);  

        setId(last_id);

        setQuery("");
        setLoadsystemMessage(false);
    }



    return (
        <div className="flex h-full flex-col rounded-[28px] border border-[#e8ddd0] bg-[#fcfaf8] shadow-[0_20px_60px_-24px_rgba(77,57,38,0.28)]">
            <div className="flex items-center justify-between border-b border-[#efe4d8] px-6 py-5">
                <div>
                    <h2 className="text-lg font-semibold text-[#2f241c]">Ask about your documents</h2>
                    <p className="text-sm text-[#7a685d]">Ask questions and get grounded answers from the uploaded files.</p>
                </div>
                <div className="rounded-full border border-[#e3d5c2] bg-[#f7efe7] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#8b6d4b]">
                    Live preview
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[83%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user' ? 'bg-[#3e342b] text-[#fdf7f0]' : 'bg-[#f2e7db] text-[#2f241c]'}`}>
                            <p className="text-sm leading-6">{message.content}</p>
                            {message.source ? (
                                <div className="mt-3 flex items-center gap-2 rounded-full border border-[#dcc8b0] bg-[#fbf6ef] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#7b6347]">
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" />
                                        <path d="M14 3.5v4h4" />
                                    </svg>
                                    Sources: {message.source}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}

                {
                    loadSystemMessage && 
                    <div className="flex justify-start">
                        <div className="rounded-2xl bg-[#f2e7db] px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8b6d4b]" />
                                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8b6d4b] [animation-delay:120ms]" />
                                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8b6d4b] [animation-delay:240ms]" />
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className="border-t border-[#efe4d8] bg-[#fcfaf8] p-4">
                <form
                    className="flex items-center gap-3 rounded-2xl border border-[#e3d5c2] bg-[#fffdfb] px-3 py-2 shadow-sm"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <input
                        type="text"
                        placeholder="Ask a question about your documents"
                        className="flex-1 border-none bg-transparent px-2 py-2 text-sm text-[#2f241c] outline-none placeholder:text-[#9b8677]"
                        value = {query}
                        onChange={(e) => {setQuery(e.target.value)}}
                    />
                    <button
                        type="submit"
                        onClick={() => handelQuery()}
                        className="rounded-xl bg-[#5f4b3b] px-4 py-2 text-sm font-semibold text-[#fef8f2] transition hover:bg-[#49392d]"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatPanel;
