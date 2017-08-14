import {
	Scene,
	Camera,
	WebGLRenderer,
	PerspectiveCamera,
	Vector3
} from 'three'
import { h, Component } from 'preact'

import style from './style.scss'

export default class ThreeContainer extends Component {

	constructor(props) {
		super(props)

		this.zPos = props.actionZPos
		this.cameraZPos = props.cameraZPos

		this.actionZPos = props.actionZPos
		this.actionPos = new Vector3()
		this.actionMoving = false
		this.activeFrame = -1000
		this.frameCount = 0
	}

	componentDidMount() {
		this.scene = new Scene()
		this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)

		this.camera.position.z = this.cameraZPos
		
		window.addEventListener('optimizedResize', this.onResize)

		if ('ontouchstart' in window) {
			this.canvas.addEventListener('touchmove', this.onTouchMove)
		} else {
			this.canvas.addEventListener('mousemove', this.onMouseMove)
		}

		this.animate()
	}

	componentWillUnmount() {
		this.scene = null
		this.camera = null
		this.renderer = null

		window.removeEventListener('optimizedResize', this.onResize)

		if ('ontouchstart' in window) {
			this.canvas.removeEventListener('touchmove', this.onTouchMove)
		} else {
			this.canvas.removeEventListener('mousemove', this.onMouseMove)
		}
	}

	onResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
	  this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	onMouseMove = (evt) => {
		const x = evt.clientX
		const y = evt.clientY
		this.updateActionPos(x, y, this.actionZPos)
	}

	onTouchMove = (evt) => {
		const x = evt.touches[0].clientX
		const y = evt.touches[0].clientY
		this.updateActionPos(x, y, this.actionZPos)
	}

	updateActionPos(x, y, z) {
		let vec = new Vector3()
  	vec.x = (x / window.innerWidth) * 2 - 1
		vec.y = -(y / window.innerHeight) * 2 + 1
		vec.z = 0
		vec.unproject(this.camera)

		const dir = vec.sub(this.camera.position).normalize()
		const dist = -this.camera.position.z / dir.z

		this.actionPos = this.camera.position.clone()
		this.actionPos.add(dir.multiplyScalar(dist))

		const amt = this.zPos / dir.z
		this.actionPos.add(dir.multiplyScalar(amt))

		this.activeFrame = this.frameCount
	}


	animate = () => {
		this.renderer.render(this.scene, this.camera)
		this.frameCount++
		this.actionMoving = false
		if (this.props.customAnimate) {
			this.props.customAnimate()
		}
		requestAnimationFrame(this.animate)
	}
	
	render() {
		return (
			<div class={style.container}>
				<canvas ref={el => this.canvas = el} />
			</div>
		);
	}
}
