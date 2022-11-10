import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, Alert, Linking, Clipboard, TextInput } from 'react-native'
import { Input, Icon, Button, CheckBox } from 'react-native-elements';
import axios from 'axios'
import Carousel from "../components/Carousel"
import * as SQLite from 'expo-sqlite';
import utf8 from 'utf8'
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Table, TableWrapper, Row, Rows, Col  } from 'react-native-table-component';

const screenWidth = Dimensions.get("window").width;
const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'

export default function Producto(props) {
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const {navigation, route} = props;
    const {pr_codigo, pr_codprod, pr_referencia} = route.params;
    const [prod, setProd] = useState({});
    const [actdata, setACTData] = useState(1);
    const [images, setImages] = useState(["http://cotzul.com/Catalogo/img/producto-sm/0.png"]);
    const [result, setResult] = useState(null);
    const [tprecio, setTprecio] = useState(4);
    const [precio, setPrecio] = useState("-");
    const [visible, setVisible] = useState(false);
    const [img, setImg] = useState(null);
    const [texterr, setTexterr] = useState(0);
    const [check, setCheck] = useState(false);
    const [valcheck, setValCheck] = useState(0);
    const [codigousu, setCodigousu] = useState(0);

   

    const getDataUser = async () => {
        try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
        setdataUser(JSON.parse(jsonValue));
        if(dataUser != undefined){
            setCodigousu(JSON.parse(jsonValue).us_codigo);
        }
        console.log("producto_nombre: "+dataUser.us_nombre);
        } catch(e) {
        }
    }

    

    const abrirtablaProducto = async() => {
        getDataUser();
        getDataProd();
    }


    const showText = () => {
        setVisible(true);
      };

      const hideText = () => {
        setVisible(false);
      };


    getDataProd = async () => {
        
   
        try{
            db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
            ); 
            db.transaction((tx) => {
                
                tx.executeSql(
                'SELECT * FROM Producto WHERE pr_codigo = '+ pr_codigo,
                [],
                (tx, results) => {
                    
                    
                    setImg(0)
                    var len = results.rows.length;
                    if(len>0){
                        console.log(len);
                        let res = results.rows.item(0);
                        console.log("IMAGEN MINUATURA: " +res.pr_rutaimg)
                        setProd(res);
                        try{
                            console.log(utf8.decode(res.pr_descorta))
                            setTexterr(1)
                        }catch(err){
                            console.log("ERROR CATCH: "+err)
                            setTexterr(0)
                        }
                        console.log("IMAGEN GALERIA: "+ res.pr_arrayimg)
                        setImages(JSON.parse(res.pr_arrayimg));
                        console.log(images)
                        
                    }else{
                        console.log("No se ha encontrado el producto")
                    }
                     
                }
                );
            });

            
        }catch (error) {
            console.log(error)
        }
        
    };

    useEffect(() => {
       
        abrirtablaProducto();
        setACTData(2);
    }, [actdata]);


    useEffect(() => {
        /*hideText()
        if(tprecio == 0){
            setPrecio("-");
        }else if(tprecio == 1){
            setPrecio(prod.pr_preciosub.toFixed(2))
        }else if(tprecio == 2){
            setPrecio(prod.pr_contado.toFixed(2))
        }else if(tprecio == 3){
            setPrecio(prod.pr_credito.toFixed(2))
        }else if(tprecio == 4){
            setPrecio(prod.pr_pvp.toFixed(2))
        }else if(tprecio == 6){
            setPrecio("0.00")
            showText()
        }*/
    }, [tprecio]);


    useEffect(() => {
        if(img == 0){
            console.log("entro a la imagen="+img)
            if(prod.pr_arrayimg){
                console.log("entro a la definicion")
                setImages(JSON.parse(prod.pr_arrayimg));
            }
        }else if(img == 1){
            setImages(["https://app.cotzul.com/Catalogo/php/IMAGEN_PERSONALIZADA/personalizada_"+dataUser.us_codigo+"-"+pr_codigo+".jpg"]);
        }
    }, [img]);

    const createTwoButtonAlert = () =>
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      'plain-text'
    );


     
    const Selseguro = (check) => {
        if(!check)
        setValCheck(1)
            else
            setValCheck(0)
        setCheck(!check)
        
    }



    const state = {
        tableHead: ['Detalle Stock', 'Cantidad'],
        tableTitle: ['Bodega', 'Almacén', 'Promarket', 'Reparado'],
        tableData: [
            [prod.pr_bod],
            [prod.pr_alm],
            [prod.pr_chi],
            [prod.pr_rep]
          ]
      }


      const state2 = {
        tableHead: ['Datos', 'Numero'],
        tableTitle: ['SKU', 'C. Master', 'C. Estandar'],
        tableData: [
            [prod.pr_sku],
            [prod.pr_cm],
            [prod.pr_ce]
          ]
      }

      const state3 = {
        tableHead: ['Desc.', 'Valor'],
        tableTitle: ['Precio Sub.', 'Seguro', 'Iva', 'Precio total'],
        tableData: [
            [Number.parseFloat(prod.pr_preciosub).toFixed(2)],
            [Number.parseFloat(prod.pr_preciosub * 0.012).toFixed(2)],
            [Number.parseFloat(prod.pr_preciosub * 0.12).toFixed(2)],
            [Number.parseFloat(prod.pr_preciosub + (prod.pr_preciosub * 0.012) + (prod.pr_preciosub * 0.12)).toFixed(2) ],                                            
          ]
      }

      const state4 = {
        tableHead: ['Desc.', 'Valor'],
        tableTitle: ['Precio Cont.', 'Seguro', 'Iva', 'Precio total'],
        tableData: [
            [Number.parseFloat(prod.pr_contado).toFixed(2)],
            [Number.parseFloat(prod.pr_contado * 0.012).toFixed(2)],
            [Number.parseFloat(prod.pr_contado * 0.12).toFixed(2)],
            [Number.parseFloat(prod.pr_contado + (prod.pr_contado * 0.012) + (prod.pr_contado * 0.12)).toFixed(2) ],   


          ]
      }

      const state5 = {
        tableHead: ['Desc.', 'Valor'],
        tableTitle: ['Precio Cred.', 'Seguro', 'Iva', 'Precio total'],
        tableData: [
            [Number.parseFloat(prod.pr_credito).toFixed(2)],
            [Number.parseFloat(prod.pr_credito * 0.012).toFixed(2)],
            [Number.parseFloat(prod.pr_credito * 0.12).toFixed(2)],
            [Number.parseFloat(prod.pr_credito + (prod.pr_credito * 0.012) + (prod.pr_credito * 0.12)).toFixed(2) ],                                       
          ]
      }

      const state6 = {
        tableHead: ['Desc.', 'Valor'],
        tableTitle: ['Precio Pub.', 'Seguro', 'Iva', 'Precio total'],
        tableData: [
            [Number.parseFloat(prod.pr_pvp).toFixed(2)],
            [Number.parseFloat(prod.pr_pvp * 0.012).toFixed(2)],
            [Number.parseFloat(prod.pr_pvp * 0.12).toFixed(2)],
            [Number.parseFloat(prod.pr_pvp + (prod.pr_pvp * 0.012) + (prod.pr_pvp * 0.12)).toFixed(2) ],                                    
          ]
      }
    
    return (

    <ScrollView vertical style={styles.viewBody}>
       <Carousel 
            arrayImages = {images}
            height = {screenWidth}
            width = {screenWidth}
       />
        <View style={styles.productoTexto}>
            <View style={styles.viewdetalle}>
                        <Text style={styles.productoReferencia}>{prod.pr_referencia}</Text>
                        <Text style={styles.productoCodigo}>{prod.pr_codprod}</Text>
                        <Text style={styles.productoConf}>{prod.pr_familia}</Text>
                        <Text style={styles.productoConf}>{prod.pr_nivel1}</Text>
                        <Text style={styles.productoConf}>{prod.pr_nivel2}</Text>
            </View>
            <View style={styles.viewprecio}>
                <Text style={styles.preciompm}>${prod.pr_pvp}</Text>
            </View>
            
        </View>
        <View style={styles.descripcion}>
            <Text style={styles.labelcorta}>Descripción corta:</Text>
            <Text style={styles.viewcorta}>{(texterr == 1) ? utf8.decode(prod.pr_descorta) : prod.pr_descorta}</Text>
        </View>
        <View style={styles.descripcion}>
                <Text style={styles.labelcorta}>Stock: {prod.pr_stock}</Text>
        </View>
        {/*<View style={styles.descripcion}>
        <Text style={styles.labelcorta}>Tipo Precio: <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(tprecio) => setTprecio(tprecio)}
                placeholder={{ label: "Público", value: 4 }}
                items={[
                    { label: "Público", value: 4 },
                ]}
            /></Text>
            <View style={styles.containertext}>
            {
                (visible) ? (
                        <>
                        <Text style={styles.labelcorta}>Ingresa precio personalizado:</Text>
                        <TextInput style={styles.input} 
                        keyboardType='numeric'
                        placeholder='0,0'
                        onChangeText={(val)=> setPrecio(val)}
                        />
                        </>
                   
                ): null
            }
             </View>
        
             <Text style={styles.labelcorta}>Imagen a presentar: <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(value) => setImg(value)}
                placeholder={{ label: "Catalogo", value: 0 }}
                items={[
                    { label: "Personalizada", value: 1 }
                ]}
            /></Text>
            </View>*/}
        <View style={styles.container}>
        <Table borderStyle={{borderWidth: 1}}>
          <Row data={state.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper}>
            <Col data={state.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
            <Rows data={state.tableData} flexArr={[1, 0, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table>
      </View>

      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 1}}>
          <Row data={state2.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper}>
            <Col data={state2.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
            <Rows data={state2.tableData} flexArr={[1, 0, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table>
      </View>
            {/*
      <View style={styles.checkboxContainer}>
        <CheckBox
          checked={check}
          onPress={()=> Selseguro(check)}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Precio con seguro?</Text>
        
            </View>*/}

      {
            (check) ? (tprecio == 1) ? (<View style={styles.container}>
                <Table borderStyle={{borderWidth: 1}}>
                  <Row data={state3.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
                  <TableWrapper style={styles.wrapper}>
                    <Col data={state3.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={state3.tableData} flexArr={[1, 0, 1]} style={styles.row} textStyle={styles.text}/>
                  </TableWrapper>
                </Table>
              </View>) : (tprecio == 2) ? (<View style={styles.container}>
                <Table borderStyle={{borderWidth: 1}}>
                  <Row data={state4.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
                  <TableWrapper style={styles.wrapper}>
                    <Col data={state4.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={state4.tableData} flexArr={[1, 0, 1]} style={styles.row} textStyle={styles.text}/>
                  </TableWrapper>
                </Table>
              </View>) : (tprecio == 3) ? (<View style={styles.container}>
                <Table borderStyle={{borderWidth: 1}}>
                  <Row data={state5.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
                  <TableWrapper style={styles.wrapper}>
                    <Col data={state5.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={state5.tableData} flexArr={[1, 0, 1]} style={styles.row} textStyle={styles.text}/>
                  </TableWrapper>
                </Table>
              </View>) : (tprecio == 4) ? (<View style={styles.container}>
                <Table borderStyle={{borderWidth: 1}}>
                  <Row data={state6.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
                  <TableWrapper style={styles.wrapper}>
                    <Col data={state6.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={state6.tableData} flexArr={[1, 0, 1]} style={styles.row} textStyle={styles.text}/>
                  </TableWrapper>
                </Table>
              </View>) : <Text style={styles.label}>No éxiste información disponible</Text> :  null
        }                

        <View style={styles.styleboton}>
            <Button
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            title='Ficha de producto' 
            onPress={ () => openUrl("https://app.cotzul.com/Catalogo/Presentacion/prod/producto.php?id="+pr_codigo+"&tipo="+tprecio+"&precio="+precio+"&img="+img+"&idvendedor="+codigousu+"&seguro="+valcheck)} 
            />

        </View>
        <View style={styles.styleboton1}>
            <Button
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            title='Copiar Link' 
            onPress={ ()=>copiarLink("https://app.cotzul.com/Catalogo/Presentacion/prod/producto.php?id="+pr_codigo+"&tipo="+tprecio+"&precio="+precio+"&img="+img+"&idvendedor="+codigousu+"&seguro="+valcheck)} 
            />

            

        </View>
       {/* <View style={styles.styleboton1}>
            <Button
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            title='Copiar Link' 
            onPress={ ()=>copiarLink("https://app.cotzul.com/Catalogo/Presentacion/prod/producto.php?id="+pr_codigo+"&tipo="+tprecio+"&precio="+precio+"&img="+img+"&idvendedor="+dataUser.us_codigo+"&seguro="+valcheck)} 
            />

            

        </View>
        <View style={styles.styleboton1}>
            <Button
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            title='Cargar Imagen personalizada' 
            onPress={ ()=>openUrl("https://app.cotzul.com/Catalogo/cargarimagenpersonalizada.php?idvendedor="+dataUser.us_codigo+"&idproducto="+pr_codigo+"&seguro="+valcheck)} 
            />
    </View>*/}
    </ScrollView>
    )
}


async function openUrl(url){
    const isSupported = await Linking.canOpenURL(url);
        if(isSupported){
            await Linking.openURL(url)
        }else{
            Alert.alert('No se encontro el Link');
        }
}

function copiarLink(url){
    Clipboard.setString(url);
    Alert.alert("Link copiado con éxito");
}

const styles2 = StyleSheet.create({
    
  });

const styles = StyleSheet.create({
    viewBody: {
        flex: 1, 
        backgroundColor:"#fff"
    },
    productoTexto:{
        flexDirection: 'row',
       
    },
    viewdetalle:{
        flexDirection: 'column',
        width: 260,
    },
    viewprecio:{
        flexDirection: 'column',
        paddingTop: 30,
        width: 110
    },
    preciompm:{
        fontSize: 20,
        paddingRight: 10,
        textAlign:'right',
        fontWeight: 'bold',
        color: 'grey'
    },
    productoReferencia:{
        paddingTop: 30,
        paddingLeft: 10,
        textAlign: 'left',
        color:'#9462c1',
        fontSize: 25,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    productoCodigo:{
        textAlign: 'left',
        paddingLeft: 10,
        fontSize: 18,
    },
    productoConf:{
        textAlign: 'left',
        paddingLeft: 10,
        paddingTop:2,
        fontSize: 15,
        color: 'grey'
    },
    productoDesc:{
        paddingTop: 10,
    },
    descripcion:{
        paddingLeft: 10,
        paddingTop: 20,
        paddingRight: 10,
    },
    labelcorta:{
        fontSize: 18
    },
    viewcorta:{
        fontSize: 15,
        color: 'grey'
    },
    styleboton:{
        paddingTop: 20,
    },
    styleboton1:{
        paddingTop: 0,
    },
    btnContainerLogin:{
        marginTop: 30, 
        paddingLeft:20,
        paddingBottom: 20,
        width: "95%"
    },
    btnContainerLogin:{
        marginTop: 5, 
        paddingLeft:20,
        paddingBottom: 20,
        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#00a680",
    },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center' },
    containertext:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop:30, 
    },
    input:{
        borderWidth:1, 
        borderColor: '#777',
        padding: 8, 
        margin: 10, 
        width:200, 
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
      },
      checkbox: {
        alignSelf: "center",
      },
      label: {
        margin: 8,
      },
})

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    placeholder: {
        color: 'white',
      },
    inputAndroid: {
        width: 100,
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
};


function defaultValueUser(){
    return{
        us_codigo: 0,
        us_idtipoadm: "0",
        us_nombre: "0",
        us_nomtipoadm: "0"
    }
}

