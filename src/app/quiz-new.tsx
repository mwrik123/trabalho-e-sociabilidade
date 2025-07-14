import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { quizCategories } from "../data/mockData";
import { QuizCategory } from "../types";
import { StorageService } from "../services/storage";
import databaseService from "../services/database";

export default function Quiz() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timedOutQuestions, setTimedOutQuestions] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  const currentQuestions = selectedCategory?.questions || [];

  const startTimer = () => {
    setTimeLeft(20);
    setIsTimerActive(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimeOut = () => {
    stopTimer();

    // Marcar a pergunta atual como respondida incorretamente por timeout
    const newTimedOutQuestions = [...timedOutQuestions, currentQuestion];
    setTimedOutQuestions(newTimedOutQuestions);

    // Marcar como respondido com resposta incorreta (-1 para indicar timeout)
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = -1; // -1 indica timeout
    setSelectedAnswers(newAnswers);

    Alert.alert(
      "⏰ Tempo Esgotado!",
      "O tempo para responder esta pergunta acabou. Ela será marcada como incorreta.",
      [
        {
          text: "Continuar",
          onPress: () => {
            // Mostrar a resposta correta por alguns segundos antes de avançar
            setTimeout(() => {
              if (currentQuestion < currentQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
              } else {
                calculateFinalScore();
              }
            }, 2000);
          },
        },
      ]
    );
  };

  // Iniciar timer quando uma nova pergunta é mostrada
  useEffect(() => {
    if (
      selectedCategory &&
      !showResult &&
      selectedAnswers[currentQuestion] === undefined
    ) {
      startTimer();
    }

    return () => {
      stopTimer();
    };
  }, [currentQuestion, selectedCategory, showResult]);

  // Cleanup timer when component unmounts
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const calculateFinalScore = async () => {
    let finalScore = 0;
    currentQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setShowResult(true);
    stopTimer();

    // Salvar resultado no banco de dados
    try {
      const user = await StorageService.getUser();
      if (user && user.id && selectedCategory) {
        await databaseService.saveQuizResult(
          user.id,
          selectedCategory.id,
          selectedCategory.title,
          finalScore,
          currentQuestions.length
        );
      }
    } catch (error) {
      console.error("Erro ao salvar resultado do quiz:", error);
    }
  };

  const handleCategorySelect = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setScore(0);
    setTimedOutQuestions([]);
  };

  const handleAnswer = (answerIndex: number) => {
    // Parar o timer quando uma resposta é selecionada
    stopTimer();

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateFinalScore();
    }
  };

  const resetQuiz = () => {
    stopTimer();
    setSelectedCategory(null);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setScore(0);
    setTimedOutQuestions([]);
  };

  const backToCategories = () => {
    stopTimer();
    setSelectedCategory(null);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setScore(0);
    setTimedOutQuestions([]);
  };

  // Tela de seleção de categoria
  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>🎯 Quiz Reflexivo</Text>
              <Text style={styles.subtitle}>Escolha um tema para começar</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.categoriesContainer}>
            {quizCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <Text style={styles.categoryQuestionCount}>
                    {category.questions.length} questões
                  </Text>
                </View>
                <Text style={styles.categoryArrow}>▶</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const getCurrentQuestion = () => currentQuestions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isTimedOut = timedOutQuestions.includes(currentQuestion);

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>🎯 Resultado do Quiz</Text>
            <Text style={styles.subtitle}>
              Sua pontuação: {score}/{currentQuestions.length}
            </Text>
          </View>

          <View style={styles.resultContainer}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreText}>
                {score >= 3 ? "🎉" : score >= 2 ? "👍" : "🤔"}
              </Text>
              <Text style={styles.scoreTitle}>
                {score >= 3
                  ? "Excelente!"
                  : score >= 2
                  ? "Bom trabalho!"
                  : "Continue aprendendo!"}
              </Text>
              <Text style={styles.scoreDescription}>
                Você acertou {score} de {currentQuestions.length} questões
              </Text>
              {timedOutQuestions.length > 0 && (
                <Text style={styles.timeoutInfo}>
                  ⏰ {timedOutQuestions.length} questão(ões) não foram
                  respondidas no tempo
                </Text>
              )}
            </View>

            <View style={styles.resultDetails}>
              {currentQuestions.map((question, index) => (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultQuestionNumber}>
                      Questão {index + 1}
                    </Text>
                    <Text
                      style={[
                        styles.resultStatus,
                        selectedAnswers[index] === question.correctAnswer
                          ? styles.correctStatus
                          : styles.wrongStatus,
                      ]}
                    >
                      {selectedAnswers[index] === question.correctAnswer
                        ? "✅ Correta"
                        : timedOutQuestions.includes(index)
                        ? "⏰ Tempo esgotado"
                        : "❌ Incorreta"}
                    </Text>
                  </View>
                  <Text style={styles.resultQuestion}>{question.question}</Text>
                  <Text style={styles.resultCorrectAnswer}>
                    Resposta correta: {question.options[question.correctAnswer]}
                  </Text>
                  {timedOutQuestions.includes(index) && (
                    <Text style={styles.timeoutWarning}>
                      Esta pergunta não foi respondida dentro do tempo limite de
                      20 segundos.
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.actionButton} onPress={resetQuiz}>
                <Text style={styles.actionButtonText}>🔄 Tentar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={backToCategories}
              >
                <Text style={styles.secondaryButtonText}>📚 Outros Temas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = getCurrentQuestion();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButtonSmall}
            onPress={backToCategories}
          >
            <Text style={styles.backButtonSmallText}>⬅️</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>
              {selectedCategory.icon} {selectedCategory.title}
            </Text>
            <Text style={styles.subtitle}>
              Questão {currentQuestion + 1} de {currentQuestions.length}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((currentQuestion + 1) / currentQuestions.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Timer Container */}
      <View style={styles.timerContainer}>
        <View
          style={[
            styles.timerCircle,
            {
              borderColor:
                timeLeft <= 5
                  ? "#EF4444"
                  : timeLeft <= 10
                  ? "#F59E0B"
                  : "#10B981",
              backgroundColor:
                timeLeft <= 5
                  ? "#FEF2F2"
                  : timeLeft <= 10
                  ? "#FFFBEB"
                  : "#F0FDF4",
            },
          ]}
        >
          <Text
            style={[
              styles.timerText,
              {
                color:
                  timeLeft <= 5
                    ? "#EF4444"
                    : timeLeft <= 10
                    ? "#F59E0B"
                    : "#10B981",
              },
            ]}
          >
            {timeLeft}s
          </Text>
        </View>
        <Text style={styles.timerLabel}>
          {timeLeft <= 5 ? "⚠️ Tempo quase acabando!" : "⏰ Tempo restante"}
        </Text>
      </View>

      <ScrollView
        style={styles.questionContainer}
        contentContainerStyle={styles.questionScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isAnswered && index === selectedAnswer && styles.selectedOption,
                isAnswered &&
                  index === question.correctAnswer &&
                  styles.correctOption,
                isAnswered &&
                  index === selectedAnswer &&
                  index !== question.correctAnswer &&
                  styles.wrongOption,
              ]}
              onPress={() => !isAnswered && handleAnswer(index)}
              disabled={isAnswered}
            >
              <Text
                style={[
                  styles.optionText,
                  isAnswered &&
                    index === selectedAnswer &&
                    styles.selectedOptionText,
                  isAnswered &&
                    index === question.correctAnswer &&
                    styles.correctOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isAnswered && (
          <View>
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>💡 Explicação</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
              {isTimedOut && (
                <Text style={styles.timeoutWarning}>
                  ⏰ Esta pergunta não foi respondida no tempo limite (20s)
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentQuestion < currentQuestions.length - 1
                  ? "Próxima Pergunta ➡️"
                  : "Ver Resultado 🎯"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#F59E0B",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#FEF3C7",
    textAlign: "center",
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  categoryQuestionCount: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
  categoryArrow: {
    fontSize: 20,
    color: "#D1D5DB",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionScrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedOption: {
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
  },
  correctOption: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  wrongOption: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  selectedOptionText: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  correctOptionText: {
    color: "#10B981",
    fontWeight: "600",
  },
  explanationContainer: {
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0C4A6E",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: "#075985",
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    padding: 20,
  },
  scoreCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreText: {
    fontSize: 48,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  timeoutInfo: {
    fontSize: 14,
    color: "#F59E0B",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  resultDetails: {
    marginBottom: 24,
  },
  resultItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultQuestionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  correctStatus: {
    color: "#10B981",
  },
  wrongStatus: {
    color: "#EF4444",
  },
  resultQuestion: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  resultCorrectAnswer: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  resultActions: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  backButtonSmall: {
    padding: 8,
  },
  backButtonSmallText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSpacer: {
    width: 44,
  },
  timerContainer: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  timerLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  timeoutWarning: {
    fontSize: 14,
    color: "#F59E0B",
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "#FFFBEB",
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  backButtonIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: 13,
    height: 18,
    textAlign: "center",
    includeFontPadding: false,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
});
