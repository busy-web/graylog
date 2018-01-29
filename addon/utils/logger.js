/**
 * @module utils
 *
 */
import $ from 'jquery';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';

function post(url, data={}) {
	assert("url is required to send a post message", !isEmpty(url));

	return new RSVP.Promise((resolve, reject) => {
		$.ajax({
			url,
			data: JSON.stringify(data),
			type: 'POST',
			dataType: 'josn',
			contentType: 'application/json; charset=UTF-8',
			processData: false,
			success: function(res) {
				run(null, resolve, true);
			},
			error: function(err) {
				run(null, reject, err);
			}
		});
	});
}


export default EmberObject.extend().reopenClass({
	send(url, data={}) {
		return post(url, data);
	}
});
