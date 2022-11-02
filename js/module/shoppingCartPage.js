import store from '../store/store.js'
const productInfo ={
    props: ['product'],
    computed:{
        totalProductPrice(){
            return this.product.price * this.product.customDemandQuantity;
        },

    },
    methods:{
        addQuantity(){
            this.product.customDemandQuantity++;
        },
        minusQuantity(){
            if(this.product.customDemandQuantity==0){
                return;
            }
            this.product.customDemandQuantity--;
        },
        removeProductInShoppingCart(productId){
            var isToReomveProduct=confirm("真的要刪除這項商品嗎？");
            if(isToReomveProduct){
                store.commit('removeProductInShoppingCart',productId);
            }
            
        },

    },
    template:`
        <div class="inShoppingCartProduct">
            <div style='    width: 30vw; max-width: 200px;'>
                <img class='inShoppingCartProductImg' src="./image/productNo1.jpeg" > 
            </div>    
            <div  class ='inShoppingCartProductInfo'>
                <div >
                    <h5 >{{product.name}}</h5>   
                </div>
                <div>
                    <p style='padding:0px;margin:0px;font-size:0.8em;'>庫存量： {{product.inventoryQuantity}}</p> 
                </div>
                <div style='display:flex;align-items: center;'>
                    <p style='width:20vw;padding:0px;margin:0px;font-size:0.8em;'>價格： {{product.price}} 元</p>
                    <p style='width:20vw;padding:0px;margin:0px;font-size:0.8em;'>總價： {{totalProductPrice}} 元</p>
                    <p style='padding:0px;margin:0px;font-size:0.8em;'>數量： </p>  
                    <div style ='border:1px solid black; border-radius:5px;display'>
                        <div @click='minusQuantity' style ='user-select:none; padding: 0px 5px ;display: inline-block;'>-</div>
                        <input disabled style=' width: 5vw;appearance: none;padding: 0px;border: 0px;text-align: center;-webkit-appearance: none;' type='number' :value='product.customDemandQuantity'  v-model='product.customDemandQuantity'   ></input>
                        <div  @click='addQuantity' style ='user-select:none; padding: 0px 5px ; display: inline-block;'>+</div>
                    </div>
                    
                </div>
            </div>
            <div @click='removeProductInShoppingCart(product.id)' style='flex-grow:1;background-color: rgb(135 134 134 / 60%);border-radius: 0px 15px 15px 0px;display: flex;align-items: center;justify-content: center;'>
                <span style ='font-size: 2.5em;' class="material-symbols-outlined">
                delete
                </span>
            </div>
        </div>
    `
}
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
let inCartProductComponent={
    data(){
        return{
            inCartProductList: store.state.inCartProductList,

        }
    },
    components:{
        productInfo,
    },
    computed:{
        totalPriceInShoppingCartProduct(){
            return store.getters.totalPriceInShoppingCartProduct;
        }
    },
    methods:{
        changeToDeliveryFlow(){
            var shoppingCartFlow = document.querySelector("#shoppingCartFlow");
            shoppingCartFlow.style.display='none';
        },

    },
    template:`
        <form>
            <productInfo v-for='product in inCartProductList' :product=product />
            <hr>
            <div style='display:flex;align-items: center;justify-content: space-evenly;'>
                <div style='font-size:5vw;'> 總計： {{totalPriceInShoppingCartProduct}}</div>
                <input @click='changeToDeliveryFlow' type='button' value='填寫取貨方式' style='background-color:#ffc60099; border: 1px solid;border-radius: 21px;height:8vh;text-align:center;'> 
            </div>

        </form>
        
    `

}
let deliveryComponent={
    data(){
        return{
            deliveryInfo:{
                personName:'',
                phoneNumber:'',
                note:'',
                type:'',
                address:'',
            }
        }
    },
    components:{
        productInfo,
    },
    methods:{
        choseHomeDelivery(){
            var homeDeliveryElm=document.querySelector('#home_delivery');
            var inStorePickup=document.querySelector('#in_store_pickup');
            homeDeliveryElm.style.display='block';
            inStorePickup.style.display='none';
        },
        choseInStorePickup(){
            var homeDeliveryElm=document.querySelector('#home_delivery');
            var inStorePickup=document.querySelector('#in_store_pickup');
            homeDeliveryElm.style.display='none';
            inStorePickup.style.display='block';
        },
        confirmHomeDelivery(){
            deliveryInfo.type='宅配';
            store.commit('setDeliveryInfo',{deliveryInfo});
        },
        confirmInStorePickup(){
            deliveryInfo.type='超商取貨';
            store.commit('setDeliveryInfo',{deliveryInfo});
        }
    },
    template:`

        <div>
            <div style='display:flex;flex-direction: column;'>
                <h1 style='text-align: center;'>取貨人資訊</h1>
                <input v-model='deliveryInfo.persoaaaanName' type='text' placeholder='請輸入取貨人姓名'>
                <input v-model='deliveryInfo.phoneNumber' type='text' placeholder='請輸入手機號碼'>
                <input v-model='deliveryInfo.note' type='text' placeholder='你要告訴店家的悄悄話'>
            </div>
            <hr>
            <div style='display: flex;justify-content: center;padding:30px 0px;'>
                <input @click='choseHomeDelivery()' style='width:30%;border: 1px solid black;width: 30%;background-color: white;border-radius: 30px;margin: 0px 1vw;' type='button' value='宅配到家' >  
                <input @click='choseInStorePickup()' style='width:30%;border: 1px solid black;width: 30%;background-color: white;border-radius: 30px;margin: 0px 1vw;' type='button' value='超商取貨' >  
            </div>
            <div id='home_delivery' style='text-align: center;display:none;'>
                <input v-model='deliveryInfo.address'  type='text' placeholder='請輸入住家位址...'>
                <hr>
                <button @click='confirmHomeDelivery'>確認我要宅配到家</button>
            </div>
            <div id='in_store_pickup' style ='text-align: center; display:none;'>
                <select>
                    <option>  </option>
                    <option>7-11</option>
                    <option>萊爾富</option>
                    <option>ok</option>
                    <option>全家</option>
                </select>
                <button>選擇門市</button>
                <br>
                <input  style ='margin:10px;'type='text'/>
                <hr>
                <button @click='confirmInStorePickup'>確認我要超商取貨</button>
            </div>
        </div>
    `


}
let orderConfirmationComponent={
    data(){
        return{
            inCartProductList: store.state.inCartProductList,
            totalPriceInShoppingCartProduct:store.getters.totalPriceInShoppingCartProduct,
        }
    },
    components:{
        orderInfo,
        deliveryInfo,
    },
    template:`
        <div style='width"inherit;margin: 5%;'>
            <table style='width:100%; border-collapse: collapse;'>
                <thead>
                    <tr>
                        <th>商品名稱</th>
                        <th>單價</th>
                        <th>數量</th>
                        <th>小計</th>
                    </tr>
                </thead>
                <tbody>
                    <orderInfo v-for='product in inCartProductList' :product=product />
                    <tr>
                        <td>總計</td>
                        <td colspan='3'style='text-align:right;'>{{totalPriceInShoppingCartProduct}}</td>
                    </tr>
                    <deliveryInfo/>
                </tbody>
            </table>
            <div style='width:100%;display:flex;height:100px;    justify-content: flex-end; align-items: center;'>
                <img style='height: 50px;border: 1px solid;padding: 6px;box-shadow: 1px 1px 2px;border-radius: 13px;cursor: pointer;' src='./image/LINE-Pay(h)_W238_n.png'>
            </div>
        </div>



    `

}

export{
    inCartProductComponent,deliveryComponent,orderConfirmationComponent
}