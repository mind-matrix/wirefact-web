export const state = () => ({
  token: null,
  user: null
})

export const mutations = {
  auth (state: { token: any; user: any }, { user, token }: any) {
    state.token = token
    state.user = user
  },
  deauth(state: { token: null; user: null }) {
    state.token = null
    state.user = null
  }
}
