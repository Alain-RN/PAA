import React from 'react';
import type { ContentBlock } from './types';
import { Target, Zap, Terminal, Pin, Check, Lightbulb } from 'lucide-react';

interface LessonBlockRendererProps {
  block: ContentBlock;
  onContextMenu: (e: React.MouseEvent, blockId: string) => void;
}

export const LessonBlockRenderer: React.FC<LessonBlockRendererProps> = ({
  block,
  onContextMenu,
}) => {
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

      {block.type === 'code' && (
        <div className="lesson-section example">
          {block.title && (
            <h2 className="lesson-section-title" style={{ color: '#9ca3af' }}>
              <Zap size={18} color="#fb923c" /> {block.title}
            </h2>
          )}
          {(block.content || '').includes('\n') ||
          (block.content || '').includes('//') ||
          (block.content || '').includes('<') ? (
            <>
              <div className="lesson-code-header">
                <div className="lesson-code-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <Terminal size={13} /> Exemple concret
              </div>
              <pre className="lesson-code-body">
                {(block.content || '').replace(/```[a-z]*/g, '').replace(/`/g, '')}
              </pre>
            </>
          ) : (
            <p className="lesson-example-text">{block.content}</p>
          )}
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
            {(block.content || '').split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
