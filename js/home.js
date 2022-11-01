import { categoryList,bestseller,productCarousel,productList } from "./module/homePage.js";
import {navBar} from "./module/common.js"
import store from './store/store.js'

var Home = Vue.createApp({
    data(){
        return{
            productList:store.getters.productList,
        }
    },
    computed:{
        authId:()=>{
            return store.state.authId;
        },

    },
    created() {
        window.auth = this.auth;
        this.checkUserInfo();
    },
    destroyed() {

    },
    methods:{

        checkUserInfo(){
            const self = this;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    let userInfo = JSON.parse(this.responseText);
                    //儲存使用者資訊
                    self.$store.commit('setUserInfo',{
                        isLogin:true,
                        userInfo,
                    });
                if(this.readyState == 4 && this.status !=200){
                    //無法登入
                    self.$store.commit('setUserInfo',{
                        isLogin:false,
                    });
                    Swal.fire({
                        icon: 'error',
                        text: '無法順利登入....',
                    })
                }
               }
            };
            oReq.open("GET", 'http://127.0.0.1:8080/myWebSite/user', true);
            oReq.send();
            self.$store.commit('setInitComplete',{isInitFinish:true});
        },
        auth(urlParam){

            const oReq = new XMLHttpRequest();
            const serverAuthUrl = new URL('http://127.0.0.1:8080/myWebSite/linelogin');
            serverAuthUrl.search = urlParam;
            oReq.withCredentials=true;
            const self = this;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    let userInfo = JSON.parse(this.responseText);
                    //儲存使用者資訊
                    self.$store.commit('setUserInfo',{
                        isLogin:true,
                        userInfo,
                    });
                if(this.readyState == 4 && this.status !=200){
                    //無法登入
                    self.$store.commit('setUserInfo',{
                        isLogin:false,
                    });
                    Swal.fire({
                        icon: 'error',
                        text: '無法順利登入....',
                    })
                }
               }
            };
            oReq.addEventListener("error", ()=>{
                Swal.fire({
                    icon: 'error',
                    text: '無法連接至驗證伺服器',
                })
            });
            oReq.open("GET", serverAuthUrl.href, true);
            oReq.send();

        }

    },
    components:{
        navBar,
        categoryList,
        bestseller,
        productCarousel,
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

                    <productCarousel/>
                    <productList v-for='product in productList' :product=product  ></productList>
                </div>
            </div>
        </div>
    
    
    
    `





});
Home.use(store);
Home.mount('#homePage')




