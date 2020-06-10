<template>
  <v-app>
    <v-toolbar
      dark
      color="primary"
    >
      <v-toolbar-title white--text>
        Music Metronome
      </v-toolbar-title>
    </v-toolbar>
    <v-card class="transparent">
      <v-container
        fluid
        grid-list-xs
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12 md6 lg4 xl4
            offset-md3 offset-lg4 offset-xl4
          >
            <v-card>
              <v-card-text>
                <MusicPlayer />
                <Metronome />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-footer
      color="info"
    >
      <v-layout text-xs-center>
        <v-flex
          class="soundLink"
          grey--text
          text--lighten-3
        >
          Sound by
          <strong>
            <a href="http://musicisvfr.com" target="_blank">
              Music is VFR
            </a>
          </strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Metronome from '@/components/Metronome'
import MusicPlayer from '@/components/MusicPlayer'
export default {
  name: 'Home',
  components: {
    'Metronome': Metronome,
    'MusicPlayer': MusicPlayer,
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .soundLink a {
    color: white
  }
</style>