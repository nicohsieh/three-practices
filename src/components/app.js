import { h, Component } from 'preact'
import { Router } from 'preact-router'

import { optimizedResize } from '../utils/customEvents' 
import Header from './header'
import Home from '../routes/home'
import Profile from '../routes/profile'
import PointFace from '../routes/point-face'
import Tunnel from '../routes/tunnel'
import Points from '../routes/points'

// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {

	componentWillMount() {
		optimizedResize()
	}
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	}

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<PointFace path='/point-face' />
					<Tunnel path='/tunnel' />
					<Points path='/bubbles' />
				</Router>
			</div>
		);
	}
}
