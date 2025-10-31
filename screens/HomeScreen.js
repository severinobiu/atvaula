import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from "react-native";
import { ref, push, onValue, remove, update } from "firebase/database";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const [editing, setEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const contactsRef = ref(db, `contacts/${user.uid}`);
    const unsub = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setContacts([]);
        return;
      }
      const parsed = Object.keys(data).map((key) => ({ key, ...data[key] }));
      setContacts(parsed);
    });
    return () => unsub();
  }, [user]);

  const addContact = async () => {
    if (!name || !number) return Alert.alert("Erro", "Preencha nome e número");
    try {
      await push(ref(db, `contacts/${user.uid}`), { name, number });
      setName("");
      setNumber("");
    } catch (err) {
      Alert.alert("Erro ao adicionar", err.message);
    }
  };

  const deleteContact = (key) => {
    Alert.alert("Confirmar", "Deseja excluir este contato?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await remove(ref(db, `contacts/${user.uid}/${key}`));
          } catch (err) {
            Alert.alert("Erro ao excluir", err.message);
          }
        },
      },
    ]);
  };

  const startEdit = (item) => {
    setEditingKey(item.key);
    setEditName(item.name);
    setEditNumber(item.number);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!editName || !editNumber) return Alert.alert("Erro", "Preencha nome e número");
    try {
      await update(ref(db, `contacts/${user.uid}/${editingKey}`), { name: editName, number: editNumber });
      setEditing(false);
      setEditingKey(null);
      setEditName("");
      setEditNumber("");
    } catch (err) {
      Alert.alert("Erro ao editar", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert("Erro ao sair", err.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3399cc" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>{item.number}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => startEdit(item)}>
        <Text style={styles.btnText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: "#e73cae" }]} onPress={() => deleteContact(item.key)}>
        <Text style={styles.btnText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Contatos</Text>

      <View style={styles.form}>
        <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Número" value={number} onChangeText={setNumber} style={styles.input} keyboardType="phone-pad" />
        <Button title="Adicionar Contato" onPress={addContact} />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        extraData={contacts}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum contato ainda</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <View style={{ marginTop: 16 }}>
        <Button title="Sair" onPress={handleLogout} />
      </View>

      <Modal visible={editing} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Editar Contato</Text>
            <TextInput placeholder="Nome" value={editName} onChangeText={setEditName} style={styles.input} />
            <TextInput placeholder="Número" value={editNumber} onChangeText={setEditNumber} style={styles.input} keyboardType="phone-pad" />
            <Button title="Salvar" onPress={saveEdit} />
            <View style={{ height: 8 }} />
            <Button title="Cancelar" onPress={() => setEditing(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  form: { marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 8, borderRadius: 6 },
  item: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, borderColor: "#eee", marginBottom: 8, borderRadius: 6 },
  itemName: { fontWeight: "bold", fontSize: 16 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#d3d01d", borderRadius: 6, marginLeft: 8 },
  btnText: { color: "#fff" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
