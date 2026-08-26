import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { backendAPI } from '../services/apiService';
import type { BlockType, ContentBlock, ContextMenuState } from '../components/lesson';
import {
  LessonHeader,
  LessonBlockRenderer,
  LessonBlockEditor,
  LessonContextMenu,
  LessonActionsBar,
} from '../components/lesson';
import './LessonView.css';

export const LessonView: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { currentUser, courses, completeChapter, updateCourse } = useAppState();

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States pour l'édition dynamique et le Menu Contextuel
  const [editChapterTitle, setEditChapterTitle] = useState('');
  const [editBlocks, setEditBlocks] = useState<ContentBlock[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const course = courses.find((c) => c.id === courseId);
  const chapter = course?.chapters.find((ch) => ch.id === chapterId);

  // Reset state quand le chapitre change
  useEffect(() => {
    setDynamicContent(null);
    setIsEditing(false);
    setContextMenu(null);
  }, [courseId, chapterId]);

  // Fermer le menu contextuel lors d'un clic n'importe où
  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener('click', handleCloseMenu);
    window.addEventListener('scroll', handleCloseMenu);
    return () => {
      window.removeEventListener('click', handleCloseMenu);
      window.removeEventListener('scroll', handleCloseMenu);
    };
  }, []);

  // Chargement ou génération du contenu par l'IA
  useEffect(() => {
    async function loadOrGenerateChapterContent() {
      if (!course || !chapter) return;

      const content = chapter.content || '';

      const hasRealContent = (() => {
        if (!content || content.trim().length < 20) return false;
        try {
          const parsed = JSON.parse(content);
          return (
            Array.isArray(parsed) ||
            !!(parsed.introduction || parsed.theory || parsed.practicalExample || parsed.keyTakeaways)
          );
        } catch {
          return false;
        }
      })();

      if (hasRealContent) {
        setDynamicContent(content);
        return;
      }

      setIsGeneratingContent(true);
      try {
        const res: any = await backendAPI.generateChapterContent(
          course.id,
          chapter.id,
          course.title,
          chapter.title
        );
        if (res && res.content) {
          setDynamicContent(res.content);
          const updatedChapters = course.chapters.map((ch) =>
            ch.id === chapter.id ? { ...ch, content: res.content } : ch
          );
          updateCourse({ ...course, chapters: updatedChapters });
        }
      } catch (err) {
        console.error('❌ Erreur lors de la génération du contenu:', err);
      } finally {
        setIsGeneratingContent(false);
      }
    }
    loadOrGenerateChapterContent();
  }, [courseId, chapterId, courses]);

  if (!currentUser || !courseId || !chapterId) return null;

  if (!course || !chapter) {
    return (
      <div className="lesson-container">
        <h2 style={{ color: '#fff' }}>Leçon introuvable</h2>
        <Button variant="secondary" onClick={() => navigate('/catalog')} iconLeft={<ArrowLeft size={16} />}>
          Retour au catalogue
        </Button>
      </div>
    );
  }

  const isCompleted = currentUser.completedChapters.includes(chapterId);
  const currentContent = dynamicContent || chapter.content || '';

  // Parse le contenu JSON ou Texte brut avec Code Markdown en ContentBlock[]
  const parseBlocks = (): ContentBlock[] => {
    try {
      const parsed = JSON.parse(currentContent);
      if (Array.isArray(parsed)) return parsed;

      const blocks: ContentBlock[] = [];
      if (parsed.introduction) {
        blocks.push({
          id: 'b-intro',
          type: 'info',
          title: 'Introduction & Objectifs',
          content: typeof parsed.introduction === 'string' ? parsed.introduction : JSON.stringify(parsed.introduction),
        });
      }
      if (parsed.theory && parsed.theory !== parsed.introduction) {
        blocks.push({
          id: 'b-theory',
          type: 'paragraph',
          title: 'Explications Théoriques',
          content: typeof parsed.theory === 'string' ? parsed.theory : JSON.stringify(parsed.theory),
        });
      }
      if (parsed.practicalExample || parsed.codeExample) {
        let codeVal = parsed.practicalExample || parsed.codeExample;
        if (typeof codeVal === 'object' && codeVal !== null) {
          if (Array.isArray(codeVal)) {
            codeVal = codeVal.map((item: any) => item.code || item.content || (typeof item === 'string' ? item : JSON.stringify(item))).join('\n\n');
          } else {
            codeVal = codeVal.code || codeVal.content || JSON.stringify(codeVal);
          }
        } else if (typeof codeVal === 'string' && (codeVal.trim().startsWith('[') || codeVal.trim().startsWith('{'))) {
          try {
            const nested = JSON.parse(codeVal);
            if (Array.isArray(nested)) {
              codeVal = nested.map((item: any) => item.code || item.content || (typeof item === 'string' ? item : JSON.stringify(item))).join('\n\n');
            } else if (typeof nested === 'object' && nested !== null) {
              codeVal = nested.code || nested.content || JSON.stringify(nested);
            }
          } catch {
            // conserve la chaîne originale
          }
        }

        blocks.push({
          id: 'b-code',
          type: 'code',
          title: 'Exemple Pratique & Code',
          content: codeVal,
        });
      }
      if (parsed.keyTakeaways && Array.isArray(parsed.keyTakeaways)) {
        const cleanTakeaways = parsed.keyTakeaways.map((item: any) => 
          typeof item === 'string' ? item : item.name || item.title || item.point || JSON.stringify(item)
        );
        blocks.push({
          id: 'b-takeaways',
          type: 'list',
          title: 'Points Clés à Retenir',
          items: cleanTakeaways,
        });
      }
      if (blocks.length > 0) return blocks;
    } catch {
      // Pas de JSON pur, analyse du texte brut avec détection des blocs de code ```
    }

    // Traitement du texte brut avec découpage des blocs de code (```)
    const blocks: ContentBlock[] = [];
    const codeRegex = /```(?:[a-zA-Z]*\n)?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let blockIdCounter = 1;

    while ((match = codeRegex.exec(currentContent)) !== null) {
      const textBefore = currentContent.substring(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({
          id: `b-txt-${blockIdCounter++}`,
          type: 'paragraph',
          title: blocks.length === 0 ? 'Explications' : 'Notes Complémentaires',
          content: textBefore,
        });
      }

      const codeText = match[1].trim();
      if (codeText) {
        blocks.push({
          id: `b-code-${blockIdCounter++}`,
          type: 'code',
          title: 'Exemple de Code',
          content: codeText,
        });
      }

      lastIndex = match.index + match[0].length;
    }

    const remainingText = currentContent.substring(lastIndex).trim();
    if (remainingText) {
      blocks.push({
        id: `b-txt-${blockIdCounter++}`,
        type: 'paragraph',
        title: blocks.length === 0 ? 'Contenu de la Leçon' : 'Résumé',
        content: remainingText,
      });
    }

    return blocks.length > 0
      ? blocks
      : [{ id: 'b-raw', type: 'paragraph', title: 'Explications', content: currentContent }];
  };

  const currentBlocks = isEditing ? editBlocks : parseBlocks();

  // Gestion du Clic Droit
  const handleContextMenu = (e: React.MouseEvent, blockId: string | null) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 270;
    const menuHeight = 500;

    let x = e.clientX;
    if (x + menuWidth > window.innerWidth) {
      x = Math.max(10, window.innerWidth - menuWidth - 15);
    }

    let y = e.clientY;
    if (y + menuHeight > window.innerHeight) {
      y = Math.max(10, e.clientY - menuHeight);
      if (y + menuHeight > window.innerHeight) {
        y = Math.max(10, window.innerHeight - menuHeight - 15);
      }
    }

    setContextMenu({
      x,
      y,
      blockId,
    });
  };

  const startEditing = () => {
    setEditChapterTitle(chapter.title);
    setEditBlocks(parseBlocks());
    setIsEditing(true);
    setContextMenu(null);
  };

  const handleInsertBlockAfter = (targetBlockId: string, type: BlockType) => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case 'header':
        newBlock = { id: newId, type: 'header', title: 'Nouveau Titre' };
        break;
      case 'paragraph':
        newBlock = { id: newId, type: 'paragraph', title: 'Nouvelle Section', content: 'Saisissez votre texte...' };
        break;
      case 'code':
        newBlock = { id: newId, type: 'code', title: 'Exemple Pratique', content: '// Saisissez votre code' };
        break;
      case 'list':
        newBlock = { id: newId, type: 'list', title: 'Liste à puces', items: ['Premier élément'] };
        break;
      case 'info':
        newBlock = { id: newId, type: 'info', title: 'Note / Objectif', content: 'Remarque importante.' };
        break;
    }

    setEditBlocks((prev) => {
      const activeList = prev.length > 0 ? prev : parseBlocks();
      const idx = activeList.findIndex((b) => b.id === targetBlockId);
      if (idx < 0) return [...activeList, newBlock];
      const next = [...activeList];
      next.splice(idx + 1, 0, newBlock);
      return next;
    });

    setIsEditing(true);
    setContextMenu(null);
  };

  const handleConvertBlockType = (blockId: string, newType: BlockType) => {
    setEditBlocks((prev) => {
      const activeList = prev.length > 0 ? prev : parseBlocks();
      return activeList.map((b) => {
        if (b.id === blockId) {
          return {
            ...b,
            type: newType,
            items: newType === 'list' && (!b.items || b.items.length === 0) ? ['Élément 1'] : b.items,
          };
        }
        return b;
      });
    });
    setIsEditing(true);
    setContextMenu(null);
  };

  const handleAddBlock = (type: BlockType) => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case 'header':
        newBlock = { id: newId, type: 'header', title: 'Nouveau Titre' };
        break;
      case 'paragraph':
        newBlock = { id: newId, type: 'paragraph', title: 'Section', content: 'Saisissez votre texte...' };
        break;
      case 'code':
        newBlock = { id: newId, type: 'code', title: 'Exemple Pratique', content: '// Code...' };
        break;
      case 'list':
        newBlock = { id: newId, type: 'list', title: 'Liste à puces', items: ['Élément 1'] };
        break;
      case 'info':
        newBlock = { id: newId, type: 'info', title: 'Note / Objectif', content: 'Remarque...' };
        break;
    }

    setEditBlocks((prev) => [...(prev.length > 0 ? prev : parseBlocks()), newBlock]);
    setIsEditing(true);
    setContextMenu(null);
  };

  const handleUpdateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setEditBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const handleRemoveBlock = (id: string) => {
    setEditBlocks((prev) => (prev.length > 0 ? prev : parseBlocks()).filter((b) => b.id !== id));
    setContextMenu(null);
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    setEditBlocks((prev) => {
      const activeList = prev.length > 0 ? prev : parseBlocks();
      const idx = activeList.findIndex((b) => b.id === id);
      if (idx < 0) return activeList;
      if (direction === 'up' && idx === 0) return activeList;
      if (direction === 'down' && idx === activeList.length - 1) return activeList;

      const next = [...activeList];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
    setIsEditing(true);
    setContextMenu(null);
  };

  const handleAddListItem = (blockId: string) => {
    setEditBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          return { ...b, items: [...(b.items || []), 'Nouvel élément'] };
        }
        return b;
      })
    );
  };

  const handleUpdateListItem = (blockId: string, itemIdx: number, val: string) => {
    setEditBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          const newItems = [...(b.items || [])];
          newItems[itemIdx] = val;
          return { ...b, items: newItems };
        }
        return b;
      })
    );
  };

  const handleRemoveListItem = (blockId: string, itemIdx: number) => {
    setEditBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          return { ...b, items: (b.items || []).filter((_, i) => i !== itemIdx) };
        }
        return b;
      })
    );
  };

  const handleSaveAllChanges = async () => {
    if (!course) return;
    setIsSaving(true);
    try {
      const jsonString = JSON.stringify(editBlocks.length > 0 ? editBlocks : parseBlocks());
      setDynamicContent(jsonString);

      const updatedChapters = course.chapters.map((ch) =>
        ch.id === chapterId
          ? { ...ch, title: editChapterTitle.trim() || ch.title, content: jsonString }
          : ch
      );

      const updatedCourse = { ...course, chapters: updatedChapters };
      updateCourse(updatedCourse);
      await backendAPI.saveCourse(updatedCourse);
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Erreur lors de la sauvegarde:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const chapterIdx = course.chapters.findIndex((ch) => ch.id === chapterId);

  return (
    <div className="lesson-container" onContextMenu={(e) => handleContextMenu(e, null)}>
      {/* ── EN-TÊTE FIXE ET TITRE ── */}
      <LessonHeader
        courseTitle={course.title}
        chapterIdx={chapterIdx}
        chapterTitle={chapter.title}
        isEditing={isEditing}
        isSaving={isSaving}
        editChapterTitle={editChapterTitle}
        onNavigateBack={() => navigate(`/course/${courseId}`)}
        onStartEditing={startEditing}
        onCancel={() => setIsEditing(false)}
        onSave={handleSaveAllChanges}
        onEditChapterTitleChange={setEditChapterTitle}
      />

      {/* ── CONTENU PRINCIPAL ── */}
      {isGeneratingContent ? (
        <div className="lesson-loading">
          <div className="lesson-loading-icon">
            <Loader2 size={28} color="#ce82ff" className="lesson-spin" />
          </div>
          <p className="lesson-loading-title">
            <Sparkles size={18} color="#ce82ff" /> L'IA rédige votre leçon...
          </p>
          <p className="lesson-loading-sub">
            Le contenu est généré et sauvegardé automatiquement dans la base de données.
          </p>
        </div>
      ) : isEditing ? (
        /* ── ÉDITEUR VISUEL DE BLOCS ── */
        <LessonBlockEditor
          blocks={editBlocks}
          isSaving={isSaving}
          onUpdateBlock={handleUpdateBlock}
          onRemoveBlock={handleRemoveBlock}
          onMoveBlock={handleMoveBlock}
          onAddBlock={handleAddBlock}
          onAddListItem={handleAddListItem}
          onUpdateListItem={handleUpdateListItem}
          onRemoveListItem={handleRemoveListItem}
          onCancel={() => setIsEditing(false)}
          onSave={handleSaveAllChanges}
          onContextMenu={handleContextMenu}
        />
      ) : (
        /* ── MODE LECTURE PÉDAGOGIQUE ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentBlocks.map((block) => (
            <LessonBlockRenderer
              key={block.id}
              block={block}
              onContextMenu={handleContextMenu}
            />
          ))}
        </div>
      )}

      {/* ── MENU CONTEXTUEL CLIC DROIT EN PORTAL ── */}
      <LessonContextMenu
        contextMenu={contextMenu}
        onStartEditing={startEditing}
        onInsertBlockAfter={handleInsertBlockAfter}
        onConvertBlockType={handleConvertBlockType}
        onRemoveBlock={handleRemoveBlock}
        onAddBlock={handleAddBlock}
      />

      {/* ── BARRE D'ACTIONS FINALES ── */}
      { !isEditing && <LessonActionsBar
        isCompleted={isCompleted}
        onCompleteChapter={() => completeChapter(courseId, chapterId)}
        onStartQuiz={() => navigate(`/quiz/${courseId}/${chapterId}`)}
      />}
    </div>
  );
};

export default LessonView;
