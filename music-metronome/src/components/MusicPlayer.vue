<template>
  <v-container>
    <v-layout low, wrap>
      <v-flex xs12>
        <v-card class="mx-auto" max-width="320">
          <v-img height="220px" src="@/assets/jackets/IMG_5105.jpg" />
        </v-card>
        <v-card-text>流星 -demo-</v-card-text>
        <v-card-text>Unknown</v-card-text>
        <audio src="@/assets/songs/流星 -demo-.mp3" controls></audio>
      </v-flex>
    </v-layout>
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