import { h, Component } from 'preact'
import {
	Scene,
	Camera,
	WebGLRenderer,
	PerspectiveCamera,
	Vector3,
	Vector2
} from 'three'
// import * as dat from 'dat.gui/build/dat.gui'

import style from './style.scss'

export default class ThreeContainer extends Component {

	constructor(props) {
		super(props)

		this.cameraZPos = props.cameraZPos

		this.actionMoving = false
		this.activeFrame = -1000

		this.activeFrameDelay = props.activeFrameDelay

		this.frameCount = 0
	}

	componentDidMount() {
		this.scene = new Scene()
		this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true
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
		if (this.props.onMouseMove) {
			this.props.onMouseMove(evt)
		}
		this.setActiveVars()
	}

	onTouchMove = (evt) => {
		if (this.props.onTouchMove) {
			this.props.onTouchMove(evt)
		}
		this.setActiveVars()
	}
	
	setActiveVars() {
		this.actionMoving = true
		this.activeFrame = this.frameCount
	}

	animate = () => {
		if (!this.renderer) {
			return 
		}
		
		this.renderer.render(this.scene, this.camera)
		this.frameCount++
		if (this.frameCount - this.activeFrame > this.activeFrameDelay) {
			this.actionMoving = false
		}
		if (this.props.animate) {
			this.props.animate()
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
