import React from 'react';

const MarkdownMessage = ({ text }) => {
    // Parse markdown-style text to React elements
    const parseMarkdown = (text) => {
        const elements = [];
        let lastIndex = 0;

        // Regex patterns
        const patterns = [
            { regex: /\*\*([^*]+)\*\*/g, tag: 'strong', class: 'font-bold text-gray-900' },
            { regex: /\*([^*]+)\*/g, tag: 'em', class: 'italic text-gray-800' },
            { regex: /`([^`]+)`/g, tag: 'code', class: 'bg-gray-100 px-2 py-1 rounded font-mono text-sm' },
        ];

        // Split by lines first to handle structure
        const lines = text.split('\n');

        return lines.map((line, lineIndex) => {
            if (!line.trim()) {
                return <div key={lineIndex} className="h-2" />;
            }

            // Handle headings with **text:**
            if (line.startsWith('**') && line.includes(':')) {
                const match = line.match(/\*\*([^*]+)\*\*:(.*)/);
                if (match) {
                    return (
                        <h3 key={lineIndex} className="font-bold text-lg text-gray-900 mt-3 mb-2">
                            {match[1]}
                        </h3>
                    );
                }
            }

            // Handle bullet points
            if (line.trim().startsWith('*')) {
                const bulletContent = line.trim().substring(1).trim();
                return (
                    <li key={lineIndex} className="ml-4 text-gray-800 my-1">
                        {parseInlineMarkdown(bulletContent)}
                    </li>
                );
            }

            // Handle numbered lists
            if (line.match(/^\d+\./)) {
                const numberedContent = line.replace(/^\d+\.\s*/, '').trim();
                return (
                    <li key={lineIndex} className="ml-4 text-gray-800 my-1 list-decimal list-inside">
                        {parseInlineMarkdown(numberedContent)}
                    </li>
                );
            }

            // Handle regular paragraphs
            return (
                <p key={lineIndex} className="text-gray-800 my-1">
                    {parseInlineMarkdown(line)}
                </p>
            );
        });
    };

    const parseInlineMarkdown = (text) => {
        const elements = [];
        let lastIndex = 0;

        // Match **bold** pattern
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
                elements.push(text.substring(lastIndex, match.index));
            }
            // Add bold text
            elements.push(
                <strong key={`bold-${match.index}`} className="font-bold text-gray-900">
                    {match[1]}
                </strong>
            );
            lastIndex = boldRegex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            elements.push(text.substring(lastIndex));
        }

        return elements.length > 0 ? elements : text;
    };

    return (
        <div className="text-sm leading-relaxed space-y-2 max-w-md">
            {parseMarkdown(text)}
        </div>
    );
};

export default MarkdownMessage;
