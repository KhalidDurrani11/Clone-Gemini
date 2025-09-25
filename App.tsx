import React, { useRef, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { useChat } from './hooks/useChat';
import { Icon } from './components/Icon';

const suggestionCards = [
    { icon: 'quill', title: 'Create a story', prompt: 'Tell me a short story about a brave knight and a friendly dragon.' },
    { icon: 'code', title: 'Debug my code', prompt: 'I have a Javascript function that is not working. Here is the code: `function example() { return 1 + "1" }`. What is wrong with it?' },
    { icon: 'idea', title: 'Brainstorm ideas', prompt: 'Brainstorm three creative and catchy names for a new coffee shop.' },
    { icon: 'palette', title: 'Design a color palette', prompt: 'Create a color palette for a website with a calm and professional feel.' },
] as const;

const App: React.FC = () => {
  const { messages, isLoading, error, sendMessage, startNewChat } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex h-screen font-sans text-gray-100 bg-[#13171a]">
      <Sidebar onNewChat={startNewChat} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col flex-1 h-screen">
        <header className="flex items-center h-[65px] border-b border-gray-800 p-4 md:hidden">
            {/* Mobile header can be added here if needed */}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto h-full">
            {messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-50"></div>
                  <div className="relative inline-block p-4 bg-gray-800/50 rounded-full">
                    <Icon name="gemini" className="w-16 h-16" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mt-4 text-gray-300">Hello, how can I help you today?</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full">
                  {suggestionCards.map((card) => (
                    <button 
                      key={card.title}
                      onClick={() => handleSuggestionClick(card.prompt)}
                      className="bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-lg text-left transition-colors flex items-center gap-4"
                    >
                      <Icon name={card.icon} className="w-8 h-8 text-gray-400" />
                      <div>
                        <h2 className="font-semibold">{card.title}</h2>
                        <p className="text-sm text-gray-500 line-clamp-2">{card.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {messages.map((msg, index) => (
                  <ChatMessage key={msg.id} message={msg} isLoading={isLoading && index === messages.length -1} />
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
            {error && (
              <div className="bg-red-500/20 text-red-300 p-4 rounded-lg my-4">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        </main>
        <footer className="p-6 bg-[#13171a]/50 backdrop-blur-sm border-t border-gray-800/50">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;