// components/ui/sidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
  onNewChat?: () => void
}

export function Sidebar({ className, onNewChat }: SidebarProps) {
  // Mock chat history - in a real app, this would come from your backend
  const chatHistory = [
    { id: 1, title: "Dijkstra's Algorithm Code Demo", date: "Yesterday" },
    { id: 2, title: "Advantages of Next.js", date: "Yesterday" },
  ]

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Yesterday
          </div>
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                  {chat.title}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              guest-1753830231886
            </span>
          </div>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}