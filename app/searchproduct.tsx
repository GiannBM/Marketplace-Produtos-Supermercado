import { Text, View, StyleSheet, Button, TouchableOpacity, TextInputComponent, Modal, ActivityIndicator } from "react-native";
import { Link } from 'expo-router';
import { useEffect } from "react";
import React from 'react';
import { useRouter} from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { FlatList, TextInput} from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar } from "react-native-elements";


export default function searchproduct() {

    const router = useRouter();
    const [email, onChangeEmail] = React.useState('');
    const [id, onChangeId] = React.useState('');
    const [query, setQuery] = React.useState('');
    const [products, setProducts] = React.useState([]);
    const [loading, setloading] = React.useState(false);

    



    async function queryProducts(){


        setloading(true)

        const datatoken = await AsyncStorage.getItem('token')

        const novoproduct = [{
            Produto: query
        }]


        
        if(datatoken!=null){

            const response = await fetch('http://xxxxxxx:8080/produtoatt/query', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'x-acess-token': datatoken,
                
            },

                body: JSON.stringify(novoproduct),
            })

            const resp = await response.json()


            if(response.status ==200 ){

                setProducts(resp)
                setloading(false) 
            }

        }
    }


  useEffect(()=>{


  },[]);


  return (


    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 6,
      }}
    > 

        <View style={styles.rowmodal}>

            <TextInput
            style={styles.input2}
            placeholder="Digite sua busca"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={queryProducts}
            />

            <Button title="Buscar" onPress={queryProducts} />
        </View>

        <View>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : (
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()} 

                renderItem={({ item }) => (

                <View style={styles.container}>
                       
                  <Text style={styles.produto}>
                      {item["produto"]}
                  </Text>

                  <Text style={styles.valunitario}>
                      R$ {item["valorunitario"]}   
                      
                      <Text style={styles.unidade}> /  
                        {item["unidade"]}
                      </Text>
                  </Text>

                         

                  <Text style={styles.estabelecimento}>
                    🛒 {item["estabelecimento"]}
                  </Text>

                  <Text style={styles.endereco}>
                    📍 {item["endereco"]}
                  </Text>
                </View>
                )}
            />)}
        </View>

    
    

        
    </View>
  );
}




const styles = StyleSheet.create({

  input2: {
    borderColor: 'black',
    borderBottomWidth: 1,
    borderRadius: 2,
    width: 200,
    height: 50,
    marginBottom: 20,
  },

  container: {

    width: 350,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 12,
    borderRadius: 5,

  },
 
  button: {
    position: 'absolute',
    top: 15,
    right: 5,  
    borderRadius: 2,
    width: 75,
    height: 70,
    textAlign: 'center'
  },

  modalstyle:{

    backgroundColor: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '80%',
    padding: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex:2,
  },


  rowmodal:{

    marginTop: 10,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',

  },


  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },

  linha:{

    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
  },


  produto: {

    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',

  },

  unidade:{

    fontSize: 14,
    color: '#666',
    fontWeight: '400',

  },

  estabelecimento:{

    fontSize: 16,
    color: '#555',
    marginBottom: 6,


  },

  endereco:{

    fontSize: 14,
    color: '#777',
    marginBottom: 6,

  },

  valunitario: {

    fontSize: 18,
    color: '#28a745',
    fontWeight: '600',
    marginBottom: 8,

  },

});
