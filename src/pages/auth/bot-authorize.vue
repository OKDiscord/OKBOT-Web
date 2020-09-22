<template>
  <div class="main__wrapper">
    <div class="login__container">
      <div class="login__wrapper">
        <FlashMessageWrapper />
        <h1 class="is-size-1">OKBOT</h1>
        <h2 class="is-size-5">Discord Bot</h2>
        <button
          class="button is-medium"
          @click="login"
          :class="{ 'is-primary': !loading, 'is-dark is-loading': loading }"
          v-if="state === 'none'"
        >
          Přihlásit se přes Discord
        </button>

        <div v-else class="loader__wrapper">
          <div class="loader" />
        </div>

        <footer>
          <strong>{{ new Date().getFullYear() }}</strong> &copy; Vottus, SIM7K;
          <a href="https://github.com/OKDiscord">OKDiscord</a> &ndash; Všechna
          práva vyhrazena.
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main__wrapper {
  width: 100vw;
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  background: url("../../assets/img/login-bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .login__container {
    @media (min-width: 960px) {
      margin-right: 10rem;
    }
    .login__wrapper {
      background: rgba(0, 0, 0, 0.42);
      padding: 2rem;
      border-radius: 0.89rem;

      .loader__wrapper {
        background: #222;
        display: inline-block;
        padding: 10px 10px 5px 10px;
        border-radius: 8px;
        margin-bottom: 0;

        .loader {
          display: inline-block;
          font-size: 2rem;
        }
      }
      & > div {
        margin-bottom: 30px;
      }
      h1 {
        margin-bottom: 0;
        line-height: 1;
      }

      h2 {
        margin-bottom: 40px;
      }

      a {
        color: #b23bf0;
      }

      footer {
        margin-top: 40px;
        color: #c1c1c1;
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue"
import FlashMessageWrapper from "@/components/flash/FlashMessageWrapper.vue"
import { FlashMessage } from "@/store"

export default Vue.extend({
  components: {
    FlashMessageWrapper
  },
  mounted() {
    const objectEmpty = (obj: object) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) return false
      }
      return true
    }
    const { query } = this.$route
    if (objectEmpty(query)) return (this.state = "none")

    this.state = "loading"

    if (query.hasOwnProperty("error")) {
      this.state = "none"
      return this.$store.dispatch("flashOneMessage", {
        type: "danger",
        title: `Chyba (${query.error})`,
        message: `Došlo k chybě při přihlašování k Discordu. Chyba: ${query.error_description ??
          "neznámá"}`
      } as FlashMessage)
    }

    if (!query.hasOwnProperty("code")) {
      this.state = "none"
      return this.$store.dispatch("flashOneMessage", {
        type: "danger",
        title: `Chyba (ok_internal_missing_code)`,
        message: "Došlo k chybě při přihlašování k Discordu. Chyba: neznámá"
      } as FlashMessage)
    }
    setTimeout(async () => {
      try {
        const response = await this.$axios.request({
          method: "POST",
          url: "/auth/discord-authorize",
          data: {
            code: query.code
          }
        })
        if (!response.data.success) {
          this.state = "none"
          return this.$store.dispatch("flashOneMessage", {
            type: "danger",
            title: `Došlo k chybě (State: ${response.data.state})`,
            message: response.data.localized
          } as FlashMessage)
        }

        localStorage.setItem("OKSession", response.data.session)
        this.$router.push("/")
      } catch (e) {
        this.state = "none"
        this.$store.dispatch("flashOneMessage", {
          type: "danger",
          title: "Došlo k chybě",
          message: `Došlo k chybě při ověřování OAuth code. Chyba: ${e.message}`
        } as FlashMessage)
      }
    }, Math.random() * 600)
  },
  data: () => ({
    loading: false,
    state: "none" as "none" | "loading"
  }),
  methods: {
    async login() {
      this.$store.dispatch("clearFlash")
      this.loading = true
      setTimeout(async () => {
        try {
          const { data } = await this.$axios.get<{
            success: boolean
            state: "provided"
            url: string
          }>("/auth/discord-url")

          this.loading = false

          if (!data.success || !data.url) {
            this.loading = false
            return this.$store.dispatch("flashOneMessage", {
              type: "danger",
              title: "Došlo k chybě",
              message: `Došlo k chybě při získávání Discord OAuth URL. Chyba: neznámá`
            } as FlashMessage)
          }

          window.location.href = data.url
        } catch (e) {
          this.loading = false
          this.$store.dispatch("flashOneMessage", {
            type: "danger",
            title: "Došlo k chybě",
            message: `Došlo k chybě při získávání Discord OAuth URL. Chyba: ${e.message}`
          } as FlashMessage)
        }
      }, Math.random() * 400)
    }
  }
})
</script>
