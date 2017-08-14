import { h, Component } from 'preact'
import ThreeContainer from '../../components/three-container'

import style from './style.scss'

export default class ParticleFace extends Component {

	render() {
		return (
			<div class={style['particle-face']}>
				<h1>Particle FACE</h1>
				<ThreeContainer actionZPos={-70} cameraZPos={1} />
			</div>
		);
	}
}
