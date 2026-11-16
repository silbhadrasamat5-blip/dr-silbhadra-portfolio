'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Aspirin-inspired pharmaceutical molecule ──────────────────────────────
// Benzene ring + ester side-chain + carboxyl group
const ATOMS: { p: [number, number, number]; type: 'C' | 'O' }[] = [
  // Benzene ring (radius 1.4, XY plane)
  { p: [1.4,  0.00,  0.00], type: 'C' },   // 0
  { p: [0.7,  1.21,  0.00], type: 'C' },   // 1
  { p: [-0.7, 1.21,  0.00], type: 'C' },   // 2
  { p: [-1.4, 0.00,  0.00], type: 'C' },   // 3
  { p: [-0.7,-1.21,  0.00], type: 'C' },   // 4
  { p: [0.7, -1.21,  0.00], type: 'C' },   // 5

  // Ester side chain (–O–C(=O)–CH₃) on atom 2
  { p: [-1.10, 2.55,  0.40], type: 'O' },  // 6 ether-O
  { p: [-2.30, 3.05,  0.50], type: 'C' },  // 7 carbonyl-C
  { p: [-3.30, 2.30,  0.30], type: 'O' },  // 8 =O
  { p: [-2.55, 4.35,  0.80], type: 'C' },  // 9 methyl-C

  // Carboxyl (–COOH) on atom 1
  { p: [1.00, 2.60, -0.30], type: 'C' },   // 10 carboxyl-C
  { p: [2.30, 2.90, -0.50], type: 'O' },   // 11 =O
  { p: [0.90, 3.90, -0.20], type: 'O' },   // 12 –OH
]

const BONDS: [number, number][] = [
  // Ring
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
  // Ester branch
  [2,6],[6,7],[7,8],[7,9],
  // Carboxyl branch
  [1,10],[10,11],[10,12],
]

const COLOR = { C: 0x0D9488, O: 0x0284C7 } as const

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

    // ── Camera ────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0, 11)

    // ── Scene ─────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Lights ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55))

    const key = new THREE.DirectionalLight(0x60EFFF, 1.6)
    key.position.set(4, 6, 6)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0x0284C7, 0.6)
    fill.position.set(-4, 2, -4)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0x0D9488, 0.7)
    rim.position.set(0, -5, -6)
    scene.add(rim)

    // ── Molecule group (offset left so portrait stays clear) ──
    const mol = new THREE.Group()
    mol.position.set(-1.6, 0.4, 0)
    scene.add(mol)

    // ── Atom spheres ──────────────────────────────────────
    ATOMS.forEach(({ p, type }) => {
      const radius = type === 'C' ? 0.28 : 0.24
      const color  = COLOR[type]
      const geo = new THREE.SphereGeometry(radius, 32, 32)
      const mat = new THREE.MeshPhongMaterial({
        color,
        specular: 0xffffff,
        shininess: 110,
        emissive: color,
        emissiveIntensity: 0.10,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...p)
      mol.add(mesh)

      // Soft outer glow
      const glowGeo = new THREE.SphereGeometry(radius * 2.2, 16, 16)
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.07,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      glow.position.set(...p)
      mol.add(glow)
    })

    // ── Bond cylinders ────────────────────────────────────
    const bondMat = new THREE.MeshPhongMaterial({
      color: 0x9DD4D0,
      specular: 0xffffff,
      shininess: 55,
      transparent: true,
      opacity: 0.72,
    })

    BONDS.forEach(([i, j]) => {
      const a = new THREE.Vector3(...ATOMS[i].p)
      const b = new THREE.Vector3(...ATOMS[j].p)
      const dir = new THREE.Vector3().subVectors(b, a)
      const len = dir.length()
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)

      const geo  = new THREE.CylinderGeometry(0.07, 0.07, len, 12, 1)
      const mesh = new THREE.Mesh(geo, bondMat.clone())
      mesh.position.copy(mid)

      dir.normalize()
      const up = new THREE.Vector3(0, 1, 0)
      if (Math.abs(dir.dot(up)) < 0.9999) {
        mesh.quaternion.setFromUnitVectors(up, dir)
      } else if (dir.y < 0) {
        mesh.rotation.z = Math.PI
      }
      mol.add(mesh)
    })

    // ── Floating particles ────────────────────────────────
    const pCount = 160
    const pPos   = new Float32Array(pCount * 3)
    const pCol   = new Float32Array(pCount * 3)
    const palette = [
      new THREE.Color(0x0D9488),
      new THREE.Color(0x0284C7),
      new THREE.Color(0x14B8A6),
      new THREE.Color(0x38BDF8),
    ]
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 16
      pPos[i*3+1] = (Math.random() - 0.5) * 12
      pPos[i*3+2] = (Math.random() - 0.5) * 7
      const c = palette[Math.floor(Math.random() * palette.length)]
      pCol[i*3]   = c.r
      pCol[i*3+1] = c.g
      pCol[i*3+2] = c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Mouse drift ───────────────────────────────────────
    let mx = 0, my = 0, cx = 0, cy = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      if (!el) return
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ────────────────────────────────────
    let frameId: number
    const tick = () => {
      frameId = requestAnimationFrame(tick)
      const t = performance.now() * 0.001

      mol.rotation.y = t * 0.38
      mol.rotation.x = Math.sin(t * 0.22) * 0.14

      particles.rotation.y = t * 0.025
      particles.rotation.x = t * 0.012

      cx += (mx * 1.4 - cx) * 0.03
      cy += (-my * 0.9 - cy) * 0.03
      camera.position.x = cx
      camera.position.y = cy
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    tick()

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: THREE.Material) => m.dispose())
          } else {
            (obj.material as THREE.Material).dispose()
          }
        }
      })
      renderer.dispose()
      if (el && renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={wrapRef} className="w-full h-full" />
}
