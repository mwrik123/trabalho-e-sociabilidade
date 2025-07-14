import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

export class StorageService {
  private static readonly USER_KEY = "@user_data";
  private static readonly FIRST_TIME_KEY = "@first_time";

  // Salvar dados do usuário
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw error;
    }
  }

  // Buscar dados do usuário
  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }

  // Verificar se é a primeira vez
  static async isFirstTime(): Promise<boolean> {
    try {
      const firstTime = await AsyncStorage.getItem(this.FIRST_TIME_KEY);
      return firstTime === null;
    } catch (error) {
      console.error("Erro ao verificar primeira vez:", error);
      return true;
    }
  }

  // Marcar que não é mais a primeira vez
  static async setNotFirstTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.FIRST_TIME_KEY, "false");
    } catch (error) {
      console.error("Erro ao marcar primeira vez:", error);
      throw error;
    }
  }

  // Limpar dados do usuário (logout)
  static async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
      throw error;
    }
  }

  // Limpar todos os dados
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar todos os dados:", error);
      throw error;
    }
  }
}
