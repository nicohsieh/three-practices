import { h, Component } from 'preact'
import {
	Geometry,
	PointsMaterial,
	Points,
	Vector2,
	Vector3,
	Color,
	AdditiveBlending,
	Math as ThreeMath
} from 'three'
import { loadTextures } from '../../utils/textureLoader'
import ThreeContainer from '../../components/three-container'

import style from './style.scss'

const whitePath = '/assets/images/white.png'


// use shader material
export default class Ponts extends Component {

	constructor(props) {
		super(props)

	}

	componentDidMount() {
		// this.container.scene.background = new Color(0xffffff)
		loadTextures([whitePath])
			.then(this.init)
	}

	init = (textures) => {
		this.gemotery = new Geometry()
		for (let i = 0; i < 1000; i++) {
			let vertex = new Vector3()
			vertex.x = ThreeMath.randFloat(-10, 10)
			vertex.y = ThreeMath.randFloat(-8, 8) + 10
			vertex.z = ThreeMath.randFloat(-10, 6) - 45
			this.gemotery.vertices.push(vertex)
		}

		this.material = new PointsMaterial({
			map: textures[whitePath],
			// color: 0xb7fffa,
			size: 3,
			alphaTest: 0.1,
			// transparent: true,
			blending: AdditiveBlending
		})

		let particles = new Points(this.gemotery, this.material)
		this.container.scene.add(particles)

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
		const fc = this.container.frameCount
		if (!this.inited || fc < 60) {
			return
		}
		const bottom = -25
		for (let i = 0; i < this.gemotery.vertices.length; i++) {
			let vertice = this.gemotery.vertices[i]
			if (vertice.y > bottom) {
				vertice.y -= ((i % 10) + 1) * 0.01 + 0.17 + fc * 0.008
			}
		}

		this.gemotery.verticesNeedUpdate = true
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

		return (
			<div class={style['points']} onClick={this.switchMode}>
				<p class='instruction'>
				</p>
				<ThreeContainer 
					ref={el => this.container = el}
					cameraZPos={1}
					onMouseMove={this.onMouseMove}
					onTouchMove={this.onTouchMove}
					animate={() => {this.animate()}}
				/>
			</div>
		);
	}
}
