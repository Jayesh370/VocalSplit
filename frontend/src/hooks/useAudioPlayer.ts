import { useRef, useState, useEffect, useCallback } from 'react'
import type { AudioPlayerState } from '@/types'

export function useAudioPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
  })

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio

    const onTimeUpdate = () =>
      setState((s) => ({ ...s, currentTime: audio.currentTime }))
    const onDurationChange = () =>
      setState((s) => ({ ...s, duration: audio.duration }))
    const onEnded = () =>
      setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }))
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }))
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }))

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [src])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setState((s) => ({ ...s, currentTime: time }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    setState((s) => ({ ...s, volume, muted: volume === 0 }))
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setState((s) => ({ ...s, muted: audio.muted }))
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [])

  return { state, togglePlay, seek, setVolume, toggleMute, stop }
}
