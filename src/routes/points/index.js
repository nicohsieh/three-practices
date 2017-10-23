import { h, Component } from 'preact'
import * as OIMO from 'oimo'
import {
	BufferGeometry,
	BoxBufferGeometry,
	SphereBufferGeometry,
	Mesh,
	MeshPhongMaterial,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Vector2,
	Vector3,
	PointLight,
	AmbientLight,
	DirectionalLight,
	PCFSoftShadowMap,
	Color,
	Math as ThreeMath
} from 'three'
import { loadTextures } from '../../utils/textureLoader'
import ThreeContainer from '../../components/three-container'

import style from './style.scss'

const hasOrientation = (typeof window.orientation !== 'undefined')

// drag element
// change gravity


// use shader material
export default class Ponts extends Component {

	constructor(props) {
		super(props)
		this.state = {
			beta: 0,
			gamma: 0,
			alpha: 0
		}
		this.cameraZPos = 0
	}

	componentDidMount() {
		// this.container.scene.background = new Color(0xffffff)
		this.container.renderer.shadowMap.enabled = true
		this.container.renderer.shadowMap.type = PCFSoftShadowMap
		// this.container.scene.background = new Color(0xffffff)
		this.init()

		if (hasOrientation) {
			window.addEventListener('deviceorientation', this.handleOrientation, true)
		}
	}

	componentWillUnmount() {
		if (hasOrientation) {
			window.removeEventListener('deviceorientation', this.handleOrientation)
		}
	}

	init = (textures) => {
		this.world = new OIMO.World({
			info: true,
			worldScale: 100
		})

		this.world.gravity = new OIMO.Vec3(0, -4, 0)

		this.createBox()

		this.meshs = []
		this.bodys = []
		let geometry = new SphereBufferGeometry(1, 14, 14)
		let material = new MeshPhongMaterial({
			color: 0xf246ad,
			// emissive: 0xe2004f
		})

		for(let i = 0; i < 20; i++) {
			const x = ThreeMath.randFloat(-10, 10)
			const y = ThreeMath.randFloat(10, 0)
			const z = ThreeMath.randFloat(-10, 0) - 40
			const size = 2 + Math.random()

			let body = this.world.add({
				type:'sphere', 
				size: [size, size, size], 
				pos: [x, y, z], 
				move: true,
				config: [0.2 + Math.random() * 0.5, 0.3, 0, 1, 0xffffffff]
			})

			let mesh = new Mesh(geometry, material)
			mesh.position.set(x, y, z)
			mesh.scale.set(size, size, size)
			mesh.castShadow = true
			mesh.receiveShadow = true
			this.container.scene.add(mesh)
			this.meshs.push(mesh)
			this.bodys.push(body)
		}
   
  	this.light = new PointLight(0xffffff, 1, 100)
  	this.light.position.set(0, 10, -10)
		this.light.shadow.camera.near = 0.5
		this.light.shadow.camera.far = -100  
  	this.light.castShadow = true
  	this.container.scene.add(this.light)

  	const ambientLight = new AmbientLight(0x560101)
  	this.container.scene.add(ambientLight)
		this.inited = true
	}

	createBox() {
		const w = 24
		const t = 1
		const z = -40

		const sizes = [
			[w, t, w],
			[t, w, w],
			[w, t, w],
			[t, w, w],
			[w, w, t],
			[w, w, t],
		]

		const positions = [
			[0, w/2, z],
			[w/2, 0, z],
			[0, -w/2, z],
			[-w/2, 0, z],
			[0, 0, z - w / 2],
			[0, 0, -26],
		]
		const groundSize = [30, 1, 20]
		const groundPos = [0, -15, -40]
		let groundMeterial = new MeshStandardMaterial({
			color: 0xfcffed,
			// emissive: 0x424141
		})

		for (let i = 0; i < sizes.length; i++) {
			const transparent = (i === 5)
			this.createWall(groundMeterial, sizes[i], positions[i], transparent)
		}
	}

	createWall(meterial, size, pos, transparent) {
		this.world.add({
			size: size,
			pos: pos,
			config: [1, 0, 0.2, 1, 0xffffffff]
		})

		if (transparent) {
			return
		}

		let geometry = new BoxBufferGeometry(...size)
		let mesh = new Mesh(geometry, meterial)
		mesh.receiveShadow = true
		mesh.position.set(...pos)
		this.container.scene.add(mesh)
	}

	onMouseMove = (evt) => {
		const x = evt.clientX
		const y = evt.clientY

		const xf = x / (window.innerWidth * 0.5) - 1
		const yf = y /  (window.innerHeight * 0.5) - 1
		this.world.gravity.x = xf * -20
		this.world.gravity.y = yf * -10
	}

	onTouchMove = (evt) => {
		const x = evt.touches[0].clientX
		const y = evt.touches[0].clientY
	}

	handleOrientation = (e) => {
		this.world.gravity.x = e.gamma * 0.4
		this.world.gravity.y = e.beta * -0.4
		this.world.gravity.z = e.gamma * -0.2
		// this.world.gravity.z = (e.alpha - 180) * 0.3
		this.setState({
			beta: e.beta.toFixed(2),
			gamma: e.gamma.toFixed(2),
			alpha: e.alpha.toFixed(2)
		})
	}

	animate() {
		if (!this.inited) {
			return
		}
		this.world.step()
		let body
		let mesh
		for(let i = 0; i < this.meshs.length; i++) {
			body = this.bodys[i]
			mesh = this.meshs[i]

			if (!body.sleeping) {
				mesh.position.copy(body.getPosition())
        mesh.quaternion.copy(body.getQuaternion())
			}
		}
	}

	switchMode = () => {
		
	}

	render(props, states) {
		return (
			<div class={style['points']} onClick={this.switchMode}>
				<p class='instruction'>
				</p>
				<ul>
					<li>Beta(x axis): {states.beta}</li>
					<li>Gamma(y axis): {states.gamma}</li>
					<li>Alpha(z axis): {states.alpha}</li>
				</ul>
				<ThreeContainer 
					ref={el => this.container = el}
					cameraZPos={this.cameraZPos}
					onMouseMove={this.onMouseMove}
					onTouchMove={this.onTouchMove}
					animate={() => {this.animate()}}
				/>
			</div>
		);
	}
}
