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
	const isSofeService = /!sofe$/;

	if (isSofeService.test(name)) {
		const serviceName = name.slice(0, name.length - '!sofe'.length);
		const localStorageOverride = localStorage.getItem(`sofe:${serviceName}`);
		const manifestUrl = envs[localStorageOverride];

		if (manifestUrl) {
			return resolveUrlFromEnv(serviceName, manifestUrl);
		}
	}

	return originalSystemNormalize.apply(this, arguments);
}
