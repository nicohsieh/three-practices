import { h, Component } from 'preact'
import {
	Geometry,
	ShaderMaterial,
	Points,
	Vector3
} from 'three'
import ThreeContainer from '../../components/three-container'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'

import style from './style.scss'

export default class ParticleFace extends Component {

	constructor(props) {
		super(props)

		this.zPlanePos = -70
		this.shaderMaterial = null
	}

	componentDidMount() {
		this.init()
	}

	init() {
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

	  	},
	  	vertexShader: vert,
	  	fragmentShader: frag
	  })

	  let points = new Points(pointGeometry, this.shaderMaterial)
	  this.threeContainer.scene.add(points)
	}

	animate() {

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
