import userComponent from "./userComponent.js";
import store from '../store/store.js'
let navBar={
    computed:{
        shoppingCartQuantity:()=>{
            let countNotify = store.state.shopingCartProductQuanity;
            
            if(parseInt(countNotify)>99){
                countNotify='!';
            }
            return countNotify;
        }

    },
    methods:{
        togglePanel(){
            var panel = document.getElementById('navbar_toggle_after_panel');
            if(panel.style.width=='inherit'){
                panel.style.width='0px';
            }else{
                panel.style.width='inherit';
            }

            
        },

    },
    components:{
        user:userComponent.user
    },
    template:`

    <nav>
        <div class="navbar_logo">
                <img id='logo'  class="navbar-brand" src='./image/companyIcon.png'>
        </div>
        <div class="navbar_links">
            <ul >
                        
                <user class='less-than-show'/>
                <hr class='less-than-show'>
                <li >
                    <a  href="/home.html">首頁</a>
                </li>
                <li >
                    <a  style="position: relative;" href="/shoppingCart.html">購物車
                        <span class="cartQuantity text-white bg-warning">{{shoppingCartQuantity}}</span>
                    </a>
                </li>
                <li >
                    <a  href="/orderInformation.html">訂單查詢</a>
                </li>


            </ul>
        </div>
        <div id="navbar_toggle" @click='togglePanel'>
            <span class="material-symbols-outlined">
                menu
            </span>
        </div>
        <div id ="navbar_toggle_after_panel">
            <ul>
                <user class='less-than-show'/>
                <hr class='less-than-show'>
                <li >
                    <a  href="/home.html">首頁</a>
                </li>
                <li >
                    <a  style="position: relative;" href="/shoppingCart.html">購物車
                        <span class="cartQuantity text-white bg-warning">{{shoppingCartQuantity}}</span>
                    </a>
                </li>
                <li >
                    <a  href="/orderInformation.html">訂單查詢</a>
                </li>
            </ul>
        </div>
    </nav>



    `

}
let searchBar = {

}
export{
    navBar,
    searchBar
}