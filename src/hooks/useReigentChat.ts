import { useState } from 'react';
import { reigentService, ChatMessage, ChatCompletionRequest } from '../services/reigentService';

export interface UseReigentChatOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export function useReigentChat(options: UseReigentChatOptions = {}) {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (content: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Build messages array
      const messages: ChatMessage[] = [];
      
      // Add system prompt if provided
      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt
        });
      }
      
      // Add conversation history
      messages.push(...history);
      
      // Add new user message
      const userMessage: ChatMessage = { role: 'user', content };
      messages.push(userMessage);

      // Prepare request
      const request: ChatCompletionRequest = {
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 800
      };

      // Call API
      const response = await reigentService.chatCompletion(request);
      const assistantMessage = response.choices[0].message;

      // Update history
      setHistory(prev => [...prev, userMessage, assistantMessage]);

      return assistantMessage.content;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setHistory([]);
    setError(null);
  };

  const retry = async (): Promise<string | null> => {
    if (history.length === 0) return null;
    
    // Get the last user message
    const lastUserMessage = [...history].reverse().find(msg => msg.role === 'user');
    if (!lastUserMessage) return null;

    // Remove the last assistant response if it exists
    const newHistory = history.slice(0, -1);
    if (newHistory[newHistory.length - 1]?.role === 'assistant') {
      newHistory.pop();
    }
    
    setHistory(newHistory);
    return send(lastUserMessage.content);
  };

  return {
    history,
    loading,
    error,
    send,
    clear,
    retry
  };
}