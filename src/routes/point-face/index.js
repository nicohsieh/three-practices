import { h, Component } from 'preact'
import {
	Geometry,
	ShaderMaterial,
	Points,
	Vector3
} from 'three'
import { loadTextures } from '../../utils/TextureLoader'
import ThreeContainer from '../../components/three-container'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'

import style from './style.scss'

const texturePath = '/assets/images/face.jpg'

export default class ParticleFace extends Component {

	constructor(props) {
		super(props)

		this.zPlanePos = -70
		this.shaderMaterial = null
		this.inited = false
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
	  		mode: {value: 2.0},
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

	animate() {
		if (!this.inited) {
			return
		}
		const actionPos = this.container.actionPos
		let uniforms = this.shaderMaterial.uniforms
		uniforms.time.value += 0.02
		uniforms.point.value.x = actionPos.x
		uniforms.point.value.y = actionPos.y

		if (uniforms.strength.value < 2 && this.container.actionMoving) {
			uniforms.strength.value += 0.2
		}

		if (uniforms.strength.value > 0.2 && !this.container.actionMoving) {
			const amt = (0.2 - uniforms.strength.value) * 0.9
			uniforms.strength.value += Math.max(-0.08, amt)
		}
	}

	render() {
		return (
			<div class={style['particle-face']}>
				<ThreeContainer 
					ref={el => this.container = el}
					actionZPos={this.zPlanePos} cameraZPos={1}
					activeFrameDelay={1}
					customAnimate={() => {this.animate()}}
				/>
			</div>
		);
	}
}
