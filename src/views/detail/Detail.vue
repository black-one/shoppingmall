<template>
  <div id="detail">
   <detail-nav-bar @titleClick="titleClick" class="detail-bar" ref="nav" />
   <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">  
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info  ref="param" :param-info="paramInfo"/>
      <detail-comment-info  ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
   </scroll>
 
 <back-top @click.native="backClick" v-show="isActive"/> 
   <detail-bottom-bar @addCart="addToCart"/>

    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'


  
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'


  import { debounce } from 'common/utils';
  import {backTopMixin} from 'common/mixin';


  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
  import { mapActions } from 'vuex'
  
export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,   
      DetailBottomBar,
      Scroll,
      GoodsList
      // Toast
    },
    mixins: [backTopMixin],
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo:{},
        recommends: [],
         themeTops: [],
         getThemeTop: null,
         themeTopYs: [],
         getThemeTop: null,
         currentIndex: 0,
        //  message: '',
        //  show: false

         
      }
    },
    created(){
      // //1.保存传入的iid
      // this.iid=this.$route.params.iid
      this.iid=this.$route.query.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res=>{
        //1.获取顶部轮播图数据
        console.log(res);
        const data=res.result;
        this.topImages = data.itemInfo.topImages


         //2.请求商品基本数据
        this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        
         // 3.创建店铺信息的对象
        this.shop= new Shop(data.shopInfo)

         // 4.保存商品的详情数据
         this.detailInfo=data.detailInfo;

         //5.获取参数信息
         this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)

         //6.获取评论信息
         if(data.rate.list){
           this.commentInfo=data.rate.list[0];
         }
         
         this.$nextTick(()=>{
        
  
      })
      })

      getRecommend().then(res=>{
        // console.log(res);
        this.recommends=res.data.list
      }) 
      
      this.getThemeTop= debounce(()=>{
        console.log('-------');
         this.themeTopYs.push(0);   
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);
        console.log(this.themeTopYs);
      })
    },
    mounted(){
    },
  methods: {

    ...mapActions(['addCart']),

      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTop()
      },
       
      titleClick(index){
        // console.log(index);
         this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],500)
      },
      contentScroll(position){
        // console.log(position);       
        //1.获取y值
        const positionY=-position.y

        //2.postionY和主题中的值进行对比
        // [0,7938,9309,9607]
        // positionY 在 0和 7938之间，index=0
        // positionY 在= 7938和 9309之间，index=1
        // positionY 在 9309和 9607之间，index=2
        // positionY 大于等于9607，index=3

        let length=this.themeTopYs.length
        // for(let i=0; i<length;i++){
        // if(this.currentIndex !== i &&((i<length-1 && positionY>= this.themeTopYs[i] && positionY <this.themeTopYs[i+1]) || (i===length -1 && positionY >=this.themeTopYs[i]))){
        //     // console.log(i);
        //     this.currentIndex=i;
        //     // console.log(this.currentIndex);
        //     this.$refs.nav.currentIndex=this.currentIndex

        //   }
        // }

        for(let i=0;i<length-1;i++){
          if(this.currentIndex !==i &&(positionY >= this.themeTopYs[i] && positionY <this.themeTopYs[i+1])){
            this.currentIndex=i;
            this.$refs.nav.currentIndex=this.currentIndex
          }
        }

        //  this.listenShowBackTop(position)
         this.isActive= (-position.y)>1000
      },
      addToCart(){
        const product={}
        product.image=this.topImages[0];
        product.title=this.goods.title;
        product.desc=this.goods.desc;
        product.price=this.goods.realPrice;
        product.iid=this.iid;
        console.log(product);
        
        //2.将商品添加到购物车里(1.vuex的细节很重要，监听点击去action.js里面Promise
                              //2. mapActions的映射)
        // this.$store.dispatch('addCart',product).then(res=>{
        //   console.log(res);
        // })

        this.addCart(product).then(res=>{
        //   // console.log(res);
        //   this.show=true;
        //   this.message=res;

        //   setTimeout(()=>{
        //     this.show=false
        //     this.message=""
        //   },1500)

            this.$toast.show(res)
            // console.log(this.$toast);
        })

        
        
      }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 1;
    background-color: #fff;
    height: 100vh;
  }
  .detail-bar{
    position: relative;
    background: #fff;
    z-index: 1;
  }
  
  .content {
    /* height: calc(100% - 44px); */
    position:absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }

</style>