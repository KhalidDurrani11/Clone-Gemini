import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Role, MessagePart, UploadedImage } from '../types';
import { Role as GeminiRole } from '../types';

const API_KEY = process.env.API_KEY;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(() => {
    if (!API_KEY) {
      setError("API_KEY is not configured. Please set it in your environment variables.");
      return;
    }
    try {
      // Fix: The GoogleGenAI constructor expects an object with an `apiKey` property.
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and creative assistant. Format your responses with markdown where appropriate.'
        }
      });
      setError(null);
    } catch (e) {
        const err = e as Error;
        console.error("Failed to initialize chat:", err);
        setError(`Failed to initialize Gemini API: ${err.message}`);
    }
  }, []);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setError(null);
    initializeChat();
  }, [initializeChat]);


  const sendMessage = useCallback(async (prompt: string, image?: UploadedImage) => {
    if (!chatRef.current) {
      initializeChat();
      if (!chatRef.current) {
        console.error("Chat not initialized.");
        setError("Chat is not initialized. Please check API key.");
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    const userMessageParts: MessagePart[] = [{ text: prompt }];
    if (image) {
      userMessageParts.unshift({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: GeminiRole.USER,
      parts: userMessageParts,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    const modelMessageId = `model-${Date.now()}`;
    const modelMessage: Message = {
      id: modelMessageId,
      role: GeminiRole.MODEL,
      parts: [{ text: '' }],
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, modelMessage]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userMessageParts });
      
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId
              ? { ...msg, parts: [{ text: fullResponse }] }
              : msg
          )
        );
      }

    } catch (e) {
      const err = e as Error;
      console.error("Error sending message:", err);
      setError(`An error occurred: ${err.message}`);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId
            ? { ...msg, parts: [{ text: `Sorry, something went wrong: ${err.message}` }] }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [initializeChat]);

  // Initialize chat on first use
  useState(() => {
    startNewChat();
  });

  return { messages, isLoading, error, sendMessage, startNewChat };
};