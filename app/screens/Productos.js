import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert} from "react-native";
import { colors } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DataExtra from '../data/DataExtra'
import {SearchBar, ListItem, Icon} from "react-native-elements"
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNPickerSelect from "react-native-picker-select";





export default function Productos(){

    const [search, setSearch] = useState("");
    const [familias, setFamilias] = useState([])
    const [nivel1, setNivel1] = useState(null)
    const [categoria, setCategoria] = useState(0)
    const [elegido, setElegido] = useState(0)
    const [tproducto, setTproducto] = useState(0)
    const [loading, setLoading] = useState(false)
    const [valCategoria, setValCategoria] = useState([{ label: "Seleccionar", value: 0 }])

    const database_name = 'CotzulBD.db';
    const database_version = '1.0';
    const database_displayname = 'CotzulBD';
    const database_size = 200000;

    useEffect(() => {
        getDataFamilia()
    },[]);


    getDataFamilia = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM Catfamilia',
            [],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                console.log("se encontro");
                setFamilias(temp);
            }
            );
    
        });
    };


    getNivel1 = async (idfamilia) => {
        console.log("getNivel1" + idfamilia)
        try {
          setLoading(true)
          const response = await fetch(
            "https://app.cotzul.com/Catalogo/php/conect/db_getNivel1.php?idfamilia="+idfamilia
          );
          console.log("https://app.cotzul.com/Catalogo/php/conect/db_getNivel1.php?idfamilia="+idfamilia);
          const jsonResponse = await response.json();
          console.log(jsonResponse?.nivel1[0].n1_nivel1)
          setNivel1(jsonResponse);
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.log("un error cachado nivel1");
          console.log(error);
        }

      }

     const goFamilia = (codigo) =>{
        setElegido(codigo)
        getNivel1(codigo)
     }


     useEffect(() => {
         setCategoria(0);
         var fetchedNivel1 = [];
         if(nivel1 != null){
             fetchedNivel1 = nivel1.nivel1.map(item => {
                return {
                  label: item.n1_nivel1,
                  value: item.n1_codigo
                };
              });
              
         }
         setValCategoria(fetchedNivel1);
       
     },[nivel1]);

   
    return(
        <View style={styles.container}>
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>Productos</Text>
                <Text style={styles.titlesTitle}>Cotzul S.A.</Text>
            </View>
            {/*Search*/}
            <View style={styles.searchWrapper}>
               
                <View style={styles.search}>
                <SearchBar
                placeholder="Buscar por referencia"
                onChangeText={(e)=> setSearch(e)}
                containerStyle = {StyleSheet.Searchbar}
                value= {search}
                />
                </View>
                
            </View>

            
            
            
                    <View style={styles.categoriaWrapper}>
                    <View style={styles.categoriaListWrapper}>
                        <FlatList 
                        data ={familias}
                        renderItem = {({ item }) => ( <TouchableOpacity style={item.fa_codigo == elegido ? styles.categoriaItemWrapper1 : styles.categoriaItemWrapper2} onPress={() => goFamilia(item.fa_codigo)}><View ><Text style={styles.textItem}>{item.fa_familia}</Text></View></TouchableOpacity>)}
                        keyExtractor = {item => item.fa_codigo}
                        horizontal = {true}/>
                    </View>
                </View>
                

            <View style={styles.categoriaWrapper1}>
            <Text style={styles.titlesSubtitle}>SubCategoria: <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    style={pickerStyle}
                    onValueChange={(categoria) => setCategoria(categoria)}
                    placeholder={{ label: "Seleccionar", value: 0 }}
                    items={valCategoria}
                    value={categoria}
                /></Text>
            </View>


            
            {/*Familias*/}
            <ScrollView style={styles.scrollview}>
                <View style={styles.productoWrapper}>
                    <DataExtra texto={search} familia={elegido} categoria={categoria} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    titlesWrapper:{
        marginTop: 10,
        paddingHorizontal: 20,
    },
titlesSubtitle:{
   // fontFamily: 
   fontSize: 16,
   color: colors.textDark,
},
titlesTitle:{
    // fontFamily: 
   fontSize: 25,
   color: colors.textDark,
},
searchWrapper:{
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
},
search:{
    flex: 1,
    marginLeft: 0,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 1,


},
searchText:{
    fontSize: 14,
    marginBottom: 5,
    color: colors.textLight,

},
productoWrapper:{
    marginTop: 10,
},
Searchbar:{
    marginBottom: 20,
    backgroundColor: '#fff'
}, 
scrollview:{
    marginTop:10,
    marginBottom: 50,
},
categoriaWrapper:{
    paddingHorizontal: 20
},
categoriaWrapper1:{
    paddingHorizontal: 20,
    paddingVertical:10,
    alignItems: 'center', //Centered vertically
},
categoriaItemWrapper1:{
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#f5ca4b',
    borderRadius: 20,
    width: 120, 
    height: 70,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1
},
categoriaItemWrapper2:{
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 120, 
    height: 70,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex:1
},
textItem:{
    textAlign: 'center',
    fontSize: 10,
}


});

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        height: 20,
    },
    placeholder: {
        color: 'white',
      },
    inputAndroid: {
        width: 100,
        height: 20,
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    searchWrapper:{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 0,
        marginTop: 10,
    },
    search:{
        flex: 1,
        marginLeft: 0,
        borderBottomColor: colors.textLight,
        borderBottomWidth: 1,
    }
};
