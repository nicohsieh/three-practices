import { TextureLoader } from 'three'

const TLoader = new TextureLoader()

export function loadTextures(paths) {

	let textures = {}

	return new Promise((resolve, reject) => {
		let loaded = 0
		
		function onError(val) {
			reject(val)
		}

		paths.forEach((item) => {
			
			function onComplete(texture) {
				textures[item] = texture
				loaded ++

				if (loaded === paths.length) {
					resolve(textures)
				}
			}

			TLoader.load(item, onComplete, onError)
		})

	})
}