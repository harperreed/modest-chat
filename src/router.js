import Vue from 'vue';
import Router from 'vue-router';
import TopBar from './components/TopBar.vue';
import RemoteMedia from './components/RemoteMedia.vue';
import Login from './components/Login.vue';
import AuthHandler from './components/AuthHandler.vue';
import VideoControls from './components/VideoControls.vue';
import Participant from './components/Participant.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AuthHandler',
      component: AuthHandler
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/room/:roomName',
      name: 'Room',
      components: {
        topbar: TopBar,
        remoteMedia: RemoteMedia,
        videoControls: VideoControls,
        participant: Participant
      }
    }
  ]
});
