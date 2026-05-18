import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { api } from '../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type AgentType = 'eticaret' | 'danisman';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({ isOpen, onClose }) => {
  const [activeAgent, setActiveAgent] = useState<AgentType>('eticaret');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Ben yapay zeka asistanınızım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Call AI API
    api.chatWithAssistant({ message, mode: activeAgent })
      .then((data) => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      })
      .catch((_err) => {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0A0A0A]/90 backdrop-blur-2xl border-l border-[#2a2a2a] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 bg-[#E2E8F0] text-gray-900 px-4 py-2 rounded-lg font-medium font-body text-sm hover:bg-white transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface)] text-[#737373] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white text-black rounded-br-sm'
                        : 'bg-[#121212] border border-[#2a2a2a] text-white rounded-bl-sm prose prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-4 flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#737373] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#737373] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#737373] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Box Container */}
            <div className="p-4 bg-[#0A0A0A]/90 backdrop-blur-xl">
              <PromptInputBox
                onSend={handleSendMessage}
                isLoading={isTyping}
                placeholder={activeAgent === 'eticaret' ? "E-Ticaret verilerimi analiz et..." : "Danışmana soru sor..."}
                activeAgent={activeAgent}
                onAgentChange={setActiveAgent}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
