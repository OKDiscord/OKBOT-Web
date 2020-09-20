import { VueConstructor } from "vue/types/umd"
import axios from "axios"

export class OKInstall {
  install(Vue: VueConstructor<Vue>) {
    const Axios = axios
    Axios.defaults.baseURL =
      process.env.NODE_ENV === "development"
        ? "http://89.176.241.227:4000"
        : "https://backend.okeyko.eu"

    Vue.prototype.$axios = Axios
  }
}
