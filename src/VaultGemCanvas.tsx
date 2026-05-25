import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function VaultGemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const canvasElement = canvas
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvasElement,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    const group = new THREE.Group()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    camera.position.set(0, 0, 7)
    scene.add(group)

    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.32, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0xd8f7ff,
        emissive: 0x103746,
        metalness: 0.08,
        roughness: 0.12,
        transmission: 0.38,
        thickness: 0.6,
        transparent: true,
        opacity: 0.9,
      }),
    )
    group.add(gem)

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xeefbff,
      emissive: 0x10232a,
      metalness: 0.92,
      roughness: 0.18,
    })

    for (let index = 0; index < 28; index += 1) {
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), ringMaterial)
      const angle = (index / 28) * Math.PI * 2
      bead.position.set(Math.cos(angle) * 2.18, Math.sin(angle) * 0.58 - 0.15, Math.sin(angle) * 0.42)
      group.add(bead)
    }

    const keyLight = new THREE.PointLight(0xc7f1ff, 2.2, 12)
    keyLight.position.set(2.5, 2.4, 3.2)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0xdcc68f, 1.2, 10)
    rimLight.position.set(-2.6, -1.4, 2.4)
    scene.add(rimLight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.32))

    let frame = 0

    function resize() {
      const { clientWidth, clientHeight } = canvasElement
      const width = Math.max(1, clientWidth)
      const height = Math.max(1, clientHeight)

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvasElement)
    resize()

    function render() {
      if (!prefersReducedMotion) {
        group.rotation.y += 0.006
        group.rotation.x = Math.sin(Date.now() * 0.0007) * 0.12
        gem.rotation.z -= 0.004
      }

      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      renderer.dispose()
      gem.geometry.dispose()
      gem.material.dispose()
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
        }
      })
    }
  }, [])

  return <canvas className="vault-gem-canvas" ref={canvasRef} aria-hidden="true" />
}

export default VaultGemCanvas
