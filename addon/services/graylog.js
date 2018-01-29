/**
 * @module Service
 *
 */
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { isNone, isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import { getWithDefault, get, set } from '@ember/object';
import Logger from '@busy-web/graylog/utils/logger';
import systemInfo from '@busy-web/graylog/utils/system-info';

/**
 * get browser locale info
 *
 */
function getLocale() {
	let allLanguages = window.navigator.languages;
	if (isNone(allLanguages)) {
		allLanguages = [window.navigator.language];
	}

	let lang = allLanguages.find(language => {
		return (typeof language === 'string');
	});

	if (isNone(lang)) {
		lang = 'en-US';
	}
	return lang;
}

/**
 * add properties to data object
 *
 */
function addProperties(target, data) {
	Object.keys(target).forEach(key => {
		let val = get(target, key);
		if (!/^_/.test(key)) {
			key = `_${key}`;
		}
		set(data, key, val);
	});
}

/**
 * setup data object
 *
 */
function getData(opts={}, config) {
	assert('version not set in graylog.port config settings', !isEmpty(get(config, 'version')));
	assert('short_message is required to send data to graylog', !isEmpty(get(opts, 'short_message')));
	assert('full_message is required to send data to graylog', !isEmpty(get(opts, 'full_message')));

	let data = {
		'version': get(config, 'version'),
		'timestamp': Math.floor(Date.now()/1000),
		'host': getWithDefault(opts, 'host', window.location.hostname),
		'short_message': get(opts, 'short_message'),
		'full_message': get(opts, 'full_message'),
		'level': getWithDefault(opts, 'level', getWithDefault(config, 'level', 1))
	};

	delete opts.short_message;
	delete opts.full_message;
	delete opts.level;
	delete opts.host;

	addProperties(opts, data);

	if (get(config, 'enable_extras')) {
		set(data, '_language', getLocale());

		let { browser, version, platform } = systemInfo();
		set(data, '_platform', browser);
		set(data, '_model', platform);
		set(data, '_os_version', version);

		set(data, '_manufacturer', window.navigator.vendor);
	}

	if (get(config, 'defaults')) {
		addProperties(get(config, 'defaults'), data);
	}
	return data;
}

/**
 * build the url based on config settings for graylog
 *
 */
function getURL(config) {
	assert('api_url not set in graylog.port config settings', !isEmpty(get(config, 'api_url')));
	assert('api_port not set in graylog.port config settings', !isEmpty(get(config, 'api_port')));

	let port = get(config, 'api_port');
	let host = get(config, 'api_url');

	return `${host}:${port}/gelf`;
}

export default Service.extend({
	__config: null,

	init() {
		this._super();

		let owner = getOwner(this);
		let config = owner.resolveRegistration('config:environment');
		let conf = config.graylog || {};

		set(this, '__config', conf);
	},

	/**
	 * send events to graylog
	 *
	 * @public
	 * @method sendEvent
	 * @params data {object} data to send to graylog
	 * @return {RSVP}
	 */
	sendEvent(data={}) {
		let config = get(this, '__config');
		let url = getURL(config);
		let options = getData(data, config);

		return Logger.send(url, options);
	}
});
