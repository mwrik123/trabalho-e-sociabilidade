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

export default function Credits() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>👥 CRÉDITOS</Text>
            <Text style={styles.subtitle}>
              Trabalho acadêmico sem fins lucrativos
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.courseSection}>
            <Text style={styles.sectionTitle}>🎓 Informações Acadêmicas</Text>
            <Text style={styles.courseInfo}>
              <Text style={styles.label}>Disciplina:</Text>
              {"\n"}
              TRABALHO E SOCIABILIDADE
            </Text>
            <Text style={styles.courseInfo}>
              <Text style={styles.label}>Universidade:</Text>
              {"\n"}
              Universidade Federal do Rio Grande do Norte (UFRN)
            </Text>
            <Text style={styles.courseInfo}>
              <Text style={styles.label}>Professora:</Text>
              {"\n"}
              TASSIA REJANE MONTE DOS SANTOS
            </Text>
          </View>

          <View style={styles.participantsSection}>
            <Text style={styles.sectionTitle}>👨‍🎓 Participantes do Projeto</Text>
            <Text style={styles.participantName}>
              • ALLYSON GUSTAVO SILVA DO CARMO
            </Text>
            <Text style={styles.participantName}>
              • ARTHUR NICACIO DA SILVA
            </Text>
            <Text style={styles.participantName}>
              • MARINA ESTER ONOFRE LOPES
            </Text>
            <Text style={styles.participantName}>
              • LIVIA MARIA SILVA QUEIROZ
            </Text>
            <Text style={styles.participantName}>
              • ANA BEATRIZ FRAGA DE FARIAS
            </Text>
          </View>

          <View style={styles.projectSection}>
            <Text style={styles.sectionTitle}>📱 Sobre o Projeto</Text>
            <Text style={styles.projectDescription}>
              O "Trampo 4.0" é um aplicativo educativo desenvolvido para
              promover reflexão crítica sobre as transformações no mundo do
              trabalho na era digital.
            </Text>
            <Text style={styles.projectDescription}>
              Através de simulações, perfis de trabalhadores, quizzes
              reflexivos, linha do tempo histórica e glossário especializado, o
              app oferece uma visão abrangente sobre a "uberização" do trabalho
              e seus impactos sociais.
            </Text>
          </View>

          <View style={styles.objectivesSection}>
            <Text style={styles.sectionTitle}>🎯 Objetivos Pedagógicos</Text>
            <Text style={styles.objective}>
              • Compreender a evolução histórica do trabalho
            </Text>
            <Text style={styles.objective}>
              • Analisar os impactos da Indústria 4.0
            </Text>
            <Text style={styles.objective}>
              • Refletir sobre direitos trabalhistas
            </Text>
            <Text style={styles.objective}>
              • Desenvolver consciência crítica sobre trabalho digital
            </Text>
            <Text style={styles.objective}>
              • Estimular debate sobre futuro do trabalho
            </Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerNote}>
              Este aplicativo foi desenvolvido exclusivamente com fins
              educativos e não possui finalidade comercial. Todo o conteúdo é
              baseado em pesquisas acadêmicas e dados públicos sobre o mercado
              de trabalho.
            </Text>
            <Text style={styles.year}>2025</Text>
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
    backgroundColor: "#166534",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
  backButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
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
    width: 42,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  courseSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  participantsSection: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  projectSection: {
    backgroundColor: "#EBF8FF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  objectivesSection: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  footerSection: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  courseInfo: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 24,
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
    color: "#166534",
  },
  participantName: {
    fontSize: 16,
    color: "#166534",
    lineHeight: 24,
    marginBottom: 4,
    fontWeight: "500",
  },
  projectDescription: {
    fontSize: 16,
    color: "#1E40AF",
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "justify",
  },
  objective: {
    fontSize: 16,
    color: "#92400E",
    lineHeight: 24,
    marginBottom: 4,
  },
  footerNote: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  year: {
    fontSize: 18,
    fontWeight: "700",
    color: "#166534",
  },
});
