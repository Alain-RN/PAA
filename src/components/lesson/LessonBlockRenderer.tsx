import React from 'react';
import type { ContentBlock } from './types';
import { Target, Terminal, Pin, Check, Lightbulb, BookOpen } from 'lucide-react';

interface LessonBlockRendererProps {
  block: ContentBlock;
  onContextMenu: (e: React.MouseEvent, blockId: string) => void;
}

export const LessonBlockRenderer: React.FC<LessonBlockRendererProps> = ({
  block,
  onContextMenu,
}) => {
  const [copied, setCopied] = React.useState(false);

  const rawStringContent = typeof block.content === 'string'
    ? block.content
    : typeof block.content === 'object' && block.content !== null
      ? JSON.stringify(block.content, null, 2)
      : String(block.content || '');

  const cleanCode = rawStringContent.replace(/```[a-z]*/g, '').replace(/`/g, '').trim();

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detectLanguage = (code: string): string => {
    const lower = code.toLowerCase();
    if (lower.includes('fn main') || lower.includes('println!') || lower.includes('let mut') || lower.includes('pub struct') || lower.includes('use std::')) return 'RUST';
    if (lower.includes('select ') || lower.includes('create table') || lower.includes('insert into') || lower.includes('from ')) return 'SQL';
    if (lower.includes('function') || lower.includes('const ') || lower.includes('interface ') || lower.includes('require(')) return 'TYPESCRIPT';
    if (lower.includes('def ') || lower.includes('import datetime') || lower.includes('self.')) return 'PYTHON';
    if (lower.includes('from node:') || lower.includes('workdir') || lower.includes('expose')) return 'DOCKER';
    return 'CODE';
  };

  const renderCodeWithHighlighting = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('--') || trimmed.startsWith('#')) {
        return (
          <div key={lineIdx} className="code-line">
            <span className="code-line-num">{lineIdx + 1}</span>
            <span className="code-comment">{line}</span>
          </div>
        );
      }

      const regex = /(".*?"|'.*?'|`.*?`|\b(?:fn|mut|struct|enum|impl|match|use|pub|Result|Option|Ok|Err|SELECT|FROM|WHERE|INSERT|INTO|CREATE|TABLE|SERIAL|PRIMARY|KEY|UNIQUE|NOT|NULL|ORDER|BY|GROUP|HAVING|LIMIT|JOIN|INNER|LEFT|RIGHT|DEFAULT|TIMESTAMP|UPDATE|SET|DELETE|BEGIN|COMMIT|ROLLBACK|EXPLAIN|ANALYZE|INDEX|ON|function|const|let|var|return|if|else|async|await|try|catch|import|export|from|require|class|def|self|true|false|null|undefined|void|interface|type|RUN|COPY|EXPOSE|CMD|WORKDIR)\b|\d+)/g;
      
      const tokens: Array<{ text: string; type: string }> = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          tokens.push({ text: line.substring(lastIndex, match.index), type: 'plain' });
        }

        const matchedText = match[0];
        if (/^["'`].*["'`]$/.test(matchedText)) {
          tokens.push({ text: matchedText, type: 'string' });
        } else if (/^\d+$/.test(matchedText)) {
          tokens.push({ text: matchedText, type: 'number' });
        } else {
          tokens.push({ text: matchedText, type: 'keyword' });
        }
        lastIndex = match.index + matchedText.length;
      }

      if (lastIndex < line.length) {
        tokens.push({ text: line.substring(lastIndex), type: 'plain' });
      }

      return (
        <div key={lineIdx} className="code-line">
          <span className="code-line-num">{lineIdx + 1}</span>
          <span className="code-line-content">
            {tokens.map((tok, tokIdx) => (
              <span key={tokIdx} className={`code-token code-${tok.type}`}>
                {tok.text}
              </span>
            ))}
          </span>
        </div>
      );
    });
  };

  const langBadge = detectLanguage(cleanCode);

  return (
    <div
      className="lesson-block-wrapper"
      onContextMenu={(e) => onContextMenu(e, block.id)}
    >
      {block.type === 'header' && (
        <h2 className="lesson-block-header-text">
          {block.title || block.content}
        </h2>
      )}

      {block.type === 'info' && (
        <div className="lesson-section intro">
          {block.title && (
            <h2 className="lesson-section-title">
              <Target size={18} color="#ce82ff" /> {block.title}
            </h2>
          )}
          <div className="lesson-section-body">
            <p>{block.content}</p>
          </div>
        </div>
      )}

      {block.type === 'code' && langBadge !== 'CODE' && (
        <div className="lesson-section example">
          <div className="lesson-code-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="lesson-code-dots">
                <span />
                <span />
                <span />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                <Terminal size={14} color="#fb923c" /> {block.title || 'Exemple Pratique & Code'}
              </span>
              <span className="lesson-code-lang-badge">
                {langBadge}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className={`lesson-copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? 'Copie !' : 'Copier'}
            </button>
          </div>
          <div className="lesson-code-editor-container">
            <pre className="lesson-code-body">
              {renderCodeWithHighlighting(cleanCode)}
            </pre>
          </div>
        </div>
      )}

      {block.type === 'code' && langBadge === 'CODE' && (
        <div className="lesson-section example" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.25rem', color: '#e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
            <BookOpen size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              {block.title || 'Atelier & Application Pratique'}
            </h2>
          </div>
          <div style={{ fontSize: '0.98rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
            {cleanCode}
          </div>
        </div>
      )}

      {block.type === 'list' && (
        <div className="lesson-section takeaways">
          {block.title && (
            <h2 className="lesson-section-title">
              <Pin size={18} color="#58cc02" /> {block.title}
            </h2>
          )}
          <ul className="lesson-takeaway-list">
            {(block.items || []).map((point, i) => (
              <li key={i} className="lesson-takeaway-item">
                <div className="lesson-takeaway-bullet">
                  <Check size={11} color="#fff" strokeWidth={3} />
                </div>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {block.type === 'paragraph' && (
        <div className="lesson-section theory">
          {block.title && (
            <h2 className="lesson-section-title">
              <Lightbulb size={18} color="#38bdf8" /> {block.title}
            </h2>
          )}
          <div className="lesson-section-body">
            {rawStringContent.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
