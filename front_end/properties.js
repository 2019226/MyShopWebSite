const lineLoginServiceUrl='/backend/redirection/line/login'
const googleLoginServiceUrl='/backend/redirection/google/login'
const getUserInfoUrl='/backend/shop/user/info'
const websiteLoginPage='./login.html'
const websiteLogoutUrl='/backend/shop/user/logout'
const websiteLoginUrl='/backend/shop/user/login'
const websiteRegisterUrl='/backend/shop/user'
const websiteForgetPasswordUrl ='/backend/shop/user/password/change'
const backendResourceProductListUrl = '/backend/shop/product'
const backendResourceProductManageUrl = '/backend/shop/product'
const backendResourceShoppingCartUrl = '/backend/shoppingCart/product'
const backendResourceAmountShoppingCartUrl = '/backend/shoppingCart/amount'
const backendResourceCreateOrderUrl ='/backend/shop/order'
const linePayUrl='/backend/linepay/getPaymentUrl'
const backendResourceCheckOutUrl = '/backend/shoppingCart/checkout'
const backendResourceOrderListUrl = '/backend/shop/order'
const backendResourceOrderDetailUrl = '/backend/shop/order/{orderId}'
const backendResourceChangeOrderStatusUrl = '/backend/shop/order/{orderId}/{newStatus}'
const backendResourceCheckAdminUrl = '/backend/shop/user/admin'
export default{
    lineLoginServiceUrl,
    websiteLoginPage,
    getUserInfoUrl,
    googleLoginServiceUrl,
    linePayUrl,
    websiteLogoutUrl,
    websiteLoginUrl,
    websiteRegisterUrl,
    websiteForgetPasswordUrl,
    backendResourceProductListUrl,
    backendResourceProductManageUrl,
    backendResourceShoppingCartUrl,
    backendResourceAmountShoppingCartUrl,
    backendResourceCreateOrderUrl,
    backendResourceCheckOutUrl,
    backendResourceOrderListUrl,
    backendResourceOrderDetailUrl,
    backendResourceCheckAdminUrl,
    backendResourceChangeOrderStatusUrl,
}