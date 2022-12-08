import store from './store/store.js'
import properties from '../properties.js'
var ForgetPasswordCompoent = Vue.createApp({

    data(){
        return{
            email:'',
            password:'',
            confirmPassword:'',
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
    
        },
        

    },
    methods:{
        toChangePassword(){
            var object =new Object;
            object['email']=this.email;
            object['password']=this.password;
            const oReq = new XMLHttpRequest();
            oReq.withCredentials=true;
            oReq.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: '已變更密碼',
                    }).then((result) => {
                        window.close();
                    })
                }
                if(this.readyState == 4 && this.status !=200){
                    Swal.fire({
                        icon: 'error',
                        text: '錯誤!無法變更密碼',
                    })
                }
            }
            oReq.open("post", properties.websiteForgetPasswordUrl, true);
            oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            oReq.send(JSON.stringify(object));
            return false;
        },

    },
    template:`
        

    <div style=' height: 80vh;width:100%;top:20%; padding: 1vw;position: absolute; overflow: hidden; z-index: 0; display:flex; justify-content:center;'>

        <form @submit.prevent='toChangePassword' style='display:flex;flex-direction: column;align-items: center;width: 400px;height: 300px;padding: 2vw;background-color: white;display: flex;border: 1px solid black;box-shadow: 1px 1px 14px;'>
            <div style ='display:flex;    flex-direction: column;'>
                    <input v-model='email'  required style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='account' type='email' placeholder='請輸入電子郵件'>
                    <input v-model='password'  required style='margin: 10px;border-radius: 20px;border: 1px solid #bababa;text-align: center;' id='password' type='text' placeholder='請輸入密碼'>
            </div>
            <input type ='submit' style='border: none;border-radius: 10px;color: white;width: 50%;height: 60px;background-color: #8DC26F;margin-top: 10px;' value ='更改密碼'>
        <form>


    </div>
    `





});
ForgetPasswordCompoent.use(store);
ForgetPasswordCompoent.mount('#forgetPassword')




