# @busy-web/graylog

Ember addon for sending app data to graylog endpoints

## Installation

```ember install @busy-web/graylog```

## Setup

Add a graylog config to `config/environment.js` with the following code.

```javascript
let ENV = {
	graylog: {
		api_url: '<API_URL_HERE>',				// api url
		api_port: '<API_PORT_NUMBER_HERE>',		// api port number
		enable_extras: false,					// set this to true will enable platform, model, os_version, and manufacturer to send an all calls.
		version: '1.1',							// graylog version number
		level: 1,								// graylog log level

		/*
		defaults: { // optional default values to send on all calls.
			// key: value,
		}
		*/
	}
}
```

## Usage

Use graylog by adding the service to your Routes or Controllers

```javascript
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	graylog: service(),

	model() {
		this.get('graylog').sendEvent({
			short_message: 'Message_details',
			full_message: 'Full message',
			level: 1,
			_custom_fields: 'custom'
		});

		return {};
	}
});
```

## Contribute

Contributions are welcome. Just fork the repository, and make the desired changes. Then create a Pull Request for review.
