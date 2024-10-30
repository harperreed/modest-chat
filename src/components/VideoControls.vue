<template>
  <div class="video-controls">
    <button @click="toggleAudio">{{ isAudioMuted ? 'Unmute Audio' : 'Mute Audio' }}</button>
    <button @click="toggleVideo">{{ isVideoMuted ? 'Unmute Video' : 'Mute Video' }}</button>
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
.video-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
