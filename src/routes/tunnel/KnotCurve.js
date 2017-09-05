import { Curve, Vector3 } from 'three'


export default class KnotCurve extends Curve {
	constructor() {
		super()
	}

	getPoint(t) {
		t *= 2 * Math.PI

		var R = 10
		var s = 50

		var x = s * Math.sin(t)
		var y = Math.cos(t) * (R + s * Math.cos(t))
		var z = Math.sin(t) * (R + s * Math.cos(t))

		return new Vector3(x, y, z)
	}
}
