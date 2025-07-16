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
import { useLocalSearchParams } from "expo-router";
import { workerProfiles } from "../data/mockData";
import { WorkerProfile } from "../types";

const getReflectionText = (worker: WorkerProfile): string => {
  switch (worker.id) {
    case "1": // Carla Silva - Motorista
      return "Carla representa milhões de motoristas que trocaram empregos formais pela flexibilidade dos apps. Com custos de 37,5% da renda (combustível, manutenção, seguro), ela ganha R$ 17,78/h bruto, mas apenas R$ 11,11/h líquido. A ausência de direitos trabalhistas significa que férias, doença ou acidentes resultam em perda total de renda.";

    case "2": // Ana Santos - Freelancer
      return "Ana exemplifica o trabalho criativo na era digital. Com custos baixos (13,3% da renda) e valor/hora alto (R$ 32,14/h), ela parece estar em melhor situação. Porém, a instabilidade da demanda e a necessidade constante de buscar novos clientes geram ansiedade e incerteza sobre o futuro profissional.";

    case "3": // João Oliveira - Entregador
      return "João trabalha apenas 25h/semana, principalmente fins de semana, mas seus custos representam 22,7% da renda. Com R$ 22/h bruto, ele ganha R$ 17/h líquido. Este perfil mostra como muitos jovens usam delivery como renda complementar, mas também ilustra a precariedade: sem proteção social, ele fica vulnerável a acidentes ou problemas de saúde.";

    case "4": // Maria Costa - Serviços Gerais
      return "Maria enfrenta os desafios típicos do trabalho doméstico uberizado. Com custos moderados (14,6% da renda) e R$ 20/h bruto, ela tem renda relativamente estável. Contudo, a natureza física do trabalho e a falta de proteções trabalhistas a deixam vulnerável. A variação sazonal da demanda também afeta sua renda mensal.";

    default:
      return "Este perfil mostra como o trabalho digital oferece flexibilidade, mas transfere custos e riscos para o trabalhador. Note a ausência de proteções sociais tradicionais como férias, 13º salário ou plano de saúde.";
  }
};

export default function WorkerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const worker = workerProfiles.find((w) => w.id === id);

  if (!worker) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trabalhador não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    return stars.join("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>
                {worker.avatar} {worker.name}
              </Text>
              <Text style={styles.subtitle}>
                {worker.serviceType.icon} {worker.serviceType.name} • Nota:{" "}
                {worker.rating}
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </View>
        {/* Dados detalhados do trabalhador */}
        {/* ...existing code... */}

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📖 História</Text>
            <Text style={styles.description}>{worker.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Dados Financeiros</Text>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Renda Média Mensal:</Text>
              <Text style={[styles.dataValue, { color: "#10B981" }]}>
                R$ {worker.monthlyIncome.toFixed(2)}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Jornada Semanal:</Text>
              <Text style={styles.dataValue}>{worker.weeklyHours}h</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Custos Mensais:</Text>
              <Text style={[styles.dataValue, { color: "#EF4444" }]}>
                R$ {worker.costs.toFixed(2)} (
                {((worker.costs / worker.monthlyIncome) * 100).toFixed(1)}%)
              </Text>
            </View>

            <View style={[styles.dataRow, styles.dataRowTotal]}>
              <Text style={styles.dataLabelTotal}>Renda Líquida:</Text>
              <Text
                style={[
                  styles.dataValueTotal,
                  {
                    color:
                      worker.monthlyIncome - worker.costs > 0
                        ? "#10B981"
                        : "#EF4444",
                  },
                ]}
              >
                R$ {(worker.monthlyIncome - worker.costs).toFixed(2)}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Valor/hora líquido:</Text>
              <Text style={[styles.dataValue, { color: "#6366F1" }]}>
                R${" "}
                {(
                  (worker.monthlyIncome - worker.costs) /
                  (worker.weeklyHours * 4)
                ).toFixed(2)}
                /h
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Valor/hora bruto:</Text>
              <Text style={[styles.dataValue, { color: "#8B5CF6" }]}>
                R${" "}
                {(worker.monthlyIncome / (worker.weeklyHours * 4)).toFixed(2)}/h
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Benefícios</Text>
            {worker.benefits.length > 0 ? (
              worker.benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefit}>
                  • {benefit}
                </Text>
              ))
            ) : (
              <Text style={styles.noBenefits}>
                ❌ Sem direito a benefícios trabalhistas
              </Text>
            )}
          </View>

          <View style={styles.reflectionBox}>
            <Text style={styles.reflectionTitle}>💭 Reflexão</Text>
            <Text style={styles.reflectionText}>
              {getReflectionText(worker)}
            </Text>
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
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
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
    width: "100%",
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
  avatar: {
    fontSize: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  serviceType: {
    fontSize: 16,
    color: "#C7D2FE",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: "#FEF3C7",
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  dataRowTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 16,
  },
  dataLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  dataLabelTotal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  dataValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  dataValueTotal: {
    fontSize: 20,
    fontWeight: "700",
  },
  benefit: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  noBenefits: {
    fontSize: 16,
    color: "#EF4444",
    fontStyle: "italic",
  },
  reflectionBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  reflectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 12,
  },
  reflectionText: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
});
