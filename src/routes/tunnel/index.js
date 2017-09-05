import { h, Component } from 'preact'
import {
	Geometry,
	TubeBufferGeometry,
	MeshLambertMaterial,
	PointsMaterial,
	Mesh,
	BackSide,
	Points,
	Vector2,
	Vector3,
	PointLight,
	FaceColors,
	RepeatWrapping,
	Fog,
	AdditiveBlending,
	Math as ThreeMath
} from 'three'
import { loadTextures } from '../../utils/TextureLoader'
import ThreeContainer from '../../components/three-container'
import KnotCurve from './KnotCurve'

import style from './style.scss'

const hasOrientation = (typeof window.orientation !== 'undefined')
const texturePath = '/assets/images/starsTexture.jpg'
const starPath = '/assets/images/white.png'

// chocolate 
// repeateive in different ways

export default class Tunnel extends Component {

	constructor(props) {
		super(props)

		this.state = {
			mode: 0.0
		}

		this.zPlanePos = 350
		this.inited = false
		this.totalMode = 4

		this.movementPerc = 0.3
		this.path = null
		this.tube = null
		this.shaderMaterial = null
		this.ligth = null
		this.cameraRotation = new Vector2(0, 0)
	}

	componentDidMount() {
		loadTextures([texturePath, starPath])
			.then(this.init)

		if (hasOrientation) {
			window.addEventListener('deviceorientation', this.handleOrientation, true)
		}
		// this.init()
	}

	componentWillUnmount() {
		if (hasOrientation) {
			window.removeEventListener('deviceorientation', this.handleOrientation)
		}
	}

	init = (textures) => {

		this.container.scene.fog = new Fog(0x0c0016, 1, 40 )
		
		this.path = new KnotCurve()
	
		let texture = textures[texturePath]
		// texture.RepeatWrapping = true
		texture.wrapS = texture.wrapT = RepeatWrapping
    texture.offset.set(0, 0)
    texture.repeat.set(4, 1)

		const geometry = new TubeBufferGeometry(this.path, 400, 2, 12, true)
		const material = new MeshLambertMaterial({
			color: 0xc4d0ff,
			// emissive: 0x0a2451,
		  side : BackSide,
		  map: texture,
		  // wireframe: true
		})
		this.tube = new Mesh(geometry, material)

		let starsGeometry = new Geometry()
		const totalSteps = 100
		for (let k = 0; k < totalSteps; k++) {
			const point = this.path.getPointAt(k / totalSteps)
			for (let i = 0; i < 30; i ++) {
				// console.log(point)
				var star = new Vector3()
				star.x = point.x + ThreeMath.randFloat(-1.8, 1.8)
				star.y = point.y + ThreeMath.randFloat(-1.8, 1.8)
				star.z = point.z + ThreeMath.randFloat(-10, 10)

				starsGeometry.vertices.push( star )
			}
		}

		let starsMaterial = new PointsMaterial({
			map: textures[starPath],
			size: 0.2,
			alpha: 0.7,
			transparent: true,
			blending: AdditiveBlending
		})
		let starField = new Points( starsGeometry, starsMaterial )

		this.light = new PointLight(0xc1f5ff, 1, 50)

		this.container.scene.add(this.tube)
		this.container.scene.add(starField)
		this.container.scene.add(this.light)

	  this.inited = true
	}

	handleOrientation = (e) => {
		//beta: -180 ~ 180, x axis
		//gamma: -90 ~ 90, y axis
		this.cameraRotation.x = e.gamma * 0.1
		this.cameraRotation.y = e.beta * 0.1 - 5
	}

	animate() {
		if (!this.inited) {
			return
		}
		this.movementPerc = (this.movementPerc + 0.0002) % 1
		// console.log(this.movementPerc)
		const cameraPos = this.path.getPointAt(this.movementPerc)
		// console.log(cameraPos)
		const lightPos = this.path.getPointAt((this.movementPerc + 0.005) % 1)
		let lookAtPos = lightPos.clone()
		lookAtPos.x += this.cameraRotation.x
		lookAtPos.y += this.cameraRotation.y

		this.container.camera.position.set(cameraPos.x,cameraPos.y,cameraPos.z)
		this.container.camera.lookAt(lookAtPos)

  	this.light.position.set(lightPos.x, lightPos.y, lightPos.z)
	}

	switchMode = () => {
		if (!this.inited) {
			return
		}

		const newHex = '0x' + Math.random().toString(16).slice(2, 8)
		this.light.color.setHex(parseInt(newHex))
	}

	render(props, states) {
		return (
				<div class={style.tunnel} onClick={this.switchMode}>
				<p class='instruction'>
					Click to change the light color. Move your phone around. 
				</p>
				<ThreeContainer 
					ref={el => this.container = el}
					actionZPos={this.zPlanePos} cameraZPos={1}
					activeFrameDelay={1}
					customAnimate={() => {this.animate()}}
				/>
			</div>
		)
	}
}
