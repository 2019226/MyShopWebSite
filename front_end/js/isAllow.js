import store from './store/store.js';
import properties from "../properties.js";

const check=()=>{
    const oReq = new XMLHttpRequest();
    oReq.withCredentials=true;
    oReq.onreadystatechange = function() {
        if(this.readyState == 4 && this.status !=200){
            alert('你沒有權限可以進入此頁面！')
            document.location.href='./home.html';

        }
    };
    oReq.open("GET", properties.backendResourceCheckAdminUrl, false);
    oReq.send();
}


const init=()=>{
    check()
}
init();
