'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeQuestionViewerProps {
  content: string
}

const CodeQuestionViewer: React.FC<CodeQuestionViewerProps> = ({ content }) => {
  const raw = content.replace(/\\n/g, '\n')

  const parts = raw.split(/(```[\s\S]*?```)/g)

  const renderedParts = parts.map((part, index) => {
    if (part.startsWith('```')) {
      return (
        <ReactMarkdown
          key={index}
          components={{
            // @ts-expect-error - ReactMarkdown types are not fully compatible with Bun
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="text-xs">
                  <SyntaxHighlighter
                    // @ts-expect-error - SyntaxHighlighter style prop has incompatible types with Bun
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      fontSize: '0.9rem',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {part}
        </ReactMarkdown>
      )
    } else {
      const lines = part.split('\n')
      return lines.map((line, i) => {
        const segments = line.split(/(`[^`]+`)/g) // tách text thường và code inline

        return (
          <p key={`${index}-${i}`} className="mb-2">
            {segments.map((segment, j) => {
              if (segment.startsWith('`') && segment.endsWith('`')) {
                return (
                  <code key={j} className="bg-gray-100 px-1 py-0.5 rounded inline-code">
                    {segment.slice(1, -1)}
                  </code>
                )
              }
              return <React.Fragment key={j}>{segment}</React.Fragment>
            })}
          </p>
        )
      })
    }
  })

  return <div className="prose max-w-none">{renderedParts}</div>
}

export default CodeQuestionViewer
