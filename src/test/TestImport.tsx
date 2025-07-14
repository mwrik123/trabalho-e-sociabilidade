import React from "react";
import { View, Text } from "react-native";
import { dbService } from "../services/database";

export default function TestImport() {
  console.log("dbService:", dbService);
  console.log("dbService type:", typeof dbService);
  console.log("getUserByMatricula:", dbService?.getUserByMatricula);
  console.log("getUserByMatricula type:", typeof dbService?.getUserByMatricula);

  return (
    <View>
      <Text>Test Import</Text>
      <Text>dbService: {typeof dbService}</Text>
      <Text>getUserByMatricula: {typeof dbService?.getUserByMatricula}</Text>
    </View>
  );
}
