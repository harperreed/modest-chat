<template>
  <div class="container mx-auto text-center py-8">
    <h1 class="text-3xl font-bold mb-4">Login to chat</h1>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
  </div>
  <footer class="fixed bottom-0 w-full text-center py-2 bg-gray-800 text-white">
    fork it on <a href="https://github.com/harperreed/modest-chat" class="text-blue-400">github</a>
  </footer>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';

export default {
  name: 'Login',
  mounted() {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          return true;
        },
        signInFailure: (error) => {
          return handleUIError(error);
        },
        uiShown: () => {
          document.getElementById('loader').style.display = 'none';
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
      queryParameterForWidgetMode: 'mode',
      queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true
        }
      ],
      immediateFederatedRedirect: false,
      tosUrl: 'tos.html',
      privacyPolicyUrl: () => {
        window.location.assign('privacy.html');
      }
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }
};
</script>

<style scoped>
body {
  padding-top: 10rem;
  padding-bottom: 10rem;
  background-color: #f7fafc;
}

.container {
  text-align: center;
}

footer {
  position: fixed;
  bottom: 0;
  text-align: center;
  font-family: sans-serif;
  font-size: 0.875rem;
  padding-bottom: 0.625rem;
  width: 100%;
  background-color: #2d3748;
  color: #fff;
}
</style>
