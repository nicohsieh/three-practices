import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<nav>
					<Link class={style.title} href="/">WebGL Practices</Link>
					<Link activeClassName={style.active} href="/point-face">Point Face</Link>
				</nav>
			</header>
		);
	}
}
