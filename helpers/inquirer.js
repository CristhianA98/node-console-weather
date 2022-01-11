const inquirer = require('inquirer');
let colors = require('colors/safe');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${colors.green('1.')} Buscar Ciudad`
            },
            {
                value: 2,
                name:  `${colors.green('2.')} Historial`
            },
            {
                value: 0,
                name: `${colors.green('3.')} Salir`
            }
        ]
    }
];

const listarLugares = async( lugares = [] )=>{
    const choices = lugares.map((lugar, id) =>{
        let idx = id+1;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({ /* Ingresar elemento al último */
        value: '0',
        name: '0. CANCELAR'
    });

    const preguntas =[
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Lugar',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);

    return id;
}

const confirmar = async(message) =>{
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const {ok} = await inquirer.prompt(question);

    return ok;
}

const inquirerMenu = async()=> {
    console.clear();
    console.log(colors.green("==============================="));
    console.log(colors.white("     SELECCIONE UNA OPCIÓN"));
    console.log(colors.green("===============================\n"));

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

const pausa = async()=> {
    const questions = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${colors.green('enter')} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(questions);
}

const leerInput = async(message)=>{
    const questions =[
        {
            type:'input',
            name:'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Ingrese un valor'
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(questions);
    return desc;
}

const mostrarListadoChecklist = async( tareas = [] )=>{
    const choices = tareas.map((tarea, id) =>{
        let idx = id+1;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn)? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ];

    const { ids } = await inquirer.prompt(pregunta);

    return ids;
}




module.exports={
    inquirerMenu,
    pausa,
    leerInput,
    confirmar,
    mostrarListadoChecklist,
    listarLugares
}