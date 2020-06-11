<template>
  <v-container>
    <v-layout low, wrap>
      <v-flex xs12>
        <v-card class="mx-auto" max-width="320">
          <v-img height="220px" :src="songs[songIndex].img" />
        </v-card>
        <v-card-text>{{songs[songIndex].name}}</v-card-text>
        <v-card-text>{{songs[songIndex].artist}}</v-card-text>
        <v-card-text>{{toCurrentMs}} / {{toDurationMs}}</v-card-text>
        <v-slider
          v-model="currentTime"
          :label="toCurrentMs"
          :value="currentTime"
          :min="0"
          :max="duration"
          color="primary"
        />
        <v-icon dark color="primary" @click.prevent="prev">mdi-rewind</v-icon>
        <template v-if="!isPlay">
          <v-icon dark color="primary" @click.prevent="play">mdi-play</v-icon>
        </template>
        <template v-else>
          <v-icon dark color="primary" @click.prevent="pause">mdi-pause</v-icon>
        </template>
        <v-icon dark color="primary" @click.prevent="next">mdi-fast-forward</v-icon>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Howl } from "howler";
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
        },
        {
          id: 2,
          name: "1118",
          artist: "Unknown",
          img: require("@/assets/jackets/IMG_3101_Original.jpg"),
          song: require("@/assets/songs/1118.mp3")
        }
      ],
      audio: {
        song: null
      },
      isPlay: false,
      duration: 0,
      currentTime: 0,
      timer: null,
      songIndex: 0
    };
  },
  mounted: function() {
    this.audio.song = new Howl({
      loop: true,
      src: this.songs[this.songIndex].song
    });
    this.audio.song.on("load", () => {
      this.duration = this.audio.song.duration();
    });
    this.audio.song.on("play", () => {
      this.timer = setInterval(() => {
        let seek = this.audio.song.seek();
        this.currentTime = seek;
      }, 200);
    });
    this.audio.song.on("pause", () => {
      clearInterval(this.timer);
      this.isPlay = false;
    });
    this.audio.song.on("sotp", () => {
      clearInterval(this.timer);
      this.isPlay = false;
    });
    this.audio.song.on("end", () => {
      clearInterval(this.timer);
      this.currentTime = 0;
      this.getSongIndex;
      this.isPlay = false;
    });
  },
  methods: {
    playSilent(audio) {
      audio.mute(true);
      audio.play();
    },
    prepareAudio() {
      this.playSilent(this.audio.song);
    },
    playAudio(audio) {
      //audio.seek(this.currentTime);
      audio.mute(false);
      audio.play();
    },
    play() {
      //this.prepareAudio();
      this.playAudio(this.audio.song);
      this.isPlay = true;
    },
    pause() {
      this.audio.song.pause();
      this.isPlay = false;
    },
    prev() {
      this.audio.song.stop();
      this.songIndex -= 1;
      if (this.songIndex < 0) {
        this.songIndex = this.songs.length - 1;
      }
      this.audio.song = new Howl({
        loop: true,
        src: this.songs[this.songIndex].song
      });
      if (this.isPlay) {
        this.play();
      }
    },
    next() {
      this.audio.song.stop();
      this.songIndex += 1;
      if (this.songIndex > this.songs.length - 1) {
        this.songIndex = 0;
      }
      this.audio.song = new Howl({
        loop: true,
        src: this.songs[this.songIndex].song
      });
      if (this.isPlay) {
        this.play();
      }
    },
    padZero(v) {
      if (v < 10) {
        return "0" + Math.ceil(v);
      } else {
        return Math.ceil(v);
      }
    },
    toTime() {
      return this.toCurrentMs() + "/" + this.toDurationMs();
    }
  },
  computed: {
    toCurrentMs() {
      const minutes = ((this.currentTime % 3600) / 60) | 0;
      const second = this.padZero(this.currentTime % 60);
      return minutes + ":" + second;
    },
    toDurationMs() {
      const minutes = ((this.duration % 3600) / 60) | 0;
      const second = this.padZero(this.duration % 60);
      return minutes + ":" + second;
    },
    getSongIndex() {
      if (this.songIndex === this.songs.length - 1) {
        return this.songIndex - this.songIndex;
      }
      return this.songIndex + 1;
    }
  }
};
</script>