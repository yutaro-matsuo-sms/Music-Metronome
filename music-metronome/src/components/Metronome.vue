<template>
  <v-container>
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-slider
          ref="pendurumSlider"
          :value="playState.now"
          :min="0"
          :max="scaleLimit"
          readonly
          color="primary"
        />
      </v-flex>
      <v-flex xs12>
        <v-card
          flat
          color="transparent"
        >
          <v-card-title>
            Tempo
          </v-card-title>
          <v-card-text>
            <v-layout
              row
              wrap
              align-center
            >
              <v-flex text-xs-right>
                <v-btn
                  fab
                  small
                  color="secondary"
                  :disabled="isPlaying"
                  @click="stepScaleMinus"
                >
                  <v-icon>
                    remove
                  </v-icon>
                </v-btn>
              </v-flex>
              <v-flex
                text-xs-center
                headline
                grey--text
                text--darken-2
              >
                {{ playCondition.scale }}
              </v-flex>
              <v-flex text-xs-left>
                <v-btn
                  fab
                  small
                  color="secondary"
                  :disabled="isPlaying"
                  @click="stepScalePlus"
                >
                  <v-icon>
                    add
                  </v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card
          flat
          color="transparent"
        >
          <v-card-title>
            <v-checkbox
              label="Beat"
              color="accent"
              :readonly="isPlaying"
              v-model="playCondition.enableBeat"
            />
          </v-card-title>
          <v-card-text>
            <v-layout>
              <v-flex
                offset-xs1 offset-sm4 offset-md3 offset-xl4
              >
                <v-radio-group
                  v-model="playCondition.beat"
                  row
                  :disabled="!playCondition.enableBeat || isPlaying"
                >
                  <v-radio
                    color="secondary"
                    v-for="(item, index) in beatItems"
                    :key="index"
                    :label="item.toString()"
                    :value="item"
                    @click="changeBeat(item)"
                  />
                </v-radio-group>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        text-xs-center
      >
        <template v-if="!isPlaying">
          <v-btn
            dark
            color="primary"
            @click.prevent="startPlay"
          >
            <v-icon>
              music_note
            </v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            dark
            color="accent"
            @click.prevent="stopPlay"
          >
            <v-icon>
              music_off
            </v-icon>
          </v-btn>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Howl } from 'howler'

const scaleRange = {
  min: 40,
  max: 208
}

const beatRange = [2, 3, 4, 6]

const soundUrls = {
  tempo: 'https://firebasestorage.googleapis.com/v0/b/metronomo-22db2.appspot.com/o/admin%2FCastanets01-1.mp3?alt=media&token=cb5d31b2-6c76-4521-adc9-14a39df9e480',
  beat: 'https://firebasestorage.googleapis.com/v0/b/metronomo-22db2.appspot.com/o/admin%2FOnmtp-Inspiration01-1.mp3?alt=media&token=8ec0630c-465d-4be2-947e-166ce5778d8d'
}

export default {
  name: 'Metronome',
  data () {
    return {
      playCondition: {
        scale: 60,
        enableBeat: false,
        beat: 4
      },
      playInterval: null,
      playState: {
        direction: true,
        now: 0,
        limit: 0,
        count: 0
      },
      audio: {
        tempo: null,
        beat: null
      }
    }
  },
  computed: {
    scaleLimit () {
      const allValue = scaleRange.max - scaleRange.min
      const value = this.playCondition.scale - scaleRange.min
      return allValue - value + 1
    },
    beatItems () {
      return beatRange
    },
    isPlaying () {
      return this.playInterval !== null
    }
  },
  methods: {
    stepScale (scale) {
      if (scale < 60) return 2
      if (scale < 72) return 3
      if (scale < 120) return 4
      if (scale < 144) return 6
      return 8
    },
    stepScaleMinus () {
      this.playCondition.scale -= this.stepScale(this.playCondition.scale - 1)

      if (this.playCondition.scale <= scaleRange.min) {
        this.playCondition.scale = scaleRange.min
      }
    },
    stepScalePlus () {
      this.playCondition.scale += this.stepScale(this.playCondition.scale + 1)

      if (this.playCondition.scale >= scaleRange.max) {
        this.playCondition.scale = scaleRange.max
      }
    },
    changeBeat (value) {
      this.playCondition.beat = value
    },
    playSilent (audio) {
      audio.mute(true)
      audio.play()
    },
    prepareAudio () {
      this.playSilent(this.audio.tempo)
      this.playSilent(this.audio.beat)
    },
    playAudio (audio) {
      audio.seek(0)
      audio.mute(false)
      audio.play()
    },
    startPlay () {
      this.prepareAudio()

      this.playState.limit = this.$refs.pendurumSlider.max
      const time = ((60 / this.playCondition.scale) / 2) * 1000

      this.playInterval = setInterval(() => {
        if (this.playState.now === (this.playState.limit / 2)) {
          if ((this.playCondition.enableBeat) && (((this.playState.count + 1) % this.playCondition.beat) === 0)) {
            this.playAudio(this.audio.beat)
          } else {
            this.playAudio(this.audio.tempo)
          }
        }

        if (this.playState.direction) {
          this.playState.now += this.playState.limit / 2
        } else {
          this.playState.now -= this.playState.limit / 2
        }

        let end = false
        if (this.playState.direction) {
          end = (this.playState.now >= this.playState.limit)
        } else {
          end = (this.playState.now <= 0)
        }
        if (end) {
          this.playState.direction = !this.playState.direction
          this.playState.count++
        }
      }, time)
    },
    stopPlay () {
      clearInterval(this.playInterval)

      this.playInterval = null
      this.playState = {
        direction: true,
        now: 0,
        limit: 0,
        count: 0
      }

      this.audio.tempo.stop()
      this.audio.beat.stop()
    }
  },
  mounted () {
    this.audio.tempo = new Howl({ src: [soundUrls.tempo] })
    this.audio.beat = new Howl({ src: [soundUrls.beat] })
  },
  beforeDestroy () {
    this.stopPlay()
  }
}
</script>

<style scoped>
</style>