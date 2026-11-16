'use client'

import { useEffect, useRef } from 'react'

interface Props {
  videoUrl?: string
}

const DEFAULT_VIDEO_URL =
  'https://viakjhjyyflqwlqgsnah.supabase.co/storage/v1/object/public/portfolio-media/polished_video.mp4'

/**
 * Fixed full-page background video.
 * - Clean full-frame rendering without scale cropping (watermark-free video).
 * - Scroll-scrubbed via requestAnimationFrame + lerp; no autoplay loop.
 */
export default function VideoBackground({ videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const activeVideoUrl = videoUrl || DEFAULT_VIDEO_URL

  useEffect(() => {
    const video = videoRef.current
    if (!video || !activeVideoUrl) return

    // Start paused at frame 0
    video.pause()

    let targetTime = 0
    let rafId: number

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0 || !video.duration) return
      const progress = Math.min(1, scrollY / maxScroll)
      targetTime = progress * video.duration
    }

    const animate = () => {
      if (video.readyState >= 2 && video.duration) {
        const diff = targetTime - video.currentTime
        if (Math.abs(diff) > 0.015) {
          // Lerp: smooth easing toward target
          video.currentTime = Math.max(
            0,
            Math.min(video.duration, video.currentTime + diff * 0.1)
          )
        }
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [activeVideoUrl])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={activeVideoUrl}
        muted
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Very subtle warm tint to harmonise with pearl white sections */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(250,249,246,0.06)' }}
      />
    </div>
  )
}
