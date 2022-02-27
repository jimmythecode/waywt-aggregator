import React from 'react'
import ReactMarkdown from 'react-markdown'

function Markdown({markdown}:{markdown: string}) {
  return (
    <ReactMarkdown>{markdown}</ReactMarkdown>
  )
}

export default Markdown