import Vue from 'vue';
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
            primary: '#009688',
            secondary: '#E65100',
            accent: '#E65100',
            error: '#E65100',
            warning: '#E65100',
            info: '#E65100',
            success: '#E65100'
    },
    icons: {
        iconfont: 'mdiSvg',
    },
});
