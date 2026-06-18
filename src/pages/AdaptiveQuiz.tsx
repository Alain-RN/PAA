import React, { useState, useEffect } from 'react';
import { useAppState, getQuestionsForChapter } from '../hooks/useAppState';
import type { Question } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { ChevronRight, Award, Brain, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const AdaptiveQuiz: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { courses, saveQuizAttempt } = useAppState();

  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Lists to keep track of the quiz run
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]); // true for correct, false for incorrect
  const [trajectory, setTrajectory] = useState<('easy' | 'medium' | 'hard')[]>(['easy']);
  const [isFinished, setIsFinished] = useState(false);

  const totalQuestions = 4; // We present 4 adaptive questions per quiz

  // Load questions pool
  useEffect(() => {
    if (!chapterId) return;
    const pool = getQuestionsForChapter(chapterId);
    setQuestionsPool(pool);
    
    // Pick the first easy question
    const easyQs = pool.filter((q) => q.difficulty === 'easy');
    if (easyQs.length > 0) {
      setQuizQuestions([easyQs[0]]);
      setTrajectory(['easy']);
    } else if (pool.length > 0) {
      setQuizQuestions([pool[0]]);
      setTrajectory([pool[0].difficulty]);
      setCurrentDifficulty(pool[0].difficulty);
    }
  }, [chapterId]);

  const course = courses.find((c) => c.id === courseId);
  const chapter = course?.chapters.find((ch) => ch.id === chapterId);

  // Params are guaranteed by the router, but TypeScript needs this narrowing
  if (!courseId || !chapterId) return null;

  if (!course || !chapter || quizQuestions.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <RefreshCw className="spinner" />
        <p>Chargement du quiz...</p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentStep];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleValidate = () => {
    if (selectedOption === null || isAnswered) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    setIsAnswered(true);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setAnswersStatus((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    const nextStep = currentStep + 1;

    if (nextStep < totalQuestions) {
      // Determine next difficulty based on answer
      let nextDifficulty: 'easy' | 'medium' | 'hard' = currentDifficulty;
      if (isCorrect) {
        if (currentDifficulty === 'easy') nextDifficulty = 'medium';
        else if (currentDifficulty === 'medium') nextDifficulty = 'hard';
      } else {
        if (currentDifficulty === 'hard') nextDifficulty = 'medium';
        else if (currentDifficulty === 'medium') nextDifficulty = 'easy';
      }

      // Find an unused question of the next difficulty
      let nextQuestion = questionsPool.find(
        (q) => q.difficulty === nextDifficulty && !quizQuestions.some((qq) => qq.id === q.id)
      );

      // Fallback if no questions left of that difficulty
      if (!nextQuestion) {
        nextQuestion = questionsPool.find((q) => !quizQuestions.some((qq) => qq.id === q.id));
      }

      if (nextQuestion) {
        setQuizQuestions((prev) => [...prev, nextQuestion!]);
        setCurrentDifficulty(nextDifficulty);
        setTrajectory((prev) => [...prev, nextDifficulty]);
        setCurrentStep(nextStep);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // No more questions available, finish quiz early
        finishQuiz();
      }
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);

    const finalScorePercent = Math.round((score / totalQuestions) * 100);
    const difficultyBefore = trajectory[0];
    const difficultyAfter = trajectory[trajectory.length - 1];

    let xpGained = 50; // default XP
    if (finalScorePercent >= 80) xpGained = 100; // high success
    if (finalScorePercent < 50) xpGained = 20; // low score

    saveQuizAttempt(
      chapterId + '_quiz',
      chapterId,
      finalScorePercent,
      difficultyBefore,
      difficultyAfter,
      xpGained
    );
  };

  const finalScorePercent = Math.round((score / totalQuestions) * 100);

  return (
    <div>
      <button
        onClick={() => navigate(`/course/${courseId}`)}
        className="btn btn-secondary mb-2"
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <ArrowLeft size={14} />
        <span>Quitter le Quiz</span>
      </button>

      <div style={styles.header}>
        <span style={styles.category}>{course.title}</span>
        <h1 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>
          Quiz Adaptatif : {chapter.title}
        </h1>
      </div>

      {!isFinished ? (
        <div style={styles.quizLayout}>
          {/* Question panel */}
          <div style={{ flex: 1.3 }}>
            <GlassCard style={styles.quizCard}>
              <div className="flex-between mb-2">
                <span style={styles.stepIndicator}>
                  Question {currentStep + 1} sur {totalQuestions}
                </span>
                
                {/* Current Difficulty indicator */}
                <div style={styles.difficultyContainer}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Difficulté : </span>
                  <span style={{
                    ...styles.difficultyBadge,
                    backgroundColor:
                      currentDifficulty === 'easy' ? 'rgba(16, 185, 129, 0.15)' :
                      currentDifficulty === 'medium' ? 'rgba(245, 158, 11, 0.15)' :
                      'rgba(239, 68, 68, 0.15)',
                    color:
                      currentDifficulty === 'easy' ? 'var(--accent-success)' :
                      currentDifficulty === 'medium' ? 'var(--accent-warning)' :
                      'var(--accent-danger)'
                  }}>
                    {currentDifficulty === 'easy' ? 'Facile' : currentDifficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </span>
                </div>
              </div>

              <h2 style={styles.questionText}>{currentQuestion.text}</h2>

              <div style={styles.optionsList}>
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctAnswerIndex;

                  let optionStyle = { ...styles.optionItem };
                  if (isSelected) {
                    optionStyle = { ...optionStyle, ...styles.optionSelected };
                  }
                  if (isAnswered) {
                    if (isCorrect) {
                      optionStyle = { ...optionStyle, ...styles.optionCorrect };
                    } else if (isSelected) {
                      optionStyle = { ...optionStyle, ...styles.optionIncorrect };
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                      style={optionStyle}
                    >
                      <div style={{
                        ...styles.optionCircle,
                        ...(isSelected ? styles.optionCircleActive : {}),
                        ...(isAnswered && isCorrect ? styles.optionCircleCorrect : {}),
                        ...(isAnswered && isSelected && !isCorrect ? styles.optionCircleIncorrect : {}),
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>
                    </button>
                  );
                })}
              </div>

              <div style={styles.actionRow}>
                {!isAnswered ? (
                  <button
                    onClick={handleValidate}
                    disabled={selectedOption === null}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Valider la réponse
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>
                      {currentStep + 1 === totalQuestions ? 'Terminer le quiz' : 'Question suivante'}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {isAnswered && (
                <div style={{
                  ...styles.explanationBox,
                  borderColor: selectedOption === currentQuestion.correctAnswerIndex ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Brain size={16} color="var(--accent-primary)" />
                    <span>Explication de l'IA :</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right: Live Trajectory visualization */}
          <div style={styles.trajectorySidebar}>
            <GlassCard>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={16} color="var(--accent-secondary)" />
                <span>Adaptation en direct</span>
              </h3>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                L'IA adapte la difficulté en fonction de votre justesse :
              </p>

              <div style={styles.trajectoryTimeline}>
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const stepTrajectory = trajectory[idx];
                  const hasAnswered = idx < answersStatus.length;
                  const wasCorrect = answersStatus[idx];

                  return (
                    <div key={idx} style={styles.timelineNode}>
                      <div style={{
                        ...styles.timelinePoint,
                        backgroundColor: 
                          !hasAnswered ? 'rgba(255,255,255,0.05)' :
                          wasCorrect ? 'var(--accent-success)' : 'var(--accent-danger)',
                        boxShadow:
                          !hasAnswered ? 'none' :
                          wasCorrect ? '0 0 8px var(--accent-success)' : '0 0 8px var(--accent-danger)',
                      }}>
                        {idx + 1}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Question {idx + 1}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {stepTrajectory ? (
                            <span>Niveau : {stepTrajectory === 'easy' ? 'Facile' : stepTrajectory === 'medium' ? 'Moyen' : 'Difficile'}</span>
                          ) : (
                            <span>En attente...</span>
                          )}
                        </div>
                      </div>
                      
                      {hasAnswered && (
                        <div>
                          {wasCorrect ? (
                            <span style={{ color: 'var(--accent-success)', fontSize: '0.8rem', fontWeight: 'bold' }}>+1 lvl</span>
                          ) : (
                            <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 'bold' }}>-1 lvl</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        /* ==========================================
           QUIZ COMPLETED SCREEN
           ========================================== */
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <GlassCard style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div style={styles.awardIcon}>
              <Award size={48} color="#fff" />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Quiz terminé !</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Voici le bilan d'évaluation de l'algorithme d'adaptation pédagogique.
            </p>

            <div style={styles.scoreRow}>
              <div style={styles.scoreCircle}>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{score} / {totalQuestions}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({finalScorePercent}%)</div>
              </div>

              <div style={styles.adaptationSummary}>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>
                  Ajustement de votre niveau
                </div>
                
                <div style={styles.trajectoryPath}>
                  {trajectory.map((diff, idx) => (
                    <React.Fragment key={idx}>
                      <span style={{
                        color: 
                          diff === 'easy' ? 'var(--accent-success)' :
                          diff === 'medium' ? 'var(--accent-warning)' :
                          'var(--accent-danger)',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}>
                        {diff === 'easy' ? 'Facile' : diff === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                      {idx < trajectory.length - 1 && <span style={{ color: 'var(--text-muted)', margin: '0 0.25rem' }}>➔</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  {finalScorePercent >= 80 ? (
                    <span style={{ color: 'var(--accent-success)' }}>
                      🎉 <strong>Niveau augmenté !</strong> Votre niveau de maîtrise sur ce chapitre augmente. Vous remportez <strong>+100 XP</strong> !
                    </span>
                  ) : finalScorePercent < 50 ? (
                    <span style={{ color: 'var(--accent-danger)' }}>
                      ⚠️ <strong>Niveau abaissé.</strong> L'IA a détecté des lacunes et a configuré des révisions automatiques. Vous gagnez <strong>+20 XP</strong>.
                    </span>
                  ) : (
                    <span>
                      ⚖️ <strong>Niveau stable.</strong> Niveau de difficulté maintenu. Vous remportez <strong>+50 XP</strong> !
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.reviewSection}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>
                Détails des questions posées :
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {quizQuestions.map((q, idx) => {
                  const wasCorrect = answersStatus[idx];
                  return (
                    <div key={idx} style={{
                      ...styles.reviewItem,
                      borderColor: wasCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      background: wasCorrect ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)'
                    }}>
                      <div className="flex-between">
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Question {idx + 1} ({q.difficulty})</span>
                        {wasCorrect ? (
                          <span style={{ color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <CheckCircle size={14} /> Correct
                          </span>
                        ) : (
                          <span style={{ color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <XCircle size={14} /> Incorrect
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left', marginTop: '0.25rem' }}>
                        {q.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="btn btn-primary"
              style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}
            >
              Retourner au cours
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '1.5rem',
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--accent-primary)',
    letterSpacing: '0.05em',
  },
  quizLayout: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  quizCard: {
    padding: '2rem 1.5rem',
  },
  stepIndicator: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: 550,
  },
  difficultyContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  difficultyBadge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
  },
  questionText: {
    fontSize: '1.25rem',
    margin: '1.5rem 0',
    lineHeight: '1.4',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  optionItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.85rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-primary)',
    fontSize: '0.9rem',
    transition: 'var(--transition-smooth)',
    width: '100%',
  },
  optionSelected: {
    borderColor: 'var(--accent-primary)',
    background: 'rgba(99, 102, 241, 0.05)',
  },
  optionCorrect: {
    borderColor: 'var(--accent-success)',
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--accent-success)',
  },
  optionIncorrect: {
    borderColor: 'var(--accent-danger)',
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--accent-danger)',
  },
  optionCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--glass-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'var(--text-secondary)',
  },
  optionCircleActive: {
    background: 'var(--accent-primary)',
    borderColor: 'var(--accent-primary)',
    color: '#fff',
  },
  optionCircleCorrect: {
    background: 'var(--accent-success)',
    borderColor: 'var(--accent-success)',
    color: '#fff',
  },
  optionCircleIncorrect: {
    background: 'var(--accent-danger)',
    borderColor: 'var(--accent-danger)',
    color: '#fff',
  },
  actionRow: {
    marginTop: '1.5rem',
  },
  explanationBox: {
    marginTop: '1.5rem',
    background: 'rgba(0,0,0,0.25)',
    borderLeft: '3px solid var(--accent-primary)',
    padding: '1rem',
    borderRadius: '0 8px 8px 0',
  },
  trajectorySidebar: {
    width: '300px',
  },
  trajectoryTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  timelineNode: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  timelinePoint: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
  },
  awardIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
  },
  scoreRow: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid var(--accent-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
  },
  adaptationSummary: {
    flex: 1,
    textAlign: 'left',
    minWidth: '200px',
  },
  trajectoryPath: {
    background: 'rgba(0,0,0,0.3)',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: '1px solid var(--glass-border)',
  },
  reviewSection: {
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.5rem',
  },
  reviewItem: {
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '0.75rem',
  },
};

export default AdaptiveQuiz;
