<template>
  <div id="topbar" class="fixed top-0 left-0 w-full bg-gray-800 text-white flex items-center justify-between p-4">
    <div class="local" id="local-media"></div>
    <div class="controls flex space-x-4">
      <i id="logout" class="action fa fa-sign-out-alt cursor-pointer" @click="logout"></i>
      <i id="audioToggle" class="action fa fa-volume-down cursor-pointer" :class="{ 'fa-volume-mute': isAudioMuted, 'fa-volume-down': !isAudioMuted }" @click="toggleAudio"></i>
      <i id="videoToggle" class="action fa fa-video cursor-pointer" :class="{ 'fa-video-slash': isVideoMuted, 'fa-video': !isVideoMuted }" @click="toggleVideo"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAudioMuted: false,
      isVideoMuted: false,
    };
  },
  methods: {
    logout() {
      this.$emit('logout');
    },
    toggleAudio() {
      this.isAudioMuted = !this.isAudioMuted;
      this.$emit('toggle-audio', this.isAudioMuted);
    },
    toggleVideo() {
      this.isVideoMuted = !this.isVideoMuted;
      this.$emit('toggle-video', this.isVideoMuted);
    },
  },
};
</script>

<style scoped>
#topbar {
  width: 24rem;
  height: 18.75rem;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 10000;
  border: 0;
  background: #333;
}

.controls {
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  z-index: 15;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
}

.action {
  font-weight: bolder;
  color: #000;
  margin: auto;
}

.action:hover {
  font-weight: bolder;
  color: #444;
}

.active {
  color: red;
}

.active:hover {
  color: #444;
}

#local-media {
  z-index: 10;
  width: 24rem;
  height: 18.75rem;
  top: 0;
  left: 0;
}

#local-media video {
  max-width: 100%;
  max-height: 100%;
  border: none;
}
</style>
