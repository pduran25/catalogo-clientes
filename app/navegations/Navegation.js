import React, { useState,useRef, useEffect, useMemo } from "react";
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ProductosStack from "../navegations/ProductosStack";
import CatalogoStack from "../navegations/CatalogoStack";
import ClienteStack from "../navegations/ClienteStack";
import PerfilStack from "../navegations/PerfilStack";
import { Icon } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
import LoginForm from "./LoginForm";
import CargarDatos from "./CargarDatos";
import CargarDatos2 from "./CargarDatos2";
import { AuthContext } from "../components/Context"

import AsyncStorage from '@react-native-async-storage/async-storage'

const Tab = createBottomTabNavigator();
const STORAGE_KEY = '@save_data'


export default function Navigation(props){ 
    const {toastRef} = props;
    const [isLoading, setIsLoading] = React.useState(false);
    const [userToken, setUserToken] = React.useState(null);
    const [chargue, setChargue] = React.useState(0);
    const [paso, setPaso] = React.useState(0);

    const authContext = React.useMemo(() => ({
        signIn: () => {
            setUserToken('keyrubik');
            setIsLoading(false);
            setChargue(0);
        },
        signInfree: () => {
            setUserToken('keyrubikfree');
            setIsLoading(false);
            setChargue(0);
        },
        signUp: () => {
            setUserToken('keyrubikload');
            setIsLoading(false);
            setChargue(1);
        },
        signfree: () => {
            setUserToken('keyrubikloadfree');
            setIsLoading(false);
            setChargue(1);
        },
        signOut: () => {
            setUserToken(null);
            setIsLoading(false);
            setChargue(0);
            setPaso(0);
        },
    }))

    const getDataLogin = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if(paso == 0){
                if(jsonValue != null && chargue == 0){
                    authContext.signIn();
                    console.log("se logoneo")
                }else if(jsonValue != null && chargue == 1){
                    console.log("se cargo")
                }else{
                    authContext.signOut();
                    console.log("sin login")
            }
            setPaso(1);
        }
        } catch(e) {
           console.log(e)
        }
    }
    useEffect(() =>{
        getDataLogin();
    },[])
    



    
    return(
        <AuthContext.Provider value={authContext}>
        <NavigationContainer> 
            {(userToken == null) ? <LoginForm  toastRef={toastRef} /> : 
             (userToken === 'keyrubikload') ? <CargarDatos toastRef={toastRef} /> : 
             (userToken === 'keyrubik') ? 
            <Tab.Navigator
            initialRouteName="restaurants"
            tabBarOptions={{
              inactiveTintColor: "#646464",
              activeTintColor: "#00a680",
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
              })}
            >
                <Tab.Screen 
                    name="productos" 
                    component={ProductosStack}
                    options={{title: "Productos"}} 
                    />
                    <Tab.Screen 
                    name="catalogos" 
                    component={CatalogoStack}
                    options={{title: "Catálogo"}}  />
                    <Tab.Screen 
                    name="perfil" 
                    component={PerfilStack}
                    options={{title: "Perfil"}}  />
            </Tab.Navigator> : (userToken === 'keyrubikloadfree') ? <CargarDatos2 toastRef={toastRef} /> : (userToken === 'keyrubikfree') ? <Tab.Navigator
            initialRouteName="restaurants"
            tabBarOptions={{
              inactiveTintColor: "#646464",
              activeTintColor: "#00a680",
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
              })}
            >
                <Tab.Screen 
                    name="productos" 
                    component={ProductosStack}
                    options={{title: "Productos"}} 
                    />
            </Tab.Navigator> : <View></View>}
                </NavigationContainer>
                </AuthContext.Provider>
          
    );
}

function screenOptions(route, color){
    let iconName;
    switch(route.name){
        case "productos":
            iconName = "gift-outline";
            break;
        case "catalogos":
            iconName = "book-open-variant";
            break;
        case "clientes":
            iconName = "account-multiple";
            break;
        case "perfil":
            iconName = "account-circle";
            break;
        default: 
            break;
    }
    return(
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}