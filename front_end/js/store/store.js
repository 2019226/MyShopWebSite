import properties from '../../properties.js'
export default  new Vuex.Store({
  state :{
    
    shoppingCartAmount:0,
    userInfo:{
      isLogin: false,
      userName:'',
      userPicture:'',
    },
    productList:[],
    inCartProductList:[],
    deliveryInfo:{
      picker:'',
      cellPhoneNumber:'',
      notice:'',
      deliveryType:'',
      address:'',
    },
    orderInfoList:[{
      uuid:'01',
      status:'pending',
      pedningInfo:{
        date:'2022/09/09'
      },
    },{
      uuid:'01',
      status:'finish',
      pedningInfo:{
        date:'2022/09/09'
      },
    },{

    }]
  },
  mutations: {
    setProductList:(state,productList)=>{

      state.productList = productList
      let sum =0;
      productList.forEach(product => {
        if(product.isAddToCart){
          sum++;
        }
      });
      state.shoppingCartAmount=sum;

    },
    setInCartProductList:(state,inCartProductList)=>{
      state.inCartProductList = inCartProductList
    },
    setUserInfo :(state,{isLogin,userInfo}) =>{
      state.userInfo.isLogin =isLogin;
      state.userInfo.userName =userInfo.name;
      state.userInfo.userPicture =userInfo.picture==undefined?'./image/account.svg':userInfo.picture;
    },
    addProductToCart:(state,{product})=>{
      state.shoppingCartAmount++;
      var found = state.productList.find(function(element,) {
        return element.id == product.id;
      });
      found.isAddToCart=true;
    },
    removeProductInShoppingCart:(state,productId)=>{
      state.shoppingCartAmount--;
      var needToRemoveProductIndex=state.inCartProductList.findIndex(function(targetProduct){
        return targetProduct.id==productId;
      })
      
      state.inCartProductList.splice(needToRemoveProductIndex,1);
    },
    changeCustomDemandQuantity:(state,changeProductInfo)=>{
      console.log(changeProductInfo)
      var found = state.inCartProductList.find(function(element,) {
        return element.id == changeProductInfo.productId;
      });
      found.customDemandQuantity = changeProductInfo.demandQuantity;
    },
    setDeliveryInfo:(state,deliveryInfo)=>{

      state.deliveryInfo.personName=deliveryInfo.personName;
      state.deliveryInfo.phoneNumber=deliveryInfo.phoneNumber;
      state.deliveryInfo.note=deliveryInfo.note;
      state.deliveryInfo.type=deliveryInfo.type;
      state.deliveryInfo.address=deliveryInfo.address;
    }
  },
  getters: {
    productList: (state)=> {
        while(state.productList.length%4!=0){
          state.productList.push({});
        }
        return state.productList;
    },
    totalPriceInShoppingCartProduct:(state)=>{
      var sum=0;
      state.inCartProductList.forEach(element => {
        sum +=  element.price*element.customDemandQuantity;
      });
      return sum;
    },
    deliveryInfo:(state)=>{
      return state.deliveryInfo;
    },
    userInfo:(state)=>{
      return state.userInfo;
    },
    shoppingCartAmount:(state)=>{
      //???????????????
      //??????????????????????????? ?????????????????????
      //?????????????????????????????? ?????????????????????????????????????????? ????????????
      //??????????????????????????????????????????????????? ????????????????????????
      if(state.shoppingCartAmount==0){
        const oReq = new XMLHttpRequest();
        oReq.withCredentials=true;
        oReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              state.shoppingCartAmount =this.responseText;
            }
        }
        oReq.open("get", properties.backendResourceAmountShoppingCartUrl, false);
        oReq.send();
      }
      return state.shoppingCartAmount;
    },
    getInCartProductList:(state)=>{
      return state.inCartProductList;
      
    }
  }
})

  