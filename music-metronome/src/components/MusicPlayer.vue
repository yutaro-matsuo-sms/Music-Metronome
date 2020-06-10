<template>
  <v-container>
    <div class="music-player">
      <div class="song">
        <img src="@/assets/jackets/IMG_5105.jpg" />
        <h3>流星 -demo-</h3>
        <h3>Unknown</h3>
        <audio src="@/assets/songs/流星 -demo-.mp3" controls></audio>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "MusicPlayer",
  compornents: {},
  data: function() {
    return {
      songs: [
        {
          id: 1,
          name: "流星 -demo-",
          artist: "Unknown",
          img: require("@/assets/jackets/IMG_5105.jpg"),
          song: require("@/assets/songs/流星 -demo-.mp3")
        }
      ]
    };
  }
};
</script>