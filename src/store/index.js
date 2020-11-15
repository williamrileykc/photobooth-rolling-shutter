import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  // ==|== State =================================================================================
  state: {
    videoDevices: [],
    cameraID: undefined,
    picturePreviewReady: false,
  },
  // ==|== Actions ===============================================================================
  actions: {
    setVideoDevices({ commit }, obj) {
      commit("SET_VIDEODEVICES", obj);
    },
    setCameraID({ commit }, obj) {
      commit("SET_CAMERAID", obj);
    },
    setPicturePreviewReady({ commit }, obj) {
      commit("SET_PICTUREPREVIEWREADY", obj);
    },
  },
  // ==|== Mutations =============================================================================
  mutations: {
    SET_VIDEODEVICES(state, obj) {
      state.videoDevices = obj;
    },
    SET_CAMERAID(state, obj) {
      state.cameraID = obj;
    },
    SET_PICTUREPREVIEWREADY(state, obj) {
      state.picturePreviewReady = obj;
    },
  },
  // ==|== Getters ===============================================================================
  getters: {}
});
