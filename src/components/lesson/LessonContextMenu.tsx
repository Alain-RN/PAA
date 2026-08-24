import React from 'react';
import { createPortal } from 'react-dom';
import type { BlockType, ContextMenuState } from './types';
import {
  Wrench,
  Edit3,
  Plus,
  AlignLeft,
  Heading,
  Code,
  List,
  Info,
  RefreshCw,
  Trash2,
  Layers,
} from 'lucide-react';

interface LessonContextMenuProps {
  contextMenu: ContextMenuState | null;
  onStartEditing: () => void;
  onInsertBlockAfter: (targetBlockId: string, type: BlockType) => void;
  onConvertBlockType: (blockId: string, newType: BlockType) => void;
  onRemoveBlock: (blockId: string) => void;
  onAddBlock: (type: BlockType) => void;
}

export const LessonContextMenu: React.FC<LessonContextMenuProps> = ({
  contextMenu,
  onStartEditing,
  onInsertBlockAfter,
  onConvertBlockType,
  onRemoveBlock,
  onAddBlock,
}) => {
  if (!contextMenu) return null;

  return createPortal(
    <div
      className="lesson-rightclick-menu"
      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {contextMenu.blockId ? (
        <>
          <div className="lesson-rightclick-header">
            <Wrench size={13} /> Outils du Bloc
          </div>
          <button className="lesson-rightclick-item" onClick={onStartEditing}>
            <Edit3 size={15} color="#ce82ff" /> Éditer le chapitre
          </button>
          <div className="lesson-rightclick-divider" />
          <div className="lesson-rightclick-header">
            <Plus size={13} /> Insérer dessous
          </div>
          <button
            className="lesson-rightclick-item"
            onClick={() => onInsertBlockAfter(contextMenu.blockId!, 'paragraph')}
          >
            <AlignLeft size={15} color="#38bdf8" /> Insérer un texte
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onInsertBlockAfter(contextMenu.blockId!, 'header')}
          >
            <Heading size={15} color="#ce82ff" /> Insérer un titre
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onInsertBlockAfter(contextMenu.blockId!, 'code')}
          >
            <Code size={15} color="#fb923c" /> Insérer un code / exemple
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onInsertBlockAfter(contextMenu.blockId!, 'list')}
          >
            <List size={15} color="#58cc02" /> Insérer une liste
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onInsertBlockAfter(contextMenu.blockId!, 'info')}
          >
            <Info size={15} color="#eab308" /> Insérer une note
          </button>
          <div className="lesson-rightclick-divider" />
          <div className="lesson-rightclick-header">
            <RefreshCw size={13} /> Convertir de Type
          </div>
          <button
            className="lesson-rightclick-item"
            onClick={() => onConvertBlockType(contextMenu.blockId!, 'header')}
          >
            <Heading size={15} color="#ce82ff" /> Convertir en Titre
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onConvertBlockType(contextMenu.blockId!, 'paragraph')}
          >
            <AlignLeft size={15} color="#38bdf8" /> Convertir en Texte
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onConvertBlockType(contextMenu.blockId!, 'code')}
          >
            <Code size={15} color="#fb923c" /> Convertir en Code
          </button>
          <button
            className="lesson-rightclick-item"
            onClick={() => onConvertBlockType(contextMenu.blockId!, 'list')}
          >
            <List size={15} color="#58cc02" /> Convertir en Liste
          </button>
          <div className="lesson-rightclick-divider" />
          <button
            className="lesson-rightclick-item danger"
            onClick={() => onRemoveBlock(contextMenu.blockId!)}
          >
            <Trash2 size={15} /> Supprimer ce bloc
          </button>
        </>
      ) : (
        <>
          <div className="lesson-rightclick-header">
            <Layers size={13} /> Actions du Chapitre
          </div>
          <button className="lesson-rightclick-item" onClick={onStartEditing}>
            <Edit3 size={15} color="#ce82ff" /> Éditer le chapitre
          </button>
          <button className="lesson-rightclick-item" onClick={() => onAddBlock('paragraph')}>
            <Plus size={15} color="#58cc02" /> Ajouter un nouveau bloc
          </button>
        </>
      )}
    </div>,
    document.body
  );
};
