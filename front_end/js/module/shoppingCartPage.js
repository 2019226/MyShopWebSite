import store from '../store/store.js'
import properties from '../../properties.js'
const productInfo ={
    props: ['product'],
    computed:{
        totalProductPrice(){
            return this.product.price * this.product.customDemandQuantity;
        },

    },
    methods:{
        addQuantity(){
            
            let data =new Object();
            data['productId']=this.product.id;
            data['demandQuantity']=parseInt(this.product.customDemandQuantity)+1;

            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    store.commit('changeCustomDemandQuantity',data)
                }
                if (this.readyState == 4 && this.status != 200) {
                    let echo = JSON.parse(this.responseText);
                    Swal.fire({
                        icon: echo.status,
                        text: echo.message,
                    })
                }
            }
            oReq.open("post", properties.backendResourceShoppingCartUrl, false);
            oReq.setRequestHeader('Content-Type','application/json;charset=UTF-8');
            oReq.send(JSON.stringify(data));

            
        },
        minusQuantity(){
            if(this.product.customDemandQuantity==1){
                return;
            }
            let data =new Object();
            data['productId']=this.product.id;
            data['demandQuantity']=parseInt(this.product.customDemandQuantity)-1;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    store.commit('changeCustomDemandQuantity',data)
                }
                if (this.readyState == 4 && this.status != 200) {
                    let echo = JSON.parse(this.responseText);
                    Swal.fire({
                        icon: echo.status,
                        text: echo.message,
                    })
                }
            }
            oReq.open("post", properties.backendResourceShoppingCartUrl, false);
            oReq.setRequestHeader('Content-Type','application/json;charset=UTF-8');
            oReq.send(JSON.stringify(data));
        },
        removeProductInShoppingCart(productId){
            var isToReomveProduct=confirm("?????????????????????????????????");
            if(isToReomveProduct){

                const oReq = new XMLHttpRequest();
                oReq.withCredentials=true;
                oReq.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        store.commit('removeProductInShoppingCart',productId);
                    }
                }
                oReq.open("delete", properties.backendResourceShoppingCartUrl+'/'+productId, false);
                oReq.send();

            }
            
        },

    },
    template:`
        <div class="inShoppingCartProduct">
            <div style='    width: 30vw; max-width: 200px;'>
                <img class='inShoppingCartProductImg' :src="product.imageUrl" > 
            </div>    
            <div  class ='inShoppingCartProductInfo'>
                <div >
                    <h5 >{{product.name}}</h5>   
                </div>
                <div>
                    <p style='padding:0px;margin:0px;font-size:0.8em;'>???????????? {{product.inventoryQuantity}}</p> 
                </div>
                <div style='display:flex;align-items: center;'>
                    <p style='width:20vw;padding:0px;margin:0px;font-size:0.8em;'>????????? {{product.price}} ???</p>
                    <p style='width:20vw;padding:0px;margin:0px;font-size:0.8em;'>????????? {{totalProductPrice}} ???</p>
                    <p style='padding:0px;margin:0px;font-size:0.8em;'>????????? </p>  
                    <div style ='border:1px solid black; border-radius:5px;display'>
                        <div @click='minusQuantity' style ='user-select:none; padding: 0px 5px ;display: inline-block;'>-</div>
                        <input disabled style=' width: 5vw;appearance: none;padding: 0px;border: 0px;text-align: center;-webkit-appearance: none;' type='number'   v-model='product.customDemandQuantity'   >
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
                    ???????????????:{{deliveryInfo.picker}}<br>
                    ????????????:{{deliveryInfo.cellPhoneNumber}}<br>
                    ????????????:{{deliveryInfo.notice}}<br>
                    ????????????:{{deliveryInfo.deliveryType}}<br>
                    ??????:{{deliveryInfo.address}}<br>
                </div>
            </td>
        </tr>


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

let inCartProductComponent={
    

    mounted(){
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                store.commit('setInCartProductList',JSON.parse(this.responseText));
            }
        }
        oReq.open("get", properties.backendResourceShoppingCartUrl, false);
        oReq.send();
    },
    components:{
        productInfo,
    },
    computed:{
        totalPriceInShoppingCartProduct(){
            return store.getters.totalPriceInShoppingCartProduct;
        },
        inCartProductList(){
            return store.getters.getInCartProductList;
        }
    },
    methods:{
        confirmOrderProductList(){
            if(this.inCartProductList.length==0){
                Swal.fire({
                    icon: 'error',
                    text: '??????????????????????????????...',
                })
            }else{
                this.$emit('switch-panel','??????????????????')
            }
            
            
        },


    },
    template:`
        <form>
            <productInfo v-for='product in inCartProductList' :product=product />
            <hr>
            <div style='display:flex;align-items: center;justify-content: space-evenly;'>
                <div style='font-size:5vw;'> ????????? {{totalPriceInShoppingCartProduct}}</div>
                <button type="button" class="btn btn-success" @click='confirmOrderProductList'>??????????????????</button>
            </div>

        </form>
        
    `

}
let deliveryComponent={

    computed:{
        deliveryInfo(){
            return store.getters.deliveryInfo
        }
    },
    components:{
        productInfo,
    },
    methods:{

        confirmHomeDelivery(){
            console.log(this.deliveryInfo);
            this.deliveryInfo.deliveryType='??????';
            store.commit('setDeliveryInfo',this.deliveryInfo);
            this.$emit('switch-panel','??????')
            return false;
        },
        previousState(){
            this.$emit('switch-panel','????????????')
        }
    },
    template:`
        <form @submit.prevent='confirmHomeDelivery'>
            <div>
                
                <div style='display:flex;flex-direction: column;align-items:center;'>
                
                    <h1 style='text-align: center;'>???????????????</h1>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">??????</span>
                        <input v-model='deliveryInfo.picker' required type='text' class="form-control" placeholder="????????????????????????" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">??????</span>
                        <input  v-model='deliveryInfo.cellPhoneNumber' required  type="tel"  pattern="[0-9]{10}"   class="form-control" placeholder="0912345678"  aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">??????</span>
                        <input v-model='deliveryInfo.address' required type="text" class="form-control" placeholder="?????????????????????"  aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">??????</span>
                        <textarea v-model='deliveryInfo.notice' required class="form-control" aria-label="??????????????????????????????"></textarea>
                    </div>
                    <hr>
                    <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-around;">
                        <button type="button" class="btn btn-secondary" @click='previousState'>?????????</button>
                        <button type="submit" class="btn btn-success" >????????????</button>
                    </div>
            
                </div>
                
            </div>
        </form>
            


    `


}
let orderConfirmationComponent={
    data(){
        return{
            inCartProductList: store.state.inCartProductList,
            totalPriceInShoppingCartProduct:store.getters.totalPriceInShoppingCartProduct,
        }
    },
    mounted(){
        if(!window.exposed){
            window.exposed= new Object();
            window.exposed.orderComponent={
                postOrderInfoToBackend:this.postOrderInfoToBackend,
            }
        }
    },
    created(){
        window.customMethod={
            postOrderInfoToBackend:this.postOrderInfoToBackend,
        }
    },
    methods:{
        postOrderInfoToBackend(transactionId,orderId){
            var searchParams = new URLSearchParams({
                orderId:orderId,
                transactionId:transactionId
            });
            let data =new Object();
            data = store.getters.deliveryInfo;

            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: '?????????',
                    }).then(()=>{
                        document.location.href='./home.html'
                    })
               }
               if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '???????????????,??????????????????',
                    })
                }
            };
            oReq.open("POST",properties.backendResourceCreateOrderUrl+'?'+searchParams.toString(), false);
            oReq.setRequestHeader('Content-Type','application/json;charset=UTF-8');
            oReq.send(JSON.stringify(data));
        },
        checkOut(){
            
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    window.open(properties.linePayUrl,"")
                }
                if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '??????????????????,??????????????????',
                    })
                }
            };
            oReq.open("GET",properties.backendResourceCheckOutUrl, false);
            oReq.send();
        },
        previousState(){
            this.$emit('switch-panel','??????????????????')
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
                        <th>????????????</th>
                        <th>??????</th>
                        <th>??????</th>
                        <th>??????</th>
                    </tr>
                </thead>
                <tbody>
                    <orderInfo v-for='product in inCartProductList' :product=product />
                    <tr>
                        <td>??????</td>
                        <td colspan='3'style='text-align:right;'>{{totalPriceInShoppingCartProduct}}</td>
                    </tr>
                    <deliveryInfo/>
                </tbody>
            </table>
            <div style='width:100%;display:flex;height:100px;    justify-content: space-around; align-items: center;'>
                <button type="button" class="btn btn-secondary" @click='previousState'>?????????</button>    
                <img @click='checkOut' style='height: 50px;border: 1px solid;padding: 6px;box-shadow: 1px 1px 2px;border-radius: 13px;cursor: pointer;' src='./image/LINE-Pay(h)_W238_n.png'>
            </div>
        </div>



    `

}

export{
    inCartProductComponent,deliveryComponent,orderConfirmationComponent
}