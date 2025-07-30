// components/ui/suggestion-buttons.tsx
"use client"

import { Button } from "@/components/ui/button"

interface SuggestionButtonsProps {
  onSuggestionClick: (suggestion: string) => void
  isLoading?: boolean
}

export function SuggestionButtons({ onSuggestionClick, isLoading }: SuggestionButtonsProps) {
  const suggestions = [
    {
      title: "What are the advantages",
      subtitle: "of using Next.js?"
    },
    {
      title: "Write code to",
      subtitle: "demonstrate dijkstra's algorithm"
    },
    {
      title: "Help me write an essay",
      subtitle: "about silicon valley"
    },
    {
      title: "What is the weather",
      subtitle: "in San Francisco?"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-4 text-left justify-start hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
          onClick={() => onSuggestionClick(`${suggestion.title} ${suggestion.subtitle}`)}
          disabled={isLoading}
        >
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {suggestion.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {suggestion.subtitle}
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}