<template>
  <div class="container mt-2">
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-primary" @click="leerArchivo()">
        Abrir archivo
      </button>
      <button
        type="button"
        class="btn btn-primary"
        :class="{ disabled: !dataString }"
        @click="saveCurrent()"
      >
        Guardar archivo
      </button>
      <button type="button" class="btn btn-primary" @click="clear()">
        Nuevo archivo
      </button>
    </div>

    <div class="mt-5">
      <label for="exampleInputPassword1" class="form-label">{{
        currentPath || "Nuevo archivo"
      }}</label>
      <textarea
        v-model="dataString"
        class="form-control"
        id="exampleInputPassword1"
        rows="10"
        @change="calcular()"
      ></textarea>
    </div>

    <div class="mt-5">
      <h4>Tabla de tipos</h4>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Cod</th>
              <th scope="col">Nombre</th>
              <th scope="col">Tipo Base</th>
              <th scope="col">Padre</th>
              <th scope="col">Dimensión</th>
              <th scope="col">Mínimo</th>
              <th scope="col">Máximo</th>
              <th scope="col">Ámbito</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tipo, index) in tipos" :key="index">
              <th scope="row">{{ tipo.cod }}</th>
              <th>{{ tipo.nombre }}</th>
              <th>{{ tipo.tipoBase }}</th>
              <th>{{ tipo.padre }}</th>
              <th>{{ tipo.dimensiones }}</th>
              <th>{{ tipo.valorMinimo }}</th>
              <th>{{ tipo.valorMaximo }}</th>
              <th>{{ tipo.ambito }}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-5">
      <h4>Tabla de símbolos</h4>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Cod</th>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Tipo</th>
              <th scope="col">Num Parámetros</th>
              <th scope="col">Lista Parámetros</th>
              <th scope="col">Dirección</th>
              <th scope="col">Ámbito</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(simbolo, index) in simbolos" :key="index">
              <th scope="row">{{ simbolo.cod }}</th>
              <th>{{ simbolo.nombre }}</th>
              <th>{{ simbolo.categoria }}</th>
              <th>{{ simbolo.tipo.nombre }}</th>
              <th>{{ simbolo.numParametros }}</th>
              <th>{{ simbolo.listaParametros }}</th>
              <th>{{ simbolo.direccion }}</th>
              <th>{{ simbolo.ambito }}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
//import analizar from "./util/analyzer";
import analyze from "./util/analyzer2";
import { ipcRenderer } from "electron";

export default {
  name: "App",

  components: {},

  data() {
    return {
      dataString: "",
      tipos: [],
      simbolos: [],
      currentPath: "",
    };
  },

  watch: {
    dataString() {
      this.calcular();
    },
  },

  methods: {
    clear() {
      this.currentPath = "";
      this.dataString = "";
    },

    calcular() {
      // const resultado = analizar(this.dataString);
      // this.tipos = resultado.tablaTipos.tipos;
      // this.simbolos = resultado.tablaSimbolos.simbolos;

      const result = analyze(this.dataString);
      this.tipos = result.tablaTipos;
      this.simbolos = result.tablaSimbolos;
      console.log({ simbolos: this.simbolos });
    },

    async leerArchivo() {
      const filedata = await ipcRenderer.invoke("readFile");
      if (!filedata) return;
      this.currentPath = filedata.path;
      this.dataString = filedata.content || "";
    },

    async saveCurrent() {
      await ipcRenderer.invoke("saveFile", {
        path: this.currentPath,
        content: this.dataString,
      });
    },
  },
};
</script>

<style></style>
