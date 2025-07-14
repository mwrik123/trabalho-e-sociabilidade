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
import { WorkerCard } from "../components/WorkerCard";
import { workerProfiles } from "../data/mockData";

export default function Profiles() {
  const router = useRouter();

  const handleWorkerPress = (workerId: string) => {
    router.push(`/worker-detail?id=${workerId}` as any);
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
            <Text style={styles.title}>👥 Perfis de Trabalhadores</Text>
            <Text style={styles.subtitle}>
              Conheça as histórias reais do trabalho digital
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {workerProfiles.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onPress={() => handleWorkerPress(worker.id)}
          />
        ))}
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
    backgroundColor: "#6366F1",
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
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
});
