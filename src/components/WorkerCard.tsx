import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WorkerProfile } from "../types";

interface WorkerCardProps {
  worker: WorkerProfile;
  onPress: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onPress }) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("⭐");
    }

    return stars.join("");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{worker.avatar}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{worker.name}</Text>
          <Text style={styles.serviceType}>
            {worker.serviceType.icon} {worker.serviceType.name}
          </Text>
          <Text style={styles.rating}>
            {renderStars(worker.rating)} {worker.rating}
          </Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={3}>
        {worker.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    fontSize: 40,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: "#6366F1",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: "#F59E0B",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});
