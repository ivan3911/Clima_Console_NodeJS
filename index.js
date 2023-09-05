
import 'dotenv/config'
import { inquirerMenu,leerInput, listarLugares, pausa  } from './helpers/inquirer.js';
import { Busquedas } from './models/busquedas.js';


const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do{
        opt = await inquirerMenu();

        switch ( opt )
        {
            case 1:
                //Mostrar mensaje
                const termino =  await leerInput('Ciudad: ');
                
                //Buscar lugares
                const lugares =  await busquedas.ciudad( termino );
                
                //Seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                
                const lugarSelecionado = lugares.find( l => l.id === id  );
                
                //Guardar en DB
                busquedas.agregaHistorial( lugarSelecionado.nombre );
            
                //Clima
                 const clima = await busquedas.climaLugar(lugarSelecionado.lat, lugarSelecionado.lng);

                //Mostrar ressultados
                // console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSelecionado.nombre.green );
                console.log('Lat:', lugarSelecionado.lat );
                console.log('Lng:', lugarSelecionado.lng );
                console.log('Temperatura:', clima.temp );
                console.log('Minima:', clima.min );
                console.log('Maxima:', clima.max );
                console.log('Como esta el clima:', clima.desc.green );

            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar } `);
                })

            break;
        }

        if(opt !==  0) await pausa();


    } while ( opt !== 0 );
}


main();