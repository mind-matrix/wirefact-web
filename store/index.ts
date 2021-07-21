export const state = () => ({
  token: null,
  user: null,
  favourites: []
})

export const mutations = {
  auth (state: { token: any; user: any }, { user, token }: any) {
    state.token = token
    state.user = user
  },
  deauth(state: { token: null; user: null }) {
    state.token = null
    state.user = null
  },
  toggleFav(state: { favourites: string[] }, id: string) {
    if (state.favourites.includes(id)) state.favourites = state.favourites.filter(item => item !== id)
    else state.favourites.push(id)
  }
}
