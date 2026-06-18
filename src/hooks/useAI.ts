import { useState, useEffect } from 'react';
import { useAppState } from './useAppState';
import type { Course, Chapter } from '../types';

export function useAI() {
  const { currentUser, courses } = useAppState();
  const [recommendation, setRecommendation] = useState<{
    course: Course;
    chapter: Chapter;
    reason: string;
  } | null>(null);

  // Analyze currentUser weak chapters and generate smart recommendation
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student' || currentUser.weakChapters.length === 0) {
      setRecommendation(null);
      return;
    }

    // Find the first weak chapter
    const weakChId = currentUser.weakChapters[0];
    
    // Find course and chapter details
    let foundCourse: Course | null = null;
    let foundChapter: Chapter | null = null;

    for (const c of courses) {
      const ch = c.chapters.find(item => item.id === weakChId);
      if (ch) {
        foundCourse = c;
        foundChapter = ch;
        break;
      }
    }

    if (foundCourse && foundChapter) {
      // Craft realistic recommendation reasons based on chapter
      let reason = "L'analyse de vos performances montre des lacunes sur ce sujet.";
      if (weakChId.includes('ch3')) {
        reason = "Vous avez commis plusieurs erreurs sur les jointures complexes et le filtrage après agrégation (HAVING). Réviser ce chapitre améliorera votre logique de requêtes.";
      } else if (weakChId.includes('ch2')) {
        reason = "Des difficultés ont été détectées sur l'écriture des clauses WHERE et l'ordre de tri ORDER BY. Un rappel des bases de filtrage vous sera très bénéfique.";
      } else if (weakChId.includes('ch1')) {
        reason = "La modélisation de données (MCD/MLD) et le concept de clés étrangères restent flous dans vos derniers quiz. Reprenez les fondamentaux de structure.";
      }

      setRecommendation({
        course: foundCourse,
        chapter: foundChapter,
        reason,
      });
    }
  }, [currentUser?.weakChapters, courses]);

  // Simulated typewriter hook for AI summary generation
  const useTypewriter = (text: string, speed = 15, trigger = true) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
      if (!trigger || !text) {
        setDisplayedText('');
        return;
      }

      setDisplayedText('');
      setIsGenerating(true);
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
        }
      }, speed);

      return () => {
        clearInterval(interval);
        setIsGenerating(false);
      };
    }, [text, speed, trigger]);

    return { displayedText, isGenerating };
  };

  // Simulated Ollama request
  const generateAISummary = async (_chapterContent: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `[Ollama Llama3-8B Local] RÉSUMÉ : Ce chapitre aborde les concepts fondamentaux de la leçon. Il est essentiel de retenir que les structures présentées reposent sur une rigueur sémantique. L'architecture globale s'articule autour de la séparation des responsabilités. Le point d'attention majeur réside dans la gestion des clés et des dépendances pour garantir la stabilité et l'extensibilité de vos développements.`
        );
      }, 1000);
    });
  };

  return {
    recommendation,
    useTypewriter,
    generateAISummary,
  };
}
