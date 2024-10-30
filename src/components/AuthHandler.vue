<template>
  <div>
    <p v-if="!user">Redirecting to login...</p>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import { mapState } from 'vuex';
import { mapActions } from 'vuex';

export default {
  name: 'AuthHandler',
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['setUser']),
    initApp() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setUser(user);
          const roomName = window.location.pathname.split('/').pop() || 'default';
          this.$router.push(`/room/${roomName}`);
        } else {
          this.$router.push('/login');
        }
      }, (error) => {
        console.log(error);
      });
    }
  },
  created() {
    this.initApp();
  }
};
</script>
