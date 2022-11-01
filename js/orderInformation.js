
import {navBar} from "./module/common.js"
import store from './store/store.js'
const orderInfo ={
    props: ['product'],
    computed:{
        totalProductPrice(){
            return this.product.price * this.product.customDemandQuantity;
        },
    },
    template:`
        <tr>
            <td>{{this.product.name}}</td>
            <td style='text-align:right;'>{{this.product.price}}</td>
            <td style='text-align:right;'>{{this.product.customDemandQuantity}}</td>
            <td style='text-align:right;'>{{this.product.price*this.product.customDemandQuantity}}</td>
        </tr>
    `
}
const deliveryInfo ={
    data(){
        return{
            deliveryInfo:store.getters.deliveryInfo,
        }
    },
    template:`
        <tr>
            <td colspan='4'>
                <div>
                    取貨人姓名:{{deliveryInfo.personName}}<br>
                    手機號碼:{{deliveryInfo.phoneNumber}}<br>
                    配送需知:{{deliveryInfo.note}}<br>
                    配送類別:{{deliveryInfo.type}}<br>
                    位址:{{deliveryInfo.address}}<br>
                </div>
            </td>
        </tr>


    `
}
var Home = Vue.createApp({
    data(){
        return{
            orderProductList:[{
                id :'04',
                name :'同學真是越夜越美麗同學真同學真是越夜越美',
                price :'18',
                inventoryQuantity:50,
                customDemandQuantity:5,
          
              },{
                id :'05',
                name :'商品二',
                price :'520',
                inventoryQuantity:50,
                customDemandQuantity:3,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              },{
                id :'06',
                name :'商品三',
                price :'0',
                inventoryQuantity:50,
                customDemandQuantity:2,
          
              }],
              deliveryInfo:{
                personName:'XXX',
                phoneNumber:'090000000',
                note:'薯條去鹽',
                type:'宅配',
                address:'jaosdjposajopdsa',
              },
              orderProcessInfo:{
                pendingDate:'2022/01/01',
                orderCheckDate:'2022/01/02',
                packingProductDate:'處理中',
                deliveryProductDate:'...',
                finishOrderDate:'...',
              }

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
        showOrderDeatil(){
            var orderInfoModalElm=document.getElementById('orderInfoModal');
            orderInfoModalElm.style.visibility=orderInfoModalElm.style.visibility=='hidden'?'':'hidden';
        },
        closeOrderInfoModal(){
            var orderInfoModalElm=document.getElementById('orderInfoModal');
            orderInfoModalElm.style.visibility='hidden';
        }

    },
    components:{
        orderInfo,
        deliveryInfo,
        navBar,
    },
    template:`
        
        <header style=" height: 100%; position: absolute;overflow: hidden;z-index:1;">
            <navBar/>
        </header>
        <div  style ='position: absolute;top:20%;display:flex; flex-direction: column;width: 100%;height: 100%; z-index:0'>
                <div style='display: flex;justify-content: space-around;'>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>待處理</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>賣家確認</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>處理商品</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>已送貨</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>完成訂單</button>
                </div>
                <div style='padding: 20px;margin: 20px 10vw;border-radius: 15px;display: flex;background-color: white;background-color: rgb(181, 181, 181);'>
                    <div style='width: 50%;'>
                        訂單編號:12345678901234567890
                    </div>
                    <div style='display: flex;width: 50%;justify-content: space-between;'>
                        <span>商品名稱x1..商品名稱x1商品名稱x1</span>
                        <span>總價:456</span>
                        <button @click='showOrderDeatil'>顯示更多</button>
                    </div>
                </div>             
        </div>
        <div id='orderInfoModal'  style='     visibility: hidden; background-color:white; width:100%;position: absolute;height:100%;display:flex;align-items: center;justify-content: center;flex-direction: column;'>
            <div style='      position: relative;  right: -31vw;top: 1vw;'>
                <button @click='closeOrderInfoModal' style='border-radius: 50%;width: 35px;'>X</button>
            </div>
            <div style=' position: relative;top: 1vw;width:60vw;height:30vw; border:1px solid; padding:25px;overflow-y:scroll;'>
                <div style='display: flex; height: 100px; flex-direction: row; justify-content: space-around; align-items: center;'>
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>待處理</span>
                        <span style ='font-size: 2em;'class="material-symbols-outlined">pending</span>
                        {{orderProcessInfo.pendingDate}}
                    </div>
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>賣家確認</span>
                        <span style ='font-size: 2em;'class="material-symbols-outlined">check_circle</span>
                        {{orderProcessInfo.orderCheckDate}}
                    </div>
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>處理商品</span>
                        <span style ='font-size: 2em;'class="material-symbols-outlined">package</span>
                        {{orderProcessInfo.packingProductDate}}
                    </div>    
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>已送貨</span>
                        <span style ='font-size: 2em;'class="material-symbols-outlined">local_shipping</span>
                        {{orderProcessInfo.deliveryProductDate}}
                    </div>     
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>完成訂單</span>
                        <span style ='font-size: 2em;'class="material-symbols-outlined">task</span>
                        {{orderProcessInfo.finishOrderDate}}
                    </div>                                                                             
                </div>
                <hr>
                <div>訂單編號:12345678901234567890</div>
                <table style='width:100%; border-collapse: collapse;font-size:25pt;'>
                    <thead>
                        <tr>
                            <th>商品名稱</th>
                            <th>單價</th>
                            <th>數量</th>
                            <th>小計</th>
                        </tr>
                    </thead>
                    <tbody>
                        <orderInfo v-for='product in orderProductList' :product=product />
                        <tr>
                            <td>總計</td>
                            <td colspan='3'style='text-align:right;'>{{totalPriceInShoppingCartProduct}}</td>
                        </tr>
                        <deliveryInfo/>
                    </tbody>
                </table>             
            </div>            
        </div>

    
    `





});
Home.use(store);
Home.mount('#orderInformation')




