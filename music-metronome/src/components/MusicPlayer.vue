<template>
  <v-container>
    <v-layout low, wrap>
      <v-flex xs12>
        <v-card class="mx-auto" max-width="320">
          <v-img height="220px" :src="songs[songIndex].img" />
        </v-card>
        <v-card-text>{{songs[songIndex].name}}</v-card-text>
        <v-card-text>{{songs[songIndex].artist}}</v-card-text>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center justify-center>
      <v-flex text-md-right>
        <v-card-text>{{toCurrentMs}} / {{toDurationMs}}</v-card-text>
        <v-slider v-model="currentTime" @end="changeSeek" :min="0" :max="duration" color="primary" />
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex text-md-right>
        <v-icon x-large dark color="primary" @click.prevent="prev">mdi-rewind</v-icon>
      </v-flex>
      <v-flex text-md-center>
        <template v-if="!isPlay">
          <v-icon x-large dark color="primary" @click.prevent="play">mdi-play</v-icon>
        </template>
        <template v-else>
          <v-icon x-large dark color="primary" @click.prevent="pause">mdi-pause</v-icon>
        </template>
      </v-flex>
      <v-flex text-md-left>
        <v-icon x-large dark color="primary" @click.prevent="next">mdi-fast-forward</v-icon>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex text-xs-right>
        <v-slider
          v-model="audioVol"
          append-icon="mdi-volume-high"
          prepend-icon="mdi-volume-low"
          :min="0"
          :max="100"
        />
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
        <v-flex text-md-right>
          <v-icon dark color="primary" @click.prevent="showPlayList">mdi-format-list-bulleted</v-icon>
        </v-flex>
        <v-flex text-md-center>
          <template v-if="!songs[songIndex].isFav">
            <v-icon dark color="primary" @click.prevent="changeFavorite">mdi-heart-outline</v-icon>
          </template>
          <template v-else>
            <v-icon dark color="primary" @click.prevent="changeFavorite">mdi-heart</v-icon>
          </template>
        </v-flex>
        <v-flex text-md-left>
          <v-icon dark color="primary" @click.prevent="addPlayList">mdi-playlist-plus</v-icon>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Howl, Howler } from "howler";
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
          song: require("@/assets/songs/流星 -demo-.mp3"),
          isFav: false
        },
        {
          id: 2,
          name: "1118",
          artist: "Unknown",
          img: require("@/assets/jackets/IMG_3101_Original.jpg"),
          song: require("@/assets/songs/1118.mp3"),
          isFav: false
        }
      ],
      audio: {
        song: null
      },
      isPlay: false,
      duration: 0,
      currentTime: 0,
      timer: null,
      songIndex: 0,
      audioVol: 100
    };
  },
  mounted: function() {
    this.audio.song = new Howl({
      src: this.songs[this.songIndex].song,
      volume: this.toVol
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
      this.songIndex += 1;
      this.audio.song = new Howl({
        src: this.songs[this.songIndex].song,
        volume: this.toVol,
        onload: () => {
          this.duration = Howler.duration();
        }
      });
      this.play();
      this.isPlay = true;
    });
  },
  methods: {
    playChangeSeek(seek) {
      this.audio.song.seek(seek).mute(false);
      if (this.isPlay) {
        this.audio.song.play();
      }
    },
    playAudio(audio) {
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
        src: this.songs[this.songIndex].song,
        volume: this.toVol
      });
      if (this.isPlay) {
        this.audio.song.play();
      }
    },
    next() {
      this.audio.song.stop();
      this.songIndex += 1;
      if (this.songIndex > this.songs.length - 1) {
        this.songIndex = 0;
      }
      this.audio.song = new Howl({
        src: this.songs[this.songIndex].song,
        volume: this.toVol
      });
      this.audio.song.on("load", () => {
        this.duration = this.audio.song.duration();
      });
      if (this.isPlay) {
        this.audio.song.play();
      }
    },
    changeSeek(seek) {
      this.audio.song.stop();
      this.playChangeSeek(seek);
    },
    changeFavorite() {
      console.log(this.songs[this.songIndex].isFav);
      return this.songs[this.songIndex].isFav = !this.songs[this.songIndex].isFav
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
      let minutes = ((this.currentTime % 3600) / 60) | 0;
      const second = this.padZero(this.currentTime % 60);
      if (second === "60") {
        return parseInt(minutes) + 1 + ":" + "00";
      }
      return minutes + ":" + second;
    },
    toDurationMs() {
      let minutes = ((this.duration % 3600) / 60) | 0;
      const second = this.padZero(this.duration % 60);
      if (second === 60) {
        return parseInt(minutes) + 1 + ":" + "00";
      }
      return minutes + ":" + second;
    },
    getSongIndex() {
      if (this.songIndex === this.songs.length - 1) {
        return this.songIndex - this.songIndex;
      }
      return this.songIndex + 1;
    },
    toVol() {
      return this.audioVol / 100;
    }
  },
  watch: {
    audioVol: function(vol) {
      Howler.volume(vol / 100);
    }
  }
};
</script>