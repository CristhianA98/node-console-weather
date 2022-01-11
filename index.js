require('dotenv').config();/* Variables de entorno */

const { leerInput, pausa, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
let colors = require('colors/safe');


/* console.log(process.env.MAPBOX_KEY); */

const main = async () => {
    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                /* Solicitar Ciudad por teclado */
                const busqueda = await leerInput('Ciudad: ');
                /* REGRESA LUGARES */
                const lugares =  await busquedas.ciudad(busqueda);
                /* LISTA LOS LUGARES BUSCADOS */
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === '0') continue;
                const lugarSeleccionado = lugares.find(l=> l.id === idSeleccionado);


                /* GUARDAR EN DB */
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                /* CLIMA */
                const mostrarClima = await busquedas.climaLugar(lugarSeleccionado.lat,lugarSeleccionado.lng);

                /* Mostrar Resultado */
                console.log(colors.green('\nInformación de la Ciudad\n'));
                console.log(`Ciudad: ${lugarSeleccionado.nombre}`);
                console.log(`Lat: ${lugarSeleccionado.lat}`);
                console.log(`Lng: ${lugarSeleccionado.lng}`);
                console.log(`Descripcion: ${mostrarClima.descripcion}`);
                console.log(`Descripcion: ${mostrarClima.temp}`);
                console.log(`Mínima: ${mostrarClima.min}`);
                console.log(`Máxima: ${mostrarClima.max}`);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i)=>{
                    const idx = `${i+1}`;
                    console.log(`${idx}. ${lugar}`);
                })

                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0);
}

main();
