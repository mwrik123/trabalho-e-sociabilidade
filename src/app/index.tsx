import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StorageService } from "../services/storage";
import databaseService from "../services/database";
import { User } from "../types";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUserRegistration();
  }, []);

  const checkUserRegistration = async () => {
    try {
      const storedUser = await StorageService.getUser();
      console.log("🔍 Usuário encontrado no storage:", storedUser);

      if (!storedUser) {
        console.log("📱 Primeiro uso detectado - redirecionando para registro");
        // Primeiro uso - redirecionar para registro
        router.replace("/register");
        return;
      }

      console.log("✅ Usuário já registrado:", storedUser.name);
      setUser(storedUser);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      Alert.alert("Erro", "Erro ao carregar dados do usuário");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null; // O redirecionamento já foi feito
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header melhorado */}
        <View style={styles.header}>
          <View style={styles.headerDecoration}>
            <View style={styles.decorativeCircle} />
            <View style={styles.decorativeCircle2} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.welcome}>Olá,</Text>
            <Text style={styles.userName}>{user.name}!</Text>
            <Text style={styles.matricula}>Matrícula: {user.matricula}</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>
              Explore o mundo do trabalho e sociabilidade
            </Text>
          </View>
        </View>

        {/* Menu em grid 2x3 */}
        <View style={styles.menuContainer}>
          <View style={styles.menuRow}>
            <TouchableOpacity
              style={[styles.menuCard, styles.primaryCard]}
              onPress={() => router.push("/quiz-new")}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>📚</Text>
              </View>
              <Text style={styles.menuTitle}>Quiz</Text>
              <Text style={styles.menuDescription}>
                Teste seus conhecimentos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuCard, styles.secondaryCard]}
              onPress={() => router.push("/ranking")}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>🏆</Text>
              </View>
              <Text style={styles.menuTitle}>Ranking</Text>
              <Text style={styles.menuDescription}>Sua posição no top</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity
              style={[styles.menuCard, styles.accentCard]}
              onPress={() => router.push("/timeline")}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>📅</Text>
              </View>
              <Text style={styles.menuTitle}>Timeline</Text>
              <Text style={styles.menuDescription}>História do trabalho</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuCard, styles.successCard]}
              onPress={() => router.push("/simulator")}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>🎯</Text>
              </View>
              <Text style={styles.menuTitle}>Simulador</Text>
              <Text style={styles.menuDescription}>Simule situações</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity
              style={[styles.menuCard, styles.infoCard]}
              onPress={() => router.push("/profiles")}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>👥</Text>
              </View>
              <Text style={styles.menuTitle}>Perfis</Text>
              <Text style={styles.menuDescription}>Profissionais diversos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuCard, styles.warningCard]}
              onPress={() => router.push("/glossary")}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.menuIcon}>📖</Text>
              </View>
              <Text style={styles.menuTitle}>Glossário</Text>
              <Text style={styles.menuDescription}>Termos importantes</Text>
            </TouchableOpacity>
          </View>

          {/* Card de créditos full-width */}
          <TouchableOpacity
            style={[styles.menuCard, styles.fullWidthCard]}
            onPress={() => router.push("/credits")}
          >
            <View
              style={[
                styles.iconContainer,
                { marginBottom: 0, marginRight: 16 },
              ]}
            >
              <Text style={styles.menuIcon}>ℹ️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuTitle, { textAlign: "left" }]}>
                Créditos
              </Text>
              <Text style={[styles.menuDescription, { textAlign: "left" }]}>
                Informações sobre o aplicativo e desenvolvedores
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#64748B",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    position: "relative",
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    top: -30,
    right: -20,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    bottom: -20,
    left: -10,
  },
  headerContent: {
    zIndex: 1,
    alignItems: "center",
  },
  welcome: {
    fontSize: 18,
    color: "#CBD5E1",
    marginBottom: 4,
    fontWeight: "500",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  matricula: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#E2E8F0",
    textAlign: "center",
    fontWeight: "500",
  },
  menuContainer: {
    gap: 16,
  },
  menuRow: {
    flexDirection: "row",
    gap: 16,
  },
  menuCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  primaryCard: {
    backgroundColor: "#EBF8FF",
    borderColor: "#3B82F6",
  },
  secondaryCard: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  accentCard: {
    backgroundColor: "#F0FDF4",
    borderColor: "#10B981",
  },
  successCard: {
    backgroundColor: "#FDF2F8",
    borderColor: "#EC4899",
  },
  infoCard: {
    backgroundColor: "#F0F9FF",
    borderColor: "#06B6D4",
  },
  warningCard: {
    backgroundColor: "#FFFBEB",
    borderColor: "#F59E0B",
  },
  fullWidthCard: {
    backgroundColor: "#F8FAFC",
    borderColor: "#64748B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    minHeight: 80,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
    textAlign: "center",
  },
  menuDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
