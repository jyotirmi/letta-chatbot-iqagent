// components/ui/main-chat.tsx
"use client"

import { useChat } from 'ai/react'
import { useState } from 'react'
import { EnhancedChat } from '@/components/ui/enhanced-chat'
import { SuggestionButtons } from '@/components/ui/suggestion-buttons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Square, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant" | "system" | "data"  // Updated to match AI SDK
  createdAt?: Date
}

interface MainChatProps {
  onNewChat?: () => void
}

export function MainChat({ onNewChat }: MainChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput, setMessages } = useChat({
    api: '/api/chat',
  })

  const [error, setError] = useState<string | null>(null)

  // Reset chat function
  const resetChat = () => {
    setMessages([])
    setInput('')
    setError(null)
    onNewChat?.()
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null)
    try {
      await handleSubmit(e)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Auto-submit the suggestion
    const syntheticEvent = {
      preventDefault: () => {},
      target: { elements: { message: { value: suggestion } } }
    } as any
    handleSubmit(syntheticEvent)
  }

  // Transform messages to include timestamps
  const enhancedMessages = messages
    .filter(msg => msg.role === "user" || msg.role === "assistant")  // Filter only user/assistant
    .map(msg => ({
      ...msg,
      createdAt: new Date()
    }))

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              IQ Workbench
            </h1>
          </div>
          {/* New Chat Button in Header */}
          {messages.length > 0 && (
            <Button 
              onClick={resetChat}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              New Chat
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Welcome State */
          <div className="flex-1 flex flex-col justify-center p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Hello there!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                How can I help you today?
              </p>
            </div>

            <SuggestionButtons 
              onSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-hidden">
            <EnhancedChat
              messages={enhancedMessages}
              isLoading={isLoading}
              className="h-full"
            />
          </div>
        )}

        {/* Chat Input - Always Visible */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Send a message..."
                className="min-h-[60px] resize-none pr-20 py-4 text-base border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (!isLoading && input.trim()) {
                      onSubmit(e as any)
                    }
                  }
                }}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                {isLoading ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={stop}
                    className="h-8 w-8 p-0"
                    variant="outline"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim()}
                    className="h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-t border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
        </div>
      )}
    </div>
  )
}