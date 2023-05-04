import { createI18n } from 'vue-i18n'


export default {
    install: (app) => {
        let i18nOptions = {
            locale: "zh-tw",
            // fallbackLocale: fallback,
            silentFallbackWarn: true,
            globalInjection: true
        }
        app.use(createI18n({
            // legacy: false, // Composition API 模式
            globalInjection: true, // 全局注册 $t方法
            locale: "tw",
        }))
       
    },
};
