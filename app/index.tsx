import { Text, View, Image, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';


export default function Home() {

  const router = useRouter();
  const image = require("../assets/images/LogoFoundIt.png")


  return (

     <LinearGradient
      colors={['#b19dc9ff', '#7c68e0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      
        <Image source={image} style ={styles.image}/>
      

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

      </LinearGradient>

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
    color: 'white',
    textAlign: 'center',
    fontSize:25,
    fontWeight:700
  },

  button: {
    backgroundColor: '#ae9ff7ff',
    width:200,
    padding:17,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  image:{

    marginTop:-175,
    marginBottom:-50,
    width: 450,
    height: 450,
    resizeMode: 'contain',

  },

});
