import * as THREE from 'three'
import THREEx from 'threex.domevents'
import * as initOrbitControls from 'three-orbit-controls'
const OrbitControls = initOrbitControls(THREE)

import { User } from '../models/user'
import { UI } from './ui'

export class GFX {

    private user: User = null
    private data: Array<User> = null // array

    private scene: THREE.Scene = null
    private camera: THREE.OrthographicCamera = null
    // private camera: THREE.PerspectiveCamera = null
    private renderer: THREE.WebGLRenderer = null
    private domEvents: THREEx.DomEvents = null
    private controls: any = null

    constructor(user: User, data: Array<User>) {
        this.user = user
        this.data = data
        this.setup()
        this.draw()
        this.animate()
    }

    private setup() {
        const { innerWidth: width, innerHeight: height } = window

        this.scene = new THREE.Scene()

        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -500, 1000)
        // this.camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
        this.camera.position.set(200, 200, 200)
        this.camera.lookAt(this.scene.position)

        // const axes = new THREE.AxisHelper(20)
        // this.scene.add(axes)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.setClearColor(0xffffff, 1)
        document.body.appendChild(this.renderer.domElement)

        // this.renderer.domElement.classList.add('canvas')
        this.domEvents = new THREEx.DomEvents(THREE, this.camera, this.renderer.domElement)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDumping = true
        this.controls.enableZoom = true
        this.controls.autoRotate = true
        this.controls.addEventListener('change', this.render.bind(this))

        window.addEventListener('resize', this.onWindowResize.bind(this), false)
    }

    private onWindowResize() {
        const { innerWidth: width, innerHeight: height } = window

        this.camera.aspect = width / height
        this.camera.left = -width / 2
        this.camera.right = width / 2
        this.camera.top = height / 2
        this.camera.bottom = -height / 2

        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height)
        this.render()
    }

    private draw() {

        const ui = new UI()

        // create hover function
        const onHover = (user: User, node: THREE.Mesh) => {
            return (e) => {
                this.controls.autoRotate = false
                console.log(`${ user.first_name } ${ user.last_name }: ${ user.activities }`)

                const position = this.calc2DPosition(node.position)
                // console.log(position)
                ui.setCardImg(user.photo_50)
                ui.setCardName(`${ user.first_name } ${ user.last_name }`)
                ui.setCardPosition(position)
                ui.show(ui.card)
            }
        }

        const onUnhover = () => {
            return (e) => {
                this.controls.autoRotate = true
                ui.hide(ui.card)
                ui.setCardImg('')
                ui.setCardName('')
            }
        }

        // create vertices from data

        for (let d of this.data) {
            const vertex = new THREE.Vector3()

            const theta = THREE.Math.randFloatSpread(360)
            const phi = THREE.Math.randFloatSpread(360)

            const c: number = 30

            vertex.x = c * d.activities * Math.sin(theta) * Math.cos(phi)
            vertex.y = c * d.activities * Math.sin(theta) * Math.sin(phi)
            vertex.z = c * d.activities * Math.cos(theta)

            const sphere = this.sphere(7, new THREE.Vector3(vertex.x, vertex.y, vertex.z))
            this.attachHoverToNode(sphere, onHover(d, sphere), onUnhover())

            const line = this.line(new THREE.Vector3(0, 0, 0), vertex)

            this.scene.add(sphere)
            this.scene.add(line)

        }

        // draw center node
        const centerNode = this.sphere(11, new THREE.Vector3(0, 0, 0), 0xff4081)
        this.attachHoverToNode(centerNode, onHover(this.user, centerNode), onUnhover())
        this.scene.add(centerNode)

        // light up
        const ambientLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambientLight)

        const directionalLight = this.light(new THREE.Vector3(1, 1, 1))
        this.scene.add(directionalLight)

        // render
        this.render()

    }

    private attachHoverToNode(node: THREE.Mesh, onMouseOver: any, onMouseOut: any) {
        this.domEvents.addEventListener(node, 'mouseover', onMouseOver)
        this.domEvents.addEventListener(node, 'mouseout', onMouseOut)
    }

    private calc2DPosition(vector: THREE.Vector3): THREE.Vector3 {
        const result = new THREE.Vector3(vector.x, vector.y, vector.z)
        const canvas = this.renderer.domElement

        result.project(this.camera)
        result.x = Math.round((result.x + 1) * canvas.width / 2)
        result.y = Math.round((-result.y + 1) * canvas.height / 2)
        result.z = 0

        return result
    }

    private render() {

        // const timer = Date.now() * 0.00005

        // this.camera.position.x = Math.cos(timer) * 200
        // this.camera.position.z = Math.sin(timer) * 200
        // this.camera.lookAt(this.scene.position)

        this.renderer.render(this.scene, this.camera)
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.controls.update()
        this.render()
    }

    private sphere(radius: number, position: THREE.Vector3, color: number = 0x3F51B5): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(radius, 32, 32)
        const material = new THREE.MeshLambertMaterial({
            overdraw: 0.5,
            wireframe: true,
            color
        })
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.set(position.x, position.y, position.z)

        return sphere
    }

    private line(from: THREE.Vector3, to: THREE.Vector3): THREE.Line {
        const material = new THREE.LineBasicMaterial({
            linewidth: 2,
            color: 0x3f51b5,
            transparent: true,
            opacity: 0.2
        })
        const geometry = new THREE.Geometry()
        geometry.vertices.push(from, to)

        return new THREE.Line(geometry, material)
    }

    private light(position: THREE.Vector3, color: number = 0xffffff): THREE.DirectionalLight {
        const light = new THREE.DirectionalLight(color)
        light.position.set(position.x, position.y, position.z)
        light.position.normalize()

        return light
    }

}