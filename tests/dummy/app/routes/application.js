import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	graylog: service('graylog'),

	model() {
		//this.get('graylog').submit({
		//	short_message: 'Testing graylog setup for web application',
		//	full_message: 'n/a'
		//});

		return {};
	}
});
