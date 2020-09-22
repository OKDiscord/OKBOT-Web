<template>
  <div>
      <div></div>

  </div>
</template>

<script lang="ts">
import { flashOneMessage } from "@/app/functions/flash"
import { objectEmpty } from "@/app/functions/misc"
import Vue from "vue"
export default Vue.extend({
  mounted() {
    const { query } = this.$route
    if (objectEmpty(query)) return (this.loading = false)

    this.loading = true

    if (query.hasOwnProperty("error")) {
      this.loading = false
      return flashOneMessage({
        type: "danger",
        title: `Chyba (${query.error})`,
        message: `Došlo k chybě při přihlašování k Discordu. Chyba: ${query.error_description ??
          "neznámá"}`
      })
    }

    if (!query.hasOwnProperty("code")) {
      this.loading = false
      return flashOneMessage({
        type: "danger",
        title: `Chyba (ok_internal_missing_code)`,
        message: "Došlo k chybě při přihlašování k Discordu. Chyba: neznámá"
      })
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
          this.loading = false
          return flashOneMessage({
            type: "danger",
            title: `Došlo k chybě (State: ${response.data.state})`,
            message: response.data.localized
          })
        }

        // TODO: do stuff
      } catch (e) {
        this.loading = false
        flashOneMessage({
          type: "danger",
          title: "Došlo k chybě",
          message: `Došlo k chybě při ověřování OAuth code. Chyba: ${e.message}`
        })
      }
    }, Math.random() * 600)
  },
  data: () => ({
    loading: false
  })
})
</script>
