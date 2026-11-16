'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeMoleculeCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    // ── Renderer ──────────────────────────────────────────
    const W = el.clientWidth || window.innerWidth
    const H = el.clientHeight || window.innerHeight
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Camera (z = 14 ensures zero clipping at any edge) ──
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
    camera.position.set(0, 0, 14)

    // ── Scene ─────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Clinical Lighting ─────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.4))

    const keyLight = new THREE.DirectionalLight(0x0d9488, 2.4)
    keyLight.position.set(6, 8, 10)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x0284c7, 2.0)
    fillLight.position.set(-6, -5, 8)
    scene.add(fillLight)

    // ── Targeted Drug Delivery Nanosphere Group ───────────
    const nanoGroup = new THREE.Group()

    // 1. Inner Active Drug Core (Clinical Aqua Green)
    const coreGeo = new THREE.IcosahedronGeometry(0.72, 2)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x0f766e,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.4,
    })
    const drugCore = new THREE.Mesh(coreGeo, coreMat)
    nanoGroup.add(drugCore)

    // 2. Inner Active Drug Micro-Beads
    const beadGeo = new THREE.SphereGeometry(0.11, 16, 16)
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      roughness: 0.2,
      metalness: 0.3,
    })
    const beadCoords = [
      [0.95, 0.45, 0.3],
      [-0.9, -0.4, 0.45],
      [0.35, -0.95, -0.35],
      [-0.4, 0.9, -0.4],
      [0.65, -0.55, 0.65],
      [-0.65, 0.55, 0.6],
    ]
    beadCoords.forEach(([bx, by, bz]) => {
      const bead = new THREE.Mesh(beadGeo, beadMat)
      bead.position.set(bx, by, bz)
      nanoGroup.add(bead)
    })

    // 3. Translucent Lipid/Crystal Carrier Shell
    const shellGeo = new THREE.SphereGeometry(1.55, 28, 28)
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.26,
      roughness: 0.15,
      metalness: 0.05,
      depthWrite: false,
    })
    const lipidShell = new THREE.Mesh(shellGeo, shellMat)
    nanoGroup.add(lipidShell)

    // Subtle geometric lipid-bilayer mesh lines
    const wireGeo = new THREE.IcosahedronGeometry(1.56, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0d9488,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const lipidWire = new THREE.Mesh(wireGeo, wireMat)
    nanoGroup.add(lipidWire)

    // 4. Targeted Receptor-Binding Ligands / Pins (Sky Blue)
    const pinDirections = [
      new THREE.Vector3(1, 0.7, 0.4).normalize(),
      new THREE.Vector3(-1, 0.6, 0.5).normalize(),
      new THREE.Vector3(0.4, -1, 0.6).normalize(),
      new THREE.Vector3(-0.6, -0.8, -0.5).normalize(),
      new THREE.Vector3(0.8, -0.4, -0.7).normalize(),
      new THREE.Vector3(-0.3, 0.9, -0.6).normalize(),
      new THREE.Vector3(0, 0.2, 1).normalize(),
      new THREE.Vector3(0.2, -0.2, -1).normalize(),
    ]

    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.5,
    })
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.2,
      metalness: 0.4,
    })

    const stalkGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.42, 10)
    const tipGeo = new THREE.SphereGeometry(0.11, 16, 16)

    pinDirections.forEach((dir) => {
      const pinHolder = new THREE.Group()

      const stalk = new THREE.Mesh(stalkGeo, stalkMat)
      stalk.position.y = 1.76
      pinHolder.add(stalk)

      const tip = new THREE.Mesh(tipGeo, tipMat)
      tip.position.y = 1.98
      pinHolder.add(tip)

      pinHolder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      nanoGroup.add(pinHolder)
    })

    // 5. Twin Clinical Orbital Rings
    const ringGeo = new THREE.TorusGeometry(2.35, 0.022, 12, 80)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      transparent: true,
      opacity: 0.45,
      roughness: 0.3,
    })
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.4,
      roughness: 0.3,
    })

    const orbitRing1 = new THREE.Mesh(ringGeo, ringMat1)
    orbitRing1.rotation.x = Math.PI / 2.6
    orbitRing1.rotation.y = 0.35
    nanoGroup.add(orbitRing1)

    const orbitRing2 = new THREE.Mesh(ringGeo, ringMat2)
    orbitRing2.rotation.x = -Math.PI / 2.8
    orbitRing2.rotation.y = -0.45
    nanoGroup.add(orbitRing2)

    // Positioned cleanly in the lower-middle gap (between text & portrait)
    const basePos = { x: 0.35, y: -1.35 }
    nanoGroup.position.set(basePos.x, basePos.y, 0)
    nanoGroup.scale.setScalar(0.88)
    scene.add(nanoGroup)

    // ── Floating Bio-Particles ────────────────────────────
    const pCount = 120
    const pPos = new Float32Array(pCount * 3)
    const pCol = new Float32Array(pCount * 3)
    const palette = [
      new THREE.Color(0x0d9488),
      new THREE.Color(0x0284c7),
      new THREE.Color(0x14b8a6),
      new THREE.Color(0x38bdf8),
    ]
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 18
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 11
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
      const c = palette[i % palette.length]
      pCol[i * 3] = c.r
      pCol[i * 3 + 1] = c.g
      pCol[i * 3 + 2] = c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Interactive Mouse & Resize ────────────────────────
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.45
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.35
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onResize = () => {
      if (!el) return
      const w = el.clientWidth || window.innerWidth
      const h = el.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let clock = 0
    let rafId: number
    const animate = () => {
      clock += 0.015

      nanoGroup.rotation.y += 0.005
      drugCore.rotation.y -= 0.012
      drugCore.rotation.x += 0.008
      const pulse = 1 + Math.sin(clock * 2) * 0.04
      drugCore.scale.setScalar(pulse)

      orbitRing1.rotation.z += 0.004
      orbitRing2.rotation.z -= 0.003
      particles.rotation.y += 0.0008

      nanoGroup.rotation.x += (mouseY - nanoGroup.rotation.x) * 0.04
      nanoGroup.position.x += (basePos.x + mouseX - nanoGroup.position.x) * 0.04

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (renderer.domElement && el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={wrapRef} className="w-full h-full" />
}
