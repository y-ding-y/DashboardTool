// import VueI18nPlugin from './i18n-extend'
// import AuthorityPlugin from './authority-plugin'
// import TabsPagePlugin from './tabs-page-plugin'

// const Plugins = {
//   install: function (Vue) {
//     window.$vueApp.use(VueI18nPlugin)
//     window.$vueApp.use(AuthorityPlugin)
//     window.$vueApp.use(TabsPagePlugin)
//   },
// }
// export default Plugins 
import VueI18nPlugin from './i18n-extend'
import AuthorityPlugin from './authority-plugin'
import TabsPagePlugin from './tabs-page-plugin'



export default {
    install: (app) => {
        app.use(VueI18nPlugin)
        app.use(AuthorityPlugin)
        app.use(TabsPagePlugin) 
    },
};

