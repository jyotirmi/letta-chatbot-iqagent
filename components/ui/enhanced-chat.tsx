"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/components/ui/message"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant" | "system" | "data"  // Match AI SDK types
  createdAt?: Date
}

interface EnhancedChatProps {
  messages: ChatMessage[]
  isLoading?: boolean
  className?: string
}

export function EnhancedChat({
  messages,
  isLoading = false,
  className
}: EnhancedChatProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground max-w-md">
                Ask me anything! I'm Alex, your AI assistant with persistent memory.
                I can help with coding, research, analysis, and much more.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <Message
                key={message.id}
                content={message.content}
                role={message.role}
                timestamp={message.createdAt}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  🤖
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
    </div>
  )
}