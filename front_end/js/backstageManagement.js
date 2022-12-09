import store from './store/store.js'
import Cropper from './module/cropper.js'
import properties from '../properties.js'
import {needLoginNotification} from "./module/common.js"
const orderProductInfo ={
    props: ['product'],
    template:`
        <tr>
            <td>{{this.product.name}}</td>
            <td style='text-align:right;'>{{this.product.price}}</td>
            <td style='text-align:right;'>{{this.product.user_demand_quantity}}</td>
            <td style='text-align:right;'>{{this.product.price*this.product.user_demand_quantity}}</td>
        </tr>
    `
}
const orderDetail={
    data(){
        return{
            orderProductList:[{
                id :'',
                name :'',
                price :'',
                user_demand_quantity:0,
          
              },],
              deliveryInfo:{
                personName:'',
                phoneNumber:'',
                note:'',
                type:'',
                address:'',
              },
              orderProcessInfo:{
                pendingDate:'',
                orderCheckDate:'',
                packingProductDate:'',
                deliveryProductDate:'',
                finishOrderDate:'',
              }
        }
    },
    computed:{
        totalPriceInShoppingCartProduct(){
            let sum=0;
            this.orderProductList.forEach(element => {
                sum +=element.price*element.user_demand_quantity;
            });
            return sum;
        },
        orderCancelable(){
            let cancelable =false;
            if(this.orderProcessInfo.finishOrderDate=="處理中"||this.orderProcessInfo.finishOrderDate=="..."){
                cancelable=true;
            }
            return cancelable;
        }
    },
    props:['selectedOrderid'],
    mounted(){

        var comp = this;
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
        oReq.open("GET", properties.backendResourceOrderListUrl+'/'+this.selectedOrderid, true);
        oReq.send();
    },
    methods:{
        orderPanelVisibleControl(componentName){
            this.$emit('orderPanelVisibleControl',componentName);
        },
        cancelThisOrder(){
            Swal.fire({
                title: '真的要取消訂單嗎？',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText:
                  '我知道取消訂單是無法復原的',
                cancelButtonText:
                  '等等再來',
              }).then((result) => {
                this.changeOrderStatus('取消訂單')
              })
        },
        changeOrderStatus(newStatus){
            let url =properties.backendResourceChangeOrderStatusUrl;
            let orderId =this.selectedOrderid;
            url =url.replace('{orderId}',orderId);
            url =url.replace('{newStatus}',newStatus);
            var comp =this;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: '已更新',
                    }).then(()=>{
                        let response = JSON.parse(this.responseText);
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
                    })
                }
                if (this.readyState == 4 && this.status != 200) {
                    Swal.fire({
                        icon: 'error',
                        text: '更新訂單狀態時,系統發生錯誤',
                    })
                }
            };
            oReq.open("PUT", url, false);
            oReq.send();
            this.$emit('refreshOrderList');
            

            
        },
        downloadOrderReport(){
            Swal.fire({
                title: "選擇檔案類型",
                html: `
                    <a class="btn btn-primary "   download  href="/backend/shop/order/${this.selectedOrderid}/excel"  target="_blank" role="button" >EXCEL</a>
                    <a class="btn btn-secondary " download  href="/backend/shop/order/${this.selectedOrderid}/pdf"    target="_blank" role="button" >PDF</a>
                `,
                type: "warning",
                showConfirmButton: false,
                showCancelButton: false
              });
        }
    },
    components:{
        orderProductInfo
    },
    template:`
            <div id='orderInfoModal'  style='  background-color:white; width:-webkit-fill-available;display:flex;align-items: center;flex-direction: column; '>
  
                <div  style='height: 75px;'>
                    <button v-if='orderCancelable' @click='cancelThisOrder' type="button" class="btn btn-danger"  >取消訂單</button>
                </div>
                <div style="width: -webkit-fill-available;height: 500px;border: 1px solid;padding: 25px;overflow-y: scroll;">
                    <div style='display: flex; height: 100px; flex-direction: row; justify-content: space-around; align-items: center;'>
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>待處理</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">pending</span>
                            <div>
                                <span v-if='orderProcessInfo.pendingDate!="處理中"'>
                                    {{orderProcessInfo.pendingDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("待處理")'>完成</button>
                                </span>
                            </div>
                        </div>
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>賣家確認</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">check_circle</span>
                            <div>
                                <span v-if='orderProcessInfo.orderCheckDate!="處理中"'>
                                    {{orderProcessInfo.orderCheckDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("賣家確認")'>完成</button>
                                </span>
                            </div>
                        </div>
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>處理商品</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">package</span>
                            <div>
                                <span v-if='orderProcessInfo.packingProductDate!="處理中"'>
                                    {{orderProcessInfo.packingProductDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("處理商品")'>完成</button>
                                </span>
                            </div>
                            
                        </div>    
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>已送貨</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">local_shipping</span>
                            <div>
                                <span v-if='orderProcessInfo.deliveryProductDate!="處理中"'>
                                    {{orderProcessInfo.deliveryProductDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("已送貨")'>完成</button>
                                </span>
                            </div>                            
                        </div>     
                        <div style='display:flex; flex-direction: column; align-items: center;'>
                            <span>完成訂單</span>
                            <span style ='font-size: 2em;'class="material-symbols-outlined">task</span>
                            <div>
                                <span v-if='orderProcessInfo.finishOrderDate!="處理中"'>
                                    {{orderProcessInfo.finishOrderDate}}
                                </span>
                                <span v-else>
                                    <button @click='changeOrderStatus("完成訂單")'>完成</button>
                                </span>
                            </div>                                                           
                        </div>                                                                             
                    </div>
                    <hr>
                    <div>訂單編號:{{selectedOrderid}}</div>
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
                            <orderProductInfo v-for='product in orderProductList' :product=product />
                            <tr>
                                <td>總計</td>
                                <td colspan='3'style='text-align:right;'>{{totalPriceInShoppingCartProduct}}</td>
                            </tr>
                        <tr>
                            <td colspan='4'>
                                <div>
                                    取貨人姓名:{{deliveryInfo.picker}}<br>
                                    手機號碼:{{deliveryInfo.cell_phone_number}}<br>
                                    配送需知:{{deliveryInfo.notice}}<br>
                                    配送類別:{{deliveryInfo.delivery_type}}<br>
                                    位址:{{deliveryInfo.address}}<br>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>             
                </div> 
                <div style='margin-top: 30px; display: flex; justify-content: space-evenly; flex-direction: row; width: -webkit-fill-available; align-items: center;'>
                    
                    <button type="button" class="btn btn-success" @click='orderPanelVisibleControl("orderList")' >返回訂單管理頁面</button>
                    <button @click='downloadOrderReport' type="button" class="btn btn-success"  >下載訂單產品明細</button>
                </div>           
            </div>
    `

}


const orderList ={
    props:['order'],
    methods:{
        orderPanelVisibleControl(componentName){
            this.$emit('orderPanelVisibleControl',componentName);
        },
        selectOrderId(){
            this.$emit('selectedOrderId',this.order.id);
        }
    },
    template:`
        <li style='margin: 0px 3vw;' class="list-group-item">
            <div style='width: 50%;'>
                訂單編號:{{order.id}}
            </div>
            <div style='display: flex;'>
                <span style='width:500px;padding-right: 50px;overflow:hidden; white-space: nowrap; text-overflow: ellipsis; '>{{order.describe}}</span>
                <span style='width:30%'>總價:{{order.total}}</span>
                <button style='width:20%' type="button" class="btn btn-secondary" @click='orderPanelVisibleControl("orderDetail");selectOrderId();' >顯示更多</button>
            </div>
        </li>
    `
}
const orderManagePanel={
    data(){
        return{
            orderManagePanelComponentVisible:{
                orderList:true,
                orderDetail:false,
            },
            orderInfoList:[{}],
            selectedOrderid:'',
        }
    },
    components:{
        orderList,
        orderDetail,
    },
    mounted(){

        var comp = this;
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                comp.orderInfoList=JSON.parse(this.responseText)
           }
        };
        oReq.open("GET", properties.backendResourceOrderListUrl+'?status=待處理', true);
        oReq.send();
    },
    methods:{
        orderPanelVisibleControl(componentName){
            for (const [key, value] of Object.entries(this.orderManagePanelComponentVisible)) {
                this.orderManagePanelComponentVisible[key] =false;
            }
            this.orderManagePanelComponentVisible[componentName]=true;
        },
        choseOrderStatus(event){
            var target = event.target;
            var value = target.innerText;
            var comp = this;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    comp.orderInfoList=JSON.parse(this.responseText)
               }
            };
            oReq.open("GET", properties.backendResourceOrderListUrl+'?status='+value, true);
            oReq.send();
        },
        selectedOrderId(orderId){
            this.selectedOrderid=orderId;
        },
        refreshOrderList(){
            var comp = this;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    comp.orderInfoList=JSON.parse(this.responseText)
               }
            };
            oReq.open("GET", properties.backendResourceOrderListUrl+'?status=待處理', true);
            oReq.send();
        },
    },
    template:`

            <div  v-if='orderManagePanelComponentVisible.orderList' style ='display:flex; flex-direction: column;width: 100%;'>
                <div style='display: flex;justify-content: space-around;'>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>待處理</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>賣家確認</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>處理商品</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>已送貨</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>完成訂單</button>
                    <button @click='choseOrderStatus($event)' style='border: 0px;background-color: white;font-size: 3vw;'>取消訂單</button>
                </div>
                <div style=' padding: 10px; overflow-y:scroll; border-radius: 10px;display: flex;background-color: white;background-color: rgb(181, 181, 181);'>
                    <ul class="list-group" style='width:100%;font-size:2vw;'>

                        <orderList v-for='order in orderInfoList' :order='order' @orderPanelVisibleControl='orderPanelVisibleControl'  @selectedOrderId='selectedOrderId' />

                    </ul>
                </div>             
            </div>
            <orderDetail v-if='orderManagePanelComponentVisible.orderDetail' @refreshOrderList='refreshOrderList' @orderPanelVisibleControl='orderPanelVisibleControl' :selectedOrderid='selectedOrderid' />


    `
}



const productChangeInfoMethods={
    whenUserUploadedImageThenShowIt(evnet){
        var targetElm = evnet.target;
        console.log(targetElm.files[0].size);
        if(targetElm.files[0].size>1048576 ){
            Swal.fire({
                icon: 'error',
                text: '檔案大小請勿超過1MB',
            })
            return;
        }
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
                viewMode: 1,
                aspectRatio: 1,
                autoCropArea: 1,
                minCropBoxWidth: 400,
                minCanvasWidth: 400,
                restore: false,
                guides: false,
                center: false,
                highlight: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                toggleDragModeOnDblclick: false

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
    },
    updateBackendProductData(){
        Swal.fire({
          title: '確認資料填寫無誤',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText:
            '沒問題！送出吧！',
          cancelButtonText:
            '我再檢查一下',
        }).then((result) => {
          if (result.isConfirmed) {
            const formData = new FormData();
            let imageName = document.querySelector('#imageFile');
            if(imageName.files.length!=0){
                formData.append('productImg',this.dataURItoBlob(document.getElementById('previewImg').src),imageName.files[0].name);
            }else{
                formData.append('productImg',new Blob ,'');
            }
            
            formData.append('product',JSON.stringify(this.product));
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: '已更新',
                    })
                }
                if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '更新商品時,系統發生錯誤',
                    })
                }
            }
            oReq.open('put', properties.backendResourceProductManageUrl+"/"+this.product.id, true);
            oReq.send(formData);
          }
        })
        
        return false;
    },
    createBackendProductData(){
        Swal.fire({
          title: '確認資料填寫無誤',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText:
            '沒問題！送出吧！',
          cancelButtonText:
            '我再檢查一下',
        }).then((result) => {
          if (result.isConfirmed) {
            const formData = new FormData();
            let imageName = document.querySelector('#imageFile');
            formData.append('productImg',this.dataURItoBlob(document.getElementById('previewImg').src),imageName.files[0].name);
            formData.append('product',JSON.stringify(this.product));
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: '上傳成功',
                    })
                }
                if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '上傳商品時,系統發生錯誤',
                    })
                }
            }
            oReq.open('post', properties.backendResourceProductManageUrl, true);
            oReq.send(formData);
          }
        })
        
        return false;
    },
    //https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    },
    goHome(){
        this.$emit('refreshProductList');
        this.$emit('openProductPanel','home');
    },
    deleteProduct(productId){
        let comp=this
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                Swal.fire({
                    icon: 'success',
                    text: '已刪除',
                }).then(()=>{
                    comp.$emit('refreshProductList')
                })
            }
            if(this.readyState == 4 && this.status !=200){
                Swal.fire({
                    icon: 'error',
                    text: '刪除商品時,系統發生錯誤',
                })
            }
            
        }
        oReq.open("delete", properties.backendResourceProductManageUrl+"/"+productId, true);
        oReq.send();
    }
}
const productInfo ={

    props: ['product'],
    methods:{
        goEditProduct(productId){
            this.$emit("selectProduct",productId);
            this.$emit("openProductPanel",'updateProductPanel');
        },
        deleteProduct:productChangeInfoMethods.deleteProduct,
    },
    template:`
        <div style="display: flex;align-items: center;border: 1px solid;border-radius: 10px;margin:10px 0px;">
            <div style='width:113px;margin-right:10px;'>
                <img style ='border:0px;border-radius:10px 0px 0px 10px;' class='productImg' :src=product.imageUrl >
            </div> 
            <div style='width:50%;'>
                <p style='width: -webkit-fill-available;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'>{{product.name}}</p>                
            </div> 
            <div style='width:20%;'>
                <span>{{product.price}}</span>
            </div>             
            <div style='width:10%;'>
                <span>{{product.quantity}}</span>
            </div> 
            <div style='width:10%;'>
                <span @click='goEditProduct(product.id)' style='font-size: 30pt; background-color: #f4b36f; border-radius: 10px;margin: 8px;' class="material-symbols-outlined">edit</span>
                <span @click='deleteProduct(product.id)' style='font-size: 30pt; background-color: #f4b36f; border-radius: 10px;margin: 8px;' class="material-symbols-outlined">delete</span>
            </div>                                     
        </div>

    `
}
const productCreateComponent={
    props: {
        product: {
          default: {
            quantity: null,
            price: null,
            imageUrl: null,
            name: null,
            id: null,
          },
          type: Object
        }
    },
    methods:productChangeInfoMethods,
    template:`
        <div style='height: 97vh; display: flex; flex-direction: column; justify-content: space-between;'>
            <form id='productForm' @submit.prevent='createBackendProductData'>
                <div style='display: flex;  flex-direction: row;'>
                    <div style="      border: 1px solid;   height: fit-content; display: flex;width: 50%;background-color: gray;flex-direction: column;">
                        <input id='imageFile' required  @change='whenUserUploadedImageThenShowIt($event)' previewImageId='previewImg' type="file" name="productImage" accept="image/png, image/jpg, image/jpeg" />
                        <div style='margin: 10px auto;width: 400px;height: 400px;'>
                            <img id="previewImg" src="./image/upload.svg"     style="width:100%;height:100%;  " />
                        </div>
                        <button type="button" previewImageId='previewImg' @click='showCropperedImage($event)'>剪裁</button>
                    </div>
                    <div style='width:50%;padding: 50px;'>
                        <div> <label style='width:100px;'>商品名稱</label><input required type='text' v-model='product.name'></div>
                        <div> <label style='width:100px;'>商品描述</label><input required type='text' v-model='product.describe'></div>
                        <div> <label style='width:100px;'>單價</label><input required type='number' v-model='product.price'></div>
                        <div> <label style='width:100px;'>庫存</label><input required type='number' v-model='product.quantity'></div>
                    </div>
                </div> 
                <div style='margin: 30px;padding: 5px;display: flex;align-items: center;justify-content: space-around;height: 50px;"'>
                    <input   type="submit" class="btn btn-success" value='新增商品'>
                    <input  @click='goHome'  type="button" class="btn btn-warning" value='回到商品管理頁面' >
                </div>           
            </form>
        </div>        
        
    `
}

const productUpdateComponent={
    props:['product'],
    mounted(){
        if(this.product.imageUrl){
            var image = document.getElementById('previewImg');
            image.src=this.product.imageUrl;
        }

    },
    methods:productChangeInfoMethods,
    template:`
        <div style='height: 97vh; display: flex; flex-direction: column; justify-content: space-between;'>
            <form id='productForm' @submit.prevent='updateBackendProductData'>
                <div style='display: flex;  flex-direction: row;'>
                    <div style="      border: 1px solid;   height: fit-content; display: flex;width: 50%;background-color: gray;flex-direction: column;">
                        <input id='imageFile'  @change='whenUserUploadedImageThenShowIt($event)' previewImageId='previewImg' type="file" name="productImage" accept="image/png, image/jpg, image/jpeg" />
                        <div style='margin: 10px auto;width: 400px;height: 400px;'>
                            <img id="previewImg" src="./image/upload.svg"     style="width:100%;height:100%;  " />
                        </div>
                        <button type="button" previewImageId='previewImg' @click='showCropperedImage($event)'>剪裁</button>
                    </div>
                    <div style='width:50%;padding: 50px;'>
                        <div> <label style='width:100px;'>商品名稱</label><input required type='text' v-model='product.name'></div>
                        <div> <label style='width:100px;'>商品描述</label><input required type='text' v-model='product.describe'></div>
                        <div> <label style='width:100px;'>單價</label><input required type='number' v-model='product.price'></div>
                        <div> <label style='width:100px;'>庫存</label><input required type='number' v-model='product.quantity'></div>
                    </div>
                </div> 
                <div style='margin: 30px;padding: 5px;display: flex;align-items: center;justify-content: space-around;height: 50px;"'>
                    <input  type="submit" class="btn btn-success" value ='變更'>
                    <input  @click='goHome'  type="button" class="btn btn-warning" value ='回到商品管理頁面'>
                </div>           
            </form>
        </div>        
        
    `
}
const productManagePanel={
    data(){
        return{
            productManagePanelVisible:{
                home:true,
                creaeProductPanel:false,
                updateProductPanel:false,
            },
            productList:[{}],
            selectedProduct:{
            },
            renderKey: 0,
        }
    },
    mounted(){
        this.refreshProductList()
    },
    methods:{
        openProductPanel(panelName){
            for (const [key, value] of Object.entries(this.productManagePanelVisible)) {
                this.productManagePanelVisible[key] =false;
            }
            this.productManagePanelVisible[panelName]=true;
        },
        refreshProductList(){
            let comp = this;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    comp.productList=JSON.parse(this.responseText);
                    comp.renderKey++;
               }
            };
            oReq.open("GET", properties.backendResourceProductListUrl, true);
            oReq.send();
        },
        selectProduct(productId){
            this.selectedProduct=this.productList.find((product)=>{return product.id==productId})
        },
        
    },
    components:{
        productInfo,
        productCreateComponent,
        productUpdateComponent,
    },
    template:`
    <productCreateComponent v-if='productManagePanelVisible.creaeProductPanel' @refreshProductList=refreshProductList @openProductPanel=openProductPanel />
    <productUpdateComponent :product='selectedProduct' v-if='productManagePanelVisible.updateProductPanel' @refreshProductList=refreshProductList @openProductPanel=openProductPanel />
    <div v-if='productManagePanelVisible.home'>
        <div style=" background-color: cadetblue; display: flex; padding: 10px; ">
            <span style='width:100px;'>商品圖片</span>
            <span style='width:50%;'>商品名稱</span>
            <span style='width:20%;'>單價</span>
            <span style='width:10%;'>庫存量</span>
            <span style='width:10%;'></span>
        </div>
        <div style='height:500px;overflow-y:scroll;' :key="renderKey">
            <productInfo  v-for='(product) in productList'  :product=product @refreshProductList=refreshProductList @selectProduct=selectProduct @openProductPanel=openProductPanel  />
        </div>                    
        <div @click='openProductPanel("creaeProductPanel")' style='margin: 30px;padding: 5px;display: flex;align-items: center;justify-content: center;height: 50px;background-color: gray;border-radius: 10px;"'>
            <span  style='font-size:40pt;' class="material-symbols-outlined"> add_circle </span>
        </div>
    </div>
`
}




var Home = Vue.createApp({ 
    data(){
        return{

            panelVisible:{
                productManagePanel:true,
                orderManagePanel:false
               
            },
        }
    },
    methods:{

        switchToSelectedPanel(event){
            //按鈕效果
            var functionList=document.querySelectorAll('#functionList > div > button');
            functionList.forEach(element => {
                if(element.innerHTML!=event.target.innerHTML){
                    element.classList.remove('activePanel');
                }
            });
            event.target.classList.toggle('activePanel');
            //面板的顯示與隱藏
            var panelName = event.target.dataset.panelname;
            for (const [key, value] of Object.entries(this.panelVisible)) {
                this.panelVisible[key] =false;
                if(panelName==key){
                    this.panelVisible[key] =true;    
                }
            }
        },
        toLogout(){
            document.location.href=properties.websiteLogoutUrl;

        },

    },
    components:{
        orderManagePanel,
        needLoginNotification,
        productManagePanel,
    },
    template:`
        <needLoginNotification/>
        <div style='width:100%;height:100%; display:flex;'>
            <div style='display: flex;padding-top: 20px;width: 300px;border: 1px solid;flex-direction: column;justify-content: space-between;'>
                <div id='functionList' style='width:inherit;'>
                    <div style='width:inherit;' >
                        <button  @click='switchToSelectedPanel($event)' class='activePanel' data-panelName='productManagePanel' style="width: inherit;height: 50px;">商品管理</button>
                    </div>   
                    <div style='width:inherit;'>
                        <button @click='switchToSelectedPanel($event)' data-panelName='orderManagePanel' style="width: inherit;height: 50px;">訂單管理</button>
                    </div>                
                </div>
                <div style='width:inherit;'>
                    <button @click='toLogout' style='width:inherit;height: 50px;background-color:rgb(128 192 91);border:0px;'>登出</button>
                </div>
            </div>
            <div id='panelList' style='flex-grow:1;padding:10px;'>
                 <productManagePanel v-if='panelVisible.productManagePanel' :productList='productList'/>
                 <orderManagePanel v-if='panelVisible.orderManagePanel'/>
            </div>
        </div>
    
    `





});
Home.use(store);
Home.mount('#backstageManagement')


