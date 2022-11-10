import React, {useState, useEffect} from 'react'
import { StyleSheet, View , Text, Image, ScrollView, Alert} from 'react-native'
import { Input,Button,Icon} from 'react-native-elements';
import {isEmpty} from "lodash";
import axios from 'axios'
import {NavigationContainer} from "@react-navigation/native";
import Navigation from "../navegations/Navegation";
import CargarDatos from "../navegations/CargarDatos";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from "../components/Context"
import NetInfo from "@react-native-community/netinfo";

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'


export default function LoginForm(props) {
    const {toastRef} = props;
    const [showPassword,setShowPassword] = useState(false);
    const [formData, setformData] = useState(defaultValueForm());
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [user, setUser] = useState(false);
    const [basedatos, setBasedatos] = useState(false);
    const {signUp, signfree} = React.useContext(AuthContext);
    const [internet, setInternet] = useState(true);
    
   
    const onChange = (e, type) => {
        setformData({...formData, [type]:e.nativeEvent.text});
    }


    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
          setUser(jsonValue != null ? true : false);
        } catch(e) {
           console.log(e)
        }
    }

    const setDB = async (value) => {
        try {
            await AsyncStorage.setItem(STORAGE_DB, value)
          } catch(e) {
             console.log(e)
          }
    }

    const getDB = async () => {
        try {
          const base = await AsyncStorage.getItem(STORAGE_DB);
          setBasedatos(base == "SI" ? true : false);
          console.log("base de datos: " + basedatos)
        } catch(e) {
           console.log(e)
        }
    }
    

      const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        } catch (e) {
          // saving error
        }
      }

    const reviewInternet = () =>{
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
        });
    }

    const onSubmitfree = async () =>{
        reviewInternet()
        if(internet){
            setUser(false);
            signfree();
        }else{
            Alert.alert("Su dispositivo no cuenta con internet");
            
         }
    }

    const onSubmit = async () =>{
        reviewInternet()
        if(internet){
            if(isEmpty(formData.cedula)){
                toastRef.current.show("Todos los campos son obligatorios");
            }else{
                try {
                    const response = await fetch(
                        'https://app.cotzul.com/Catalogo/php/conect/db_getClientexcedula.php?cedula='+formData.cedula
                    );
                    
                    const respuesta = await response.json();
                    console.log(respuesta.cliente[0].cl_cliente);
                    if(respuesta.cliente[0].cl_cliente != 0){
                        setUser(true);
                        storeData(respuesta.cliente[0]);
                        setDB("NO") 
                        signUp()
                    }else{
                        toastRef.current.show("No existen datos de esta cédula");
                    }
                    
                }catch(error){
                    console.log(error);
                }

            }
    }else{
           Alert.alert("Su dispositivo no cuenta con internet");
           
        }
        
    }


    return (
       
        <>
             
            <View style={styles.formContainer}><Image 
                source={require("../../assets/img/logo_cotzul.jpeg")}
                resizeMode = "contain"
                style={styles.image}
            />
            <Text style={styles.titlesTitle}>Catálogo Clientes</Text>
            <Input 
                placeholder = "Cédula/Ruc"
                containerStyle = {styles.inputForm}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name="account"
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) =>onChange(e, "cedula")}
            />
            
            <Button
                title="Ingresar"
                containerStyle={styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress= {onSubmit}
            />

            <Button
                title="Cliente Final"
                containerStyle={styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress= {onSubmitfree}
            /></View>
            
        </>
    );
}




function defaultValueUser(){
    return{
        cl_codigo: "",
        cl_cedula: "",
        cl_tipoid: "",
        cl_cliente: "",
        cl_telefono: "",
        cl_direccion: "",
        cl_correo: "",
        cl_codvendedor: "",
        cl_nomvendedor: ""
    }
}


function defaultValueForm(){
    return{
        cedula: ""
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10, 
        marginLeft: 30, 
        marginRight: 30
    },
    inputForm:{
        width: "100%",
        marginTop: 10
    },
    image:{
        height: 50,
        width: "80%",
        marginTop: 20, 
        marginBottom: 10,
    },
    btnContainerLogin:{
        marginTop: 30, 
        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#00a680",
    }, 
    iconRight:{
        color : "#c1c1c1",

    }
})
