export default (config, env, helpers) => {
	

	config.module.loaders.push({
		test: /\.glsl$/,
		loader: 'webpack-glsl-loader'
	})
};

