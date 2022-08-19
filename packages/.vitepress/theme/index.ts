import Theme from 'vitepress/theme'
import DemoContainer from './components/DemoContainer.vue';

import './styles/vars.css'
import './styles/main.css'

export default {
    ...Theme,
    enhanceApp(ctx: any) {
        ctx.app.component('DemoContainer', DemoContainer)
    },
}
