import store from '../store/store.js'
import properties from '../../properties.js'

let categoryList ={
    template:`
        <div >
            <ul class="list-group">
                <li class="list-group-item">An item</li>
                <li class="list-group-item">A second item</li>
                <li class="list-group-item">A third item</li>
                <li class="list-group-item">A fourth item</li>
                <li class="list-group-item">And a fifth one</li>
            </ul>
        </div>
    `
}
let bestseller={
    template:`
    <div >
        <ol class="list-group list-group-numbered">
            <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Subheading</div>
                Content for list item
            </div>
            <span class="badge bg-primary rounded-pill">14</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Subheading</div>
                Content for list item
            </div>
            <span class="badge bg-primary rounded-pill">14</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Subheading</div>
                Content for list item
            </div>
            <span class="badge bg-primary rounded-pill">14</span>
            </li>
        </ol>
    </div>
    `


}
let productList = {
    props: ['product'],
    methods:{
        addToCart:(product)=>{
            //判斷有沒有登入
            const userInfo = store.getters.userInfo;
            if(!userInfo.isLogin){
                Swal.fire({
                    icon: 'error',
                    text: '請先登入',
                })
                return;
            }
            //向後端傳送要放入購物車的資料
            const data =new Object();
            data['productId']=product.id;
            data['demandQuantity']=1;

            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    store.commit('addProductToCart',{product});
                }
                if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '系統發生錯誤',
                    })
                }
            }
            oReq.open("post", properties.backendResourceShoppingCartUrl, true);
            oReq.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            oReq.send(JSON.stringify(data));
            //更新vuex

            
        }
    },
    template:`

        <div   :class=product.id?'productCardContainer':'productPlaceholder'  >
            <div v-if="product.id" class="productCard">
                <div class = 'productImgContainer'>    
                    <img class='productImg' :src=product.imageUrl >
                </div>    
                <div class = "productInfoContainer">
                    <div><h5>{{product.name}}</h5></div>
                    <div class='productDescribeArea'>
                        <p>{{product.describe}}</p>
                    </div>
                    <div >
                        價格:{{product.price}} 元
                    </div>
                    <div class = 'productButtonArea'>
                        <a style='padding: 4px;font-size: 12pt;' v-if='!product.isAddToCart' @click='addToCart(product)' class="btn btn-sm btn-primary">加入購物車</a>
                        <a style='padding: 4px;font-size: 12pt;' v-if='product.isAddToCart'onclick='location.href="./shoppingCart.html"' class=" btn btn-sm btn-primary">到購物車查看</a>
                       
                    </div>

                </div>
            </div>
        </div>

    `
}
export{
    categoryList,
    bestseller,
    productList
}