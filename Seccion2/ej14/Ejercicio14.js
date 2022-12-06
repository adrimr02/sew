
class AudioManager {
  constructor() {
    this.audioElement = document.querySelector('audio')
    this.basicControls = new AudioControls(this.audioElement)
    this.volumeControl = document.querySelector('input[name=volume]')
    this.panControl = document.querySelector('input[name=panning]')
    this.audioContext = null
    this.track = null
    this.volumeNode = null
    this.panNode = null
    this.createEvents()
  }

  createEvents() {
    document.querySelector('button[name=play]').addEventListener('click', this.play.bind(this))
    this.volumeControl.addEventListener('input', this.changeVolume.bind(this))
    this.panControl.addEventListener('input', this.changePanning.bind(this))
  }

  loadAudio(url) {
    document.querySelector('source').setAttribute('src', url)
    this.audioElement.load()
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.basicControls.updateControls()
    })
    this.volumeControl.disabled = false
    this.panControl.disabled = false
    this.initAudioCtx()
  }

  initAudioCtx() {
    if (!this.audioContext)
      this.audioContext = new AudioContext()

    if (!this.volumeNode)
      this.volumeNode = new GainNode(this.audioContext)

    if (!this.panNode)
      this.panNode = new StereoPannerNode(this.audioContext, { pan: 0 })

    if (!this.track) {
      this.track = new MediaElementAudioSourceNode(this.audioContext, {
        mediaElement: this.audioElement
      })
  
      this.track.connect(this.volumeNode).connect(this.panNode).connect(this.audioContext.destination)
    }
  }

  play() {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  changeVolume() {
    document.querySelector('p:nth-child(6) span').innerText = Math.floor(this.volumeControl.value / 2 * 100) + '%'
    this.volumeNode.gain.value = this.volumeControl.value
  }

  changePanning() {
    this.panNode.pan.value = this.panControl.value
  }

}

class AudioControls {
  constructor(audioElement) {
    this.currentTime = document.querySelector('p span:nth-child(2)')
    this.totalTime = document.querySelector('p span:nth-child(4)')
    this.timeLine = document.querySelector('input[name=timeline]')
    this.playBtn = document.querySelector('button[name=play]')
    this.pauseBtn = document.querySelector('button[name=pause]')
    this.restartBtn = document.querySelector('button[name=restart]')
    this.audioElement = audioElement
    this.raf = null
    this.createEvents()
  }

  createEvents() {
    this.timeLine.addEventListener('input', this.seekTime.bind(this))
    this.timeLine.addEventListener('change', this.changeTime.bind(this))
    this.playBtn.addEventListener('click', this.play.bind(this))
    this.pauseBtn.addEventListener('click', this.pause.bind(this))
    this.restartBtn.addEventListener('click', this.restart.bind(this))
    this.audioElement.addEventListener('ended', this.endedAudio.bind(this))
    document.addEventListener('keypress', this.handleKeyEvents.bind(this))
  }

  #parseTime(secs) {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`
  }

  setControls() {
    this.playBtn.disabled = false
    this.pauseBtn.disabled = true
    this.restartBtn.disabled = true
    this.totalTime.innerText = this.#parseTime(this.audioElement.duration)
    this.timeLine.disabled = false
    this.timeLine.max = Math.floor(this.audioElement.duration)
    this.timeLine.value = 0
    this.currentTime.innerText = '0:00'
  }

  updateControls() {
    this.setControls()
  }

  endedAudio() {
    this.restart()
    this.pause()
  }

  /**
   * Crea la animacion de movimiento de la barra de tiempo
   */
  whileAudioPlaying() {
    this.timeLine.value = Math.floor(this.audioElement.currentTime)
    this.currentTime.innerText = this.#parseTime(this.audioElement.currentTime)
    this.raf = requestAnimationFrame(this.whileAudioPlaying.bind(this))
  }

  play() {
    this.audioElement.play()
    requestAnimationFrame(this.whileAudioPlaying.bind(this))
    this.playBtn.disabled = true
    this.pauseBtn.disabled = false
    this.restartBtn.disabled = false
  }

  pause() {
    this.audioElement.pause()
    cancelAnimationFrame(this.raf)
    this.pauseBtn.disabled = true
    this.playBtn.disabled = false
  }

  restart() {
    this.audioElement.currentTime = 0
  }

  seekTime() {
    this.currentTime.innerText = this.#parseTime(this.timeLine.value)
    if (!this.audioElement.paused) {
      // Impide que la barra de tiempo se actualice cuando el usuario la mueve si el audio se está reproduciendo
      cancelAnimationFrame(this.raf) 
    }
  }
  
  changeTime() {
    this.audioElement.currentTime = this.timeLine.value
    if (!this.audioElement.paused) {
      // Una vez el usuario ha movido la barra de tiempo la animacion se vuelve a activar
      requestAnimationFrame(this.whileAudioPlaying.bind(this))
    }
  }

  handleKeyEvents(e) {
    if (this.audioElement) {
      switch (e.key) {
        case 'k':
        case 'K':
        case ' ':
          if (this.audioElement.paused)
            this.play()
          else
            this.pause()
          break
        case 'j':
        case 'J':
          if (this.audioElement.currentTime >= 5)
            this.audioElement.currentTime -= 5
          else 
            this.audioElement.currentTime = 0
          break;
        case 'l':
        case 'L':
          if (this.audioElement.currentTime <= this.audioElement.duration + 5)
            this.audioElement.currentTime += 5
          else 
            this.audioElement.currentTime = this.audioElement.duration
          break;
        case 'r':
        case 'R':
          this.restart()
      }
    }
  }

}



class LocalFileReader {
  constructor() {
    this.checkNavigator()
  }

  checkNavigator() {
    if (window.File)
      document.querySelector('input[type=file]').disabled = false
    else
      document.querySelector('main').innerHTML(`<p>Este navegador no soporta la API File de HTML5 por lo que la aplicacion no funcionará correctametne</p>`)
  }

  readFile(file) { 
    if (file) 
      if (file.type.match('audio/*')) {
        audioManager.loadAudio(URL.createObjectURL(file))
      }
      else {
        output.innerHTML += `<p>Solo se permiten archivos de audio</p>`
      }
  }

  dropEvent(e) {
    e.preventDefault()
    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file.type.match('audio/*')) {
            audioManager.loadAudio(URL.createObjectURL(file))
          }
          else {
            output.innerHTML += `<p>Solo se permiten archivos de audio</p>`
          }
        }
      });
    } else {
      [...e.dataTransfer.files].forEach((file) => {
        if (file.type.match('audio/*')) {
          audioManager.loadAudio(URL.createObjectURL(file))
        }
        else {
          output.innerHTML += `<p>Solo se permiten archivos de audio</p>`
        }
      });
    }
  }

  dragOverEvent(e) {
    e.preventDefault()
  }

}

const fileReader = new LocalFileReader()
const audioManager = new AudioManager();