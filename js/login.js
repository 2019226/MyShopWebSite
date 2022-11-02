import store from './store/store.js'
import properties from '../properties.js'

var LoginCompoent = Vue.createApp({
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
        showPassword(){
            var x = document.getElementById("password");
            if (x.type === "password") {
              x.type = "text";
            } else {
              x.type = "password";
            }
        },
        toGoogleLogin(){
            var x = screen.width/2 - 500/2;
            var y = screen.height/2 - 600/2;
            var rand =Math.floor(Math.random()*100000);
            window.open(properties.websiteLoginUrl,"","left="+x+",top="+y+",width=500,height=600")


        },
        toLineLogin(){
            var x = screen.width/2 - 500/2;
            var y = screen.height/2 - 600/2;
            var rand =Math.floor(Math.random()*100000);
            window.open(properties.lineLoginServiceUrl,"","left="+x+",top="+y+",width=500,height=600")
        },

    },
    template:`
        

    <div style=' height: 80vh;width:100%;top:20%; padding: 1vw;position: absolute; overflow: hidden; z-index: 0; display:flex; justify-content:center;'>

        <div style='display:flex;flex-direction: column;align-items: center;width: 400px;height: 450px;padding: 2vw;background-color: white;display: flex;border: 1px solid black;box-shadow: 1px 1px 14px;'>
            <div style ='display:flex;    flex-direction: column;'>
                    <input style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='account' type='text' placeholder='請輸入電子郵件'>
                    <input style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='password' type='password' placeholder='請輸入密碼'>
                    <div style='text-align: center;'>
                        <input type="checkbox" @click="showPassword()"id='showPassword'>
                        <label for='showPassword'>顯示密碼</label>
                    </div>
            </div>
            <button style='border: none;border-radius: 10px;color: white;width: 50%;height: 60px;background-color: #8DC26F;margin-top: 10px;'>登入</button>
            <hr>
            <p>或是</p>
            <div>
                
                <button @click='toGoogleLogin' style='background-image: url("./image/btn_google_signin_dark_pressed_web.png");background-repeat: no-repeat;background-size: contain;border: none;width: 172px;height: 40px;background-color:white; '></button>
                <button @click='toLineLogin' style='background-image: url("./image/btn_login_base.png");background-repeat: no-repeat;background-size: contain;border: none;width: 150px;background-color: white;height: 40px;'></button>
            </div>
            <hr>
            <button onclick="window.open('./register.html', 'mywin','left=200,top=200,width=500,height=500,toolbar=1,resizable=0'); return false;" style='border: none;background-color: white;color: gray;'>前往註冊</button>
        </div>


    </div>

        
        
    
    `





});
LoginCompoent.use(store);
LoginCompoent.mount('#login')




