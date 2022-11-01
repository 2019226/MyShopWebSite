import store from '../store/store.js'

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
let productCarousel ={
    // template:`
    //     <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
    //         <div class="carousel-indicators">
    //         <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    //         <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    //         <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
    //         </div>
    //         <div class="carousel-inner">
    //         <div class="carousel-item active">
    //              <img style='width:600px; height:300px;  margin:auto;' src="./asset/6-ways-to-help-your-child-get-a-good-nights-sleep-960x1280.jpg" class="d-block " alt="...">
    //             <div class="carousel-caption d-none d-md-block">
    //             <h5>First slide label</h5>
    //             <p>Some representative placeholder content for the first slide.</p>
    //             </div>
    //         </div>
    //         <div class="carousel-item ">
    //         <img style='width:50%; display:block; margin:auto;' src="./asset/https___cdn.cnn.com_cnnnext_dam_assets_120910112738-mom-sleeping-infant-baby-night-story-top.jpg" class="d-block " alt="...">
    //             <div class="carousel-caption d-none d-md-block">
    //             <h5>First slide label</h5>
    //             <p>Some representative placeholder content for the first slide.</p>
    //             </div>
    //         </div>
    //         <div class="carousel-item ">
    //         <img style='width:50%; display:block; margin:auto;' src="./asset/r0_161_2500_1572_w1200_h678_fmax.jpg" class="d-block " alt="...">
    //             <div class="carousel-caption d-none d-md-block">
    //             <h5>First slide label</h5>
    //             <p>Some representative placeholder content for the first slide.</p>
    //             </div>
    //         </div>
    //         </div>
    //         <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    //         <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    //         <span class="visually-hidden">Previous</span>
    //         </button>
    //         <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    //         <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //         <span class="visually-hidden">Next</span>
    //         </button>
    //     </div>
    
    // `

} 
let productList = {
    props: ['product'],
    methods:{
        addToCart:(product)=>{
            store.commit('addProductToCart',{product});
        }
    },
    template:`

        <div   :class=product.id?'productCardContainer':'productPlaceholder'  >
            <div v-if="product.id" class="productCard">
                <div class = 'productImgContainer'>    
                    <img class='productImg' src="./image/productNo1.jpeg" >
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
                        <a style='padding: 4px;font-size: 12pt;' v-if='!product.isAddToCart' @click.once='addToCart(product)' class="btn btn-sm btn-primary">加入購物車</a>
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
    productCarousel,
    productList
}