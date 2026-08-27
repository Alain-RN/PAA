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
  const text = subject.toLowerCase();
  const isCuisine = /cuisine|recette|gastronomie|pâtisserie|cuisson|plat|ingrédient|gâteau|chef/i.test(text);
  const isLangue = /langue|anglais|espagnol|allemand|italien|français|vocabulaire|grammaire|tradu|prononciation|dialogue|voyage/i.test(text);
  const isMecanique = /mécanique|moteur|voiture|automobile|réparation|bricolage|frein|vidange|outil/i.test(text);
  const isMath = /math|algèbre|géométrie|calcul|nombre|probabilit|statistique|équation|analyse|arithmétique/i.test(text);

  if (isCuisine) {
    return JSON.stringify({
      introduction: `Bienvenue dans le chapitre ${chapterIdx + 1} du cours "${subject}". Nous allons étudier les techniques culinaires et les astuces de chefs pour réussir ce plat.`,
      theory: `La cuisine repose sur l'équilibre des saveurs, la précision des températures et la fraîcheur des ingrédients. Maîtriser les étapes de préparation garantit une réussite constante.`,
      practicalExample: `🍳 ATELIER CULINAIRE & RECETTE PAS À PAS : ${subject.toUpperCase()}\n\n• Ingrédients principaux :\n  - Produits frais de qualité et condiments adaptés.\n\n• Étapes de réalisation :\n  1. Préparation (Mise en place) : Éplucher, couper et peser les ingrédients.\n  2. Cuisson : Suivre le temps de cuisson et ajuster à feu moyen.\n  3. Dressage : Assaisonner et présenter élégamment.`,
      keyTakeaways: [
        `Soigner la préparation des ingrédients avant la cuisson`,
        `Contrôler régulièrement la cuisson et les assaisonnements`,
        `Servir immédiatement pour préserver les textures`
      ]
    });
  }

  if (isLangue) {
    return JSON.stringify({
      introduction: `Bienvenue dans le chapitre ${chapterIdx + 1} du cours "${subject}". Nous découvrons les règles essentielles et les expressions clés pour communiquer avec assurance.`,
      theory: `Pour s'exprimer avec fluidité, il faut associer vocabulaire thématisé et structures de phrases naturelles. L'écoute active et la répétition sont les piliers de l'apprentissage.`,
      practicalExample: `🗣️ DIALOGUE D'APPLICATION PRATIQUE : ${subject.toUpperCase()}\n\n• Situation :\n  - Personne A : Salutations chaleureuses et question sur le voyage/thématique.\n  - Personne B : Réponse fluide avec le vocabulaire clé du chapitre.\n\n• Exercice :\n  1. Lire le dialogue à voix haute en soignant l'intonation.\n  2. Mémoriser les 5 mots de vocabulaire essentiels.`,
      keyTakeaways: [
        `Mémoriser les expressions courantes du chapitre`,
        `Pratiquer la prononciation à voix haute au quotidien`,
        `Appliquer la grammaire dans des phrases simples`
      ]
    });
  }

  if (isMecanique) {
    return JSON.stringify({
      introduction: `Bienvenue dans le chapitre ${chapterIdx + 1} du cours "${subject}". Nous abordons le diagnostic, l'outillage et les gestes techniques indispensables.`,
      theory: `La mécanique exige rigueur et méthode. Identifier les symptômes de dysfonctionnement et respecter les couples de serrage évite la dégradation des pièces.`,
      practicalExample: `🔧 FICHE TECHNIQUE & MAINTENANCE : ${subject.toUpperCase()}\n\n• Outils requis :\n  - Clés adaptées, gants de protection et produit dégraissant.\n\n• Procédure pas à pas :\n  1. Inspection visuelle et sécurisation de la zone de travail.\n  2. Démontage ordonné des éléments défectueux.\n  3. Remplacement, nettoyage et contrôle final de fonctionnement.`,
      keyTakeaways: [
        `Mettre les équipements de protection avant toute opération`,
        `Suivre scrupuleusement l'ordre de démontage/remontage`,
        `Tester le système en conditions réelles après travail`
      ]
    });
  }

  if (isMath) {
    return JSON.stringify({
      introduction: `Bienvenue dans le chapitre ${chapterIdx + 1} du cours "${subject}". Nous étudions les formules, les théorèmes et la méthode de résolution pas à pas.`,
      theory: `Les mathématiques s'appuient sur la logique et la démonstration. Comprendre la provenance des formules permet de les appliquer sans erreur dans les problèmes.`,
      practicalExample: `# ---------------------------------------------------------\n# DÉMONSTRATION ET CALCUL RESOLU : ${subject.toUpperCase()}\n# ---------------------------------------------------------\n\nimport math\n\ndef resoudre_exercice_chapitre(x: float):\n    """Exemple de calcul pas à pas."""\n    resultat = math.pow(x, 2) + 2 * x + 1\n    print(f"📊 Pour x = {x}, le résultat calculé est {resultat}")\n    return resultat\n\nresoudre_exercice_chapitre(5.0)`,
      keyTakeaways: [
        `Identifier les données de l'énoncé avant de commencer`,
        `Appliquer rigoureusement les priorités opératoires`,
        `Vérifier la cohérence du résultat final`
      ]
    });
  }

  const phases = [
    'Introduction & Principes de Base',
    'Concepts Fondamentaux & Syntaxe',
    'Mise en Pratique & Exemple Concret',
    'Techniques Avancées & Architecture',
    'Optimisation des Performances & Sécurité',
    'Projet Pratique Complet & Intégration'
  ];
  const phase = phases[Math.min(chapterIdx, phases.length - 1)];
  const subjectSlug = subject.toLowerCase().replace(/[^a-z0-9]/g, '_');

  return JSON.stringify({
    introduction: `Bienvenue dans le chapitre ${chapterIdx + 1} du cours sur "${subject}". Dans ce module, nous allons explorer ${phase.toLowerCase()} pour acquérir des compétences directement exploitables.`,
    theory: `La maîtrise de ${subject} nécessite une compréhension approfondie des mécanismes clés. Ce chapitre aborde la phase "${phase}". Il est essentiel d'assimiler la théorie et d'examiner attentivement l'exemple ci-dessous.`,
    practicalExample: `// ---------------------------------------------------------\n// EXEMPLE PRATIQUE CONCRET : ${subject.toUpperCase()}\n// Module : Chapitre ${chapterIdx + 1} (${phase})\n// Niveau : ${difficulty}\n// ---------------------------------------------------------\n\nfunction init_${subjectSlug}_demo() {\n  const payload = {\n    topic: "${subject}",\n    chapterIndex: ${chapterIdx + 1},\n    phase: "${phase}",\n    status: "READY"\n  };\n\n  console.log("🚀 Exécution du module ${subject} - ${phase}...");\n  return payload;\n}\n\nconst result = init_${subjectSlug}_demo();\nconsole.log("✅ Résultat du module :", result);`,
    keyTakeaways: [
      `Maîtriser les notions clés de la phase "${phase}" pour ${subject}`,
      `Examiner et tester l'exemple pratique pour en comprendre la logique`,
      `Appliquer les bonnes pratiques et conventions présentées`
    ]
  });
}

function buildQuestions(chapterId: string, subject: string, chapterTitle: string): Question[] {
  const ts = Date.now();
  return [
    {
      id: `${chapterId}_q1_easy_${ts}`,
      text: `Quelle est la définition la plus précise du concept central abordé dans "${chapterTitle}" ?`,
      options: [
        `Une notion secondaire sans impact pratique`,
        `Un principe fondamental permettant de comprendre et structurer "${subject}" avec succès`,
        `Un détail technique uniquement réservé aux spécialistes`,
        `Une convention arbitraire sans rapport avec le sujet`,
      ],
      correctAnswerIndex: 1,
      explanation: `Le concept central de ce chapitre est un principe fondamental dans "${subject}" qui permet de structurer efficacement la démarche.`,
      difficulty: 'easy',
    },
    {
      id: `${chapterId}_q2_easy_${ts + 1}`,
      text: `Parmi les affirmations suivantes, laquelle décrit correctement un avantage majeur de "${subject}" ?`,
      options: [
        `Il complexifie l'apprentissage sans apporter de bénéfices réels`,
        `Il est uniquement adapté aux situations très rares`,
        `Il améliore la compréhension, la maîtrise et l'efficacité des solutions apportées`,
        `Il dispense totalement d'appliquer les principes fondamentaux`,
      ],
      correctAnswerIndex: 2,
      explanation: `"${subject}" est reconnu pour améliorer significativement la maîtrise et l'efficacité des solutions.`,
      difficulty: 'easy',
    },
    {
      id: `${chapterId}_q3_medium_${ts + 2}`,
      text: `Dans le contexte de "${chapterTitle}", quelle approche est considérée comme la meilleure pratique ?`,
      options: [
        `Privilégier la rapidité sans vérifier la méthode`,
        `Appliquer les principes enseignés de façon méthodique et rigoureuse`,
        `Ignorer les règles établies pour improviser`,
        `Copier une méthode sans l'adapter à la situation`,
      ],
      correctAnswerIndex: 1,
      explanation: `La meilleure pratique consiste à appliquer les principes de façon méthodique et adaptée au contexte.`,
      difficulty: 'medium',
    },
    {
      id: `${chapterId}_q4_medium_${ts + 3}`,
      text: `Comment se manifeste une mauvaise application des notions de "${chapterTitle}" ?`,
      options: [
        `Le résultat s'améliore automatiquement`,
        `Aucun impact visible sur la qualité`,
        `Des erreurs récurrentes et une perte d'efficacité importante`,
        `La résolution devient instantanée`,
      ],
      correctAnswerIndex: 2,
      explanation: `Une mauvaise application des notions entraîne des erreurs récurrentes et une baisse de qualité.`,
      difficulty: 'medium',
    },
    {
      id: `${chapterId}_q5_hard_${ts + 4}`,
      text: `Dans un cas d'application avancé sur "${subject}", quelle stratégie donne les meilleurs résultats ?`,
      options: [
        `Traiter tout le problème en une seule fois sans méthode`,
        `Décomposer la situation en étapes claires et appliquer les principes éprouvés`,
        `Éviter les contrôles de sécurité et de qualité`,
        `Utiliser des raccourcis risqués`,
      ],
      correctAnswerIndex: 1,
      explanation: `Décomposer le problème en étapes claires et appliquer les principes éprouvés garantit des résultats fiables.`,
      difficulty: 'hard',
    },
    {
      id: `${chapterId}_q6_hard_${ts + 5}`,
      text: `Face à une difficulté dans "${chapterTitle}", quelle démarche analytique est la plus efficace ?`,
      options: [
        `Attendre sans rien modifier`,
        `Abandonner le processus et recommencer à zéro`,
        `Analyser les symptômes, vérifier les principes de base et corriger étape par étape`,
        `Ignorer les avertissements`,
      ],
      correctAnswerIndex: 2,
      explanation: `L'analyse rigoureuse des symptômes et la vérification des principes de base permettent de résoudre le problème efficacement.`,
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

// ─── Intégration de llama.cpp / LLM local (Sans Base de Données) ─────────────

async function generateWithLlamaCpp(params: AIGenerationParams, baseUrl: string): Promise<AIGenerationResult> {
  const { title, category, difficulty, nbChapters, additionalContext } = params;
  const courseId = `c_ai_${Date.now()}`;

  const prompt = `Tu es un expert pédagogique. Génère un cours complet en JSON strict avec cette structure exacte (SANS MARKDOWN, SANS TEXTE AVANT OU APRES) :
{
  "description": "description du cours en 2-3 phrases",
  "chapters": [
    {
      "title": "Titre du chapitre",
      "content": "Contenu détaillé du chapitre avec explications et exemples",
      "summaryByAI": "Résumé concis du chapitre",
      "questions": [
        {"text": "Question 1 ?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswerIndex": 0, "explanation": "Explication", "difficulty": "easy"},
        {"text": "Question 2 ?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswerIndex": 1, "explanation": "Explication", "difficulty": "medium"},
        {"text": "Question 3 ?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswerIndex": 2, "explanation": "Explication", "difficulty": "hard"}
      ]
    }
  ]
}

Paramètres du cours:
- Titre: "${title}"
- Catégorie: "${category}"
- Difficulté: "${difficulty}"
- Nombre de chapitres: ${nbChapters}
${additionalContext ? `- Contexte: ${additionalContext}` : ''}

Réponds uniquement avec le JSON.`;

  let rawText = '';

  // 1. Essayer le serveur HTTP llama.cpp / Ollama en mode OpenAI (/v1/chat/completions)
  try {
    const chatUrl = baseUrl.replace(/\/$/, '') + '/v1/chat/completions';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout check

    const res = await fetch(chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Tu es un assistant pédagogique qui réponds TOUJOURS en JSON valide.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      rawText = data.choices?.[0]?.message?.content || '';
    }
  } catch (e) {
    console.log('OpenAI endpoint fallback for llama.cpp:', e);
  }

  // 2. Si endpoint chat non disponible, essayer l'endpoint natif llama.cpp (/completion)
  if (!rawText) {
    const compUrl = baseUrl.replace(/\/$/, '') + '/completion';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(compUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `[INST] Tu es un assistant pédagogique qui réponds TOUJOURS en JSON valide.\n${prompt} [/INST]`,
        temperature: 0.7,
        n_predict: 4096,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Serveur llama.cpp non joignable à ${baseUrl}`);
    const data = await res.json();
    rawText = data.content || '';
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Aucun JSON valide dans la réponse du modèle llama.cpp');

  const parsed = JSON.parse(jsonMatch[0]);

  const chapters: Chapter[] = (parsed.chapters as any[]).map((ch: any, i: number) => ({
    id: `${courseId}_ch${i + 1}`,
    courseId,
    title: ch.title || `Chapitre ${i + 1}`,
    content: ch.content || `Contenu du chapitre ${i + 1}`,
    summaryByAI: ch.summaryByAI || `Résumé du chapitre ${i + 1}`,
    order: i + 1,
  }));

  const course: Course = {
    id: courseId,
    title,
    description: parsed.description || `Cours "${title}" généré localement par llama.cpp.`,
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
    if (Array.isArray(ch.questions)) {
      questionsByChapter[chapterId] = ch.questions.map((q: any, qi: number) => ({
        id: `${chapterId}_q${qi + 1}_${q.difficulty || 'medium'}_${ts + qi}`,
        text: q.text,
        options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
        explanation: q.explanation || 'Explication de la réponse.',
        difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      }));
    }
  });

  return { course, questionsByChapter };
}

// ─── Fonction principale exportée ─────────────────────────────────────────────

export async function generateCourseWithAI(params: AIGenerationParams): Promise<AIGenerationResult> {
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const llamaUrl =
    (import.meta.env.VITE_LLAMA_URL as string) ||
    localStorage.getItem('llama_cpp_url') ||
    'http://localhost:8080';
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // 1. Tenter la génération via le backend Express (qui persiste dans PostgreSQL)
  try {
    const res = await fetch(`${backendUrl}/courses/generate-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.course) {
        const questionsByChapter: Record<string, Question[]> = {};
        (data.course.chapters || []).forEach((ch: any) => {
          if (ch.questions) {
            questionsByChapter[ch.id] = ch.questions;
          }
        });
        return { course: data.course, questionsByChapter };
      }
    }
  } catch (err) {
    console.warn('Backend Express non disponible pour la génération AI (fallback local):', err);
  }

  // 2. Tenter la connexion directe au serveur llama.cpp local
  try {
    return await generateWithLlamaCpp(params, llamaUrl);
  } catch (err) {
    console.warn('llama.cpp non disponible (fallback Gemini / local):', err);
  }

  // 3. Tenter l'API Gemini si la clé est présente
  if (apiKey && apiKey.length > 10) {
    try {
      return await generateWithGemini(params, apiKey);
    } catch (err) {
      console.warn('Gemini API échoué :', err);
    }
  }

  // 4. Générateur dynamique autonome
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return simulateLocalGeneration(params);
}
