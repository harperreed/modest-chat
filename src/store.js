import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    participants: [],
    isAudioMuted: false,
    isVideoMuted: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setParticipants(state, participants) {
      state.participants = participants;
    },
    toggleAudio(state) {
      state.isAudioMuted = !state.isAudioMuted;
    },
    toggleVideo(state) {
      state.isVideoMuted = !state.isVideoMuted;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    setParticipants({ commit }, participants) {
      commit('setParticipants', participants);
    },
    toggleAudio({ commit }) {
      commit('toggleAudio');
    },
    toggleVideo({ commit }) {
      commit('toggleVideo');
    },
  },
  getters: {
    user: (state) => state.user,
    participants: (state) => state.participants,
    isAudioMuted: (state) => state.isAudioMuted,
    isVideoMuted: (state) => state.isVideoMuted,
  },
});
