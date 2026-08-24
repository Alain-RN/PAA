import React from 'react';
import type { ContentBlock, BlockType } from './types';
import { Button } from '../ui';
import {
  Heading,
  AlignLeft,
  Code,
  List,
  Info,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
} from 'lucide-react';

interface LessonBlockEditorProps {
  blocks: ContentBlock[];
  isSaving: boolean;
  onUpdateBlock: (id: string, updates: Partial<ContentBlock>) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onAddBlock: (type: BlockType) => void;
  onAddListItem: (blockId: string) => void;
  onUpdateListItem: (blockId: string, itemIdx: number, val: string) => void;
  onRemoveListItem: (blockId: string, itemIdx: number) => void;
  onCancel: () => void;
  onSave: () => void;
  onContextMenu: (e: React.MouseEvent, blockId: string) => void;
}

export const LessonBlockEditor: React.FC<LessonBlockEditorProps> = ({
  blocks,
  isSaving,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  onAddBlock,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem,
  onCancel,
  onSave,
  onContextMenu,
}) => {
  return (
    <div className="lesson-blocks-builder">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="lesson-block-item"
          onContextMenu={(e) => onContextMenu(e, block.id)}
        >
          <div className="lesson-block-item-bar">
            <span className={`lesson-block-type-badge ${block.type}`}>
              {block.type === 'header' && <Heading size={12} />}
              {block.type === 'paragraph' && <AlignLeft size={12} />}
              {block.type === 'code' && <Code size={12} />}
              {block.type === 'list' && <List size={12} />}
              {block.type === 'info' && <Info size={12} />}
              Bloc {index + 1} : {block.type}
            </span>

            <div className="lesson-block-controls">
              <button
                className="lesson-block-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveBlock(block.id, 'up');
                }}
                disabled={index === 0}
                title="Monter ce bloc"
              >
                <ArrowUp size={14} />
              </button>
              <button
                className="lesson-block-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveBlock(block.id, 'down');
                }}
                disabled={index === blocks.length - 1}
                title="Descendre ce bloc"
              >
                <ArrowDown size={14} />
              </button>
              <button
                className="lesson-block-icon-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBlock(block.id);
                }}
                title="Supprimer ce bloc"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Contenu éditable */}
          {block.type === 'header' && (
            <input
              type="text"
              className="lesson-edit-input"
              style={{ fontSize: '1.1rem', fontWeight: 800 }}
              placeholder="Texte du titre de section..."
              value={block.title || ''}
              onChange={(e) => onUpdateBlock(block.id, { title: e.target.value })}
            />
          )}

          {block.type === 'paragraph' && (
            <>
              <input
                type="text"
                className="lesson-edit-input"
                placeholder="Titre de section..."
                value={block.title || ''}
                onChange={(e) => onUpdateBlock(block.id, { title: e.target.value })}
              />
              <textarea
                className="lesson-edit-textarea"
                placeholder="Contenu du texte..."
                value={block.content || ''}
                onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
              />
            </>
          )}

          {block.type === 'info' && (
            <>
              <input
                type="text"
                className="lesson-edit-input"
                placeholder="Titre de la note..."
                value={block.title || ''}
                onChange={(e) => onUpdateBlock(block.id, { title: e.target.value })}
              />
              <textarea
                className="lesson-edit-textarea"
                placeholder="Contenu de la note..."
                value={block.content || ''}
                onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
              />
            </>
          )}

          {block.type === 'code' && (
            <>
              <input
                type="text"
                className="lesson-edit-input"
                placeholder="Titre de l'exemple..."
                value={block.title || ''}
                onChange={(e) => onUpdateBlock(block.id, { title: e.target.value })}
              />
              <textarea
                className="lesson-edit-textarea"
                placeholder="Code ou exemple..."
                value={block.content || ''}
                onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
              />
            </>
          )}

          {block.type === 'list' && (
            <>
              <input
                type="text"
                className="lesson-edit-input"
                placeholder="Titre de la liste..."
                value={block.title || ''}
                onChange={(e) => onUpdateBlock(block.id, { title: e.target.value })}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(block.items || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="lesson-takeaway-edit-row">
                    <input
                      type="text"
                      className="lesson-edit-input"
                      placeholder={`Élément ${itemIdx + 1}...`}
                      value={item}
                      onChange={(e) => onUpdateListItem(block.id, itemIdx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="lesson-block-icon-btn danger"
                      onClick={() => onRemoveListItem(block.id, itemIdx)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onAddListItem(block.id)}
                  iconLeft={<Plus size={14} />}
                >
                  Ajouter un élément
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Outil d'ajout au bas */}
      <div className="lesson-add-block-panel">
        <span className="lesson-add-block-title">
          <Plus size={14} /> Ajouter un bloc au chapitre
        </span>
        <div className="lesson-add-buttons">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddBlock('header')}
            iconLeft={<Heading size={14} />}
          >
            Titre
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddBlock('paragraph')}
            iconLeft={<AlignLeft size={14} />}
          >
            Texte
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddBlock('code')}
            iconLeft={<Code size={14} />}
          >
            Code / Exemple
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddBlock('list')}
            iconLeft={<List size={14} />}
          >
            Liste
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddBlock('info')}
            iconLeft={<Info size={14} />}
          >
            Note / Info
          </Button>
        </div>
      </div>


    </div>
  );
};
