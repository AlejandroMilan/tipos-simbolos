class Tipo {
  constructor(
    cod,
    nombre,
    tipoBase,
    padre,
    dimensiones,
    valorMinimo,
    valorMaximo,
    ambito
  ) {
    this.cod = cod;
    this.nombre = nombre;
    this.tipoBase = tipoBase;
    this.padre = padre;
    this.dimensiones = dimensiones;
    this.valorMinimo = valorMinimo;
    this.valorMaximo = valorMaximo;
    this.ambito = ambito == "global" ? 0 : ambito;
  }
}

// Crear una lista de tipos
let tablaTipos = [];

// Función para agregar un nuevo tipo a la tabla
function agregarTipo(
  cod,
  nombre,
  tipoBase,
  padre,
  dimensiones,
  valorMinimo,
  valorMaximo,
  ambito
) {
  let nuevoTipo = new Tipo(
    cod,
    nombre,
    tipoBase,
    padre,
    dimensiones,
    valorMinimo,
    valorMaximo,
    ambito
  );
  tablaTipos.push(nuevoTipo);
}

// Agregar tipos predefinidos
agregarTipo(1, "int", "int", null, null, null, null, "global");
agregarTipo(2, "long", "long", null, null, null, null, "global");
agregarTipo(3, "short", "short", null, null, null, null, "global");
agregarTipo(4, "byte", "byte", null, null, null, null, "global");
agregarTipo(5, "float", "float", null, null, null, null, "global");
agregarTipo(6, "double", "double", null, null, null, null, "global");
agregarTipo(7, "char", "char", null, null, null, null, "global");
agregarTipo(8, "bool", "bool", null, null, null, null, "global");
agregarTipo(9, "string", "char", "string", null, null, null, "global"); // "string" es hijo de "char"
agregarTipo(10, "Object", "Object", null, null, null, null, "global");
agregarTipo(11, "Function", "Function", null, null, null, null, "global");

// Definir una clase para representar cada símbolo
class Simbolo {
  constructor(
    linea,
    cod,
    nombre,
    categoria,
    tipoCod,
    numParametros,
    listaParametros,
    direccion,
    ambito
  ) {
    this.linea = linea;
    this.cod = cod;
    this.nombre = nombre;
    this.categoria = categoria;
    this.tipo = tipoCod; // Se asignará en la función agregarSimbolo
    this.numParametros = numParametros;
    this.listaParametros = listaParametros;
    this.direccion = direccion;
    this.ambito = ambito;
  }
}

// Crear una lista de símbolos
let tablaSimbolos = [];

// Función para agregar un nuevo símbolo a la tabla
function agregarSimbolo(
  linea,
  cod,
  nombre,
  categoria,
  tipoCod,
  numParametros,
  listaParametros,
  direccion,
  ambito
) {
  // Buscar el tipo correspondiente en la tabla de tipos
  let tipo = tablaTipos.find((tipo) => tipo.cod === tipoCod);
  console.log({ tipo, tipoCod, tablaTipos });
  if (!tipo) {
    console.error(
      `Tipo con código ${tipoCod} no encontrado en la tabla de tipos.`
    );
    return;
  }

  console.log({ tipoSimbolo: tipo });

  let nuevoSimbolo = new Simbolo(
    linea,
    cod,
    nombre,
    categoria,
    tipo,
    numParametros,
    listaParametros,
    direccion,
    ambito
  );
  tablaSimbolos.push(nuevoSimbolo);
}

function analizarCodigoFuente(codigoFuente) {
  tablaSimbolos = [];
  tablaTipos = tablaTipos.slice(0, 11);
  // Dividir el código en líneas
  let lineas = codigoFuente.split("\n");
  // Buscar clases y declaraciones de variables en cada línea

  let ambito = 0;

  lineas.forEach((linea, index) => {
    if (linea.includes("{")) ambito += 1;
    if (linea.includes("}")) ambito -= 1;

    if (linea.includes("void")) {
      const partes = linea.split(" ");
      const nombre = partes[partes.length - 1].replace("()", "");
      console.log({ nombre });

      agregarSimbolo(
        index + 1,
        tablaSimbolos.length + 1,
        nombre,
        "Function",
        11,
        null,
        null,
        9000 + index,
        ambito
      );

      return;
    }

    if (linea.includes("class")) {
      // Extraer el nombre de la clase y agregar un nuevo tipo como hijo de "Object"
      let nombreClase = linea.split(" ")[1];
      let tipoPadre = tablaTipos.find((tipo) => tipo.nombre === "Object");
      if (!tipoPadre) {
        console.error(
          "No se encontró el tipo padre 'Object' en la tabla de tipos."
        );
        return;
      }
      let nuevoTipo = new Tipo(
        tablaTipos.length + 1,
        nombreClase,
        "Object",
        "Object",
        null,
        null,
        null,
        ambito
      );
      tablaTipos.push(nuevoTipo);
      console.log(
        `Se agregó un nuevo tipo '${nombreClase}' como hijo de 'Object'.`
      );
    } else if (linea.includes("=")) {
      // Es una declaración de variable, extraer el tipo y el nombre de la variable
      let partes = linea.trim().split(" ");
      let tipoVariable = partes[0];
      let nombreVariable = partes[1].split("=")[0];
      // Buscar el tipo en la tabla de tipos
      let tipo = tablaTipos.find((tipo) => tipo.nombre === tipoVariable);
      if (!tipo) {
        console.error(
          `Tipo '${tipoVariable}' no encontrado en la tabla de tipos.`
        );
        return;
      }

      console.log({ tipo });
      // Agregar un nuevo símbolo con el tipo detectado automáticamente
      agregarSimbolo(
        index + 1,
        tablaSimbolos.length + 1,
        nombreVariable,
        "variable",
        tipo.cod,
        null,
        null,
        9000 + index,
        ambito
      );
      console.log(
        `Se agregó un nuevo símbolo '${nombreVariable}' de tipo '${tipoVariable}'.`
      );
    }
  });
}

const cargarDesdeString = (string) => {
  // Analizar el código fuente para agregar nuevos tipos y símbolos
  analizarCodigoFuente(string);
  return { tablaSimbolos, tablaTipos };
};

export default cargarDesdeString;
