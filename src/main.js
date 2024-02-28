import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
// eslint-disable-next-line no-unused-vars
import * as bootstrap from "bootstrap";

createApp(App).use(store).mount("#app");
