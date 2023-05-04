import * as funaxios from '@/services/base'


export default {
	install: (app) => {
		app.config.globalProperties.$funAxios = funaxios;
		window.$funAxios = funaxios;
	},
};
