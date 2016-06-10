import { applyMiddleware, getManifest, getServiceName } from 'sofe';

const envs = {
	integ: 'https://cdn-integ.canopy.ninja/sofe-manifest.json',
	stage: 'https://cdn-stage.canopy.ninja/sofe-manifest.json',
	prod: 'https://cdn.canopytax.com/sofe-manifest.json',
	spalpatine: 'https://cdn2.canopytax.com/sofe-manifest.json',

	thing: 'https://app-thing.canopy.ninja/sofe-manifest.json',
	groot: 'https://app-groot.canopy.ninja/sofe-manifest.json',
	thanos: 'https://app-thanos.canopy.ninja/sofe-manifest.json',
};

const canopyMiddleware = () => (preLocateLoad, preLocateNext) => {
	const serviceName = getServiceName(preLocateLoad);

	preLocateNext(preLocateLoad);

	return (postLocateLoad, postLocateNext) => {
		if (serviceName) {
			const localStorageValue = localStorage.getItem(`sofe:${serviceName}`);
			if (typeof localStorageValue === 'string' && envs[localStorageValue]) {
				getManifest(envs[localStorageValue])
				.then(manifest => {
					if (manifest[serviceName]) {
						console.log(`Overriding sofe service '${serviceName}' to use the version found on '${localStorageValue}'`);
						postLocateNext(manifest[serviceName]);
					} else {
						throw new Error(`Cannot find sofe service '${serviceName}' at the sofe manifest for '${localStorageValue}'`);
					}
				})
				.catch(ex => {
					throw ex;
				});
			} else {
				postLocateNext(postLocateLoad);
			}
		} else {
			console.warn(`canopy-sofe-extensions not working properly (overrides to "stage", "thanos", etc) because sofe's getServiceName function returned something falsy for`, preLocateLoad);
			postLocateNext(postLocateLoad);
		}
	}
}

applyMiddleware(canopyMiddleware);
