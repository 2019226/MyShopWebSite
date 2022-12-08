import store from './store/store.js';
import properties from "../properties.js";

const checkUserInfo=()=>{
    const oReq = new XMLHttpRequest();
    oReq.withCredentials=true;
    oReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let userInfo = JSON.parse(this.responseText);
            //儲存使用者資訊
            store.commit('setUserInfo',{
                isLogin:true,
                userInfo,
            });
        if(this.readyState == 4 && this.status !=200){
            //無法登入
            store.commit('setUserInfo',{
                isLogin:false,
            });
        }
       }
    };
    oReq.open("GET", properties.getUserInfoUrl, false);
    oReq.send();
}




const init=()=>{
    checkUserInfo()
}
init();




























// auth(urlParam){

//     const oReq = new XMLHttpRequest();
//     const serverAuthUrl = new URL('http://127.0.0.1:8080/myWebSite/linelogin');
//     serverAuthUrl.search = urlParam;
//     oReq.withCredentials=true;
//     const self = this;
//     oReq.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
            
//             let userInfo = JSON.parse(this.responseText);
//             //儲存使用者資訊
//             self.$store.commit('setUserInfo',{
//                 isLogin:true,
//                 userInfo,
//             });
//         if(this.readyState == 4 && this.status !=200){
//             //無法登入
//             self.$store.commit('setUserInfo',{
//                 isLogin:false,
//             });
//             Swal.fire({
//                 icon: 'error',
//                 text: '無法順利登入....',
//             })
//         }
//        }
//     };
//     oReq.addEventListener("error", ()=>{
//         Swal.fire({
//             icon: 'error',
//             text: '無法連接至驗證伺服器',
//         })
//     });
//     oReq.open("GET", serverAuthUrl.href, true);
//     oReq.send();

// }