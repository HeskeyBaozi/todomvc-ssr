import Vue from "vue";
import MuseUI from "muse-ui";
import "./assets/icon.css";
import "./assets/css.css";
import "muse-ui/dist/muse-ui.css";
import "muse-ui/dist/theme-carbon.css";
import {store} from './store';
import App from "./App.vue";
import router from "./router";

Vue.use(MuseUI);
Vue.config.productionTip = false;


const vm: Vue = new Vue({
    router,
    store,
    render: h => h(App)
});

vm.$mount('#app');
