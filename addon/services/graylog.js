/**
 * @module Service
 *
 */
import Service from '@ember/service';
import Logger from '@busy-web/graylog/utils/logger';

export default Service.extend({
	submit(data={}) {
		return Logger.send(data).then(res => {
			console.log('success', res);
		}).catch(err => {
			console.log('err', err);
		});
	}
});
