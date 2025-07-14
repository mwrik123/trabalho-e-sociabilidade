import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { StorageService } from "../services/storage";
import databaseService from "../services/database";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !matricula.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha nome e matrícula."
      );
      return;
    }

    if (matricula.length < 3) {
      Alert.alert(
        "Matrícula inválida",
        "A matrícula deve ter pelo menos 3 caracteres."
      );
      return;
    }

    setLoading(true);

    try {
      // Verificar se a matrícula já existe
      const existingUser = await databaseService.getUserByMatricula(
        matricula.trim()
      );

      if (existingUser) {
        // Usuário já existe, fazer login
        await StorageService.saveUser({
          id: existingUser.id,
          name: existingUser.name,
          matricula: existingUser.matricula,
        });

        Alert.alert(
          "Bem-vindo de volta!",
          `Olá ${existingUser.name}, você já possui uma conta. Redirecionando...`,
          [
            {
              text: "OK",
              onPress: () => {
                StorageService.setNotFirstTime();
                router.replace("/");
              },
            },
          ]
        );
      } else {
        // Criar novo usuário
        const newUser = await databaseService.createUser(
          name.trim(),
          matricula.trim()
        );

        await StorageService.saveUser({
          id: newUser.id,
          name: newUser.name,
          matricula: newUser.matricula,
        });

        Alert.alert(
          "Cadastro realizado!",
          `Bem-vindo ${name}! Agora você pode participar dos quizzes e concorrer no ranking.`,
          [
            {
              text: "Começar",
              onPress: () => {
                StorageService.setNotFirstTime();
                router.replace("/");
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/photo.png")}
            style={styles.iconImage}
          />
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>
            Para começar, precisamos de algumas informações suas
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Matrícula</Text>
            <TextInput
              style={styles.input}
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Digite sua matrícula"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continuar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Seus dados serão usados apenas para o ranking dos quizzes
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
    textAlign: "center",
  },
  iconImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  button: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});
