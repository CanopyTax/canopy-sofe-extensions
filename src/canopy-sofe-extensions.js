import { resolveUrlFromEnv } from './canopy-env-manifests.js';

const envs = {
	integ: 'https://cdn-integ.canopy.ninja/sofe-manifest.json',
	stage: 'https://cdn-stage.canopy.ninja/sofe-manifest.json',
	prod: 'https://cdn.canopytax.com/sofe-manifest.json',

	thing: 'https://app-thing.canopy.ninja/sofe-manifest.json',
	groot: 'https://app-groot.canopy.ninja/sofe-manifest.json',
	thanos: 'https://app-thanos.canopy.ninja/sofe-manifest.json',
};

const originalSystemNormalize = SystemJS.normalize;

SystemJS.normalize = function(name, parentName, parentAddress) {
	const isSofeService = /sofe(@[0-9a-zA-Z\-\.]+)?\.js$/;

	if (isSofeService.test(name)) {
		localStorageOverride = localStorage.getItem(`sofe:${name}`);
		const manifestUrl = envs[localStorageOverride];

		if (manifestUrl) {
			return resolveUrlFromEnv(name.slice(0, name.lastIndexOf('!')), manifestUrl);
		}
	}

	return originalSystemNormalize.apply(this, arguments);
}
