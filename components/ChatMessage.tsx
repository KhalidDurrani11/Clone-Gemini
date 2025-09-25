import React from 'react';
// Fix: Import TextPart to use in type predicate.
import type { Message, MessagePart, TextPart } from '../types';
import { Role } from '../types';
import { Icon } from './Icon';
import { CodeBlock } from './CodeBlock';

interface ChatMessageProps {
  message: Message;
  isLoading: boolean;
}

const parseInlineFormatting = (text: string): React.ReactNode => {
    // Handles **bold** and *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <b key={index}>{part.slice(2, -2)}</b>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <i key={index}>{part.slice(1, -1)}</i>;
        }
        return part;
    });
};

const formatText = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(React.createElement(listType!, { key: `list-${elements.length}`, className: `list-inside ${listType === 'ol' ? 'list-decimal' : 'list-disc'}` }, ...listItems));
            listItems = [];
            listType = null;
        }
    };

    lines.forEach((line, index) => {
        if (line.trim() === '') {
            flushList();
            return;
        }

        const olMatch = line.match(/^(\d+)\.\s(.*)/);
        const ulMatch = line.match(/^[-*]\s(.*)/);

        if (olMatch) {
            if (listType !== 'ol') flushList();
            listType = 'ol';
            listItems.push(<li key={index}>{parseInlineFormatting(olMatch[2])}</li>);
        } else if (ulMatch) {
            if (listType !== 'ul') flushList();
            listType = 'ul';
            listItems.push(<li key={index}>{parseInlineFormatting(ulMatch[1])}</li>);
        } else {
            flushList();
            elements.push(<p key={index} className="my-1">{parseInlineFormatting(line)}</p>);
        }
    });

    flushList();
    return elements;
};

const renderMessageContent = (parts: MessagePart[]) => {
  return parts.map((part, index) => {
    if ('inlineData' in part) {
      const { mimeType, data } = part.inlineData;
      return (
        <div key={index} className="my-2">
          <img
            src={`data:${mimeType};base64,${data}`}
            alt="User upload"
            className="rounded-lg max-w-xs max-h-64 object-contain"
          />
        </div>
      );
    }
    
    if ('text' in part && part.text) {
        const segments = part.text.split(/(```[\s\S]*?```)/g);
        return (
            <div key={index} className="prose prose-invert prose-sm max-w-none">
              {segments.filter(s => s).map((segment, i) => {
                  if (segment.startsWith('```') && segment.endsWith('```')) {
                    const codeBlock = segment.slice(3, -3);
                    const firstLine = codeBlock.split('\n')[0].trim();
                    const languageMatch = firstLine.match(/^[a-zA-Z]+/);
                    const language = languageMatch ? languageMatch[0] : '';
                    const code = language ? codeBlock.substring(firstLine.length).trim() : codeBlock;
                    return <CodeBlock key={i} language={language} code={code} />;
                  }
                  return <div key={i} className="whitespace-pre-wrap">{formatText(segment)}</div>;
              })}
            </div>
        );
    }

    return null;
  });
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isUser = message.role === Role.USER;
  const isModel = message.role === Role.MODEL;
  
  // Fix: Use a type predicate to correctly narrow the type of the found message part to TextPart before accessing the 'text' property.
  const textContent = message.parts.find((p): p is TextPart => 'text' in p)?.text ?? '';
  const isLastModelMessage = isModel && isLoading && textContent.length > 0;

  const Avatar = () => (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        {isUser ? <Icon name="user" className="w-5 h-5 text-white" /> : <Icon name="gemini" className="w-7 h-7" />}
    </div>
  );

  return (
    <div className={`flex items-start gap-4 my-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <Avatar />}

      <div className={`max-w-2xl w-full ${isUser ? 'text-right' : ''}`}>
        <div className="font-bold mb-2 text-gray-300">{isUser ? 'You' : 'Gemini'}</div>
        <div className={`p-4 rounded-xl ${isUser ? 'bg-blue-900/50 text-left ml-auto' : 'bg-gray-800'}`}>
            {renderMessageContent(message.parts)}
            {isLoading && isModel && !textContent && (
                <div className="flex items-center gap-2">
                    <span className="animate-pulse">Thinking...</span>
                </div>
            )}
            {isLastModelMessage && (
              <span className="inline-block w-2 h-5 bg-white animate-pulse ml-1" />
            )}
        </div>
      </div>

      {isUser && <Avatar />}
    </div>
  );
};