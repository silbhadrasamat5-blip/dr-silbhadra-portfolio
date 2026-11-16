'use client'

import { useEffect, useRef } from 'react'

interface Props {
  videoUrl: string
}

/**
 * Fixed full-page background video.
 * - scale-[1.08] origin-top-left crops the bottom-right watermark off-screen.
 * - Scroll-scrubbed via requestAnimationFrame + lerp; no autoplay loop.
 */
export default function VideoBackground({ videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return

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
  }, [videoUrl])

  if (!videoUrl) {
    // Gradient fallback when no video is configured
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 45%, #F0FDF4 100%)',
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* scale-[1.08] crops the bottom-right watermark; origin-top-left keeps composition */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover scale-[1.08] origin-top-left"
      />
      {/* Very subtle warm tint to harmonise with pearl white sections */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(250,249,246,0.06)' }}
      />
    </div>
  )
}
