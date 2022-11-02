// import Vuex from './vuex.global.js'
// import { createStore } from 'vuex'

export default  new Vuex.Store({
  state :{
    init:false,
    authId:'0',
    isLogin: false,
    userName:'',
    userPicture:'',
    shopingCartProductQuanity:3,

    productList:[{
        id :'04',
        name :'同學真是越夜越美麗同學真是越夜越美麗',
        price :'18',
        currency:'新台幣',
        describe:'同學真是越夜越美麗',
        inventoryQuantity:50,
        isAddToCart:false,
      },{
        id :'05',
        name :'商品二',
        price :'520',
        currency:'新台幣',
        describe:'月老的紅線',
        inventoryQuantity:50,

        isAddToCart:false,
      },{
        id :'06',
        name :'商品三',
        price :'0',
        currency:'紙錢',
        describe:'孟婆湯',
        inventoryQuantity:50,

        isAddToCart:false,
      },{
        id :'07',
        name :'商品四',
        price :'18',
        currency:'新台幣',
        describe:'老闆吃了沒用',
        inventoryQuantity:50,

        isAddToCart:false,
      },{
        id :'08',
        name :'人生的下一站',
        price :'210',
        currency:'新台幣',
        describe:'車票',
        inventoryQuantity:50,

        isAddToCart:false,
      },{
        id :'09',
        name :'人生的下一站',
        price :'210',
        currency:'新台幣',
        describe:'車票',
        inventoryQuantity:50,

        isAddToCart:false,
      },{
        id :'10',
        name :'人生的下一站',
        price :'210',
        currency:'新台幣',
        describe:'車票',
        inventoryQuantity:50,

        isAddToCart:false,
      }
    ],
    inCartProductList:[{
      id :'04',
      name :'同學真是越夜越美麗同學真同學真是越夜越美',
      price :'18',
      inventoryQuantity:50,
      customDemandQuantity:0,

    },{
      id :'05',
      name :'商品二',
      price :'520',
      inventoryQuantity:50,
      customDemandQuantity:0,

    },{
      id :'06',
      name :'商品三',
      price :'0',
      inventoryQuantity:50,
      customDemandQuantity:0,

    },{
      id :'07',
      name :'商品四',
      price :'18',
      inventoryQuantity:50,
      customDemandQuantity:0,

    },{
      id :'08',
      name :'人生的下一站',
      price :'210',
      inventoryQuantity:50,
      customDemandQuantity:0,
    }],
    deliveryInfo:{
      personName:'XXX',
      phoneNumber:'090000000',
      note:'薯條去鹽',
      type:'宅配',
      address:'jaosdjposajopdsa',
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
    setUserInfo :(state,{isLogin,userInfo}) =>{
      state.isLogin =isLogin;
      state.userName =userInfo.name;
      state.userPicture =userInfo.userPicture==undefined?'./image/avatar.png':userInfo.userPicture;
    },
    setInitComplete:(state,{isInitFinish})=>{
      state.init = isInitFinish;
    },
    addProductToCart:(state,{product})=>{
      state.shopingCartProductQuanity++;
      var found = state.productList.find(function(element,) {
        return element.id == product.id;
      });
      found.isAddToCart=true;
    },
    removeProductInShoppingCart:(state,productId)=>{
      var needToRemoveProductIndex=state.inCartProductList.findIndex(function(targetProduct){
        return targetProduct.id==productId;
      })
      
      state.inCartProductList.splice(needToRemoveProductIndex,1);
    },
    setDeliveryInfo:(state,{deliveryInfo})=>{
      console.log(deliveryInfo);
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
        console.log(state.productList);
        return state.productList;
    },
    totalPriceInShoppingCartProduct:(state)=>{
      var sum=0;
      state.inCartProductList.forEach(element => {
        sum +=  element.price*element.customDemandQuantity;
      });
      console.log(sum);
      return sum;
    },
    deliveryInfo:(state)=>{
      return state.deliveryInfo;
    }
  }
})

  