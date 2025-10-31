import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ref, push } from "firebase/database";
import { db, auth } from "../firebase/firebaseConfig";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!name || !email || !message) return Alert.alert("Erro", "Preencha todos os campos");
    try {
      await push(ref(db, `messages/${auth.currentUser.uid}`), { name, email, message });
      Alert.alert("Sucesso", "Mensagem enviada!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      Alert.alert("Erro ao enviar", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fale Conosco</Text>
      <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Seu e-mail" placeholderTextColor="#aaa" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Digite sua mensagem..." placeholderTextColor="#aaa" multiline value={message} onChangeText={setMessage} />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a5d8f",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: "#3399cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
