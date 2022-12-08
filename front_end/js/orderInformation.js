   
import {navBar,needLoginNotification} from "./module/common.js"
import store from './store/store.js'
import properties from '../../properties.js'

const orderProduct ={
    props: ['product'],
    template:`
            <tr>
                <td style='text-align:center;'>{{product.name}}</td>
                <td style='text-align:center;'>{{product.price}}</td>
                <td style='text-align:center;'>{{product.user_demand_quantity}}</td>
                <td style='text-align:right;'>{{product.price*this.product.user_demand_quantity}}</td>
            </tr>
    `
}

const orderList ={
    props:['order'],
    methods:{
        showOrderDetail(id){
            this.$emit('showDetail',id);
        },
    },
    template:`
        <li style='margin: 0px 10vw;' class="list-group-item">
            <div style='width: 50%;'>
                訂單編號:{{order.id}}
            </div>
            <div style='display: flex;'>
                <span style='width:50%'>{{order.describe}}</span>
                <span style='width:30%'>總價:{{order.total}}</span>
                <button style='width:20%' type="button" class="btn btn-secondary" @click='showOrderDetail(order.id)' >顯示更多</button>
            </div>
        </li>
    `
}
var orderDetail = {
    props:['order'],
    data(){
        return{
            orderProductList:[{
              }],
              deliveryInfo:{

              },
              orderProcessInfo:{
                pendingDate:'待處理',
                orderCheckDate:'賣家確認',
                packingProductDate:'處理商品',
                deliveryProductDate:'已送貨',
                finishOrderDate:'完成訂單',
              }
        }
    },
    mounted(){
        let comp =this;
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                comp.deliveryInfo=response.deliveryInfo
                comp.orderProductList=response.orderProductList
                let processInfo = response.orderProcessInfo;
                processInfo.forEach(element => {
                    switch (element.status) {
                        case '待處理':
                            comp.orderProcessInfo.pendingDate=element.date;
                            break;
                        case '賣家確認':
                            comp.orderProcessInfo.orderCheckDate=element.date;
                            break;
                        case '處理商品':
                            comp.orderProcessInfo.packingProductDate=element.date;
                            break;
                        case '已送貨':
                            comp.orderProcessInfo.deliveryProductDate=element.date;
                            break;
                        case '完成訂單':
                            comp.orderProcessInfo.finishOrderDate=element.date;
                            break;
                    }
                });
                
           }
        };
        oReq.open("GET", properties.backendResourceOrderDetailUrl.replace('{orderId}',this.order.id), true);
        oReq.send();
    },
    computed:{
        totalPriceInShoppingCartProduct(){
            let sum=0;
            this.orderProductList.forEach(element => {
                sum +=element.price*element.user_demand_quantity;
            });
            return sum;
        },
    },
    methods:{
        closeDetail(){
            this.$emit('closeDetail');
        },
    },
    components:{
        orderProduct,
        
    },
    template:`
        <div  style=' top: 20%;  background-color:white; width:100%;position: absolute;height:100%;display:flex;flex-direction: row;'>
            <div>
                <div>
                    <ul class="list-group" style='padding: 10px; font-size: 2vw; width: 30vw;'>
                        <li style='background: bisque;text-align: center;'  @click="closeDetail" class="list-group-item">回上一步</li>
                        <li  class="list-group-item">訂單編號:{{order.id}}</li>
                        <li  class="list-group-item"> 訂單總金額:{{totalPriceInShoppingCartProduct}}元</li>
                        <li  class="list-group-item">取貨人姓名:{{deliveryInfo.picker}}</li>
                        <li  class="list-group-item">手機號碼:<br>{{deliveryInfo.cell_phone_number}}</li>
                        <li  class="list-group-item">配送需知:<br>{{deliveryInfo.notice}}</li>
                        <li  class="list-group-item"> 配送類別:{{deliveryInfo.delivery_type}}</li>
                        <li  class="list-group-item"> 位址:<br>{{deliveryInfo.address}}</li>
                        
                        
                    </ul>
                </div>
            </div>
            <div style='position: relative; top: 0vw; width: 60vw;'>
                <div style='display: flex; height: 118px; flex-direction: row; justify-content: space-around; align-items: center;'>
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>待處理</span>
                        <span style ='font-size: 2em;' class="material-symbols-outlined">pending</span>
                        {{orderProcessInfo.pendingDate}}
                    </div>
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>賣家確認</span>
                        <span style ='font-size: 2em;' class="material-symbols-outlined">check_circle</span>
                        {{orderProcessInfo.orderCheckDate}}
                    </div>
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>處理商品</span>
                        <span style ='font-size: 2em;' class="material-symbols-outlined">package</span>
                        {{orderProcessInfo.packingProductDate}}
                    </div>    
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>已送貨</span>
                        <span style ='font-size: 2em;' class="material-symbols-outlined">local_shipping</span>
                        {{orderProcessInfo.deliveryProductDate}}
                    </div>     
                    <div style='display:flex; flex-direction: column; align-items: center;'>
                        <span>完成訂單</span>
                        <span style ='font-size: 2em;' class="material-symbols-outlined">task</span>
                        {{orderProcessInfo.finishOrderDate}}
                    </div>                                              
                </div>
                <hr>
                
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
                        <orderProduct v-for='product in orderProductList' :product=product />
                    </tbody>
                </table>             
            </div>            
        </div>
    `



}
var Home = Vue.createApp({
    data(){
        return{
            showOrderDetail:false,
            orderList:[{}],
            selectedOrder:null,
        }
    },
    mounted(){

        var comp = this;
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                comp.orderList=JSON.parse(this.responseText)
           }
        };
        oReq.open("GET", properties.backendResourceOrderListUrl+'?status=待處理', true);
        oReq.send();
    },
    methods:{
    
        showDetail(id){
            this.selectedOrder = this.orderList.find(function(order) {
                return order.id == id;
            });
            this.showOrderDetail = true;
        },
        closeDetail(){
            this.selectedOrder = null;
            this.showOrderDetail = false;
        },
        choseOrderStatus(event){
            var target = event.target;
            var value = target.innerText;
            var comp = this;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    comp.orderList=JSON.parse(this.responseText)
               }
            };
            oReq.open("GET", properties.backendResourceOrderListUrl+'?status='+value, true);
            oReq.send();
        }

    },
    components:{
        navBar,
        orderList,
        orderDetail,
        needLoginNotification,
    },
    template:`
        <needLoginNotification/>
        <header style=" height: 100%; position: absolute;overflow: hidden;z-index:1;">
            <navBar/>
        </header>
        <div v-if='!showOrderDetail' style ='position: absolute;top:20%;display:flex; flex-direction: column;width: 100%;height: 100%; z-index:0'>
                <div style='display: flex;justify-content: space-around;'>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>待處理</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>賣家確認</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>處理商品</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>已送貨</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>完成訂單</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>取消訂單</button>
                </div>
                <div style='padding: 20px;'>
                    <ul class="list-group" style='font-size:2vw;'>

                        <orderList v-for='order in orderList' :order='order' @showDetail='showDetail' />

                    </ul>
                </div>          
        </div>
        <orderDetail v-if='showOrderDetail' :order='selectedOrder'  @closeDetail='closeDetail'/>
        

    
    `





});
Home.use(store);
Home.mount('#orderInformation')




