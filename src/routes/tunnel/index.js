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
	Math as ThreeMath
} from 'three'
import ThreeContainer from '../../components/three-container'
import KnotCurve from './KnotCurve'
import { loadTextures } from '../../utils/textureLoader'
import { sinLookUp } from '../../utils/sinLookUp'

import style from './style.scss'

const hasOrientation = (typeof window.orientation !== 'undefined')
const texturePath = '/assets/images/swirl.jpg'
const starPath = '/assets/images/mint.png'

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
		this.light = null
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

		this.container.scene.fog = new Fog(0x080026, 1, 80)
		
		this.path = new KnotCurve()
	
		let texture = textures[texturePath]
		// texture.RepeatWrapping = true
		texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(3, 5)

		const geometry = new TubeBufferGeometry(this.path, 400, 2, 12, true)
		const material = new MeshLambertMaterial({
			color: 0xffffff,
			emissive: 0x6b0d66,
		  side : BackSide,
		  map: texture,
		  // wireframe: true
		})
		this.tube = new Mesh(geometry, material)

		this.starsGeometry = new Geometry()
		const totalSteps = 60
		for (let k = 0; k < totalSteps; k++) {
			const point = this.path.getPointAt(k / totalSteps)
			const max = Math.random() * 30 + 40
			for (let i = 0; i < max; i ++) {
				// console.log(point)
				var star = new Vector3()
				star.x = point.x + ThreeMath.randFloat(-1.8, 1.8)
				star.y = point.y + ThreeMath.randFloat(-1.8, 1.8) + 1
				star.z = point.z + ThreeMath.randFloat(-10, 10)

				this.starsGeometry.vertices.push( star )
			}
		}

		let starsMaterial = new PointsMaterial({
			map: textures[starPath],
			alphaTest: 0.1,
			color: 0xf4d0f2,
			size: 0.6,
			transparent: true,
		})

		let starField = new Points(this.starsGeometry, starsMaterial)

		this.light = new PointLight(0xc1f5ff, 1, 50)

		this.container.scene.add(this.tube)
		this.container.scene.add(starField)
		this.container.scene.add(this.light)

	  this.inited = true
	}

	rgb2hex(r, g, b) {
		let c1 = r.toString(16)
		let str = '0x'
		for(let i = 0; i < arguments.length; i++) {
			let val = arguments[i].toString(16)
			if (val.length < 2) {
				str += '0' + val
			} else {
				str += val
			}
		}
		return str
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
		this.movementPerc = (this.movementPerc + 0.0004) % 1
		const cameraPos = this.path.getPointAt(this.movementPerc)
		const lightPos = this.path.getPointAt((this.movementPerc + 0.005) % 1)
		let lookAtPos = lightPos.clone()
		lookAtPos.x += this.cameraRotation.x
		lookAtPos.y += this.cameraRotation.y

		this.container.camera.position.set(cameraPos.x,cameraPos.y,cameraPos.z)
		this.container.camera.lookAt(lookAtPos)

  	this.light.position.set(lightPos.x, lightPos.y, lightPos.z)

  	// light color 
  	const frameCount = this.container.frameCount
  	const r = ~~((sinLookUp(frameCount * 0.019) + 1) * 100 + 27)
  	const g = ~~((sinLookUp(frameCount * 0.013 + 2) + 1) * 70 + 30)
  	const b = ~~((sinLookUp(frameCount * 0.017 + 3) + 1) * 90 + 37)
  	const newColor = this.rgb2hex(r, g, b)

  	this.light.color.setHex(newColor)

  	for(let i = 0; i < this.starsGeometry.vertices.length; i++) {
  		const item = this.starsGeometry.vertices[i]
  		const val = sinLookUp(frameCount * 0.008 + i * 0.3) * 0.1
  		item.z += val
  	}

  	this.starsGeometry.verticesNeedUpdate = true
	}

	switchMode = () => {
		if (!this.inited) {
			return
		}
	}

	render(props, states) {
		return (
				<div class={style.tunnel} onClick={this.switchMode}>
				<p class='instruction'>
					
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
