import { useDispatch, useSelector } from "react-redux"

function onAcceptJob(event){
    //[not done]
}
function onRefuseJob(event){
    //[not done]
}

const deliveryJobNotification=(props)=>{
    let deliveryCharge=useSelector(state=>state.deliveryData.deliveryCharge);
    let totalItemMoney=useSelector(state=>state.deliveryData.totalItemMoney);
    sellerAddress:useSelector(state=>state.deliveryData.sellerAddress);
    userAddress:useSelector(state=>state.deliveryData.userAddress);

    const dispatch=useDispatch();

    return (
        <div>
            <p>Delivery charge: {deliveryCharge}</p>
            <p>Total product price in order: {totalItemMoney}</p>
            <p>Seller address: {sellerAddress.formattedAddress}</p>
            <p>Distance to seller: [not done: goong]]</p>
            <p>Customer address: {userAddress.formattedAddress}</p>
            <p>Distance to customer: [not done: goong]]</p>
            <button>No</button>
            <button>Yes</button>
        </div>
    )

}