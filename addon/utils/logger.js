/**
 * @module utils
 *
 */
import $ from 'jquery';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import EmberObject, { getWithDefault, get, set } from '@ember/object';
import { isNone, isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import systemInfo from './system-info';

function post(url, data={}) {
	assert("url is required to send a post message", !isEmpty(url));

	return new RSVP.Promise((resolve, reject) => {
		$.post(url, data, res => {
			run(null, resolve, res);
		}).fail(err => {
			run(null, reject, err);
		});
	});
}

const CONF = {
	version: "1.1",
	enable_extras: true
};

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

function addProperties(target, data) {
	Object.keys(target).forEach(key => {
		let val = get(target, key);
		if (!/^_/.test(key)) {
			key = `_${key}`;
		}
		set(data, key, val);
	});
}

export default EmberObject.extend().reopenClass({
	send(opts={}) {
		assert('host not set in graylog.port config settings', !isEmpty(get(CONF, 'host')));
		assert('port not set in graylog.port config settings', !isEmpty(get(CONF, 'port')));
		assert('version not set in graylog.port config settings', !isEmpty(get(CONF, 'version')));

		assert('short_message is required to send data to graylog', !isEmpty(get(opts, 'short_message')));
		assert('full_message is required to send data to graylog', !isEmpty(get(opts, 'full_message')));


		let port = get(CONF, 'port');
		let host = get(CONF, 'host');
		let url = `${host}:${port}/gelf`;

		let data = {
			'version': get(CONF, 'version'),
			'timestamp': Math.floor(Date.now()/1000),
			'host': getWithDefault(opts, 'host', window.location.hostname),
			'short_message': get(opts, 'short_message'),
			'full_message': get(opts, 'full_message'),
			'level': getWithDefault(opts, 'level', 1)
		};

		delete opts.short_message;
		delete opts.full_message;
		delete opts.level;
		delete opts.host;

		addProperties(opts, data);

		if (get(CONF, 'enable_extras')) {
			set(data, '_language', getLocale());

			let { browser, version, platform } = systemInfo();
			set(data, '_platform', browser);
			set(data, '_model', platform);
			set(data, '_os_version', version);

			set(data, '_manufacturer', window.navigator.vendor);
		}

		console.log(data);
		return post(url, data);
	}
});
