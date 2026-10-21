import React from 'react';

// Formats inline markdown elements (bold, italic, inline code, inline math)
function formatInlineText(text) {
  if (!text) return '';

  // Regex patterns for bold, code, math, italic
  const parts = [];
  let keyIdx = 0;

  // We can do standard tokenization or simple regex replace with dangerouslySetInnerHTML or React elements
  // Using pure React elements without dangerouslySetInnerHTML is safer and cleaner!
  // Simple regex matching:
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(<span key={keyIdx++}>{text.substring(lastIndex, match.index)}</span>);
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={keyIdx++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={keyIdx++} className="theory-inline-code">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('$') && token.endsWith('$')) {
      parts.push(<span key={keyIdx++} className="theory-math-badge">{token.slice(1, -1)}</span>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={keyIdx++}>{token.slice(1, -1)}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={keyIdx++}>{text.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

export default function TheoryRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let elemKey = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block (```)
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={elemKey++} className="theory-code-container">
          <pre className="theory-code-pre">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Markdown Table (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // First row is header
        const headerCols = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map(c => c.trim());
        
        // Skip separator line if it contains dashes
        const dataRows = tableLines.slice(1).filter(row => !row.replace(/\|/g, '').replace(/[\s:-]/g, '') === false || !row.includes('---'));

        elements.push(
          <div key={elemKey++} className="theory-table-container">
            <table className="theory-table">
              <thead>
                <tr>
                  {headerCols.map((col, hIdx) => (
                    <th key={hIdx}>{formatInlineText(col)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => {
                  const cells = row.split('|').slice(1, -1).map(c => c.trim());
                  return (
                    <tr key={rIdx}>
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx}>{formatInlineText(cell)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={elemKey++} className="theory-h3">
          {formatInlineText(trimmed.replace('### ', ''))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={elemKey++} className="theory-h4">
          {formatInlineText(trimmed.replace('#### ', ''))}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={elemKey++} className="theory-h2">
          {formatInlineText(trimmed.replace('## ', ''))}
        </h2>
      );
      i++;
      continue;
    }

    // 4. Horizontal Rule
    if (trimmed === '---') {
      elements.push(<hr key={elemKey++} className="theory-hr" />);
      i++;
      continue;
    }

    // 5. Bullet Lists (* or -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
        listItems.push(lines[i].trim().replace(/^[*\-]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={elemKey++} className="theory-ul">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="theory-li">
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Numbered Lists (1. 2. etc)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={elemKey++} className="theory-ol">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="theory-li">
              {formatInlineText(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Regular paragraph / empty line
    if (trimmed.length > 0) {
      elements.push(
        <p key={elemKey++} className="theory-p">
          {formatInlineText(trimmed)}
        </p>
      );
    }

    i++;
  }

  return <div className="theory-rendered-article">{elements}</div>;
}
