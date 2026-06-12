import type { Exam, ExamDifficulty, GradingResult, AgentTraceStep, Question } from "./types"

const physicsQuestions: Question[] = [
  {
    id: 1,
    text: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is its acceleration?",
    options: {
      A: "2 m/s²",
      B: "4 m/s²",
      C: "5 m/s²",
      D: "10 m/s²"
    },
    correctAnswer: "B",
    explanation: "Using a = (v - u) / t = (20 - 0) / 5 = 4 m/s². The acceleration is the change in velocity divided by time.",
    topic: "Kinematics"
  },
  {
    id: 2,
    text: "Which of the following is a vector quantity?",
    options: {
      A: "Speed",
      B: "Mass",
      C: "Velocity",
      D: "Temperature"
    },
    correctAnswer: "C",
    explanation: "Velocity is a vector because it has both magnitude and direction. Speed, mass, and temperature are scalar quantities.",
    topic: "Vectors and Scalars"
  },
  {
    id: 3,
    text: "A ball is thrown vertically upward with an initial velocity of 30 m/s. What is the maximum height reached? (g = 10 m/s²)",
    options: {
      A: "30 m",
      B: "45 m",
      C: "60 m",
      D: "90 m"
    },
    correctAnswer: "B",
    explanation: "Using v² = u² - 2gh, at maximum height v = 0. So 0 = 900 - 20h, giving h = 45 m.",
    topic: "Projectile Motion"
  },
  {
    id: 4,
    text: "Newton&apos;s third law states that:",
    options: {
      A: "F = ma",
      B: "An object at rest stays at rest",
      C: "For every action there is an equal and opposite reaction",
      D: "Energy is conserved"
    },
    correctAnswer: "C",
    explanation: "Newton&apos;s third law describes action-reaction pairs. When object A exerts a force on object B, object B exerts an equal and opposite force on object A.",
    topic: "Newton&apos;s Laws"
  },
  {
    id: 5,
    text: "What is the SI unit of work?",
    options: {
      A: "Newton",
      B: "Watt",
      C: "Joule",
      D: "Pascal"
    },
    correctAnswer: "C",
    explanation: "Work is measured in Joules (J). 1 Joule = 1 Newton × 1 meter. Watt is the unit of power, Newton is force, and Pascal is pressure.",
    topic: "Work and Energy"
  },
  {
    id: 6,
    text: "A 2 kg object moves at 3 m/s. What is its kinetic energy?",
    options: {
      A: "3 J",
      B: "6 J",
      C: "9 J",
      D: "18 J"
    },
    correctAnswer: "C",
    explanation: "Kinetic energy KE = ½mv² = ½ × 2 × 3² = ½ × 2 × 9 = 9 J.",
    topic: "Kinetic Energy"
  },
  {
    id: 7,
    text: "The frequency of a wave is 50 Hz and its wavelength is 2 m. What is the wave speed?",
    options: {
      A: "25 m/s",
      B: "50 m/s",
      C: "100 m/s",
      D: "200 m/s"
    },
    correctAnswer: "C",
    explanation: "Wave speed v = frequency × wavelength = 50 × 2 = 100 m/s.",
    topic: "Waves"
  },
  {
    id: 8,
    text: "Which type of electromagnetic radiation has the shortest wavelength?",
    options: {
      A: "Radio waves",
      B: "Visible light",
      C: "X-rays",
      D: "Gamma rays"
    },
    correctAnswer: "D",
    explanation: "Gamma rays have the shortest wavelength and highest frequency in the electromagnetic spectrum, followed by X-rays, UV, visible light, IR, microwaves, and radio waves.",
    topic: "Electromagnetic Spectrum"
  },
  {
    id: 9,
    text: "What is the resistance of a conductor if a current of 2 A flows through it when a potential difference of 12 V is applied?",
    options: {
      A: "4 Ω",
      B: "6 Ω",
      C: "10 Ω",
      D: "24 Ω"
    },
    correctAnswer: "B",
    explanation: "Using Ohm&apos;s law, R = V/I = 12/2 = 6 Ω.",
    topic: "Electricity"
  },
  {
    id: 10,
    text: "Two resistors of 4 Ω and 6 Ω are connected in parallel. What is the equivalent resistance?",
    options: {
      A: "2.4 Ω",
      B: "5 Ω",
      C: "10 Ω",
      D: "24 Ω"
    },
    correctAnswer: "A",
    explanation: "For parallel resistors: 1/R = 1/4 + 1/6 = 3/12 + 2/12 = 5/12. So R = 12/5 = 2.4 Ω.",
    topic: "Circuits"
  }
]

const chemistryQuestions: Question[] = [
  {
    id: 1,
    text: "What is the atomic number of carbon?",
    options: {
      A: "4",
      B: "6",
      C: "8",
      D: "12"
    },
    correctAnswer: "B",
    explanation: "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus. The mass number is 12.",
    topic: "Atomic Structure"
  },
  {
    id: 2,
    text: "Which of the following is an example of a covalent bond?",
    options: {
      A: "NaCl",
      B: "H₂O",
      C: "KBr",
      D: "CaO"
    },
    correctAnswer: "B",
    explanation: "Water (H₂O) has covalent bonds where electrons are shared between hydrogen and oxygen atoms. NaCl, KBr, and CaO are ionic compounds.",
    topic: "Chemical Bonding"
  },
  {
    id: 3,
    text: "What is the pH of a neutral solution at 25°C?",
    options: {
      A: "0",
      B: "1",
      C: "7",
      D: "14"
    },
    correctAnswer: "C",
    explanation: "A neutral solution has equal concentrations of H⁺ and OH⁻ ions, giving a pH of 7 at 25°C.",
    topic: "Acids and Bases"
  },
  {
    id: 4,
    text: "In the reaction 2H₂ + O₂ → 2H₂O, what is the limiting reagent if 4 moles of H₂ react with 1 mole of O₂?",
    options: {
      A: "H₂",
      B: "O₂",
      C: "Both equally",
      D: "Neither"
    },
    correctAnswer: "B",
    explanation: "The stoichiometric ratio is 2:1 (H₂:O₂). With 4 moles of H₂, we need 2 moles of O₂. Since we only have 1 mole of O₂, oxygen is the limiting reagent.",
    topic: "Stoichiometry"
  },
  {
    id: 5,
    text: "Which element has the highest electronegativity?",
    options: {
      A: "Oxygen",
      B: "Nitrogen",
      C: "Fluorine",
      D: "Chlorine"
    },
    correctAnswer: "C",
    explanation: "Fluorine has the highest electronegativity (3.98 on the Pauling scale) of all elements due to its small atomic radius and high effective nuclear charge.",
    topic: "Periodic Trends"
  },
  {
    id: 6,
    text: "What type of reaction is: Zn + CuSO₄ → ZnSO₄ + Cu?",
    options: {
      A: "Decomposition",
      B: "Combination",
      C: "Single displacement",
      D: "Double displacement"
    },
    correctAnswer: "C",
    explanation: "This is a single displacement reaction where zinc replaces copper in the compound because zinc is more reactive than copper.",
    topic: "Types of Reactions"
  },
  {
    id: 7,
    text: "What is the molarity of a solution containing 4 moles of solute in 2 liters of solution?",
    options: {
      A: "0.5 M",
      B: "2 M",
      C: "4 M",
      D: "8 M"
    },
    correctAnswer: "B",
    explanation: "Molarity = moles of solute / liters of solution = 4/2 = 2 M.",
    topic: "Solutions"
  },
  {
    id: 8,
    text: "Which gas law relates pressure and volume at constant temperature?",
    options: {
      A: "Charles&apos;s Law",
      B: "Boyle&apos;s Law",
      C: "Avogadro&apos;s Law",
      D: "Gay-Lussac&apos;s Law"
    },
    correctAnswer: "B",
    explanation: "Boyle&apos;s Law states that at constant temperature, the pressure and volume of a gas are inversely proportional (PV = constant).",
    topic: "Gas Laws"
  },
  {
    id: 9,
    text: "What is the oxidation state of sulfur in H₂SO₄?",
    options: {
      A: "+2",
      B: "+4",
      C: "+6",
      D: "-2"
    },
    correctAnswer: "C",
    explanation: "In H₂SO₄: H is +1 (×2 = +2), O is -2 (×4 = -8). For the molecule to be neutral: +2 + S + (-8) = 0, so S = +6.",
    topic: "Oxidation States"
  },
  {
    id: 10,
    text: "Which of the following is an endothermic process?",
    options: {
      A: "Combustion",
      B: "Freezing water",
      C: "Evaporation",
      D: "Condensation"
    },
    correctAnswer: "C",
    explanation: "Evaporation is endothermic as it requires energy to break intermolecular forces and convert liquid to gas. Combustion, freezing, and condensation release energy (exothermic).",
    topic: "Thermochemistry"
  }
]

const mathQuestions: Question[] = [
  {
    id: 1,
    text: "What is the derivative of f(x) = 3x² + 2x - 5?",
    options: {
      A: "6x + 2",
      B: "3x + 2",
      C: "6x² + 2",
      D: "x² + 2x"
    },
    correctAnswer: "A",
    explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-5) = 0. So f&apos;(x) = 6x + 2.",
    topic: "Differentiation"
  },
  {
    id: 2,
    text: "Evaluate: ∫(2x + 3)dx",
    options: {
      A: "x² + 3x + C",
      B: "2x² + 3x + C",
      C: "x² + 3 + C",
      D: "2x + C"
    },
    correctAnswer: "A",
    explanation: "Integrating term by term: ∫2x dx = x², ∫3 dx = 3x. The result is x² + 3x + C.",
    topic: "Integration"
  },
  {
    id: 3,
    text: "What is the value of sin(90°)?",
    options: {
      A: "0",
      B: "0.5",
      C: "0.707",
      D: "1"
    },
    correctAnswer: "D",
    explanation: "sin(90°) = 1. This is a fundamental trigonometric value where the angle corresponds to the y-coordinate on the unit circle.",
    topic: "Trigonometry"
  },
  {
    id: 4,
    text: "Solve for x: 2x² - 8 = 0",
    options: {
      A: "x = ±2",
      B: "x = ±4",
      C: "x = 2",
      D: "x = 4"
    },
    correctAnswer: "A",
    explanation: "2x² = 8, x² = 4, x = ±√4 = ±2. Don&apos;t forget the negative root!",
    topic: "Quadratic Equations"
  },
  {
    id: 5,
    text: "What is the sum of the first 10 terms of the arithmetic sequence 2, 5, 8, 11, ...?",
    options: {
      A: "145",
      B: "155",
      C: "165",
      D: "175"
    },
    correctAnswer: "B",
    explanation: "a₁ = 2, d = 3, n = 10. Using Sₙ = n/2(2a₁ + (n-1)d) = 10/2(4 + 27) = 5 × 31 = 155.",
    topic: "Sequences and Series"
  },
  {
    id: 6,
    text: "If log₁₀(x) = 2, what is x?",
    options: {
      A: "20",
      B: "100",
      C: "200",
      D: "1000"
    },
    correctAnswer: "B",
    explanation: "log₁₀(x) = 2 means 10² = x, so x = 100.",
    topic: "Logarithms"
  },
  {
    id: 7,
    text: "What is the equation of a line with slope 3 passing through point (1, 2)?",
    options: {
      A: "y = 3x - 1",
      B: "y = 3x + 1",
      C: "y = 3x - 2",
      D: "y = 3x + 2"
    },
    correctAnswer: "A",
    explanation: "Using point-slope form: y - 2 = 3(x - 1), y = 3x - 3 + 2 = 3x - 1.",
    topic: "Linear Functions"
  },
  {
    id: 8,
    text: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
    options: {
      A: "0",
      B: "1",
      C: "2",
      D: "Undefined"
    },
    correctAnswer: "C",
    explanation: "Factor the numerator: (x² - 1)/(x - 1) = (x+1)(x-1)/(x-1) = x + 1. As x → 1, the limit is 1 + 1 = 2.",
    topic: "Limits"
  },
  {
    id: 9,
    text: "In a right triangle, if one leg is 3 and the hypotenuse is 5, what is the other leg?",
    options: {
      A: "2",
      B: "4",
      C: "6",
      D: "8"
    },
    correctAnswer: "B",
    explanation: "Using Pythagorean theorem: a² + b² = c². So 3² + b² = 5², 9 + b² = 25, b² = 16, b = 4.",
    topic: "Pythagorean Theorem"
  },
  {
    id: 10,
    text: "What is the probability of getting exactly 2 heads when flipping 3 fair coins?",
    options: {
      A: "1/8",
      B: "2/8",
      C: "3/8",
      D: "4/8"
    },
    correctAnswer: "C",
    explanation: "Total outcomes = 2³ = 8. Favorable outcomes (HHT, HTH, THH) = 3. Probability = 3/8.",
    topic: "Probability"
  }
]

const biologyQuestions: Question[] = [
  {
    id: 1,
    text: "What is the powerhouse of the cell?",
    options: {
      A: "Nucleus",
      B: "Ribosome",
      C: "Mitochondria",
      D: "Endoplasmic Reticulum"
    },
    correctAnswer: "C",
    explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.",
    topic: "Cell Biology"
  },
  {
    id: 2,
    text: "Which molecule carries genetic information?",
    options: {
      A: "RNA",
      B: "DNA",
      C: "Protein",
      D: "Lipid"
    },
    correctAnswer: "B",
    explanation: "DNA (Deoxyribonucleic Acid) is the molecule that stores and transmits genetic information in most organisms.",
    topic: "Genetics"
  },
  {
    id: 3,
    text: "What is the process by which plants convert sunlight into chemical energy?",
    options: {
      A: "Respiration",
      B: "Fermentation",
      C: "Photosynthesis",
      D: "Glycolysis"
    },
    correctAnswer: "C",
    explanation: "Photosynthesis converts light energy, water, and CO₂ into glucose and oxygen using chlorophyll in chloroplasts.",
    topic: "Photosynthesis"
  },
  {
    id: 4,
    text: "Which blood type is considered the universal donor?",
    options: {
      A: "Type A",
      B: "Type B",
      C: "Type AB",
      D: "Type O"
    },
    correctAnswer: "D",
    explanation: "Type O negative is the universal donor because it lacks A, B antigens and Rh factor, so it won&apos;t trigger an immune response in any recipient.",
    topic: "Blood Types"
  },
  {
    id: 5,
    text: "What is the correct order of the stages of mitosis?",
    options: {
      A: "Prophase, Metaphase, Anaphase, Telophase",
      B: "Metaphase, Prophase, Telophase, Anaphase",
      C: "Anaphase, Prophase, Metaphase, Telophase",
      D: "Telophase, Anaphase, Metaphase, Prophase"
    },
    correctAnswer: "A",
    explanation: "The stages of mitosis occur in order: Prophase (chromosomes condense), Metaphase (align at center), Anaphase (separate), Telophase (nuclear envelope reforms).",
    topic: "Cell Division"
  },
  {
    id: 6,
    text: "Which enzyme is responsible for DNA replication?",
    options: {
      A: "RNA polymerase",
      B: "DNA polymerase",
      C: "Helicase",
      D: "Ligase"
    },
    correctAnswer: "B",
    explanation: "DNA polymerase synthesizes new DNA strands by adding nucleotides complementary to the template strand.",
    topic: "DNA Replication"
  },
  {
    id: 7,
    text: "What is the function of the ribosome?",
    options: {
      A: "Energy production",
      B: "Protein synthesis",
      C: "Cell division",
      D: "Waste removal"
    },
    correctAnswer: "B",
    explanation: "Ribosomes are the sites of protein synthesis, translating mRNA into amino acid chains that form proteins.",
    topic: "Cell Organelles"
  },
  {
    id: 8,
    text: "Which of the following is NOT a function of the liver?",
    options: {
      A: "Producing bile",
      B: "Detoxification",
      C: "Producing insulin",
      D: "Storing glycogen"
    },
    correctAnswer: "C",
    explanation: "Insulin is produced by the pancreas, not the liver. The liver produces bile, detoxifies blood, and stores glycogen.",
    topic: "Human Physiology"
  },
  {
    id: 9,
    text: "What type of inheritance pattern is shown when heterozygotes display an intermediate phenotype?",
    options: {
      A: "Complete dominance",
      B: "Incomplete dominance",
      C: "Codominance",
      D: "Multiple alleles"
    },
    correctAnswer: "B",
    explanation: "Incomplete dominance occurs when the heterozygote shows a phenotype intermediate between the two homozygotes (e.g., red × white = pink flowers).",
    topic: "Inheritance Patterns"
  },
  {
    id: 10,
    text: "Which part of the brain controls balance and coordination?",
    options: {
      A: "Cerebrum",
      B: "Cerebellum",
      C: "Medulla oblongata",
      D: "Hypothalamus"
    },
    correctAnswer: "B",
    explanation: "The cerebellum coordinates voluntary muscle movements, balance, and posture. It&apos;s located at the back of the brain.",
    topic: "Nervous System"
  }
]

const questionBanks: Record<string, Question[]> = {
  Physics: physicsQuestions,
  Chemistry: chemistryQuestions,
  Mathematics: mathQuestions,
  Biology: biologyQuestions
}

export function generateExam(config: {
  subject: string
  topic: string
  difficulty: ExamDifficulty
  questionCount: number
}): Exam {
  const questions = questionBanks[config.subject] || physicsQuestions
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, Math.min(config.questionCount, questions.length))
  
  // Re-assign IDs based on selection
  const finalQuestions = selected.map((q, index) => ({
    ...q,
    id: index + 1
  }))

  return {
    id: `exam-${Date.now()}`,
    subject: config.subject,
    topic: config.topic,
    difficulty: config.difficulty,
    questions: finalQuestions,
    createdAt: new Date()
  }
}

export function gradeExam(exam: Exam, answers: Record<number, string>): GradingResult {
  const questionResults = exam.questions.map(question => {
    const userAnswer = answers[question.id] || null
    const isCorrect = userAnswer === question.correctAnswer
    
    return {
      questionId: question.id,
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }
  })

  const correctCount = questionResults.filter(r => r.isCorrect).length
  const percentage = Math.round((correctCount / exam.questions.length) * 100)

  // Analyze weak and strong areas
  const topicPerformance: Record<string, { correct: number; total: number }> = {}
  exam.questions.forEach((q, index) => {
    if (!topicPerformance[q.topic]) {
      topicPerformance[q.topic] = { correct: 0, total: 0 }
    }
    topicPerformance[q.topic].total++
    if (questionResults[index].isCorrect) {
      topicPerformance[q.topic].correct++
    }
  })

  const weakAreas: string[] = []
  const strongAreas: string[] = []

  Object.entries(topicPerformance).forEach(([topic, perf]) => {
    const topicPercentage = (perf.correct / perf.total) * 100
    if (topicPercentage < 50) {
      weakAreas.push(topic)
    } else if (topicPercentage >= 80) {
      strongAreas.push(topic)
    }
  })

  // Generate personalized study advice
  const studyAdvice: string[] = []
  
  if (percentage >= 90) {
    studyAdvice.push("Excellent performance! Focus on maintaining your knowledge through regular review.")
    studyAdvice.push("Challenge yourself with more advanced problems in your strong areas.")
  } else if (percentage >= 70) {
    studyAdvice.push("Good work! You have a solid understanding of most concepts.")
    if (weakAreas.length > 0) {
      studyAdvice.push(`Focus extra attention on: ${weakAreas.join(", ")}.`)
    }
    studyAdvice.push("Practice more problems to reinforce your understanding.")
  } else if (percentage >= 50) {
    studyAdvice.push("You&apos;re on the right track, but there&apos;s room for improvement.")
    studyAdvice.push(`Priority areas to study: ${weakAreas.join(", ") || "Review all topics"}.`)
    studyAdvice.push("Consider creating flashcards for key concepts and formulas.")
  } else {
    studyAdvice.push("This topic needs more attention. Don&apos;t be discouraged!")
    studyAdvice.push("Start by reviewing the fundamentals and basic concepts.")
    studyAdvice.push("Work through textbook examples step by step before attempting practice problems.")
    studyAdvice.push("Consider seeking additional help from a teacher or tutor.")
  }

  return {
    score: correctCount,
    totalQuestions: exam.questions.length,
    percentage,
    questionResults,
    studyAdvice,
    weakAreas,
    strongAreas
  }
}

export function generateAgentTrace(
  action: "generate" | "grade",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
): AgentTraceStep[] {
  const now = new Date()
  
  if (action === "generate") {
    return [
      {
        type: "thought",
        content: `I need to generate a ${context.difficulty} difficulty exam for ${context.subject} covering ${context.topic}. The exam should have ${context.questionCount} multiple-choice questions.`,
        timestamp: new Date(now.getTime() - 4000)
      },
      {
        type: "action",
        content: `Querying question database for ${context.subject} questions matching topic: "${context.topic}"`,
        timestamp: new Date(now.getTime() - 3500)
      },
      {
        type: "observation",
        content: `Found 10 questions in the database. Filtering for ${context.difficulty} difficulty level.`,
        timestamp: new Date(now.getTime() - 3000)
      },
      {
        type: "action",
        content: `Selecting ${context.questionCount} questions with balanced topic coverage and appropriate difficulty.`,
        timestamp: new Date(now.getTime() - 2500)
      },
      {
        type: "observation",
        content: `Selected questions covering: Kinematics, Vectors, Projectile Motion, Newton's Laws, Work and Energy.`,
        timestamp: new Date(now.getTime() - 2000)
      },
      {
        type: "thought",
        content: "Validating question quality and ensuring no duplicate concepts.",
        timestamp: new Date(now.getTime() - 1500)
      },
      {
        type: "validation",
        content: "✓ All questions validated. Difficulty distribution verified. Exam ready for delivery.",
        timestamp: new Date(now.getTime() - 1000),
        status: "success"
      }
    ]
  } else {
    const correctCount = Object.values(context.answers).filter(
      (a, i) => a === context.exam.questions[i]?.correctAnswer
    ).length
    const percentage = Math.round((correctCount / context.exam.questions.length) * 100)
    
    return [
      {
        type: "thought",
        content: `I need to grade ${context.exam.questions.length} student responses and provide detailed feedback.`,
        timestamp: new Date(now.getTime() - 3500)
      },
      {
        type: "action",
        content: "Comparing student answers against correct answers for each question.",
        timestamp: new Date(now.getTime() - 3000)
      },
      {
        type: "observation",
        content: `Grading complete. Student scored ${correctCount}/${context.exam.questions.length} (${percentage}%).`,
        timestamp: new Date(now.getTime() - 2500)
      },
      {
        type: "action",
        content: "Analyzing performance patterns to identify weak areas and generate study recommendations.",
        timestamp: new Date(now.getTime() - 2000)
      },
      {
        type: "observation",
        content: "Identified topic-wise performance. Generating personalized study advice based on mistake patterns.",
        timestamp: new Date(now.getTime() - 1500)
      },
      {
        type: "thought",
        content: "Cross-referencing common misconceptions database to provide targeted explanations.",
        timestamp: new Date(now.getTime() - 1000)
      },
      {
        type: "validation",
        content: `✓ Grading validated. Score: ${percentage}%. Feedback quality: High. Recommendations: Personalized.`,
        timestamp: new Date(now.getTime() - 500),
        status: percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "error"
      }
    ]
  }
}
