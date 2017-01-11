import request from 'superagent';
import yaml from 'js-yaml';

/**
 * Responsible for fetching the Swagger from the given `url` and
 * returning it. Handles `.yaml`, `.yml`, `.json` URL's.
 *
 * Note: URL can be an object, which will just be returned without
 * any further processing.
 *
 * @param {String|Object} url
 */
export function fetchDefinition(url) {
  return (dispatch) => {
    // Hack because I'm a noob at React, if the url is actually an object (JSON)
    // dispatch that instead.
    if (typeof url !== 'string') {
      dispatch(gotDefinition(url));

    // URL is actually a URL, so go fetch the result.
    } else {
      request.get(url).then((response) => {
        if (url.endsWith('yaml') || url.endsWith('yml')) {
          dispatch(gotDefinition(yaml.safeLoad(response.text)));
        } else {
          dispatch(gotDefinition(response.body));
        }
      }).catch((err) => {
        alert(`An error occured fetching definition: ${err.message}`);
      });
    }
  }
}

export function gotDefinition(definition) {
  return {
    type: 'GOT_DEFINITION',
    definition
  }
}
