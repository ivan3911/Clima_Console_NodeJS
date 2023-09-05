import fs from  'fs'
import axios from 'axios'

class Busquedas{
    historial = ['Tegucigalpa','Madrid','San Jose'];
    dbPath = './db/database.json';

    constructor(){
        this.leerBD();
    }

    get historialCapitalizado(){
       return this.historial.map( lugar => {

        let palabras =  lugar.split(' ');
        palabras = palabras.map(p => p[0].toUpperCase() +  p.substring(1));
        
        return palabras.join(' ')

       })
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramsOpenWeatherMap (){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        }

    }

    async ciudad(lugar = '' ) {

        try {
            
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });


            const resp =  await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
    

        } catch (error) {
            return [];    
        }
    }

    async  climaLugar (lat, lon) {

        try {

            //instance de axios.create()
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeatherMap, lat,lon}
            });

            const resp =  await instance.get();

            const {weather, main} = resp.data;
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    agregaHistorial( lugar = '' ){
     
        if ( this.historial.includes( lugar.toLowerCase() ) ) {
            return;
        }

        this.historial = this.historial.splice(0,4);
        this,this.historial.unshift( lugar.toLowerCase() );

        //Grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }

    leerBD(){
        
        if ( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        
        const data = JSON.parse( info );

        this.historial= data.historial;


    }
}





export {
    Busquedas,
}