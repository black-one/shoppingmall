import BackTop from 'components/content/backTop/BackTop';
import { BACK_POSITION } from './const';


export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isActive: false
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0)
        }
        // listenShowBackTop(position) {
        //     this.isActive = -position.y > BACK_POSITION
        // }
    }

}