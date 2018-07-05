import { applyMiddleware, getManifest, getServiceName, getServiceUrl, InvalidServiceName } from 'sofe';

const envs = {
  integ: 'https://cdn-integ.canopy.ninja/sofe-manifest.json',
  'cdn-integ': 'https://cdn-integ.canopy.ninja/sofe-manifest.json',
  stage: 'https://cdn-stage.canopy.ninja/sofe-manifest.json',
  'app-stage': 'https://cdn-stage.canopy.ninja/sofe-manifest.json',
  'cdn-stage': 'https://cdn-stage.canopy.ninja/sofe-manifest.json',
  prod: 'https://cdn.canopytax.com/sofe-manifest.json',
};

const localRegex = /^[0-9][0-9][0-9][0-9]$/

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
      } else if (localRegex.test(localStorageValue)) {
        postLocateNext(`https://localhost:${localStorageValue}/${serviceName}.js`);
      } else if (localStorageValue === 'stage') {
        throw new Error(`'stage' is not a valid override for sofe services. Please change your sofe override for '${serviceName}' to be either 'app-stage' or 'cdn-stage'`);
      } else {
        postLocateNext(postLocateLoad);
      }
    } else {
      console.warn(`canopy-sofe-extensions not working properly (overrides to "cdn-stage", "thanos", etc) because sofe's getServiceName function returned something falsy for`, preLocateLoad);
      postLocateNext(postLocateLoad);
    }
  }
}

applyMiddleware(canopyMiddleware);

export function calculatePublicPath(serviceName) {
  let url

  try {
    url = getServiceUrl(serviceName)
  } catch (err) {
  }

  if (!url) {
    const scriptEl = document.querySelector(`script[data-system-amd-name="${serviceName}"]`)
    if (scriptEl) {
      url = scriptEl.src
    }
  }

  if (url) {
    const directory = url.slice(0, url.lastIndexOf('/') + 1)
    return directory
  } else {
    throw new Error(`Cannot set webpack public path for sofe service '${serviceName}'.`)
  }
}
