import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import style from './style'

export default class Home extends Component {
	render() {
		return (
			<div class={style.home}>
				<nav>
					<Link activeClassName={style.active} href="/point-face">Point Face</Link>
					<Link activeClassName={style.active} href="/tunnel">Tunnel</Link>
					<Link activeClassName={style.active} href="/bubbles">Bubbles</Link>
				</nav>
			</div>
		);
	}
}
