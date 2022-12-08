import userComponent from "./userComponent.js";
import store from '../store/store.js'


let navBar={
    computed:{
        shoppingCartAmount:()=>{
            
            let countNotify = store.getters.shoppingCartAmount
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
                
        </div>
        <div class="navbar_links">
            <ul >
                        

                <li >
                    <a  href="/home.html">首頁</a>
                </li>
                <li >
                    <a  style="position: relative;" href="/shoppingCart.html">購物車
                        <span v-if="shoppingCartAmount>0" class="cartQuantity text-white bg-warning">{{shoppingCartAmount}}</span>
                    </a>
                </li>
                <li >
                    <a  href="/orderInformation.html">訂單查詢</a>
                </li>


            </ul>
        </div>
        <div class='user more-than-show'>
            <user />
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
                    <a  style="position: relative;" href="/shoppingCart.html">
                        購物車
                        <span v-if="shoppingCartAmount>0" class="cartQuantity text-white bg-warning">{{shoppingCartAmount}}</span>
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
let needLoginNotification={
    data(){
        return{
            isLogin:store.getters.userInfo.isLogin,
        }

    },
    mounted(){
        if(!this.isLogin){
            var target = document.getElementById('notLoginCover');
            while(target.nextSibling){
                target.nextSibling.remove();
            }
        }
    },
    template:`
        <div id='notLoginCover' v-if='!isLogin' style='width:100vw;height:100vh;background-color:gray;z-index: 99999;display:flex;justify-content: center; align-items: center;'>
            <div style='width: 25vw;height: 25vh;font-size: 1vw;background-color: white;display: flex;justify-content: center;align-items: center;box-shadow: 1px 2px 23px;border-radius: 10px;flex-direction: column;'>
                <p style='  text-align:center; vertical-align: middle;font-size: 3em;'>請先登入</p>
                <button type="button" class="btn btn-success" onclick='document.location.href="./login.html"'>登入去～</button>
            </div>
        </div>
    `

}

export{
    navBar,
    needLoginNotification,
}