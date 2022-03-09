import React from 'react';
import ReactMarkdown from 'react-markdown';

function Markdown({ markdown }: { markdown: string }) {
  const arrayOfParagraphs = markdown.split('\n')
    .map(x=> x.trim())
    .filter(x=>x.length>0);
  
  return (
    // <ReactMarkdown>{markdown}</ReactMarkdown>
    <div>
      {arrayOfParagraphs.map((thisParagraph, index) => (
        <ReactMarkdown key={index.toString()}>{thisParagraph}</ReactMarkdown>
      ))}
    </div>
  );
}

export default Markdown;
