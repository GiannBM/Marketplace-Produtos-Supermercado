import { Stack, Link } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function RootLayout() {
  return (


    <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="register" options={{ title: 'Cadastro' }} />
          <Stack.Screen name="userpage" options={{ title: 'UserPage' }} />
          <Stack.Screen name="camera" options={{ title: 'Camera' }} />
          <Stack.Screen name="searchproduct" options={{ title: 'Busca Produtos' }} />

        </Stack>
    </GestureHandlerRootView>
  );
}
