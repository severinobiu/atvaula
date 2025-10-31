// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

// Telas
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen"; // 👈 nova tela de contato

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) return null; // Pode trocar por um splash futuramente

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            {/* Telas de autenticação */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: "Cadastro" }}
            />
          </>
        ) : (
          <>
            {/* Telas acessadas após login */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Início" }}
            />
            <Stack.Screen
              name="Contato"
              component={ContactScreen}
              options={{ title: "Fale Conosco" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
