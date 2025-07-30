"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface MessageProps {
  content: string
  role: "user" | "assistant"
  timestamp?: Date
  className?: string
}

// Function to convert plain text with \n characters to proper markdown
function convertToMarkdown(text: string): string {
  // First, convert \n\n to actual double newlines for paragraph breaks
  let converted = text.replace(/\\n\\n/g, '\n\n')
  
  // Convert single \n to actual newlines  
  converted = converted.replace(/\\n/g, '\n')
  
  // Split by double newlines to get paragraphs
  const paragraphs = converted.split('\n\n')
  
  return paragraphs.map(paragraph => {
    // Clean up the paragraph
    paragraph = paragraph.trim()
    
    // Detect if this is a list (starts with - or *)
    if (paragraph.includes('\n- ') || paragraph.includes('\n* ') || paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
      return paragraph // Keep lists as-is, markdown will handle them
    }
    
    // Detect code blocks - look for function definitions, imports, etc.
    const codePatterns = [
      /^(import|from|def|class|function|const|let|var|if|for|while)/m,
      /^[ ]*[a-zA-Z_][a-zA-Z0-9_]*\s*[=:]/m,
      /^[ ]*[{}[\]()]/m,
      /^\s*\/\/|^\s*#|^\s*\/\*/m, // Comments
      /;\s*$/m // Semicolons at end of lines
    ]
    
    const hasCode = codePatterns.some(pattern => pattern.test(paragraph))
    const hasMultipleLines = paragraph.includes('\n')
    const looksLikeCode = hasCode && hasMultipleLines && paragraph.split('\n').length > 2
    
    // If it looks like code, wrap in code block
    if (looksLikeCode) {
      // Try to detect language
      let language = 'text'
      if (paragraph.includes('import ') || paragraph.includes('def ') || paragraph.includes('print(')) {
        language = 'python'
      } else if (paragraph.includes('function ') || paragraph.includes('const ') || paragraph.includes('console.log')) {
        language = 'javascript'
      } else if (paragraph.includes('#include') || paragraph.includes('int main')) {
        language = 'c'
      } else if (paragraph.includes('public class') || paragraph.includes('System.out')) {
        language = 'java'
      }
      
      return '```' + language + '\n' + paragraph + '\n```'
    }
    
    // Regular paragraph - return as-is
    return paragraph
  }).join('\n\n')
}

export function Message({ content, role, timestamp, className }: MessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Convert plain text to markdown for assistant messages
  const markdownContent = role === "assistant" ? convertToMarkdown(content) : content

  return (
    <div className={cn("flex w-full", role === "user" ? "justify-end" : "justify-start", className)}>
      <div className={cn(
        "flex max-w-[85%] gap-3",
        role === "user" ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className={cn(
            role === "user" 
              ? "bg-gray-600 text-white"
              : "bg-gray-200 text-gray-700"
          )}>
            {role === "user" ? "U" : "🤖"}
          </AvatarFallback>
        </Avatar>
        
        <div className={cn(
          "group relative rounded-2xl px-4 py-3 shadow-sm transition-all",
          role === "user" 
            ? "bg-gray-600 text-white"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        )}>
          <div className={cn(
            "text-sm leading-relaxed",
            role === "user" ? "text-white" : "text-gray-900 dark:text-gray-100"
          )}>
            {role === "user" ? (
              <p className="whitespace-pre-wrap m-0">{content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : 'text'
                      
                      return !inline ? (
                        <div className="my-4">
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={language}
                            PreTag="div"
                            showLineNumbers={true}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              background: '#1e1e1e',
                              padding: '1rem',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code 
                          className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400" 
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    p({children}) {
                      return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                    },
                    h1({children}) {
                      return <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-gray-900 dark:text-white">{children}</h1>
                    },
                    h2({children}) {
                      return <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0 text-gray-800 dark:text-gray-100">{children}</h2>
                    },
                    h3({children}) {
                      return <h3 className="text-md font-medium mb-2 mt-4 first:mt-0 text-gray-700 dark:text-gray-200">{children}</h3>
                    },
                    ul({children}) {
                      return <ul className="list-disc list-inside mb-4 space-y-1 ml-2">{children}</ul>
                    },
                    ol({children}) {
                      return <ol className="list-decimal list-inside mb-4 space-y-1 ml-2">{children}</ol>
                    },
                    li({children}) {
                      return <li className="leading-relaxed mb-1">{children}</li>
                    },
                    blockquote({children}) {
                      return (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 py-3 rounded-r">
                          {children}
                        </blockquote>
                      )
                    },
                    a({href, children}) {
                      return (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {children}
                        </a>
                      )
                    },
                    strong({children}) {
                      return <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
                    },
                    em({children}) {
                      return <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
                    },
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div className="absolute -bottom-8 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              onClick={copyToClipboard}
              title={copied ? "Copied!" : "Copy message"}
            >
              <Copy className={cn("h-3 w-3", copied && "text-green-500")} />
            </Button>
            {role === "assistant" && (
              <>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>

          {/* Timestamp */}
          {timestamp && (
            <div className={cn(
              "mt-2 text-xs opacity-60",
              role === "user" ? "text-gray-100" : "text-gray-500"
            )}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}