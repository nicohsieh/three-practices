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
	  		time: {value: 0.0},
	  		point: {value: new Vector3(0.5, 0.5, this.zPlanePos)},
	  		texture: {type: 't', value: textures[texturePath]},
	  		strength: {type: 'f', value: 0.5}
	  	},
	  	vertexShader: vert,
	  	fragmentShader: frag
	  })

	  let points = new Points(pointGeometry, this.shaderMaterial)
	  this.threeContainer.scene.add(points)

	  this.inited = true
	}

	animate() {
		if (!this.inited) {
			return
		}
	}

	render() {
		return (
			<div class={style['particle-face']}>
				<h1>Particle FACE!</h1>
				<ThreeContainer 
					ref={el => this.threeContainer = el}
					actionZPos={this.zPlanePos} cameraZPos={1}
					customAnimate={this.animate}
				/>
			</div>
		);
	}
}
