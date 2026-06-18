import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Course, HistoryLog, LeaderboardEntry, Badge, Question, GlobalAnalytics } from '../types';

interface AppStateContextType {
  currentUser: User | null;
  courses: Course[];
  historyLogs: HistoryLog[];
  leaderboard: LeaderboardEntry[];
  analytics: GlobalAnalytics;
  login: (email: string, role: 'student' | 'admin') => boolean;
  register: (name: string, email: string) => void;
  logout: () => void;
  completeChapter: (courseId: string, chapterId: string) => void;
  saveQuizAttempt: (
    quizId: string, 
    chapterId: string, 
    score: number, 
    difficultyBefore: 'easy' | 'medium' | 'hard', 
    difficultyAfter: 'easy' | 'medium' | 'hard',
    xpGained: number
  ) => void;
  addXP: (amount: number, reason: string) => void;
  addWeakChapter: (chapterId: string) => void;
  removeWeakChapter: (chapterId: string) => void;
  updateCourseProgress: (courseId: string) => void;
  // Admin functions
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  usersList: User[];
  updateUserRole: (userId: string, role: 'student' | 'admin') => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Initial Mock Badges
const ALL_BADGES: Badge[] = [
  { id: 'b1', name: 'Premier Pas', description: 'Création de votre compte sur la plateforme', icon: 'UserCheck', category: 'special' },
  { id: 'b2', name: 'Série de Feu', description: 'Maintenir une série d\'apprentissage de 5 jours', icon: 'Flame', category: 'streak' },
  { id: 'b3', name: 'Maître des Requêtes', description: 'Terminer tous les chapitres SQL', icon: 'Database', category: 'course' },
  { id: 'b4', name: 'Pionnier de l\'IA', description: 'Compléter le cours IA Locale Ollama', icon: 'Cpu', category: 'course' },
  { id: 'b5', name: 'Esprit Flexible', description: 'Réussir une transition de difficulté de Facile à Moyen en quiz', icon: 'TrendingUp', category: 'quiz' },
  { id: 'b6', name: 'Perfectionniste', description: 'Obtenir 100% de réussite sur un quiz adaptatif', icon: 'Award', category: 'quiz' },
];

// Initial Mock Courses
const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Bases de Données Relationnelles & SQL',
    description: 'Apprenez à modéliser vos données, concevoir des bases PostgreSQL/MySQL, et maîtriser le langage SQL des requêtes de base aux jointures complexes.',
    category: 'Bases de données',
    difficulty: 'Débutant',
    xpReward: 300,
    chapters: [
      {
        id: 'c1_ch1',
        courseId: 'c1',
        title: 'Introduction aux SGBDR et Modélisation (MCD, MLD)',
        content: 'Un Système de Gestion de Bases de Données Relationnelles (SGBDR) organise les données sous forme de tables reliées entre elles. Avant de coder, il faut modéliser : \n1. Le Modèle Conceptuel des Données (MCD) avec des entités et des associations.\n2. Le Modèle Logique des Données (MLD) traduisant ces entités en tables relationnelles avec clés primaires (Unique ID) et clés étrangères (Foreign Keys) assurant l\'intégrité référentielle.\n\nExemple de relations :\n- Un-à-Plusieurs (1:N) : Un étudiant appartient à une classe.\n- Plusieurs-à-Plusieurs (N:M) : Un étudiant s\'inscrit à plusieurs cours. Cette relation nécessite une table d\'association.',
        summaryByAI: 'Les SGBDR structurent les données en tables. La conception passe par un MCD (entités/associations) puis un MLD (tables avec clés primaires et clés étrangères). Les clés étrangères permettent de lier les entités de façon intègre.',
        order: 1
      },
      {
        id: 'c1_ch2',
        courseId: 'c1',
        title: 'Sélection et filtrage des données (SELECT, WHERE, ORDER BY)',
        content: 'Le langage SQL (Structured Query Language) permet d\'interroger les tables. La commande de base est SELECT, combinée à FROM.\n\nSyntaxe de base :\n`SELECT colonne1, colonne2 FROM table;`\n\nPour filtrer les données, on utilise la clause WHERE :\n`SELECT * FROM etudiants WHERE niveau >= 3;`\n\nOn peut trier les résultats avec ORDER BY (ASC pour croissant, DESC pour décroissant) :\n`SELECT nom, xp FROM etudiants ORDER BY xp DESC;`\n\nOpérateurs logiques : AND, OR, NOT, IN, LIKE (recherche textuelle avec wildcard `%`).',
        summaryByAI: 'Pour récupérer des données spécifiques, utilisez SELECT. Filtrez les lignes avec WHERE en spécifiant des conditions logiques. Triez les résultats avec ORDER BY.',
        order: 2
      },
      {
        id: 'c1_ch3',
        courseId: 'c1',
        title: 'Jointures complexes et Agrégations (JOIN, GROUP BY, HAVING)',
        content: 'Les jointures permettent de combiner les colonnes de plusieurs tables basées sur une valeur commune (généralement clé primaire = clé étrangère).\n\nTypes de jointures :\n- INNER JOIN : retourne les enregistrements ayant des correspondances dans les deux tables.\n- LEFT JOIN : retourne tous les enregistrements de la table de gauche, et les correspondances de droite.\n- RIGHT JOIN : retourne tous les enregistrements de la table de droite, et les correspondances de gauche.\n\nLes fonctions d\'agrégation (SUM, AVG, COUNT, MAX, MIN) permettent de calculer des statistiques. Elles s\'associent à GROUP BY pour regrouper les lignes.\n\nFiltrer un groupe :\nPour appliquer une condition sur un calcul agrégé, WHERE ne fonctionne pas. Il faut utiliser HAVING :\n`SELECT cours_id, COUNT(etudiant_id) FROM inscriptions GROUP BY cours_id HAVING COUNT(etudiant_id) > 5;`',
        summaryByAI: 'Les JOIN fusionnent les données de plusieurs tables. Les fonctions d\'agrégation groupent les données via GROUP BY, et HAVING filtre ces groupes (contrairement à WHERE qui filtre les lignes individuelles).',
        order: 3
      }
    ]
  },
  {
    id: 'c2',
    title: 'Développement Web Frontend avec React',
    description: 'Maîtrisez les concepts clés de React 19, du DOM virtuel à la gestion d\'état locale ou globale avec Context API.',
    category: 'Frontend',
    difficulty: 'Intermédiaire',
    xpReward: 400,
    chapters: [
      {
        id: 'c2_ch1',
        courseId: 'c2',
        title: 'Comprendre le DOM virtuel & Syntaxe JSX',
        content: 'React repose sur le Virtual DOM. Au lieu de manipuler directement le DOM du navigateur (qui est une opération lente), React conserve une copie légère en mémoire. Quand l\'état change, React crée un nouveau Virtual DOM, le compare à l\'ancien (algorithme de Diffing), et ne met à jour que les éléments réels modifiés (Reconciliation).\n\nJSX (JavaScript XML) permet d\'écrire des structures HTML directement au sein du code JavaScript. Chaque balise JSX est convertie en appel de fonction `React.createElement`. Il y a des règles de syntaxe :\n- Un seul élément parent racine.\n- Les attributs s\'écrivent en camelCase (ex : class devient className).\n- On intègre du code JS dynamique dans des accolades `{}`.',
        summaryByAI: 'Le Virtual DOM permet à React d\'optimiser les rendus en ne mettant à jour que les parties du DOM qui ont changé. JSX combine HTML et JS dans un format lisible.',
        order: 1
      },
      {
        id: 'c2_ch2',
        courseId: 'c2',
        title: 'Gestion de l\'état local et effets secondaires (useState, useEffect)',
        content: 'L\'état représente les données dynamiques d\'un composant qui provoquent un nouveau rendu lorsqu\'elles changent. On utilise le hook `useState` :\n`const [count, setCount] = useState(0);`\n\nPour gérer les effets secondaires (appels API, écouteurs d\'événements, synchronisations), on utilise `useEffect` :\n`useEffect(() => { ... }, [dependencies]);`\nLe tableau de dépendances détermine quand l\'effet s\'exécute. S\'il est vide `[]`, il s\'exécute uniquement au montage du composant. La fonction retournée à la fin de l\'effet sert à nettoyer (Clean-up) pour éviter les fuites de mémoire.',
        summaryByAI: 'useState gère l\'état réactif local d\'un composant. useEffect contrôle les effets de bord et la synchronisation externe, avec nettoyage au démontage.',
        order: 2
      }
    ]
  },
  {
    id: 'c3',
    title: 'Intelligence Artificielle Locale avec Ollama',
    description: 'Intégrez des modèles de langage avancés (Llama 3, Mistral) directement en local dans vos applications web sans dépendre d\'API payantes.',
    category: 'Intelligence Artificielle',
    difficulty: 'Avancé',
    xpReward: 500,
    chapters: [
      {
        id: 'c3_ch1',
        courseId: 'c3',
        title: 'Introduction aux LLM locaux',
        content: 'L\'exécution locale d\'IA offre plusieurs avantages : confidentialité absolue des données, absence de frais d\'API récurrents, et fonctionnement hors-ligne. Ollama est un outil léger qui permet de faire tourner des modèles de langage géants (LLM) sous macOS, Linux et Windows en exposant une API REST locale sur le port 11434.\n\nLes modèles populaires incluent :\n- Llama 3 (Meta) : excellent en généraliste.\n- Mistral (Français) : performant et optimisé.\n- Codellama / Qwen : spécialisés en programmation.',
        summaryByAI: 'Ollama simplifie l\'exécution de grands modèles (LLM) en local sur votre machine. Il gère le matériel et expose une API HTTP simple pour communiquer avec les modèles.',
        order: 1
      }
    ]
  }
];

// Questions Pool by Chapter and Difficulty for Adaptive Quizzes
const QUESTIONS_POOL: Record<string, Question[]> = {
  'c1_ch1': [
    { id: 'q1_easy', text: 'Que signifie le sigle SGBDR ?', options: ['Système Général de Base de Données Réseau', 'Système de Gestion de Bases de Données Relationnelles', 'Structure Graphique de Base de Données Répartie', 'Serveur de Gestion des Bases de Données Réplicables'], correctAnswerIndex: 1, explanation: 'SGBDR signifie Système de Gestion de Bases de Données Relationnelles.', difficulty: 'easy' },
    { id: 'q2_easy', text: 'Qu\'est-ce qu\'une clé primaire ?', options: ['Une clé qui crypte la base de données', 'Un identifiant unique pour chaque enregistrement d\'une table', 'Le mot de passe de l\'administrateur', 'La première colonne alphabétique'], correctAnswerIndex: 1, explanation: 'Une clé primaire identifie de manière unique chaque ligne d\'une table.', difficulty: 'easy' },
    { id: 'q3_medium', text: 'Comment s\'appelle la clé d\'une table faisant référence à la clé primaire d\'une autre table ?', options: ['Clé secondaire', 'Clé référentielle', 'Clé étrangère', 'Clé externe'], correctAnswerIndex: 2, explanation: 'Une clé étrangère (Foreign Key) pointe vers une clé primaire d\'une autre table pour établir une relation.', difficulty: 'medium' },
    { id: 'q4_medium', text: 'Dans quel modèle définit-on l\'intégrité référentielle en premier ?', options: ['Le MCD (Modèle Conceptuel)', 'Le MLD (Modèle Logique)', 'Le dictionnaire de données', 'La base physique'], correctAnswerIndex: 1, explanation: 'L\'intégrité référentielle et les clés étrangères sont formalisées au niveau du Modèle Logique des Données (MLD).', difficulty: 'medium' },
    { id: 'q5_hard', text: 'Si une entité A a une relation (1,N) avec une entité B, comment est traduite cette relation en tables relationnelles (MLD) ?', options: ['On crée une table d\'association avec les identifiants de A et B', 'La clé primaire de A migre comme clé étrangère dans la table B', 'La clé primaire de B migre comme clé étrangère dans la table A', 'Les deux tables sont fusionnées'], correctAnswerIndex: 1, explanation: 'Pour une relation 1:N (une entité A peut être associée à plusieurs B), la clé primaire du côté "1" (table A) migre comme clé étrangère dans la table du côté "N" (table B).', difficulty: 'hard' },
    { id: 'q6_hard', text: 'Quelle anomalie de base de données est directement empêchée par une contrainte de clé étrangère avec ON DELETE RESTRICT ?', options: ['La duplication des enregistrements', 'Les enregistrements orphelins dans la table dépendante', 'Les lenteurs lors des requêtes SELECT', 'L\'inversion des clés primaires'], correctAnswerIndex: 1, explanation: 'L\'option ON DELETE RESTRICT empêche la suppression d\'une ligne dans une table parente si d\'autres tables y font référence, évitant ainsi d\'avoir des lignes orphelines (qui pointent vers un identifiant inexistant).', difficulty: 'hard' }
  ],
  'c1_ch2': [
    { id: 'q7_easy', text: 'Quelle clause permet de filtrer les résultats d\'une requête SELECT ?', options: ['HAVING', 'WHERE', 'FILTER', 'GROUP BY'], correctAnswerIndex: 1, explanation: 'La clause WHERE filtre les lignes selon des conditions définies.', difficulty: 'easy' },
    { id: 'q8_easy', text: 'Comment trier les résultats par ordre décroissant ?', options: ['ORDER BY colonne DESC', 'SORT BY colonne DESC', 'ORDER BY colonne DOWN', 'GROUP BY colonne REVERSE'], correctAnswerIndex: 0, explanation: 'DESC est le mot-clé pour le tri décroissant (Descending).', difficulty: 'easy' },
    { id: 'q9_medium', text: 'Quelle est la différence entre les opérateurs LIKE et = dans un WHERE ?', options: ['LIKE est plus rapide', 'LIKE permet des recherches par motif avec des jokers comme %', '= n\'accepte que les nombres', 'LIKE ne fonctionne qu\'avec PostgreSQL'], correctAnswerIndex: 1, explanation: 'LIKE permet le "pattern matching", par exemple `LIKE \'J%\'` trouve tous les mots commençant par J, tandis que `=` compare l\'égalité stricte.', difficulty: 'medium' },
    { id: 'q10_medium', text: 'Quelle requête retourne les étudiants dont l\'XP est comprise entre 1000 et 2000 inclus ?', options: ['WHERE xp >= 1000 OR xp <= 2000', 'WHERE xp BETWEEN 1000 AND 2000', 'WHERE xp IN (1000, 2000)', 'WHERE xp >= 1000, <= 2000'], correctAnswerIndex: 1, explanation: 'L\'opérateur BETWEEN vérifie si une valeur se situe dans une plage incluant les bornes.', difficulty: 'medium' },
    { id: 'q11_hard', text: 'Comment écrire une requête SELECT qui filtre sur un champ de texte contenant le caractère "%" littéral ?', options: ['WHERE texte LIKE \'%%\';', 'WHERE texte LIKE \'\\%\';', 'WHERE texte LIKE \'%!%\' ESCAPE \'!\';', 'WHERE texte = \'%\';'], correctAnswerIndex: 2, explanation: 'En SQL standard, pour rechercher le caractère de pourcentage lui-même avec LIKE, on définit un caractère d\'échappement via ESCAPE, comme : LIKE \'%!%\' ESCAPE \'!\'.', difficulty: 'hard' },
    { id: 'q12_hard', text: 'Que renvoie la requête : `SELECT NULL = NULL;` ?', options: ['true', 'false', 'NULL', 'Erreur de syntaxe'], correctAnswerIndex: 2, explanation: 'En SQL, toute comparaison d\'égalité avec NULL renvoie NULL (inconnu). Pour tester la nullité, il faut utiliser `IS NULL`.', difficulty: 'hard' }
  ],
  'c1_ch3': [
    { id: 'q13_easy', text: 'Quelle jointure retourne les lignes uniquement s\'il y a correspondance dans les deux tables ?', options: ['LEFT JOIN', 'FULL JOIN', 'INNER JOIN', 'OUTER JOIN'], correctAnswerIndex: 2, explanation: 'INNER JOIN filtre les résultats pour ne garder que les lignes qui s\'apparient entre les tables.', difficulty: 'easy' },
    { id: 'q14_easy', text: 'Quelle fonction d\'agrégation calcule la moyenne d\'une colonne numérique ?', options: ['SUM()', 'AVG()', 'MEAN()', 'COUNT()'], correctAnswerIndex: 1, explanation: 'AVG() signifie Average (moyenne).', difficulty: 'easy' },
    { id: 'q15_medium', text: 'Quelle clause doit accompagner une fonction d\'agrégation pour calculer des moyennes par catégorie ?', options: ['ORDER BY', 'GROUP BY', 'HAVING', 'WHERE'], correctAnswerIndex: 1, explanation: 'GROUP BY groupe les lignes possédant les mêmes valeurs afin d\'effectuer des calculs d\'agrégation par groupe.', difficulty: 'medium' },
    { id: 'q16_medium', text: 'Quelle est la différence majeure entre WHERE et HAVING ?', options: ['WHERE s\'applique avant le GROUP BY (filtre les lignes), HAVING s\'applique après (filtre les groupes)', 'HAVING est plus rapide', 'WHERE n\'accepte pas les chaînes de caractères', 'HAVING s\'applique sur les clés étrangères uniquement'], correctAnswerIndex: 0, explanation: 'WHERE filtre les enregistrements individuels avant agrégation. HAVING filtre les résultats agrégés du GROUP BY.', difficulty: 'medium' },
    { id: 'q17_hard', text: 'Dans une jointure LEFT JOIN entre TableA et TableB, que contient une colonne de TableB s\'il n\'y a pas de correspondance pour une ligne de TableA ?', options: ['Une chaîne vide', 'La valeur 0', 'La valeur NULL', 'Une erreur est levée'], correctAnswerIndex: 2, explanation: 'Si aucune correspondance n\'existe à droite dans un LEFT JOIN, les colonnes correspondantes de la table de droite sont remplies avec NULL.', difficulty: 'hard' },
    { id: 'q18_hard', text: 'Comment s\'appelle une requête SQL imbriquée dans une autre clause WHERE ou FROM ?', options: ['Une sous-requête (Subquery)', 'Une jointure implicite', 'Une fonction stockée', 'Une vue temporaire'], correctAnswerIndex: 0, explanation: 'Une sous-requête (ou requête corrélée / imbriquée) est une requête interne exécutée pour le besoin de la requête externe.', difficulty: 'hard' }
  ],
  // Default fallback questions for React and IA
  'c2_ch1': [
    { id: 'q19_easy', text: 'Quel est l\'objectif du Virtual DOM dans React ?', options: ['Créer une interface 3D', 'Optimiser les performances en limitant les mises à jour directes du DOM réel', 'Rendre l\'application compatible avec Internet Explorer', 'Sécuriser l\'application contre le piratage'], correctAnswerIndex: 1, explanation: 'Le Virtual DOM met à jour de façon optimale le vrai DOM en calculant le diff minimal.', difficulty: 'easy' },
    { id: 'q20_medium', text: 'Quelle affirmation est vraie concernant JSX ?', options: ['JSX est obligatoire pour utiliser React', 'JSX est compilé en appels de fonctions JavaScript classiques', 'JSX s\'exécute directement dans tous les navigateurs récents', 'JSX n\'autorise pas l\'écriture de boucles'], correctAnswerIndex: 1, explanation: 'JSX est du sucre syntaxique compilé en `React.createElement` ou équivalent JS.', difficulty: 'medium' },
    { id: 'q21_hard', text: 'En React 19, comment le compilateur React (React Compiler) optimise-t-il les rendus ?', options: ['En remplaçant le JavaScript par du WebAssembly', 'En mémoïsant automatiquement les valeurs et composants sans avoir besoin de useMemo ou useCallback', 'En supprimant le Virtual DOM', 'En exécutant le code côté serveur uniquement'], correctAnswerIndex: 1, explanation: 'Le nouveau compilateur React élimine le besoin de mémoïsation manuelle (useMemo, useCallback) en optimisant le code au build.', difficulty: 'hard' }
  ],
  'c2_ch2': [
    { id: 'q22_easy', text: 'Quel hook React sert à conserver un état local réactif ?', options: ['useEffect', 'useState', 'useContext', 'useRef'], correctAnswerIndex: 1, explanation: 'useState déclare une variable d\'état local.', difficulty: 'easy' },
    { id: 'q23_medium', text: 'Dans useEffect, que se passe-t-il si le tableau de dépendances est omis ?', options: ['L\'effet s\'exécute après chaque rendu du composant', 'L\'effet ne s\'exécute qu\'au montage', 'Le composant plante', 'L\'effet s\'exécute en arrière-plan en continu'], correctAnswerIndex: 0, explanation: 'Sans tableau de dépendance, l\'effet s\'exécute à chaque recalcul et rendu.', difficulty: 'medium' },
    { id: 'q24_hard', text: 'Pourquoi doit-on renvoyer une fonction de nettoyage (Clean-up) dans un useEffect ?', options: ['Pour réinitialiser le state à zéro', 'Pour annuler des abonnements, timers ou écouteurs et éviter les fuites de mémoire', 'Pour forcer un rafraîchissement visuel', 'Pour détruire le DOM virtuel'], correctAnswerIndex: 1, explanation: 'La fonction de clean-up nettoie les effets en cours pour éviter les fuites ou comportements indésirables lors du démontage ou du re-rendu.', difficulty: 'hard' }
  ],
  'c3_ch1': [
    { id: 'q25_easy', text: 'Qu\'est-ce que Ollama ?', options: ['Un framework CSS', 'Un outil léger pour exécuter des modèles de langage (LLM) localement', 'Une base de données orientée graphe', 'Un outil de déploiement Cloud'], correctAnswerIndex: 1, explanation: 'Ollama facilite l\'installation et l\'exécution locale de modèles IA (Llama, Mistral).', difficulty: 'easy' },
    { id: 'q26_medium', text: 'Sur quel port par défaut s\'exécute l\'API locale d\'Ollama ?', options: ['3000', '8080', '11434', '5432'], correctAnswerIndex: 2, explanation: 'Par défaut, Ollama écoute sur le port local 11434.', difficulty: 'medium' },
    { id: 'q27_hard', text: 'Quel format d\'invite (Prompting) est particulièrement important pour obtenir des réponses au format structuré (ex: JSON) d\'un LLM local ?', options: ['Lui crier dessus en majuscules', 'Fournir un schéma JSON précis et des exemples de format (Few-shot prompting) dans les instructions système', 'Lancer le modèle en mode debug', 'Réduire la température à 2.0'], correctAnswerIndex: 1, explanation: 'Le structure-prompting avec description du schéma de sortie et exemples de type Few-shot est essentiel pour garantir la validité syntaxique d\'un JSON retourné par un LLM local.', difficulty: 'hard' }
  ]
};

// Initial History Logs
const INITIAL_LOGS: HistoryLog[] = [
  { id: 'log1', date: '2026-06-12T10:00:00Z', action: 'Création du compte étudiant', xpGained: 50, type: 'login' },
  { id: 'log2', date: '2026-06-13T14:30:00Z', action: 'Lecture du chapitre: Introduction aux SGBDR', xpGained: 20, type: 'chapter' },
  { id: 'log3', date: '2026-06-14T09:15:00Z', action: 'Réussite du Quiz SQL Chapitre 1 (Difficulté: Facile)', xpGained: 50, type: 'quiz' },
  { id: 'log4', date: '2026-06-15T16:00:00Z', action: 'Obtention du badge: Premier Pas', xpGained: 100, type: 'badge' },
  { id: 'log5', date: '2026-06-16T11:45:00Z', action: 'Série d\'apprentissage de 5 jours atteinte !', xpGained: 50, type: 'streak' },
];

// Initial Leaderboard
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Jean Dupont', level: 12, xp: 3500, primaryBadge: '🏆' },
  { rank: 2, name: 'Marie Curie', level: 10, xp: 3000, primaryBadge: '⚡' },
  { rank: 3, name: 'Antoine G.', level: 8, xp: 2400, primaryBadge: '🔥' },
  { rank: 4, name: 'Sophie Martin', level: 6, xp: 1850, primaryBadge: '🎓' },
  { rank: 5, name: 'Thomas L.', level: 5, xp: 1400, primaryBadge: '💻' },
  { rank: 6, name: 'Noël Isoa', level: 3, xp: 720, primaryBadge: '🚩', isCurrentUser: true }, // will sync with state
  { rank: 7, name: 'Inès R.', level: 2, xp: 510, primaryBadge: '🚩' },
  { rank: 8, name: 'Julien B.', level: 2, xp: 480, primaryBadge: '🚩' },
  { rank: 9, name: 'Léa D.', level: 1, xp: 250, primaryBadge: '🚩' },
  { rank: 10, name: 'Pierre M.', level: 1, xp: 180, primaryBadge: '🚩' },
];

// Initial Mock Users List
const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Noël Isoa',
    email: 'noel.isoa@student.univ.fr',
    role: 'student',
    level: 3,
    xp: 720,
    xpNextLevel: 1000,
    streak: 5,
    lastActiveDate: '2026-06-16',
    badges: [ALL_BADGES[0], ALL_BADGES[1]], // Premier Pas, Sérieux
    completedChapters: ['c1_ch1'],
    completedCourses: [],
    weakChapters: [], // Empty to start
    dateJoined: '2026-06-12',
  },
  {
    id: 'u2',
    name: 'Administrateur',
    email: 'admin@ecole.fr',
    role: 'admin',
    level: 99,
    xp: 99999,
    xpNextLevel: 99999,
    streak: 0,
    badges: [],
    completedChapters: [],
    completedCourses: [],
    weakChapters: [],
    dateJoined: '2026-05-01',
  },
];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage if exists
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('elearning_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error parsing elearning_user:", e);
      return null;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('elearning_courses');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch (e) {
      console.error("Error parsing elearning_courses:", e);
      return INITIAL_COURSES;
    }
  });

  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>(() => {
    try {
      const saved = localStorage.getItem('elearning_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch (e) {
      console.error("Error parsing elearning_logs:", e);
      return INITIAL_LOGS;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('elearning_leaderboard');
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch (e) {
      console.error("Error parsing elearning_leaderboard:", e);
      return INITIAL_LEADERBOARD;
    }
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('elearning_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      console.error("Error parsing elearning_users:", e);
      return INITIAL_USERS;
    }
  });

  // Keep LocalStorage updated
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('elearning_user', JSON.stringify(currentUser));
      // Sync currentUser back to usersList
      setUsersList(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      localStorage.removeItem('elearning_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('elearning_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('elearning_logs', JSON.stringify(historyLogs));
  }, [historyLogs]);

  useEffect(() => {
    localStorage.setItem('elearning_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    // Sync current user details inside leaderboard
    if (currentUser && currentUser.role === 'student') {
      setLeaderboard(prev => {
        const updated = prev.map(entry => {
          if (entry.isCurrentUser || entry.name === currentUser.name) {
            return {
              ...entry,
              name: currentUser.name,
              level: currentUser.level,
              xp: currentUser.xp,
              primaryBadge: currentUser.badges[0]?.icon === 'Flame' ? '🔥' : currentUser.badges[0]?.icon === 'UserCheck' ? '🚩' : '🏆',
              isCurrentUser: true,
            };
          }
          return entry;
        });

        // Re-sort leaderboard
        const sorted = [...updated].sort((a, b) => b.xp - a.xp);
        return sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      });
    }
  }, [currentUser?.xp, currentUser?.level, currentUser?.name]);

  useEffect(() => {
    localStorage.setItem('elearning_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Login implementation
  const login = (email: string, role: 'student' | 'admin'): boolean => {
    const user = usersList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (user) {
      setCurrentUser(user);
      // Log login activity
      const newLog: HistoryLog = {
        id: 'log_' + Date.now(),
        date: new Date().toISOString(),
        action: `Connexion réussie (${role === 'admin' ? 'Administration' : 'Étudiant'})`,
        xpGained: role === 'student' ? 10 : 0,
        type: 'login',
      };
      setHistoryLogs(prev => [newLog, ...prev]);

      if (role === 'student') {
        // Simple XP reward on login
        setCurrentUser(prev => {
          if (!prev) return null;
          let newXp = prev.xp + 10;
          let newLevel = prev.level;
          let nextLevelXp = prev.xpNextLevel;

          if (newXp >= nextLevelXp) {
            newLevel += 1;
            newXp = newXp - nextLevelXp;
            nextLevelXp = Math.round(nextLevelXp * 1.5);
          }

          return {
            ...prev,
            xp: newXp,
            level: newLevel,
            xpNextLevel: nextLevelXp,
          };
        });
      }
      return true;
    }
    return false;
  };

  // Register implementation
  const register = (name: string, email: string) => {
    const newStudent: User = {
      id: 'u_' + Date.now(),
      name,
      email,
      role: 'student',
      level: 1,
      xp: 0,
      xpNextLevel: 500,
      streak: 1,
      badges: [ALL_BADGES[0]], // Premier Pas
      completedChapters: [],
      completedCourses: [],
      weakChapters: [],
      dateJoined: new Date().toLocaleDateString('fr-FR'),
    };

    setUsersList(prev => [...prev, newStudent]);
    setCurrentUser(newStudent);

    // Initial log
    const newLog: HistoryLog = {
      id: 'log_' + Date.now(),
      date: new Date().toISOString(),
      action: 'Création du compte étudiant',
      xpGained: 50,
      type: 'login',
    };
    setHistoryLogs(prev => [newLog, ...prev]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Add XP
  const addXP = (amount: number, reason: string) => {
    if (!currentUser || currentUser.role !== 'student') return;

    setCurrentUser(prev => {
      if (!prev) return null;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLevelXp = prev.xpNextLevel;

      let levelUp = false;
      if (newXp >= nextLevelXp) {
        newLevel += 1;
        newXp = newXp - nextLevelXp;
        nextLevelXp = Math.round(nextLevelXp * 1.5);
        levelUp = true;
      }

      // Check level badges
      let currentBadges = [...prev.badges];
      if (levelUp && newLevel === 5 && !currentBadges.some(b => b.id === 'b_lvl5')) {
        const lvlBadge: Badge = {
          id: 'b_lvl5',
          name: 'Ascension',
          description: 'Atteindre le niveau 5 de compétences',
          icon: 'TrendingUp',
          earnedAt: new Date().toLocaleDateString('fr-FR'),
          category: 'level'
        };
        currentBadges.push(lvlBadge);
        
        // Log badge unlock
        setTimeout(() => {
          setHistoryLogs(l => [
            {
              id: 'log_badge_' + Date.now(),
              date: new Date().toISOString(),
              action: 'Badge débloqué : Ascension (Niveau 5)',
              xpGained: 100,
              type: 'badge'
            },
            ...l
          ]);
        }, 100);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNextLevel: nextLevelXp,
        badges: currentBadges,
      };
    });

    const newLog: HistoryLog = {
      id: 'log_' + Date.now(),
      date: new Date().toISOString(),
      action: reason,
      xpGained: amount,
      type: reason.includes('Quiz') ? 'quiz' : reason.includes('Chapitre') ? 'chapter' : 'streak',
    };
    setHistoryLogs(prev => [newLog, ...prev]);
  };

  // Mark Chapter Completed
  const completeChapter = (courseId: string, chapterId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;

    if (currentUser.completedChapters.includes(chapterId)) return;

    setCurrentUser(prev => {
      if (!prev) return null;
      const updatedChapters = [...prev.completedChapters, chapterId];
      return {
        ...prev,
        completedChapters: updatedChapters,
      };
    });

    addXP(30, `Chapitre complété : ${getChapterTitle(chapterId)}`);
    updateCourseProgress(courseId);
  };

  // Helper helper
  const getChapterTitle = (id: string) => {
    for (const c of courses) {
      const ch = c.chapters.find(item => item.id === id);
      if (ch) return ch.title;
    }
    return 'Chapitre';
  };

  // Recalculate Course progress & check course badge
  const updateCourseProgress = (courseId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    setTimeout(() => {
      setCurrentUser(prev => {
        if (!prev) return null;
        
        const courseChapterIds = course.chapters.map(ch => ch.id);
        const completedCourseChapters = courseChapterIds.filter(id => prev.completedChapters.includes(id));
        const allCompleted = completedCourseChapters.length === courseChapterIds.length;

        let completedCourses = [...prev.completedCourses];
        let currentBadges = [...prev.badges];

        if (allCompleted && !completedCourses.includes(courseId)) {
          completedCourses.push(courseId);

          // Give a badge based on course
          if (courseId === 'c1' && !currentBadges.some(b => b.id === 'b3')) {
            currentBadges.push({ ...ALL_BADGES[2], earnedAt: new Date().toLocaleDateString('fr-FR') });
          } else if (courseId === 'c3' && !currentBadges.some(b => b.id === 'b4')) {
            currentBadges.push({ ...ALL_BADGES[3], earnedAt: new Date().toLocaleDateString('fr-FR') });
          }
        }

        return {
          ...prev,
          completedCourses,
          badges: currentBadges,
        };
      });
    }, 200);
  };

  // Save Quiz Attempt & Trigger Adaptive changes
  const saveQuizAttempt = (
    _quizId: string,
    chapterId: string,
    score: number,
    difficultyBefore: 'easy' | 'medium' | 'hard',
    difficultyAfter: 'easy' | 'medium' | 'hard',
    xpGained: number
  ) => {
    if (!currentUser) return;

    // Save as log
    addXP(xpGained, `Quiz complété : ${getChapterTitle(chapterId)} (${score}%, ${difficultyBefore} -> ${difficultyAfter})`);

    // Handle adaptive logic consequences
    if (score < 50) {
      addWeakChapter(chapterId);
    } else if (score >= 80) {
      removeWeakChapter(chapterId);
      // Automatically complete chapter on great quiz score
      completeChapter(getCourseIdByChapterId(chapterId), chapterId);

      // Give special badges
      setCurrentUser(prev => {
        if (!prev) return null;
        let currentBadges = [...prev.badges];
        
        // Perfectionist badge
        if (score === 100 && !currentBadges.some(b => b.id === 'b6')) {
          currentBadges.push({ ...ALL_BADGES[5], earnedAt: new Date().toLocaleDateString('fr-FR') });
        }
        
        // Flexible Mind badge (difficulty increase)
        if (difficultyBefore === 'easy' && difficultyAfter === 'medium' && !currentBadges.some(b => b.id === 'b5')) {
          currentBadges.push({ ...ALL_BADGES[4], earnedAt: new Date().toLocaleDateString('fr-FR') });
        }

        return {
          ...prev,
          badges: currentBadges
        };
      });
    }
  };

  const getCourseIdByChapterId = (chId: string) => {
    for (const c of courses) {
      if (c.chapters.some(ch => ch.id === chId)) return c.id;
    }
    return '';
  };

  // Weak chapters logic (triggers IA recommendations)
  const addWeakChapter = (chapterId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      if (prev.weakChapters.includes(chapterId)) return prev;
      return {
        ...prev,
        weakChapters: [...prev.weakChapters, chapterId],
      };
    });
  };

  const removeWeakChapter = (chapterId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        weakChapters: prev.weakChapters.filter(id => id !== chapterId),
      };
    });
  };

  // ADMIN MOCK CRUD FUNCTIONS
  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const updateCourse = (course: Course) => {
    setCourses(prev => prev.map(c => c.id === course.id ? course : c));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const updateUserRole = (userId: string, role: 'student' | 'admin') => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  };

  // Calculate Admin Analytics mock data
  const getAnalytics = (): GlobalAnalytics => {
    const totalStudents = usersList.filter(u => u.role === 'student').length;
    // const averageXp = usersList.filter(u => u.role === 'student').reduce((acc, u) => acc + u.xp, 0) / (totalStudents || 1);

    return {
      totalUsers: usersList.length,
      activeUsersToday: Math.round(totalStudents * 0.7) || 1,
      averageTimeSpent: 34, // Simulated static average time spent
      averageSuccessRate: 76,
      popularCourses: courses.map((c, idx) => ({
        name: c.title,
        studentsCount: Math.round(totalStudents * (0.8 - idx * 0.2)) || 1,
        color: idx === 0 ? '#6366f1' : idx === 1 ? '#10b981' : '#f59e0b',
      })),
      dailyRegistrations: [
        { date: '12/06', count: 1 },
        { date: '13/06', count: 3 },
        { date: '14/06', count: 2 },
        { date: '15/06', count: 5 },
        { date: '16/06', count: 4 },
        { date: '17/06', count: totalStudents },
      ],
      categoryPerformance: [
        { category: 'Bases de données', averageScore: 82 },
        { category: 'Frontend', averageScore: 74 },
        { category: 'Intelligence Artificielle', averageScore: 68 },
      ],
    };
  };

  return (
    <AppStateContext.Provider
      value={{
        currentUser,
        courses,
        historyLogs,
        leaderboard,
        analytics: getAnalytics(),
        login,
        register,
        logout,
        completeChapter,
        saveQuizAttempt,
        addXP,
        addWeakChapter,
        removeWeakChapter,
        updateCourseProgress,
        addCourse,
        updateCourse,
        deleteCourse,
        usersList,
        updateUserRole,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Expose questions list
export const getQuestionsForChapter = (chapterId: string): Question[] => {
  return QUESTIONS_POOL[chapterId] || QUESTIONS_POOL['c1_ch1']; // fallback
};
