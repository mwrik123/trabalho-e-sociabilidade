import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { serviceTypes } from "../data/mockData";
import { ServiceType, SimulationResult } from "../types";

export default function Simulator() {
  const router = useRouter();
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("40");
  const [monthlyCosts, setMonthlyCosts] = useState<string>("");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const selectedService = serviceTypes[selectedServiceIndex];

  const calculateResult = () => {
    const costs = parseFloat(monthlyCosts) || 0;
    const hours = parseFloat(hoursPerWeek) || 40;

    // Valores baseados nos perfis reais dos trabalhadores (2024/2025)
    const hourlyRates = {
      "1": 22, // Entregador - baseado no perfil João: R$ 2200÷100h = R$ 22/h
      "2": 18, // Motorista - baseado no perfil Carlos: R$ 3200÷180h = R$ 17,78/h (arredondado)
      "3": 32, // Freelancer - baseado no perfil Ana: R$ 4500÷140h = R$ 32,14/h (arredondado)
      "4": 20, // Serviços Gerais - baseado no perfil Maria: R$ 2400÷120h = R$ 20/h
    };

    const hourlyRate =
      hourlyRates[selectedService.id as keyof typeof hourlyRates] || 15;

    // Cálculo mais claro: horas por semana * 4 semanas
    const monthlyHours = hours * 4;
    const grossIncome = monthlyHours * hourlyRate;
    const netIncome = grossIncome - costs;

    // Percentual de custos sobre a renda bruta
    const costPercentage = (costs / grossIncome) * 100;

    let message = `Para ganhar R$ ${grossIncome.toFixed(
      2
    )} brutos, você precisa trabalhar ${hours}h por semana (${monthlyHours}h/mês). `;

    if (costPercentage > 40) {
      message +=
        "⚠️ ATENÇÃO: Seus custos representam mais de 40% da renda bruta! Isso é muito alto para um trabalhador autônomo.";
    } else if (costPercentage > 25) {
      message +=
        "⚡ Seus custos representam " +
        costPercentage.toFixed(1) +
        "% da renda. Considere otimizar para reduzir custos.";
    } else if (netIncome <= 0) {
      message +=
        "❌ PREJUÍZO: Seus custos são maiores que sua renda! Revise seus valores.";
    } else {
      message +=
        "✅ Você está dentro de uma margem aceitável para trabalho autônomo.";
    }

    setResult({
      grossIncome,
      costs,
      netIncome,
      message,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>💰 Simulador de Trabalho</Text>
              <Text style={styles.subtitle}>
                Calcule sua renda como trabalhador digital
              </Text>
            </View>

            <View style={styles.headerSpacer} />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Tipo de Serviço</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.serviceSelector}
            >
              {serviceTypes.map((service, index) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceOption,
                    selectedServiceIndex === index &&
                      styles.serviceOptionSelected,
                  ]}
                  onPress={() => setSelectedServiceIndex(index)}
                >
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <Text
                    style={[
                      styles.serviceName,
                      selectedServiceIndex === index &&
                        styles.serviceNameSelected,
                    ]}
                  >
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Horas por semana</Text>
            <TextInput
              style={styles.input}
              value={hoursPerWeek}
              onChangeText={setHoursPerWeek}
              placeholder="Ex: 40"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Custos fixos mensais (R$)</Text>
            <TextInput
              style={styles.input}
              value={monthlyCosts}
              onChangeText={setMonthlyCosts}
              placeholder="Ex: 800"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={calculateResult}>
            <Text style={styles.buttonText}>Calcular</Text>
          </TouchableOpacity>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>
              💡 Custos típicos para {selectedService.name}:
            </Text>
            {selectedService.id === "1" && (
              <Text style={styles.tipsText}>
                • Combustível: R$ 300-500/mês{"\n"}• Manutenção da moto: R$
                200-400/mês{"\n"}• Bag térmica: R$ 50-100{"\n"}• Celular e
                internet: R$ 80-120/mês
              </Text>
            )}
            {selectedService.id === "2" && (
              <Text style={styles.tipsText}>
                • Combustível: R$ 800-1200/mês{"\n"}• Manutenção do carro: R$
                300-600/mês{"\n"}• Seguro: R$ 200-400/mês{"\n"}• Celular e
                internet: R$ 80-120/mês
              </Text>
            )}
            {selectedService.id === "3" && (
              <Text style={styles.tipsText}>
                • Internet de qualidade: R$ 100-150/mês{"\n"}•
                Software/licenças: R$ 200-500/mês{"\n"}• Equipamentos: R$
                300-800/mês{"\n"}• Cursos/capacitação: R$ 200-400/mês
              </Text>
            )}
            {selectedService.id === "4" && (
              <Text style={styles.tipsText}>
                • Transporte: R$ 200-400/mês{"\n"}• Materiais de trabalho: R$
                150-300/mês{"\n"}• Equipamentos: R$ 200-500/mês{"\n"}• Celular e
                internet: R$ 80-120/mês
              </Text>
            )}
          </View>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Resultado da Simulação</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Renda Bruta:</Text>
              <Text style={[styles.resultValue, { color: "#10B981" }]}>
                R$ {result.grossIncome.toFixed(2)}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Custos:</Text>
              <Text style={[styles.resultValue, { color: "#EF4444" }]}>
                - R$ {result.costs.toFixed(2)} (
                {((result.costs / result.grossIncome) * 100).toFixed(1)}%)
              </Text>
            </View>

            <View style={[styles.resultRow, styles.resultRowTotal]}>
              <Text style={styles.resultLabelTotal}>Renda Líquida:</Text>
              <Text
                style={[
                  styles.resultValueTotal,
                  {
                    color: result.netIncome > 0 ? "#10B981" : "#EF4444",
                  },
                ]}
              >
                R$ {result.netIncome.toFixed(2)}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor/hora bruto:</Text>
              <Text style={[styles.resultValue, { color: "#8B5CF6" }]}>
                R${" "}
                {(result.grossIncome / (parseFloat(hoursPerWeek) * 4)).toFixed(
                  2
                )}
                /h
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor/hora líquido:</Text>
              <Text style={[styles.resultValue, { color: "#6366F1" }]}>
                R${" "}
                {(result.netIncome / (parseFloat(hoursPerWeek) * 4)).toFixed(2)}
                /h
              </Text>
            </View>

            <View style={styles.messageContainer}>
              <Text style={styles.message}>{result.message}</Text>
            </View>
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
    backgroundColor: "#10B981",
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
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  picker: {
    height: 50,
  },
  serviceSelector: {
    marginTop: 8,
  },
  serviceOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    minWidth: 80,
  },
  serviceOptionSelected: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  serviceIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  serviceNameSelected: {
    color: "#FFFFFF",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  resultRowTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 16,
  },
  resultLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  resultLabelTotal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultValueTotal: {
    fontSize: 20,
    fontWeight: "700",
  },
  messageContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  message: {
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: "#EBF8FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
});
