'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDNACanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouse    = useRef({ x: 0, y: 0 })
  const raf      = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return

    // ── Scene / Camera / Renderer ──────────────────────────
    const scene    = new THREE.Scene()
    const W        = window.innerWidth
    const H        = window.innerHeight
    const camera   = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.set(0, 0, 18)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // ── DNA Double Helix ───────────────────────────────────
    const group = new THREE.Group()

    const RADIUS = 2.8
    const HEIGHT = 18
    const TURNS  = 5
    const PTS    = TURNS * 24    // points per full helix
    const STEP   = 6             // cross-link every N points

    const matA = new THREE.LineBasicMaterial({ color: 0xD97706 })
    const matB = new THREE.LineBasicMaterial({ color: 0xF59E0B })
    const matC = new THREE.LineBasicMaterial({
      color: 0xFBBF24, transparent: true, opacity: 0.45,
    })
    const matN = new THREE.PointsMaterial({
      color: 0xFDE68A, size: 0.2, transparent: true, opacity: 0.95,
      sizeAttenuation: true,
    })

    const s1: THREE.Vector3[] = []
    const s2: THREE.Vector3[] = []

    for (let i = 0; i <= PTS; i++) {
      const t     = i / PTS
      const angle = t * Math.PI * 2 * TURNS
      const y     = (t - 0.5) * HEIGHT
      s1.push(new THREE.Vector3(Math.cos(angle) * RADIUS,           y, Math.sin(angle) * RADIUS))
      s2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS))
    }

    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(s1), matA))
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(s2), matB))

    // Cross-links + glowing nodes
    const crossPts: THREE.Vector3[] = []
    const nodePts:  THREE.Vector3[] = []
    for (let i = 0; i <= PTS; i += STEP) {
      crossPts.push(s1[i], s2[i])
      nodePts.push(s1[i], s2[i])
    }
    group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(crossPts), matC))
    group.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(nodePts), matN))

    scene.add(group)

    // ── Floating amber particles ───────────────────────────
    const N      = 220
    const pArr   = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pArr[i * 3]     = (Math.random() - 0.5) * 32
      pArr[i * 3 + 1] = (Math.random() - 0.5) * 28
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 16
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xF59E0B, size: 0.07, transparent: true, opacity: 0.38, sizeAttenuation: true,
    })))

    // ── Mouse drift ────────────────────────────────────────
    let camX = 0, camY = 0
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5)
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5)
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize',    onResize)

    // ── Animation ──────────────────────────────────────────
    const tick = () => {
      raf.current = requestAnimationFrame(tick)
      group.rotation.y += 0.0035

      camX += (mouse.current.x * 2.5 - camX) * 0.025
      camY += (mouse.current.y * 2.5 - camY) * 0.025
      camera.position.x = camX
      camera.position.y = camY
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    tick()

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize',    onResize)
      scene.traverse(o => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points) {
          o.geometry.dispose()
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
      renderer.dispose()
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />
}
