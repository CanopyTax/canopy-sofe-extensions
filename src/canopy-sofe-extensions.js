import { applyMiddleware, getManifest, getServiceName } from 'sofe';
import { generalToast } from 'toast-service!sofe';

const envs = {
	integ: 'https://cdn-integ.canopy.ninja/sofe-manifest.json',
	'cdn-stage': 'https://cdn-stage.canopy.ninja/sofe-manifest.json',
	prod: 'https://cdn.canopytax.com/sofe-manifest.json',
	spalpatine: 'https://cdn2.canopytax.com/sofe-manifest.json',

	thing: 'https://app-thing.canopy.ninja/sofe-manifest.json',
	groot: 'https://app-groot.canopy.ninja/sofe-manifest.json',
	thanos: 'https://app-thanos.canopy.ninja/sofe-manifest.json',
	beta: 'https://app-beta.canopy.ninja/sofe-manifest.json',
	'app-stage': 'https://app-stage.canopy.ninja/sofe-manifest.json',
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
						generalToast(`Improper usage of sofe inspector - cannot find sofe service '${serviceName}' at the sofe manifest for '${localStorageValue}'`, `I apologize for trying`);
						postLocateNext(postLocateLoad);
					}
				})
				.catch(ex => {
					throw ex;
				});
			} else if (localStorageValue === 'stage') {
				generalToast(`Improper usage of sofe inspector - 'stage' is not a valid canopy sofe extensions value. Do you mean 'cdn-stage'? Or maybe 'app-stage'?`, `I apologize for trying`);
				postLocateNext(postLocateLoad);
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
