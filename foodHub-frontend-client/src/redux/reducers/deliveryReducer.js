
const initialState=
{
    deliveryCharge:null,
    totalItemMoney:null,
    sellerAddress:{
        formattedAddress:null,
        pos:{
            lng:null,
            lat:null
        }
    },
    userAddress:{
        formattedAddress:null,
        pos:{
            lng:null,
            lat:null
        }
    }
}


export default function deliveryDataReducer(state={

}, action){
    switch(action.type){
        case "setDeliveryJobNotification":
            return {
                ...(action.payload)
            };
            break;
        default:
            return state;
    }

}