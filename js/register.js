import store from './store/store.js'

var RegisterCompoent = Vue.createApp({
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


    },
    template:`
        

    <div style=' height: 80vh;width:100%;top:20%; padding: 1vw;position: absolute; overflow: hidden; z-index: 0; display:flex; justify-content:center;'>

        <form style='display:flex;flex-direction: column;align-items: center;width: 400px;height: 300px;padding: 2vw;background-color: white;display: flex;border: 1px solid black;box-shadow: 1px 1px 14px;'>
            <div style ='display:flex;    flex-direction: column;'>
                    <input style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='account' type='text' placeholder='請輸入電子郵件'>
                    <input style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='password' type='text' placeholder='請輸入密碼'>
                    <input style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='password' type='text' placeholder='請再次輸入密碼'>
            </div>
            <button style='border: none;border-radius: 10px;color: white;width: 50%;height: 60px;background-color: #8DC26F;margin-top: 10px;'>註冊</button>
        <form>


    </div>

        
        
    
    `





});
RegisterCompoent.use(store);
RegisterCompoent.mount('#register')



