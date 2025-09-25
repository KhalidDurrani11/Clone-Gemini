import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="bg-gray-950 rounded-lg my-4 overflow-hidden border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-400 text-xs">
        <span>{language || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
          <Icon name="copy" className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
