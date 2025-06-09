import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function Home() {

  const router = useRouter();

  return (

      <SafeAreaView style={styles.container}>

        <TouchableOpacity

          style={styles.button}
          onPress={()=>router.navigate("./login")}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.button}
          onPress={()=>router.navigate("./register")}
        >
          <Text style={styles.text}>Cadastro</Text>
        </TouchableOpacity>

        
      </SafeAreaView>  

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    color: 'black',
    textAlign: 'center'
  },
  button: {
    borderColor: 'black',
    backgroundColor: 'lightcyan',
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    width: 200,
    height: 50,
    marginBottom: 30,
  },

});
