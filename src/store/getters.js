const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  username: state => state.user.username,
  user: state => state.user.info,
  ignoreAjaxMessageBox: state => state.user.ignoreAjaxMessageBox
}
export default getters
