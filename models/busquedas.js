const axios = require('axios');
const fs = require('fs');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        /* Leer DB si existe */
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar=>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY || '',
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY || '' ,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            /* Pretición http */
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {

            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            /* Pretición http */
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon}
            });

            const resp = await instance.get();

            return{
                descripcion: resp.data.weather[0].description,
                temp: resp.data.main.temp,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max
            };

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        //prevenir duplicidad
        if( this.historial.includes(lugar.toLocaleLowerCase()) ){
            return;
        }

        this.historial.unshift(lugar.toLocaleLowerCase());

        /* GRABAR EN DB */
        this.guardarDB();
    }

    guardarDB(){
        const payload ={
            historial:this.historial
        }

        fs.writeFileSync(this.dbPath,JSON.stringify(payload))
    }

    leerDB(){
        if( !fs.existsSync(this.dbPath) ){
            return null;
        }

        this.historial= this.historial.splice(0,5);
    
        const info = fs.readFileSync(this.dbPath,{encoding: 'utf-8'});
        const data = JSON.parse(info);
    
        this.historial = data.historial;
    }
}

module.exports = Busquedas;