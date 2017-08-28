import { h, Component } from 'preact'
import {
	CatmullRomCurve3,
	TubeBufferGeometry,
	ShaderMaterial,
	MeshLambertMaterial,
	Mesh,
	BackSide,
	Points,
	Vector3,
	PointLight,
	FaceColors
} from 'three'
import { loadTextures } from '../../utils/TextureLoader'
import ThreeContainer from '../../components/three-container'

import style from './style.scss'

const points = [
  [68.5,185.5],
  [1,262.5],
  [270.9,281.9],
  [345.5,212.8],
  [178,155.7],
  [240.3,72.3],
  [153.4,0.6],
  [52.6,53.3],
  [68.5,185.5]
]

export default class Tunnel extends Component {

	constructor(props) {
		super(props)

		this.state = {
			mode: 0.0
		}

		this.zPlanePos = -50
		this.inited = false
		this.totalMode = 4

		this.movementPerc = 0
		this.path = null
		this.tube = null
		this.shaderMaterial = null
		this.ligth = null
	}

	componentDidMount() {
		// loadTextures([texturePath])
		// 	.then(this.init)

		this.init()
	}

	init = () => {
		
		for (var i = 0; i < points.length; i++) {
		  var x = points[i][0]
		  var y = 0
		  var z = points[i][1] + this.zPlanePos
		  points[i] = new Vector3(x, y, z)
		}

		this.path = new CatmullRomCurve3(points)
		const geometry = new TubeBufferGeometry(this.path, 64, 5, 10, true)
		const material = new MeshLambertMaterial({
			color: 0xecff84,
			emissive: 0x82246d,
		  side : BackSide,

		  // vertexColors : FaceColors,
		  wireframe: false
		})
		this.tube = new Mesh(geometry, material)

		this.light = new PointLight(0xc1f5ff, 1, 50)

		this.container.scene.add(this.tube)
		this.container.scene.add(this.light)

	  this.inited = true
	}

	animate() {
		if (!this.inited) {
			return
		}
		this.movementPerc += 0.0002
		const cameraPos = this.path.getPointAt(this.movementPerc % 1)
		const lightPos = this.path.getPointAt((this.movementPerc + 0.01) % 1)
		this.container.camera.position.set(cameraPos.x,cameraPos.y,cameraPos.z)
		this.container.camera.lookAt(lightPos)
  	this.light.position.set(lightPos.x, lightPos.y, lightPos.z)
	}

	switchMode = () => {
		if (!this.inited) {
			return
		}
		// const nextMode = (this.state.mode + 1) % this.totalMode
		// this.setState({
		// 	mode: nextMode
		// })
		// this.shaderMaterial.uniforms.mode.value = nextMode
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
