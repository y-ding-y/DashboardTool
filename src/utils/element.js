import {
    ElColorPicker as ColorPicker,
    ElCollapse as Collapse,
    ElCollapseItem as CollapseItem,
    ElCarousel as Carousel,
    ElCarouselItem as CarouselItem,
    ElSlider as Slider,
    ElRadio as Radio,
    ElRadioGroup as RadioGroup,
    ElRadioButton as RadioButton,
    ElButton as Button,
    ElButtonGroup as ButtonGroup,
    ElSelect as Select,
    ElOption as Option,
    ElDivider as Divider,
    ElTable as Table,
    ElTableColumn as TableColumn,
    ElLoading as Loading,
    ElTooltip as Tooltip,
    ElDescriptions as Descriptions,
    ElDescriptionsItem as DescriptionsItem,
    ElImage as Image,
} from 'element-plus'

import '@/assets/css/theme-green/index.css' // 浅绿色主题
import '@/assets/css/icon.css'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
    install: (app) => {
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }

        app.use([ColorPicker, Collapse, CollapseItem, Carousel, CarouselItem, Slider, Radio,
            RadioGroup, RadioButton, Button, ButtonGroup, Select, Option, Divider, Table, TableColumn,
            Loading, Tooltip, Descriptions, DescriptionsItem, Image], {
            locale: zhCn,
            size: "default",
        });
    },
};

// window.$vueApp.use(ColorPicker)
// window.$vueApp.use(Collapse)
// window.$vueApp.use(CollapseItem)
// window.$vueApp.use(Carousel)
// window.$vueApp.use(CarouselItem)
// window.$vueApp.use(Slider)
// window.$vueApp.use(Radio)
// window.$vueApp.use(RadioGroup)
// window.$vueApp.use(RadioButton)
// window.$vueApp.use(Button)
// window.$vueApp.use(ButtonGroup)
// window.$vueApp.use(Select)
// window.$vueApp.use(Option)
// window.$vueApp.use(Divider)
// window.$vueApp.use(Table)
// window.$vueApp.use(TableColumn)
// window.$vueApp.use(Loading)
// window.$vueApp.use(Tooltip)
// window.$vueApp.use(Descriptions)
// window.$vueApp.use(DescriptionsItem)
// window.$vueApp.use(Image)
