import {navBar} from "./module/common.js"
import {inCartProductComponent,deliveryComponent,orderConfirmationComponent} from "./module/shoppingCartPage.js"
import store from './store/store.js'

var ShoppingCart = Vue.createApp({
    data(){
        return{
            windowWidth:0,
            productList:store.state.productList,
     
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

        },
        sliderSwitcher(event){
            
            let targetElmId = event.currentTarget.id;
            

            if(targetElmId ==='checkOrder'){
                const fadeOutElm=document.getElementById('shoppingCartFlow');
                fadeOutElm.classList.toggle('fadeOutBySliderLeft');
                const fadeInElm=document.getElementById('checkOrderFlow');
                fadeInElm.classList.toggle('fadeInBySliderRight');
                fadeInElm.classList.toggle('inactiveFlow');
                setTimeout(() => {
                    fadeOutElm.classList.toggle('fadeOutBySliderLeft');
                    fadeOutElm.style.opacity= 0;
                    fadeOutElm.style.display= 'none';
                    fadeOutElm.style.width= '100%';
                    fadeInElm.classList.toggle('fadeInBySliderRight');
                    fadeInElm.style.width= '100vw';
                }, 2000) 
            }

        }

    },
    components:{
        navBar,
        inCartProductComponent,
        deliveryComponent,
        orderConfirmationComponent,
    },
    template:`
        
    <header style=" height: 100%; position: absolute;overflow: hidden;z-index:1;">
        <navBar/>
    </header>
    <div style ='width:100%;height:10vh; display:flex;position: absolute; top: 15%; font-size:3vw;justify-content: space-around;'>
        <input value='確認商品' type='button' style='background-color:white; border:0px;font-size:1em;color:black;' >
        <input value='填寫取貨方式' type='button' style=' background-color:white;border:0px;font-size:1em;color:gray;' >
        <input value='結帳' type='button' style='background-color:white;border:0px;font-size:1em;color:gray;' >
    </div>
    <div  style ='position: absolute;top:25%;display:flex; flex-direction: column;width: 100%;height: 100%; z-index:0'>
        <div id ='shoppingCartFlow' class='cartFlowContainer'>
            <div class ='inCartProductContainer'>
                <inCartProductComponent/>
            </div>
        </div>
        <div id ='deliveryFlow' class='cartFlowContainer'>            
            <div class ='deliveryFlowContainer'>
                <deliveryComponent/>
            </div>
        </div>
        <div id ='orderConfirmationFlow' class='cartFlowContainer'>            
            <div class ='orderConfirmationFlowContainer'>
                <orderConfirmationComponent/>
            </div>
        </div>
    </div>

        
        
    
    `





});
ShoppingCart.use(store);
ShoppingCart.mount('#shoppingCart')




