import { h, Component } from 'preact'
import {
	Geometry,
	ShaderMaterial,
	Points,
	Vector2,
	Vector3
} from 'three'
import { sineOut } from 'eases'
import { loadTextures } from '../../utils/textureLoader'
import ThreeContainer from '../../components/three-container'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'

import style from './style.scss'

const texturePath = '/assets/images/face.jpg'

export default class ParticleFace extends Component {

	constructor(props) {
		super(props)

		this.state = {
			mode: 0.0
		}

		this.zPlanePos = -70
		this.mousePos = new Vector3()
		this.actionPos = new Vector2()

		this.shaderMaterial = null
		this.inited = false
		this.totalMode = 4
	}

	componentDidMount() {
		loadTextures([texturePath])
			.then(this.init)
	}

	init = (textures) => {
		let pointGeometry = new Geometry()
	  let colNum = 200
	  let rowNum = 100
	  let spacing = 0.7
	  let total = colNum * rowNum

	  for (let i = 0; i < total; i++) {
	  	let point = new Vector3()
	  	point.x = ((i % colNum) - colNum * 0.5) * spacing
	    point.y = (~~(i / colNum) - rowNum * 0.5) * spacing
	    point.z = this.zPlanePos

	    pointGeometry.vertices.push(point)
	  }

	  this.shaderMaterial = new ShaderMaterial({
	  	uniforms: {
	  		mode: {value: this.state.mode},
	  		time: {value: 0.0},
	  		size: {value: 0.007},
	  		point: {value: new Vector3(0.5, 0.5, this.zPlanePos)},
	  		texture: {type: 't', value: textures[texturePath]},
	  		strength: {type: 'f', value: 0.5}
	  	},
	  	vertexShader: vert,
	  	fragmentShader: frag
	  })

	  let points = new Points(pointGeometry, this.shaderMaterial)
	  this.container.scene.add(points)

	  this.inited = true
	}

	onMouseMove = (evt) => {
		const x = evt.clientX
		const y = evt.clientY
		this.updateActionPos(x, y, this.zPlanePos)
	}

	onTouchMove = (evt) => {
		const x = evt.touches[0].clientX
		const y = evt.touches[0].clientY
		this.updateActionPos(x, y, this.zPlanePos)
	}

	updateActionPos = (x, y, z) => {
		const camera = this.container.camera
		let vec = new Vector3()
  	vec.x = (x / window.innerWidth) * 2 - 1
		vec.y = -(y / window.innerHeight) * 2 + 1
		vec.z = 0
		vec.unproject(this.container.camera)

		const dir = vec.sub(camera.position).normalize()
		const dist = -camera.position.z / dir.z

		this.actionPos = camera.position.clone()
		this.actionPos.add(dir.multiplyScalar(dist))

		const amt = this.zPlanePos / dir.z
		this.actionPos.add(dir.multiplyScalar(amt))
	}

	animate() {
		if (!this.inited) {
			return
		}
		let uniforms = this.shaderMaterial.uniforms
		uniforms.time.value += 0.02
		uniforms.point.value.x = this.actionPos.x
		uniforms.point.value.y = this.actionPos.y

		if (uniforms.strength.value < 2 && this.container.actionMoving) {
			uniforms.strength.value += 0.2
		}

		if (uniforms.strength.value > 0.2 && !this.container.actionMoving) {
			const amt = (0.2 - uniforms.strength.value) * 0.9
			uniforms.strength.value += Math.max(-0.08, amt)
		}
	}

	switchMode = () => {
		if (!this.inited) {
			return
		}
		const nextMode = (this.state.mode + 1) % this.totalMode
		this.setState({
			mode: nextMode
		})
		this.shaderMaterial.uniforms.mode.value = nextMode

	}

	render(props, states) {

		const modeText = `${states.mode+1}/${this.totalMode}`
		return (
			<div class={style['particle-face']} onClick={this.switchMode}>
				<p class='instruction'>
					<b>Click</b> to switch mode {modeText}. <b>Touch/hover</b> to interact.
				</p>
				<ThreeContainer 
					ref={el => this.container = el}
					cameraZPos={1}
					activeFrameDelay={1}
					onMouseMove={this.onMouseMove}
					onTouchMove={this.onTouchMove}
					animate={() => {this.animate()}}
				/>
			</div>
		);
	}
}
