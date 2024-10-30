<template>
  <div id="remote-media" class="flex flex-wrap justify-center mt-20">
    <div
      v-for="participant in participants"
      :key="participant.id"
      :id="participant.id"
      class="participant non-dominant"
    >
      <div class="status">
        <span class="audio" v-if="participant.isAudioMuted">
          <i class="fa fa-volume-mute"></i>
        </span>
        <span class="video" v-if="participant.isVideoMuted">
          <i class="fa fa-video-slash"></i>
        </span>
      </div>
      <div class="info">
        <div class="name">{{ participant.name }}</div>
      </div>
      <div class="media">
        <video
          v-if="participant.videoTrack"
          :srcObject="participant.videoTrack"
          autoplay
          playsinline
        ></video>
        <img
          v-else
          src="https://via.placeholder.com/640x480"
          alt="No video available"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    participants: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
#remote-media {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  height: 43%;
  width: 100%;
  background-color: #fff;
  text-align: center;
  margin: auto;
  align-items: baseline;
  align-content: center;
}

.participant {
  flex: flex-grow;
  margin: auto;
  position: relative;
}

.non-dominant {
  border: 1px solid #666;
  color: #fff;
}

.dominant {
  border: 1px solid red;
  color: red;
}

.info {
  bottom: 0;
  position: absolute;
  text-align: center;
  font-weight: bolder;
  width: 100%;
  color: #fff;
  mix-blend-mode: difference;
}

.status {
  top: 0;
  position: absolute;
  text-align: center;
  font-weight: bolder;
  width: 100%;
  color: red;
  mix-blend-mode: difference;
}

.status .audio {
  margin-left: 0.625rem;
  margin-right: 0.625rem;
}

.status .video {
  margin-left: 0.625rem;
  margin-right: 0.625rem;
}

.info .name {
  margin: auto;
}

.media img {
  width: 100%;
  height: 100%;
}

.media video {
  background-color: lightgrey !important;
  width: 100%;
  height: 100%;
}

/* Add styles to support dynamic resizing of video elements */
.participant {
  transition: width 0.5s, height 0.5s;
}

/* Ensure video elements are large and centered for one-on-one calls */
.one-on-one .participant {
  width: 80%;
  height: 80%;
  margin: auto;
}

/* Ensure video elements resize to fit all participants for group calls */
.group-call .participant {
  width: calc(100% / var(--num-participants));
  height: auto;
  margin: 0.5%;
}
</style>
