const cachedManifests = {};

export function resolveUrlFromEnv(name, manifestUrl) {
	return new Promise((resolve, reject) => {
		const cachedManifest = cachedManifests[manifestUrl];
		if (cachedManifest) {
			if (cachedManifest.sofe.manifest[name]) {
				resolve(cachedManifest.sofe.manifest[name]);
			} else if (cachedManifest.sofe.manifestUrl) {
				resolveUrlFromEnv(name, cachedManifest.sofe.manifestUrl)
				.then(resolve)
				.catch(reject);
			} else {
				reject(`Could not find sofe service '${name}' in manifest '${manifestUrl}'`);
			}
		} else {
			fetch(manifestUrl)
			.then(response => {
				if (response.ok) {
					response
					.json()
					.then(json => {
						cachedManifests[manifestUrl] = json;
						// now that it's in the cache, just try this function again to get the data out of the cache

						resolveUrlFromEnv(name, manifestUrl)
						.then(resolve)
						.catch(reject);
					})
					.catch(reject);
				} else {
					console.error(response);
					reject(`HTTP error retrieving manifest at '${manifestUrl}'`);
				}
			})
			.catch(reject);
		}
	});
}
