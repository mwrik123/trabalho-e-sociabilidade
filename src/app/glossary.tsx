import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { glossaryTerms } from "../data/mockData";

export default function Glossary() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);

  const filteredTerms = glossaryTerms.filter(
    (term) =>
      term.term.toLowerCase().includes(searchText.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) =>
      prev.includes(termId)
        ? prev.filter((id) => id !== termId)
        : [...prev, termId]
    );
  };

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
            <Text style={styles.title}>📚 Glossário</Text>
            <Text style={styles.subtitle}>
              Termos importantes da era digital do trabalho
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar termo..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.termsContainer}>
          {filteredTerms.map((term) => (
            <TouchableOpacity
              key={term.id}
              style={styles.termItem}
              onPress={() => toggleTerm(term.id)}
            >
              <View style={styles.termHeader}>
                <Text style={styles.termName}>{term.term}</Text>
                <Text style={styles.expandIcon}>
                  {expandedTerms.includes(term.id) ? "▼" : "▶"}
                </Text>
              </View>

              {expandedTerms.includes(term.id) && (
                <View style={styles.termDefinition}>
                  <Text style={styles.definitionText}>{term.definition}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {filteredTerms.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                🔍 Nenhum termo encontrado para "{searchText}"
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerTitle}>💡 Dica de Estudo</Text>
          <Text style={styles.footerText}>
            Estes termos são fundamentais para entender como a tecnologia
            transformou o mundo do trabalho. A "uberização" representa uma
            mudança profunda nas relações trabalhistas, onde a flexibilidade vem
            acompanhada da transferência de riscos e custos para o trabalhador.
          </Text>
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
    backgroundColor: "#EF4444",
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  termsContainer: {
    padding: 20,
  },
  termItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  termHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  termName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },
  expandIcon: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 12,
  },
  termDefinition: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  definitionText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  footerInfo: {
    backgroundColor: "#EBF8FF",
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 16,
    color: "#1E40AF",
    lineHeight: 24,
  },
});
