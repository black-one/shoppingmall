<template>
  <div class="bottom-bar"> 
    <div class="check-content">
        <check-bottom :is-checked="isSelectAll"  class="check-button" @click.native="checkClick"/>
        <span>全选</span>
    </div>

    <div class="price">合计:{{totalPrice}}</div>

    <div class="calculate" @click="calcClick">
        去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
    import CheckBottom from 'components/content/checkBotton/CheckBotton'
    import { mapGetters } from 'vuex'
export default {
    name: 'CartBottomBar',
    components: {
        CheckBottom
    },
    computed: {
        ...mapGetters(['cartList']),

        totalPrice(){
            return '￥'+this.$store.state.cartList.filter(item=>{
                return item.checked
            }).reduce((preValue,item)=>{
                return preValue + item.price *item.count
            },0).toFixed(2)
        },
        checkLength(){
            // return this.$store.state.cartList.filter(item => item.checked).length
            return this.cartList.filter(item => item.checked).length
        },
        isSelectAll(){
            if(this.cartList.length===0) return false
            //  1.使用filter
            //return  !(this.cartList.filter(item=> !item.checked).length)

            //2.使用find
            //return !this.cartList.find(item=>!item.checked)

            //3.普通遍历
            for(let item of this.cartList) {
                if(!item.checked){
                    return false
                }
            }
            return true
        }
    },
    methods:{
        checkClick(){
            if(this.isSelectAll){ //全部选中
                    this.cartList.forEach(item => item.checked =false)
            } else{ //  部分或全部不选中
                    this.cartList.forEach(item=> item.checked =true)
            }
        },
        calcClick(){
            if(!this.isSelectAll){
                this.$toast.show('请添加需要购买的商品')
            }
            
        }
    }
}
</script>

<style scoped>
    .bottom-bar {
        position: fixed;
        display: flex;
        bottom: 49px;    
        width: 100%;
        height: 44px;
        line-height: 44px;
        background-color: #eee;  
        font-size: 14px;
    }
    .check-content {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 60px;
    }
    .check-button {
        width: 20px;
        height: 20px;
        line-height: 20px;
    }
    .price {
        margin-left: 10px;
        flex: 1;
    }
    .calculate {
        width: 80px;
        height: 45px;
        background-color: red;
        margin-left: 30px;
        color: #fff;
        text-align: center;
    }


</style>           