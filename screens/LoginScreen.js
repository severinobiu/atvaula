// screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Erro", "Preencha email e senha");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged no App.js fará a navegação
    } catch (error) {
      Alert.alert("Erro ao logar", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
      <View style={{ height: 12 }} />
      <Button title="Criar conta" onPress={() => navigation.navigate("Signup")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  title: { fontSize:24, marginBottom:20, textAlign:"center" },
  input: { borderWidth:1, borderColor:"#ccc", padding:10, marginBottom:10, borderRadius:6 }
});
