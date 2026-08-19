import type { Course, Chapter, Question } from '../types';

export interface AIGenerationParams {
  title: string;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  nbChapters: number;
  additionalContext?: string;
}

export interface AIGenerationResult {
  course: Course;
  questionsByChapter: Record<string, Question[]>;
}

// ─── Simulation locale intelligente ──────────────────────────────────────────
// Génère un cours complet basé sur le sujet, sans appel API

const DIFFICULTY_XP: Record<string, number> = {
  Débutant: 300,
  Intermédiaire: 400,
  Avancé: 500,
};

function buildChapterContent(subject: string, chapterIdx: number, _totalChapters: number, difficulty: string): string {
  const phases = ['introduction', 'fondamentaux', 'pratique', 'avancé', 'expert', 'maîtrise'];
  const phase = phases[Math.min(chapterIdx, phases.length - 1)];

  const difficultyLabel = difficulty === 'Débutant' ? 'des bases solides' : difficulty === 'Intermédiaire' ? 'une maîtrise intermédiaire' : 'une expertise avancée';

  return `Ce chapitre ${chapterIdx + 1} aborde la phase "${phase}" du sujet "${subject}".

**Objectifs pédagogiques :**
À l'issue de ce chapitre, vous serez capable de :
- Comprendre les concepts fondamentaux liés à cette phase de "${subject}"
- Appliquer les techniques enseignées dans un contexte réel
- Analyser et résoudre des problèmes courants associés à ce niveau

**Contenu principal :**
La maîtrise de "${subject}" au niveau ${chapterIdx + 1} repose sur une compréhension progressive des mécanismes sous-jacents. Ce chapitre vous guidera depuis les concepts théoriques jusqu'aux applications concrètes, en vous donnant ${difficultyLabel}.

**Concepts clés :**
1. **Définition et contexte** : Comprendre pourquoi ce domaine est essentiel dans le paysage technologique actuel.
2. **Mécanismes de base** : Explorer les principes qui régissent le fonctionnement à ce niveau.
3. **Cas d'usage pratiques** : Étudier des exemples réels et des scénarios d'application.
4. **Bonnes pratiques** : Adopter les standards de l'industrie pour un code propre et maintenable.
5. **Erreurs courantes** : Identifier et éviter les pièges fréquents lors de la mise en pratique.

**Exemple concret :**
\`\`\`
// Exemple de mise en oeuvre — ${subject} (Phase ${chapterIdx + 1})
// Adaptez cet exemple à votre contexte spécifique
const exemple = {
  sujet: "${subject}",
  phase: "${phase}",
  niveau: "${difficulty}",
};
\`\`\`

**Résumé :**
Ce chapitre pose les fondations nécessaires pour progresser vers les étapes suivantes. Prenez le temps de pratiquer les exercices associés avant de passer au chapitre suivant.`;
}

function buildQuestions(chapterId: string, subject: string, chapterTitle: string): Question[] {
  const ts = Date.now();
  return [
    {
      id: `${chapterId}_q1_easy_${ts}`,
      text: `Quelle est la définition la plus précise du concept central abordé dans "${chapterTitle}" ?`,
      options: [
        `Un ensemble de règles syntaxiques sans impact fonctionnel`,
        `Un principe fondamental permettant de structurer et d'organiser "${subject}" de manière efficace`,
        `Un outil optionnel réservé aux projets de grande envergure`,
        `Une convention visuelle sans rapport avec la logique métier`,
      ],
      correctAnswerIndex: 1,
      explanation: `Le concept central de ce chapitre est un principe fondamental dans "${subject}" qui permet d'organiser et de structurer efficacement les solutions.`,
      difficulty: 'easy',
    },
    {
      id: `${chapterId}_q2_easy_${ts + 1}`,
      text: `Parmi les affirmations suivantes, laquelle décrit correctement un avantage majeur de "${subject}" ?`,
      options: [
        `Il complexifie inutilement le code sans apporter de bénéfices`,
        `Il est uniquement adapté aux petits projets`,
        `Il améliore la maintenabilité, la lisibilité et la scalabilité des solutions`,
        `Il remplace totalement la nécessité de tester son code`,
      ],
      correctAnswerIndex: 2,
      explanation: `"${subject}" est reconnu pour améliorer significativement la maintenabilité et la scalabilité des projets.`,
      difficulty: 'easy',
    },
    {
      id: `${chapterId}_q3_medium_${ts + 2}`,
      text: `Dans le contexte de "${chapterTitle}", quelle approche est considérée comme la meilleure pratique ?`,
      options: [
        `Privilégier la rapidité de développement sur la qualité du code`,
        `Appliquer les principes enseignés de façon rigoureuse dès la conception`,
        `Ignorer les conventions établies pour favoriser la créativité`,
        `Copier des solutions existantes sans les adapter au contexte`,
      ],
      correctAnswerIndex: 1,
      explanation: `La meilleure pratique consiste à appliquer les principes dès la phase de conception pour garantir la qualité et la maintenabilité à long terme.`,
      difficulty: 'medium',
    },
    {
      id: `${chapterId}_q4_medium_${ts + 3}`,
      text: `Comment se manifeste une mauvaise compréhension des concepts de "${chapterTitle}" dans un projet réel ?`,
      options: [
        `Le projet se termine plus rapidement que prévu`,
        `Aucun impact visible sur le long terme`,
        `Le code devient difficile à maintenir, générant des bugs récurrents et une dette technique`,
        `Les performances s'améliorent automatiquement`,
      ],
      correctAnswerIndex: 2,
      explanation: `Une mauvaise application des concepts entraîne une dette technique, des bugs récurrents et rend le code très difficile à maintenir.`,
      difficulty: 'medium',
    },
    {
      id: `${chapterId}_q5_hard_${ts + 4}`,
      text: `Dans un scénario avancé appliquant "${subject}", quelle stratégie permet d'optimiser simultanément la performance et la maintenabilité ?`,
      options: [
        `Réduire au maximum le nombre de fichiers, quitte à concentrer toute la logique dans un seul module`,
        `Appliquer une séparation des responsabilités stricte couplée à des patterns éprouvés`,
        `Éviter l'abstraction pour rester proche du code machine`,
        `Dupliquer le code pour éviter les dépendances entre modules`,
      ],
      correctAnswerIndex: 1,
      explanation: `La séparation des responsabilités et l'utilisation de patterns éprouvés sont les clés pour maintenir une base de code performante et maintenable sur le long terme.`,
      difficulty: 'hard',
    },
    {
      id: `${chapterId}_q6_hard_${ts + 5}`,
      text: `Face à un problème complexe dans "${subject}", quelle démarche analytique est la plus efficace ?`,
      options: [
        `Implémenter immédiatement la première solution qui vient à l'esprit`,
        `Attendre que le problème se résolve de lui-même`,
        `Décomposer le problème en sous-problèmes, identifier les patterns connus, puis synthétiser une solution`,
        `Contourner le problème en changeant les spécifications`,
      ],
      correctAnswerIndex: 2,
      explanation: `La démarche analytique efficace consiste à décomposer le problème, identifier les patterns connus et construire une solution étape par étape.`,
      difficulty: 'hard',
    },
  ];
}

function generateChapterTitle(subject: string, idx: number): string {
  const chapterTemplates = [
    `Introduction et fondamentaux de ${subject}`,
    `Architecture et principes de conception`,
    `Mise en pratique et cas d'usage`,
    `Patterns avancés et optimisations`,
    `Intégration et bonnes pratiques professionnelles`,
    `Maîtrise et projets complexes`,
  ];
  return chapterTemplates[idx] || `Chapitre ${idx + 1} : ${subject} — Niveau ${idx + 1}`;
}

function generateSummary(subject: string, chapterTitle: string): string {
  return `Ce chapitre couvre les aspects essentiels de "${chapterTitle}" dans le contexte de ${subject}. Les concepts clés incluent les principes fondamentaux, les bonnes pratiques et les techniques avancées nécessaires pour maîtriser cette phase.`;
}

function simulateLocalGeneration(params: AIGenerationParams): AIGenerationResult {
  const { title, category, difficulty, nbChapters } = params;
  const courseId = `c_ai_${Date.now()}`;

  const chapters: Chapter[] = Array.from({ length: nbChapters }, (_, i) => {
    const chapterId = `${courseId}_ch${i + 1}`;
    const chapterTitle = generateChapterTitle(title, i);
    return {
      id: chapterId,
      courseId,
      title: chapterTitle,
      content: buildChapterContent(title, i, nbChapters, difficulty),
      summaryByAI: generateSummary(title, chapterTitle),
      order: i + 1,
    };
  });

  const course: Course = {
    id: courseId,
    title,
    description: `Cours complet sur "${title}" — généré par l'IA. Ce parcours de ${nbChapters} chapitres couvre l'ensemble des compétences nécessaires pour maîtriser ${title}, du niveau ${difficulty.toLowerCase()} jusqu'à la mise en pratique professionnelle.`,
    category,
    difficulty,
    xpReward: DIFFICULTY_XP[difficulty] || 300,
    chapters,
    isRecommended: false,
  };

  const questionsByChapter: Record<string, Question[]> = {};
  chapters.forEach((ch) => {
    questionsByChapter[ch.id] = buildQuestions(ch.id, title, ch.title);
  });

  return { course, questionsByChapter };
}

// ─── Génération via Gemini API ────────────────────────────────────────────────

async function generateWithGemini(params: AIGenerationParams, apiKey: string): Promise<AIGenerationResult> {
  const { title, category, difficulty, nbChapters, additionalContext } = params;
  const courseId = `c_ai_${Date.now()}`;

  const prompt = `Tu es un expert pédagogique. Génère un cours complet en JSON strict (sans markdown, juste du JSON) avec cette structure exacte:

{
  "description": "description du cours en 2-3 phrases",
  "chapters": [
    {
      "title": "Titre du chapitre",
      "content": "Contenu détaillé du chapitre (minimum 400 mots, avec exemples de code si pertinent)",
      "summaryByAI": "Résumé concis du chapitre en 2-3 phrases",
      "questions": [
        {"text": "Question ?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0, "explanation": "Explication", "difficulty": "easy"},
        {"text": "Question ?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 1, "explanation": "Explication", "difficulty": "easy"},
        {"text": "Question ?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 2, "explanation": "Explication", "difficulty": "medium"},
        {"text": "Question ?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0, "explanation": "Explication", "difficulty": "medium"},
        {"text": "Question ?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 1, "explanation": "Explication", "difficulty": "hard"},
        {"text": "Question ?", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 3, "explanation": "Explication", "difficulty": "hard"}
      ]
    }
  ]
}

Paramètres du cours à créer:
- Titre: "${title}"
- Catégorie: "${category}"
- Difficulté: "${difficulty}"
- Nombre de chapitres: ${nbChapters}
${additionalContext ? `- Contexte additionnel: ${additionalContext}` : ''}

Génère EXACTEMENT ${nbChapters} chapitres. Le contenu doit être en FRANÇAIS. JSON pur uniquement.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Réponse vide de l\'API Gemini');

  // Parse JSON
  const parsed = JSON.parse(rawText.trim());

  const chapters: Chapter[] = (parsed.chapters as any[]).map((ch: any, i: number) => ({
    id: `${courseId}_ch${i + 1}`,
    courseId,
    title: ch.title,
    content: ch.content,
    summaryByAI: ch.summaryByAI,
    order: i + 1,
  }));

  const course: Course = {
    id: courseId,
    title,
    description: parsed.description || `Cours "${title}" généré par l'IA.`,
    category,
    difficulty,
    xpReward: DIFFICULTY_XP[difficulty] || 300,
    chapters,
    isRecommended: false,
  };

  const questionsByChapter: Record<string, Question[]> = {};
  (parsed.chapters as any[]).forEach((ch: any, i: number) => {
    const chapterId = chapters[i].id;
    const ts = Date.now() + i;
    questionsByChapter[chapterId] = (ch.questions as any[]).map((q: any, qi: number) => ({
      id: `${chapterId}_q${qi + 1}_${q.difficulty}_${ts + qi}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
    }));
  });

  return { course, questionsByChapter };
}

// ─── Fonction principale exportée ─────────────────────────────────────────────

export async function generateCourseWithAI(params: AIGenerationParams): Promise<AIGenerationResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (apiKey && apiKey.length > 10) {
    try {
      return await generateWithGemini(params, apiKey);
    } catch (err) {
      console.warn('Gemini API failed, falling back to local simulation:', err);
      // Fallback gracieux sur la simulation locale
    }
  }

  // Simulation locale avec un léger délai pour l'effet "IA qui travaille"
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return simulateLocalGeneration(params);
}
