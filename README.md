# canopy-sofe-extensions

canopy-sofe-extensions is an npm package that is part of canopy common dependencies. It does two things:

1) Provides special sofe overrides of `integ`, `stage`, `prod`, or simply a port number (for localhost)
2) Exports a function, `calculatePublicPath`, that helps you set the webpack public path for a sofe override correctly. Setting
   the public path correctly is required for doing code splitting in a sofe service.

### Example usage
```js
// In your webpack entry file
import {calculatePublicPath} from 'canopy-sofe-extensions'

__webpack_public_path__ = calculatePublicPath("name-of-my-sofe-service")
```

If you need to call dynamic `import()` immediately in a file that gets executed before the entry file, try the following

```js
// In your webpack entry file
import './set-public-path.js' // do this import at the very very top to ensure it is executed first
```

```js
// In set-public-path.js
import {calculatePublicPath} from 'canopy-sofe-extensions'

__webpack_public_path__ = calculatePublicPath("name-of-my-sofe-service")
```
