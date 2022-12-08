import { categoryList,bestseller,productList } from "./module/homePage.js";
import {navBar} from "./module/common.js"
import store from './store/store.js'
import properties from '../properties.js'
var Home = Vue.createApp({

    computed:{
        //因為productList沒有get方法
        //productList:store.getters.productList,
        productList:{
            get(){
                return store.getters.productList;
            }
        }
        
    },
    created(){
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                store.commit('setProductList',JSON.parse(this.responseText));
           }
        };
        oReq.open("GET", properties.backendResourceProductListUrl, true);
        oReq.send();
    },
    components:{
        navBar,
        categoryList,
        bestseller,
        productList
    },
    template:`
        
        <header style=" height: 100%; position: absolute;overflow: hidden;z-index:1;">
            <navBar/>
        </header>
        <div style=' position: absolute;top:20%;display:flex; flex-direction: column;width: 100%;height: 100%; z-index:0'>

            <div  style='display:flex; flex-direction: row; flex-grow: 1;'>
                <div style='display:none; flex-direction: column;'>
                    
                    <categoryList/>
                    <bestseller/>

                </div>
                <div id ='productArea' >
                    <productList v-for='product in productList' :product=product  ></productList>
                </div>
            </div>
        </div>

    `
});
Home.use(store);
Home.mount('#homePage')




