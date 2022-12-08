import {navBar,needLoginNotification} from "./module/common.js"
import {inCartProductComponent,deliveryComponent,orderConfirmationComponent} from "./module/shoppingCartPage.js"
import store from './store/store.js'
import properties from '../properties.js'
var ShoppingCart = Vue.createApp({
    data(){
        return{
            selectedPanel:{
                shoppingCartFlow:true,
                deliveryFlow:false,
                orderConfirmationFlow:false,
            }

        }
    },
    methods:{
        switchPanel(panelName){
            var targetElm =document.getElementById('flowStatusInfo');
            targetElm.childNodes.forEach((item)=>{
                if(item.nodeName=='INPUT' && !(item.value==panelName)){
                    item.style.color='gray';
                }else{
                    item.style.color='black';
                }
            })
            

            let targetPanel;
            switch(panelName){
                case '確認商品':
                    targetPanel='shoppingCartFlow'
                break;
                case '填寫取貨方式':
                    targetPanel='deliveryFlow'
                break;
                case '結帳':
                    targetPanel='orderConfirmationFlow'
                break;
            }
            for (const [key, value] of Object.entries(this.selectedPanel)) {
                if(targetPanel==key){
                    this.selectedPanel[key] =true;
                    continue;
                }
                this.selectedPanel[key] =false;
            }
        }

    },

    components:{
        navBar,
        inCartProductComponent,
        deliveryComponent,
        orderConfirmationComponent,
        needLoginNotification,
    },
    template:`
    <needLoginNotification/>

    <header style=" height: 100%; position: absolute;overflow: hidden;z-index:1;">
        <navBar/>
    </header>
    <div id='flowStatusInfo'  style ='width:100%;height:10vh; display:flex;position: absolute; top: 15%; font-size:3vw;justify-content: center;'>
        
        <input  value='確認商品' type='button' style='width:15vw; border: 1px solid;border-radius: 50px;background-color:white; font-size:0.8em;color:black;' >
        <hr style='width: 20vw; height: 1px; margin: auto 0px;'>
        <input  value='填寫取貨方式' type='button' style='width:18vw;  border: 1px solid;border-radius: 50px;background-color:white;font-size:0.8em;color:gray;' >
        <hr style='width: 20vw; height: 1px; margin: auto 0px;'>
        <input  value='結帳' type='button' style=' width:15vw;  border: 1px solid;border-radius: 50px;background-color:white;font-size:0.8em;color:gray;' >
        
    </div>
    <div  style ='position: absolute;top:30%;display:flex; flex-direction: column;width: 100%;height: 100%; z-index:0'>
        <div  v-if='selectedPanel.shoppingCartFlow'      id ='shoppingCartFlow' class='cartFlowContainer'>
            <div class ='inCartProductContainer'>
                <inCartProductComponent @switch-panel='switchPanel' />
            </div>
        </div>
        <div v-if='selectedPanel.deliveryFlow'           id ='deliveryFlow' class='cartFlowContainer'>            
            <div class ='deliveryFlowContainer'>
                <deliveryComponent @switch-panel='switchPanel'/>
            </div>
        </div>
        <div v-if='selectedPanel.orderConfirmationFlow'  id ='orderConfirmationFlow' class='cartFlowContainer'>            
            <div class ='orderConfirmationFlowContainer'>
                <orderConfirmationComponent @switch-panel='switchPanel'/>
            </div>
        </div>
    </div>

        
        
    
    `





});
ShoppingCart.use(store);
ShoppingCart.mount('#shoppingCart');
 





