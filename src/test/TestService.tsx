// Teste simples para verificar a importação do dbService
import { dbService } from "../services/database";

console.log("dbService:", dbService);
console.log("dbService.getUserByMatricula:", dbService.getUserByMatricula);

export default function TestService() {
  return null;
}
