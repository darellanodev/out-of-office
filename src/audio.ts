import { MUSIC } from './constants/music'
import { ASSETS } from './constants/assets'

export function setupBackgroundMusic() {
  const bgMusic = new Audio(`${import.meta.env.BASE_URL}${ASSETS.music}`)
  bgMusic.loop = MUSIC.loop
  bgMusic.volume = MUSIC.volume

  function playMusicOnInteraction() {
    bgMusic.play()
    document.removeEventListener('click', playMusicOnInteraction)
    document.removeEventListener('keydown', playMusicOnInteraction)
  }

  document.addEventListener('click', playMusicOnInteraction)
  document.addEventListener('keydown', playMusicOnInteraction)
}
