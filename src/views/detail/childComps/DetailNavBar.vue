<template>
   <nav-bar>
       <div slot='left' class="back" @click="backClick">
           <img src="~assets/img/common/back.svg" alt="">
       </div>
     <div slot="center" class="title">
      <div class="title-item" v-for="(item, index) in titles" @click="titleClick(index)"
           :class="{active: currentIndex === index}">
        {{item}}
      </div>
    </div>
    </nav-bar>
</template>
   
<script>   
     import NavBar from 'components/common/navbar/NavBar'

export default {
    name: 'DetailNavBar',
    components: {
      NavBar
    },
    data() {
        return {
            titles: ['商品','参数','评论','推荐'],
            currentIndex: 0
        }
        
    },
    methods: {
        titleClick(index){
            // console.log(index);
            this.currentIndex=index;
           this.$emit('titleClick',index);
           
        },
        backClick(){
            this.$router.back()
        }
    }
}
</script>

<style scoped>
    .title {
        display: flex;
    }
    .title-item {
        flex: 1;
        font-size: 13px;
    }
    .active {
        color: var(--color-high-text);
    }
    .back img {
        margin-top: 12px;
        margin-left: 15px;
        
    }
</style>