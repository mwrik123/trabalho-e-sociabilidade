import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { timelineEvents } from "../data/mockData";

export default function Timeline() {
  const router = useRouter();

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
            <Text style={styles.title}>📜 Linha do Tempo da Indústria 4.0</Text>
            <Text style={styles.subtitle}>
              A evolução do trabalho através dos séculos
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {timelineEvents.map((event, index) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineMarker}>
              <View style={styles.timelineDot} />
              {index < timelineEvents.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>

            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventIcon}>{event.icon}</Text>
                <View style={styles.eventHeaderText}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventPeriod}>{event.period}</Text>
                </View>
              </View>

              <Text style={styles.eventDescription}>{event.description}</Text>

              {index === timelineEvents.length - 1 && (
                <View style={styles.currentImpact}>
                  <Text style={styles.currentImpactTitle}>
                    🔥 Impacto Atual
                  </Text>
                  <Text style={styles.currentImpactText}>
                    • Trabalho sob demanda (Uber, iFood, Freelancer)
                    {"\n"}• Controle por algoritmos e avaliações
                    {"\n"}• Transferência de custos para o trabalhador
                    {"\n"}• Flexibilidade sem proteção social
                    {"\n"}• Economia de plataformas digitais
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={styles.conclusionCard}>
          <Text style={styles.conclusionTitle}>🤖 Onde Estamos Hoje?</Text>
          <Text style={styles.conclusionText}>
            A 4ª Revolução Industrial transformou radicalmente as relações de
            trabalho. Hoje, milhões de pessoas trabalham através de aplicativos,
            sem vínculos empregatícios, assumindo os riscos que antes eram das
            empresas. A tecnologia trouxe flexibilidade, mas também precarização
            do trabalho.
          </Text>

          <View style={styles.keyPointsContainer}>
            <Text style={styles.keyPointsTitle}>
              🔑 Pontos-chave da Uberização:
            </Text>
            <View style={styles.keyPoint}>
              <Text style={styles.keyPointIcon}>⏰</Text>
              <Text style={styles.keyPointText}>
                <Text style={styles.keyPointLabel}>Flexibilidade: </Text>
                Você escolhe quando trabalhar
              </Text>
            </View>
            <View style={styles.keyPoint}>
              <Text style={styles.keyPointIcon}>💸</Text>
              <Text style={styles.keyPointText}>
                <Text style={styles.keyPointLabel}>Custos: </Text>
                Combustível, manutenção e equipamentos por sua conta
              </Text>
            </View>
            <View style={styles.keyPoint}>
              <Text style={styles.keyPointIcon}>📊</Text>
              <Text style={styles.keyPointText}>
                <Text style={styles.keyPointLabel}>Controle: </Text>
                Algoritmos monitoram sua performance
              </Text>
            </View>
            <View style={styles.keyPoint}>
              <Text style={styles.keyPointIcon}>🚫</Text>
              <Text style={styles.keyPointText}>
                <Text style={styles.keyPointLabel}>Proteção: </Text>
                Sem férias, 13º, FGTS ou plano de saúde
              </Text>
            </View>
          </View>
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
  header: {
    backgroundColor: "#8B5CF6",
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  scrollContentContainer: {
    paddingBottom: 60,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineMarker: {
    alignItems: "center",
    marginRight: 16,
    width: 20,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#8B5CF6",
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#D1D5DB",
    marginTop: 8,
  },
  eventCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eventIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  eventHeaderText: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  eventPeriod: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  eventDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  currentImpact: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  currentImpactTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 8,
  },
  currentImpactText: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  conclusionCard: {
    backgroundColor: "#EBF8FF",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  conclusionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 16,
    textAlign: "center",
  },
  conclusionText: {
    fontSize: 16,
    color: "#1E40AF",
    lineHeight: 24,
    marginBottom: 20,
  },
  keyPointsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  keyPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  keyPointIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  keyPointLabel: {
    fontWeight: "600",
    color: "#1F2937",
  },
});
