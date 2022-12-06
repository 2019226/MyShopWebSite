import store from './store/store.js'
import properties from '../properties.js'

var LoginCompoent = Vue.createApp({
    data(){
        return{
            email:'',
            password:'',
        }
    },
    computed:{
        isLogin:()=>{
            
            return store.getters.userInfo.isLogin;
        },

    },
    watch:{
        isLogin:function(isLogin){
            if(isLogin){
                document.location.href='./home.html';
            }
    
        }

    },
    methods:{
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
            window.open(properties.googleLoginServiceUrl,"","left="+x+",top="+y+",width=500,height=600")


        },
        toLineLogin(){
            var x = screen.width/2 - 500/2;
            var y = screen.height/2 - 600/2;
            var rand =Math.floor(Math.random()*100000);
            window.open(properties.lineLoginServiceUrl,"","left="+x+",top="+y+",width=500,height=600")
        },
        toLogin(){

            var object =new Object;
            object['email']=this.email;
            object['password']=this.password;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(this.responseText);
                    document.location.href=data.redirectUrl;
                }
                if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '電子郵件或是密碼輸入錯誤',
                    })
                }
            }
            oReq.open("post", properties.websiteLoginUrl, true);
            oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            oReq.send(JSON.stringify(object));
        }

    },
    template:`
        

    <div style=' height: 80vh;width:100%;top:20%; padding: 1vw;position: absolute; overflow: hidden; z-index: 0; display:flex; justify-content:center;'>

        <div style='display:flex;flex-direction: column;align-items: center;width: 400px;height: 450px;padding: 2vw;background-color: white;display: flex;border: 1px solid black;box-shadow: 1px 1px 14px;'>
            <form @submit.prevent='toLogin' >
                    <div style ='display:flex;     align-items: center;flex-direction: column;'> 
                        <input v-model='email'    required style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='email' type='email' placeholder='請輸入電子郵件'>
                        <input v-model="password" required style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='password' type='password' placeholder='請輸入密碼'>
                        <div style='text-align: center;'>
                            <input type="checkbox" @click="showPassword()"id='showPassword'>
                            <label for='showPassword'>顯示密碼</label>
                        </div>
                        <input type='submit' style='border: none;border-radius: 10px;color: white;width: 50%;height: 60px;background-color: #8DC26F;margin-top: 10px;' value='登入'>
                    </div>
                    
            </form>
            <hr>
            <p>或是</p>
            <div>
                
                <button @click='toGoogleLogin' style='background-image: url("./image/btn_google_signin_dark_pressed_web.png");background-repeat: no-repeat;background-size: contain;border: none;width: 172px;height: 40px;background-color:white; '></button>
                <button @click='toLineLogin' style='background-image: url("./image/btn_login_base.png");background-repeat: no-repeat;background-size: contain;border: none;width: 150px;background-color: white;height: 40px;'></button>
            </div>
            <hr>
            <div>
                <button onclick="window.open('./register.html', 'mywin','left=200,top=200,width=500,height=500,toolbar=1,resizable=0'); return false;" style='border: none;background-color: white;color: gray;'>前往註冊</button>
                <button onclick="window.open('./forgetPassword.html', 'mywin','left=200,top=200,width=500,height=500,toolbar=1,resizable=0'); return false;" style='border: none;background-color: white;color: gray;'>忘記密碼</button>
            </div>
        </div>


    </div>

        
        
    
    `





});
LoginCompoent.use(store);
LoginCompoent.mount('#login')




