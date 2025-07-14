import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import databaseService from "../services/database";
import { StorageService } from "../services/storage";
import {
  RankingEntry,
  RankingCategory,
  User,
  QuizHistoryEntry,
} from "../types";

export default function RankingScreen() {
  const router = useRouter();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [categories, setCategories] = useState<RankingCategory[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string>("Ranking Geral");
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  const loadData = async () => {
    try {
      const [categoriesData, userData] = await Promise.all([
        databaseService.getRankingCategories(),
        StorageService.getUser(),
      ]);

      setCategories(categoriesData);
      setCurrentUser(userData);

      // Carregar ranking baseado na categoria selecionada
      await loadRanking();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadRanking = async () => {
    try {
      let rankingData;
      if (selectedCategory) {
        rankingData = await databaseService.getRankingByCategory(
          selectedCategory
        );
      } else {
        rankingData = await databaseService.getRanking();
      }
      setRanking(rankingData);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadRanking();
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getRankPosition = (userId: number) => {
    return ranking.findIndex((entry) => entry.id === userId) + 1;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nunca";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      return "Data inválida";
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${position}º`;
    }
  };

  const selectCategory = (categoryId: string | null, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
  };

  const toggleUserExpansion = (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const renderQuizHistory = (history?: QuizHistoryEntry[]) => {
    if (!history || history.length === 0) return null;

    return history
      .slice(0, 5)
      .map((quiz, index) => {
        // Proteção contra dados inválidos
        if (
          !quiz ||
          typeof quiz.score !== "number" ||
          typeof quiz.totalQuestions !== "number"
        ) {
          return null;
        }

        return (
          <View
            key={`${quiz.completedAt || index}-${quiz.score}-${index}`}
            style={styles.historyItem}
          >
            <View style={styles.historyScore}>
              <Text style={styles.historyScoreText}>
                {`${quiz.score}/${quiz.totalQuestions}`}
              </Text>
              <Text style={styles.historyPercentage}>
                {`${Math.round((quiz.score / quiz.totalQuestions) * 100)}%`}
              </Text>
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDate}>
                {formatDate(quiz.completedAt)}
              </Text>
              {quiz.timeSpent && (
                <Text style={styles.historyTime}>
                  {`${Math.floor(quiz.timeSpent / 60)}m ${
                    quiz.timeSpent % 60
                  }s`}
                </Text>
              )}
            </View>
          </View>
        );
      })
      .filter(Boolean); // Remove elementos null
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Carregando ranking...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>🏆 Ranking</Text>
            <Text style={styles.subtitle}>Quem mais acerta nos quizzes</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      {currentUser && (
        <View style={styles.userStatsContainer}>
          <Text style={styles.userStatsTitle}>Sua posição</Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {getRankPosition(currentUser.id!) || "-"}
              </Text>
              <Text style={styles.statLabel}>Posição</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {String(
                  ranking.find((entry) => entry.id === currentUser.id!)
                    ?.totalScore || 0
                )}
              </Text>
              <Text style={styles.statLabel}>Pontos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {String(
                  ranking.find((entry) => entry.id === currentUser.id!)
                    ?.totalQuizzes || 0
                )}
              </Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
          </View>
        </View>
      )}

      {/* Abas de categoria */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === null && styles.categoryTabActive,
            ]}
            onPress={() => selectCategory(null, "Ranking Geral")}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === null && styles.categoryTabTextActive,
              ]}
            >
              🏆 Geral
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.categoryId}
              style={[
                styles.categoryTab,
                selectedCategory === category.categoryId &&
                  styles.categoryTabActive,
              ]}
              onPress={() =>
                selectCategory(category.categoryId, category.categoryName)
              }
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category.categoryId &&
                    styles.categoryTabTextActive,
                ]}
              >
                📋 {category.categoryName}
              </Text>
              <Text style={styles.categoryTabSubtext}>
                {category.totalParticipants} jogadores
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Título da aba selecionada */}
      <View style={styles.selectedCategoryHeader}>
        <Text style={styles.selectedCategoryTitle}>{selectedCategoryName}</Text>
        <Text style={styles.selectedCategorySubtitle}>
          {selectedCategory
            ? `${ranking?.length || 0} participantes`
            : `${ranking?.length || 0} jogadores no total`}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.rankingContainer}>
          {ranking.length > 0 ? (
            ranking.map((entry, index) => (
              <View
                key={entry.id}
                style={[
                  styles.rankingItem,
                  currentUser?.id === entry.id && styles.currentUserItem,
                  index < 3 && styles.topThreeItem,
                ]}
              >
                <TouchableOpacity
                  style={styles.rankingMainContent}
                  onPress={() =>
                    selectedCategory &&
                    entry.quizHistory &&
                    toggleUserExpansion(entry.id)
                  }
                  disabled={!selectedCategory || !entry.quizHistory}
                >
                  <View style={styles.rankPosition}>
                    <Text
                      style={[
                        styles.rankPositionText,
                        index < 3 && styles.topThreeText,
                      ]}
                    >
                      {getRankIcon(index + 1)}
                    </Text>
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {entry.name || "Nome não informado"}
                    </Text>
                    <Text style={styles.userMatricula}>
                      {`Matrícula: ${entry.matricula || "Não informada"}`}
                    </Text>
                    <Text style={styles.lastQuiz}>
                      {`Último quiz: ${formatDate(entry.lastQuizDate)}`}
                    </Text>
                  </View>

                  <View style={styles.stats}>
                    <Text style={styles.totalScore}>
                      {String(entry.totalScore || 0)}
                    </Text>
                    <Text style={styles.statsLabel}>pontos</Text>
                    <Text style={styles.averageScore}>
                      {`${entry.averageScore || 0}% média`}
                    </Text>
                    <Text style={styles.totalQuizzes}>
                      {`${entry.totalQuizzes || 0} vez${
                        (entry.totalQuizzes || 0) !== 1 ? "es" : ""
                      } feita${(entry.totalQuizzes || 0) !== 1 ? "s" : ""}`}
                    </Text>
                  </View>

                  {/* Indicador de que pode expandir */}
                  {selectedCategory && entry.quizHistory && (
                    <View style={styles.expandIndicator}>
                      <Text style={styles.expandIcon}>
                        {expandedUsers.has(entry.id) ? "🔽" : "🔼"}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Histórico de quizzes do usuário */}
                {expandedUsers.has(entry.id) && entry.quizHistory && (
                  <View style={styles.quizHistoryContainer}>
                    <Text style={styles.historyTitle}>
                      {`Histórico dos últimos ${Math.min(
                        entry.quizHistory.length,
                        5
                      )} quizzes:`}
                    </Text>
                    {renderQuizHistory(entry.quizHistory)}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Nenhum resultado ainda</Text>
              <Text style={styles.emptyMessage}>
                Seja o primeiro a fazer um quiz e aparecer no ranking!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  headerSpacer: {
    width: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  userStatsContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userStatsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F59E0B",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  rankingContainer: {
    padding: 20,
  },
  rankingItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
  },
  topThreeItem: {
    backgroundColor: "#FEF3C7",
  },
  rankPosition: {
    width: 50,
    alignItems: "center",
  },
  rankPositionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  topThreeText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  userMatricula: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  lastQuiz: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  stats: {
    alignItems: "flex-end",
  },
  totalScore: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F59E0B",
  },
  statsLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  averageScore: {
    fontSize: 12,
    color: "#059669",
    marginTop: 2,
  },
  totalQuizzes: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  categoriesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  categoryTabActive: {
    backgroundColor: "#F59E0B",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  categoryTabTextActive: {
    color: "#FFFFFF",
  },
  categoryTabSubtext: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  selectedCategoryHeader: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  selectedCategoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  selectedCategorySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  rankingMainContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  scoreRange: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  expandIndicator: {
    paddingLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  expandIcon: {
    fontSize: 12,
    color: "#6B7280",
  },
  quizHistoryContainer: {
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#F59E0B",
  },
  historyScore: {
    alignItems: "flex-start",
  },
  historyScoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  historyPercentage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#059669",
  },
  historyDetails: {
    alignItems: "flex-end",
  },
  historyDate: {
    fontSize: 11,
    color: "#6B7280",
  },
  historyTime: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 1,
  },
});
