import { h, Component } from 'preact'
import * as OIMO from 'oimo'
import {
	BufferGeometry,
	BoxBufferGeometry,
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


// use shader material
export default class Ponts extends Component {

	constructor(props) {
		super(props)

	}

	componentDidMount() {
		// this.container.scene.background = new Color(0xffffff)
		this.container.renderer.shadowMap.enabled = true
		this.container.renderer.shadowMap.type = PCFSoftShadowMap
		// this.container.scene.background = new Color(0xffffff)
		this.init()
	}

	init = (textures) => {
		this.world = new OIMO.World({
			info: true,
			worldScale: 100
		})

		this.world.gravity = new OIMO.Vec3(0, -4, 0)

		const groundSize = [30, 1, 20]
		const groundPos = [0, -15, -40]
		this.ground = this.world.add({
			size: groundSize,
			pos: groundPos,
			config: [
				1, // The density of the shape.
        0.3, // The coefficient of friction of the shape.
        0.2, // The coefficient of restitution of the shape.
        1, // The bits of the collision groups to which the shape belongs.
        0xffffffff // The bits of the collision groups with which the shape collides.
			]
		})
		
		let groundGeometry = new BoxBufferGeometry(...groundSize)
		let groundMeterial = new MeshStandardMaterial({
			color: 0xc6c6c6,
			// emissive: 0x424141
		})
		let groundMesh = new Mesh(groundGeometry, groundMeterial)
		groundMesh.receiveShadow = true
		groundMesh.position.set(...groundPos)
		// groundMesh.rotation.set(0.3, 0, 0)
		this.container.scene.add(groundMesh)


		this.meshs = []
		this.bodys = []
		const size = 3
		let geometry = new BoxBufferGeometry(1, 1, 1)
		let material = new MeshPhongMaterial({
			color: 0xffffff,
			// emissive: 0xe2004f
		})

		for(let i = 0; i < 15; i++) {
			const x = ThreeMath.randFloat(-10, 10)
			const y = ThreeMath.randFloat(10, 0)
			const z = ThreeMath.randFloat(-10, 0) - 40

			let body = this.world.add({
				type:'box', 
				size: [size, size, size], 
				pos: [x, y, z], 
				move: true,
				config: [1, 0.3, 0, 1, 0xffffffff]
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

  	const ambientLight = new AmbientLight(0x011b56)
  	this.container.scene.add(ambientLight)
		this.inited = true
	}

	onMouseMove = (evt) => {
		const x = evt.clientX
		const y = evt.clientY
	}

	onTouchMove = (evt) => {
		const x = evt.touches[0].clientX
		const y = evt.touches[0].clientY
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
				<ThreeContainer 
					ref={el => this.container = el}
					cameraZPos={0}
					onMouseMove={this.onMouseMove}
					onTouchMove={this.onTouchMove}
					animate={() => {this.animate()}}
				/>
			</div>
		);
	}
}
