import store from './store/store.js'
import Cropper from './module/cropper.js'

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

const orderInfoChangeComponent={
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
                packingProductDate:'',
                deliveryProductDate:'',
                finishOrderDate:'',
              }

        }
    },
    components:{
        orderInfo,
        deliveryInfo,
    },
    methods:{
        showOrderDeatil(){
            var orderInfoModalElm=document.getElementById('orderInfoModal');
            orderInfoModalElm.style.visibility=orderInfoModalElm.style.visibility=='hidden'?'':'hidden';
        },
        closeOrderInfoModal(){
            var orderInfoModalElm=document.getElementById('orderInfoModal');
            orderInfoModalElm.style.visibility='hidden';
        },
        changeOrderStatus(status){
            console.log(status);
        }
    },
    template:`
            <div  style ='top:20px;display:flex; flex-direction: column;width: 100%;'>
                <div style='display: flex;justify-content: space-around;'>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>待處理</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>賣家確認</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>處理商品</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>已送貨</button>
                    <button style='border: 0px;background-color: white;font-size: 3vw;'>完成訂單</button>
                </div>
                <div style='padding: 20px;margin: 20px 3vw;border-radius: 15px;display: flex;background-color: white;background-color: rgb(181, 181, 181);'>
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
            <div id='orderInfoModal'  style='     visibility: hidden; background-color:white; width:-webkit-fill-available;position: absolute;height:100%;display:flex;align-items: center;flex-direction: column; top: 0px;'>
                <div style="position: relative;top: 1vw;width: -webkit-fill-available;height: 650px;border: 1px solid;padding: 25px;overflow-y: scroll;">
                    <div style='display: flex; height: 100px; flex-direction: row; justify-content: space-around; align-items: center;'>
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>待處理</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">pending</span>
                            <div>
                                <span v-if='orderProcessInfo.pendingDate!=""'>
                                    {{orderProcessInfo.pendingDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("pending")'>完成</button>
                                </span>
                            </div>
                        </div>
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>賣家確認</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">check_circle</span>
                            <div>
                                <span v-if='orderProcessInfo.orderCheckDate!=""'>
                                    {{orderProcessInfo.orderCheckDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("check")'>完成</button>
                                </span>
                            </div>
                        </div>
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>處理商品</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">package</span>
                            <div>
                                <span v-if='orderProcessInfo.packingProductDate!=""'>
                                    {{orderProcessInfo.packingProductDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("packing")'>完成</button>
                                </span>
                            </div>
                            
                        </div>    
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>已送貨</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">local_shipping</span>
                            <div>
                                <span v-if='orderProcessInfo.deliveryProductDate!=""'>
                                    {{orderProcessInfo.deliveryProductDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("delivery")'>完成</button>
                                </span>
                            </div>                            
                        </div>     
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>完成訂單</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">task</span>
                            <div>
                                <span v-if='orderProcessInfo.finishOrderDate!=""'>
                                    {{orderProcessInfo.finishOrderDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("finish")'>完成</button>
                                </span>
                            </div>                                                           
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
                <div style='margin-top: 30px;'>
                    <button @click='closeOrderInfoModal' >返回訂單管理頁面</button>
                </div>           
            </div>

    `
}
const productInfoChangeComponent={
    props: {
        action:{},
        product: {
          default: {
            id:'',
            name:'',
            describe:'',
            price:'',
            inventoryQuantity:'',
          },
          type: Object
        }
    },
    methods:{
        goBack(){
            document.getElementById('productManagePanel').style.display='';
            document.getElementById('productDetailPanel').style.display='none';  
        },
        whenUserUploadedImageThenShowIt(evnet){
            var targetElm = evnet.target;
            if(targetElm.files && targetElm.files[0]){
            
              var imageTagID = targetElm.getAttribute("previewImageId");
            
              var reader = new FileReader();
            
              reader.onload = function (e) {

                 var img = document.getElementById(imageTagID);
                 img.setAttribute("src", e.target.result);
                 /*設定圖片大小*/ 
                 if(window.cropper){
                    window.cropper.destroy();
                 }
                 window.cropper = new Cropper(img, {
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: false,
                    center: true,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: false,
                    toggleDragModeOnDblclick: false,
                    data:{ //define cropbox size
                        width: 600,
                        height:  600,
                      },
                }); 
            
              }
            
              reader.readAsDataURL(targetElm.files[0]);
            
            }
        },
        showCropperedImage(event){
            if(!window.cropper){
               return;
            }
            var targetElm =event.target;
            var imageTagID = targetElm.getAttribute("previewImageId");
            var img = document.getElementById(imageTagID);
            img.setAttribute("src", window.cropper.getCroppedCanvas().toDataURL());
            window.cropper.destroy();
        }
    },
    template:`
        <div style='display: flex; height: 650px; flex-direction: row;'>
            <div style="display: flex;width: 50%;background-color: gray;flex-direction: column;">
                <input  @change='whenUserUploadedImageThenShowIt($event)' previewImageId='previewImg' type="file" name="productImage" accept="image/png, image/jpg, image/jpeg" />
                <img id="previewImg" src="#"     style="     width: 100%;     height: 580px; " />
                <button previewImageId='previewImg' @click='showCropperedImage($event)'>剪裁</button>
            </div>
            <div style='width:50%;padding: 50px;'>
                <div> <label style='width:100px;'>商品名稱</label><input type='text' v-model='product.name'></div>
                <div> <label style='width:100px;'>商品描述</label><input type='text' v-model='product.describe'></div>
                <div> <label style='width:100px;'>單價</label><input type='text' v-model='product.price'></div>
                <div> <label style='width:100px;'>庫存</label><input type='text' v-model='product.inventoryQuantity'></div>
            </div>
        </div> 
        <div style='margin: 10px;padding: 5px;display: flex;align-items: center;justify-content: space-around;height: 50px;"'>
            
            <button v-if='action.create'>新增商品</button>
            <button v-if='action.modify'>變更</button>
            <button @click='goBack' >回到商品管理頁面</button>
        </div>           
        
        
    `
}
const productInfo ={

    props: ['product'],
    methods:{
        openProductChangeComponent(action,productId){
            this.$emit("productInfoButtonClick",action,productId);
        }
    },
    template:`
        <div style="display: flex;align-items: center;border: 1px solid;border-radius: 10px;margin:10px 0px;">
            <div style='width:100px;margin-right:10px;'>
                <img style ='border:0px;border-radius:10px 0px 0px 10px;'class='productImg' src="./image/productNo1.jpeg" >
            </div> 
            <div style='width:50%;'>
                <p style='width: -webkit-fill-available;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'>{{product.name}}</p>                
            </div> 
            <div style='width:20%;'>
                <span>{{product.price}}</span>
            </div>             
            <div style='width:10%;'>
                <span>{{product.inventoryQuantity}}</span>
            </div> 
            <div style='width:10%;'>
                <span @click='openProductChangeComponent("modify",product.id)' style='font-size: 30pt; background-color: #f4b36f; border-radius: 10px;margin: 8px;' class="material-symbols-outlined">edit</span>
                <span @click='openProductChangeComponent("delete",product.id)' style='font-size: 30pt; background-color: #f4b36f; border-radius: 10px;margin: 8px;' class="material-symbols-outlined">delete</span>
            </div>                                     
        </div>

    `
}
var Home = Vue.createApp({ 
    data(){
        return{
            action:{
              
               
            },
            productList:[{
                id :'04',
                name :'同學真是越夜越美麗同學真是越夜越美麗',
                price :'18',
                describe:'同學真是越夜越美麗',
                inventoryQuantity:50,
              },{
                id :'05',
                name :'商品二',
                price :'520',
                currency:'新台幣',
                describe:'月老的紅線',
                inventoryQuantity:50,
        
                isAddToCart:false,
              },{
                id :'06',
                name :'商品三',
                price :'0',
                currency:'紙錢',
                describe:'孟婆湯',
                inventoryQuantity:50,
        
                isAddToCart:false,
              },{
                id :'07',
                name :'商品四',
                price :'18',
                currency:'新台幣',
                describe:'老闆吃了沒用',
                inventoryQuantity:50,
        
                isAddToCart:false,
              },{
                id :'08',
                name :'人生的下一站',
                price :'210',
                currency:'新台幣',
                describe:'車票',
                inventoryQuantity:50,
        
                isAddToCart:false,
              },{
                id :'09',
                name :'人生的下一站',
                price :'210',
                currency:'新台幣',
                describe:'車票',
                inventoryQuantity:50,
        
                isAddToCart:false,
              },{
                id :'10',
                name :'人生的下一站',
                price :'210',
                currency:'新台幣',
                describe:'車票',
                inventoryQuantity:50,
        
                isAddToCart:false,
              }
            ],
            selectedProduct:{
            },
            forceToReload:0,
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
        switchToClickedPanel(event){
            //按鈕效果
            var functionList=document.querySelectorAll('#functionList > div > button');
            functionList.forEach(element => {
                if(element.innerHTML!=event.target.innerHTML){
                    element.classList.remove('activePanel');
                }
            });
            event.target.classList.toggle('activePanel');
            //面板的顯示與隱藏
            var panelList = document.querySelectorAll('#panelList > div');
            panelList.forEach(element=>{
                element.style.display='none';
            });
            switch(event.target.innerHTML){
                case '商品管理':
                    document.getElementById('productManagePanel').style.display='block';
                break;
                case '訂單管理':
                    document.getElementById('orderManagePanel').style.display='block';
                break;
            }
        },
        productInfoButtonClick(action,productId=''){
            this.forceToReload++;
            console.log(this.forceToReload)
            console.log(this.selectedProduct.name)
            var newAction= new Object();
            newAction[action]=true;
            this.action=newAction;
            if(this.productList.find((product)=>{return product.id==productId})){
                this.selectedProduct =JSON.parse(JSON.stringify(this.productList.find((product)=>{return product.id==productId}))) ;
            }else{
                this.selectedProduct={};
            }
            
            if(action=='delete'){
                alert('已刪除');
            }else{
                document.getElementById('productManagePanel').style.display='none';
                document.getElementById('productDetailPanel').style.display='';  
            }
        },

    },
    components:{
        productInfo,
        productInfoChangeComponent,
        orderInfoChangeComponent,
    },
    template:`
        
        <div style='width:100%;height:100%; display:flex;'>
            <div style='display: flex;padding-top: 20px;width: 300px;border: 1px solid;flex-direction: column;justify-content: space-between;'>
                <div id='functionList'style='width:inherit;'>
                    <div style='width:inherit;'>
                        <button @click='switchToClickedPanel($event)' style="width: inherit;height: 50px;">商品管理</button>
                    </div>   
                    <div style='width:inherit;'>
                        <button @click='switchToClickedPanel($event)' style="width: inherit;height: 50px;">訂單管理</button>
                    </div>                
                </div>
                <div style='width:inherit;'>
                    <button style='width:inherit;height: 50px;background-color:rgb(128 192 91);border:0px;'>登出</button>
                </div>
            </div>
            <div id='panelList' style='flex-grow:1;padding:10px;'>
                <div id ='productManagePanel'  >
                    <div style=" background-color: cadetblue; display: flex; padding: 10px; ">
                        <span style='width:100px;'>商品圖片</span>
                        <span style='width:50%;'>商品名稱</span>
                        <span style='width:20%;'>單價</span>
                        <span style='width:10%;'>庫存量</span>
                        <span style='width:10%;'></span>
                    </div>
                    <div style='height:550px;overflow-y:scroll;'>
                        <productInfo  v-for='product in productList' :product=product  @productInfoButtonClick="productInfoButtonClick" />
                    </div>                    
                    <div @click='productInfoButtonClick("create")' style='margin: 30px;padding: 5px;display: flex;align-items: center;justify-content: center;height: 50px;background-color: gray;border-radius: 10px;"'>
                        <span  style='font-size:40pt;' class="material-symbols-outlined"> add_circle </span>
                    </div>
                </div>
                <div id ='orderManagePanel' style='display:none;'>
                    <orderInfoChangeComponent/>
                </div>
                <div id ='productDetailPanel' style='display:none;'>
                    <productInfoChangeComponent :action=action :product=selectedProduct :key='forceToReload'/>
                </div>
            </div>
        </div>
    
    `





});
Home.use(store);
Home.mount('#backstageManagement')




