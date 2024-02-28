class Tipo {
  constructor(
    cod,
    nombre,
    tipoBase = "-",
    padre = "-",
    dimensiones = "-",
    minimo = "-",
    maximo = "-",
    ambito = "-"
  ) {
    this.cod = cod;
    this.nombre = nombre;
    this.tipoBase = tipoBase;
    this.padre = padre;
    this.dimensiones = dimensiones;
    this.minimo = minimo;
    this.maximo = maximo;
    this.ambito = ambito;
  }

  toString() {
    return `${this.cod} | ${this.nombre} | ${this.tipoBase} | ${this.padre} | ${this.dimensiones} | ${this.minimo} | ${this.maximo} | ${this.ambito}`;
  }
}

class Simbolo {
  constructor(
    linea,
    cod,
    nombre,
    categoria,
    tipo,
    numpar,
    listaPar,
    direccion,
    ambito
  ) {
    this.linea = linea;
    this.cod = cod;
    this.nombre = nombre;
    this.categoria = categoria;
    this.tipo = tipo;
    this.numpar = numpar;
    this.listaPar = listaPar;
    this.direccion = direccion;
    this.ambito = ambito;
  }

  toString() {
    return `${this.linea} | ${this.cod} | ${this.nombre} | ${this.categoria} | ${this.tipo} | ${this.numpar} | ${this.listaPar} | ${this.direccion} | ${this.ambito}`;
  }
}

class TablaTipos {
  constructor() {
    this.tipos = [];
  }

  agregarTipo(tipo) {
    this.tipos.push(tipo);
  }

  logTablaTipos() {
    console.log("Tabla de tipos");
    console.log(
      "Linea | cod | nombre | tipoBase | Padre | Dimensiones |  Mínimo | Maximo | Ambito"
    );
    this.tipos.forEach((tipo) => {
      console.log(tipo.toString());
    });
  }
}

class TablaSimbolos {
  constructor() {
    this.simbolos = [];
    this.direccionActual = 9000;
    this.ambitoActual = 0;
  }

  agregarSimbolo(simbolo) {
    if (simbolo.categoria === "array") {
      const minimo = parseInt(simbolo.listaPar.split(",")[0]);
      const maximo = parseInt(simbolo.listaPar.split(",")[1]);
      this.direccionActual += maximo - minimo + 1;
    } else {
      this.direccionActual++;
    }
    simbolo.direccion = this.direccionActual;
    simbolo.ambito = this.ambitoActual;
    this.simbolos.push(simbolo);
  }

  logTablaSimbolos() {
    console.log("Tabla de símbolos");
    console.log(
      "Linea | Cod | nombre | categoria | tipo | Numpar | ListaPar | Direccion | Ambito"
    );
    this.simbolos.forEach((simbolo) => {
      console.log(simbolo.toString());
    });
  }
}

function cargarDesdeString(stringData) {
  const tablaTipos = new TablaTipos();
  const tablaSimbolos = new TablaSimbolos();

  const contenidoArchivo = stringData;
  const lineas = contenidoArchivo.split("\n");

  lineas.forEach((linea, index) => {
    let partes = linea.trim().split(" ");
    if (partes[0] === "type") {
      const tipoInfo = partes.slice(1).join(" ").split("=");
      const [nombre, descripcion] = tipoInfo;
      const tipo = new Tipo(index, nombre.trim(), descripcion.trim());
      tablaTipos.agregarTipo(tipo);
    } else if (
      partes[0] === "function" ||
      partes[0] === "var" ||
      partes[0] === "procedure" ||
      partes[0] === "array"
    ) {
      const categoria = partes[0];
      const nombre = partes[1];
      let tipo = "";
      if (partes.length > 2) {
        tipo = partes[2];
      }
      const numpar = "0"; // Supongamos que es 0 por ahora
      const listaPar = partes.slice(3).join(","); // Supongamos que los parámetros están después del tipo
      const direccion = "";

      const simbolo = new Simbolo(
        index,
        index,
        nombre,
        categoria,
        tipo,
        numpar,
        listaPar,
        direccion,
        ""
      );
      tablaSimbolos.agregarSimbolo(simbolo);
    }
  });

  return { tablaTipos, tablaSimbolos };
}

export default cargarDesdeString;
