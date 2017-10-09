import { h, Component } from 'preact'
import {
	Geometry,
	TubeBufferGeometry,
	MeshPhongMaterial,
	PointsMaterial,
	Mesh,
	BackSide,
	Points,
	Vector2,
	Vector3,
	PointLight,
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
const tubePath = '/assets/images/bg.jpg'
const iconWeight = {
	'/assets/images/mint.png': 1.5,
	'/assets/images/burger.png': 1,
	'/assets/images/doge.png': 1,
	'/assets/images/donut.png': 1,
	'/assets/images/in-love.png': 1.5,
	'/assets/images/pizza.png': 1,
	'/assets/images/scream.png': 1,
	'/assets/images/taco.png': 1,
	'/assets/images/dildo1.png': 0.3,
	'/assets/images/dildo2.png': 0.2,
}
const defaultIcon = '/assets/images/mint.png'

// repeateive in different ways
// resize images
// clean up after burst

export default class Tunnel extends Component {

	constructor(props) {
		super(props)

		this.state = {
			mode: 0.0
		}

		this.inited = false
		this.totalMode = 4

		this.movementPerc = 0.3
		this.path = null
		this.tube = null
		this.shaderMaterial = null
		this.light = null
		this.cameraRotation = new Vector2(0, 0)
		this.iconPathsToLoad = this.getIconPathsToLoad()
		this.iconWeightMap = this.getIconWeightMap()

		const lastIndex = this.iconWeightMap.length - 1
		this.iconMapMax = this.iconWeightMap[lastIndex].max
		this.lastSelectedIcon = null

		this.iconTweak = 1

		this.bursts = []
	}

	componentDidMount() {
		loadTextures([tubePath, ...this.iconPathsToLoad])
			.then(this.init)

		if (hasOrientation) {
			window.addEventListener('deviceorientation', this.handleOrientation, true)
		} else {
			document.addEventListener('mousemove', this.handleMouseMove)
		}
	}

	componentWillUnmount() {
		if (hasOrientation) {
			window.removeEventListener('deviceorientation', this.handleOrientation)
		} else {
			document.addEventListener('mousemove', this.handleMouseMove)
		}
	}

	getIconPathsToLoad() {
		let icons = []
		Object.keys(iconWeight).forEach((name) => {
			icons.push(name)
		})
		return icons
	}

	getIconWeightMap() {
		let icons = []
		let max = 0
		Object.keys(iconWeight).forEach((name) => {
			max += iconWeight[name]
			icons.push({
				path: name,
				max				
			})
		})
		return icons
	}

	getRandomIcon() {
		const rnd = Math.random() * this.iconMapMax
		for(let i = 0; i < this.iconWeightMap.length; i++) {
			const item = this.iconWeightMap[i]
			if (rnd <= item.max) {
				if (item.path !== this.lastSelectIcon) {
					this.lastSelectedIcon = item.path
					return this.textures[this.lastSelectedIcon]
				} else {
					const index = (i + 1) % this.iconWeightMap.length
					this.lastSelectedIcon = this.iconWeightMap[index].path
					return this.textures[this.lastSelectedIcon]
				}
			}
		}
	}

	init = (textures) => {

		this.textures = textures
		this.container.scene.fog = new Fog(0x080026, 1, 80)
		
		this.path = new KnotCurve()
		
		let texture = textures[tubePath]
		// texture.RepeatWrapping = true
		texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(3, 5)

		const geometry = new TubeBufferGeometry(this.path, 400, 2, 12, true)
		const material = new MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0x6b0d66,
		  side : BackSide,
		  map: texture,
		  // wireframe: true
		})
		this.tube = new Mesh(geometry, material)

		this.iconGeometry = new Geometry()
		const totalSteps = 60
		for (let k = 0; k < totalSteps; k++) {
			const point = this.path.getPointAt(k / totalSteps)
			const max = Math.random() * 30 + 40
			for (let i = 0; i < max; i ++) {
				// console.log(point)
				let icon = new Vector3()
				icon.x = point.x + ThreeMath.randFloat(-1.8, 1.8)
				icon.y = point.y + ThreeMath.randFloat(-1.8, 1.8) + 1
				icon.z = point.z + ThreeMath.randFloat(-10, 10)

				this.iconGeometry.vertices.push(icon)
			}
		}

		this.iconMaterial = new PointsMaterial({
			map: this.textures[defaultIcon],
			alphaTest: 0.1,
			color: 0xf4d0f2,
			size: 0.6,
			transparent: true,
		})

		let icons = new Points(this.iconGeometry, this.iconMaterial)

		this.light = new PointLight(0xc1f5ff, 1, 50)

		this.container.scene.add(this.tube)
		this.container.scene.add(icons)
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
	
	switchMode = () => {
		if (!this.inited) {
			return
		}
		this.iconMaterial.map = this.getRandomIcon()
		this.iconTweak = 4
	}

	handleMouseMove = (e) => {
		const halfWinW = window.innerWidth * 0.5
		
		const x = (e.clientX - halfWinW) / halfWinW 
		const y = (e.clientY - halfWinW) / halfWinW
		// console.log(x, y)
		this.cameraRotation.x = x * 12
		this.cameraRotation.y = y * 12
	}

	handleOrientation = (e) => {
		//beta: -180 ~ 180, x axis
		//gamma: -90 ~ 90, y axis
		this.cameraRotation.x = e.gamma * 0.25
		this.cameraRotation.y = e.beta * 0.25 - 12
	}

	animate() {
		if (!this.inited) {
			return
		}
		this.movementPerc = (this.movementPerc + 0.0004) % 1

		const lightPos = this.path.getPointAt((this.movementPerc + 0.005) % 1)
		let cameraPos = this.path.getPointAt(this.movementPerc)

		cameraPos.x += this.cameraRotation.x
		cameraPos.y += this.cameraRotation.y

		this.container.camera.position.set(cameraPos.x,cameraPos.y,cameraPos.z)
		this.container.camera.lookAt(lightPos)

  	this.light.position.set(lightPos.x, lightPos.y, lightPos.z)

  	// light color 
  	const frameCount = this.container.frameCount
  	const r = ~~((sinLookUp(frameCount * 0.019 * this.iconTweak) + 1) * 100 + 47 )
  	const g = ~~((sinLookUp(frameCount * 0.013 * this.iconTweak + 2) + 1) * 100 + 30)
  	const b = ~~((sinLookUp(frameCount * 0.017 * this.iconTweak + 3) + 1) * 100 + 37)
  	const newColor = this.rgb2hex(r, g, b)

  	this.light.color.setHex(newColor)
  	const frameCountV = frameCount * 0.006
  	const iV = 0.3 * this.iconTweak

  	for(let i = 0; i < this.iconGeometry.vertices.length; i++) {
  		const item = this.iconGeometry.vertices[i]
  		const val = sinLookUp(frameCountV + i * iV) * 0.1
  		if (i % 2) {
	  		item.z += val
  		} else {
  			item.x += val
  		}
  	}

  	this.iconGeometry.verticesNeedUpdate = true

  	if (this.iconTweak > 1) {
  		this.iconTweak -= 0.2
  	}
	}

	render(props, states) {
		return (
			<div 
				class={style.tunnel} 
				onClick={this.switchMode}
			>
				<p class='instruction'>Click to change the icons. Move to move the camera.</p>
				<ThreeContainer 
					ref={el => this.container = el}
					cameraZPos={1}
					activeFrameDelay={1}
					animate={() => {this.animate()}}
				/>
			</div>
		)
	}
}
