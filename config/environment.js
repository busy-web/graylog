'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
		graylog: {
			api_url: '<API_URL_HERE>',
			api_port: '<API_PORT_NUMBER_HERE>',
			enable_extras: false,
			version: '1.1',
			level: 1,
			//defaults: {} OPTIONAL DEFAULTS TO SET ON EACH CALL
		}
	};
};
