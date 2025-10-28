
const initialState=
{
    deliveryCharge:null,
    totalItemMoney:null,
    sellerAddress:{
        formattedAddress:null,
        pos:{
            lat:10.779425388347109,
            lng:106.6845684601324
        }
    },
    customerAddress:{
        formattedAddress:null,
        pos:{
            lat:10.779425388347109,
            lng:106.6845684601324
        }
    }
}


export default function deliveryDataReducer(state=initialState, action){
    console.log("deliveryDataReducer() + action.type", action.type);
    
    switch(action.type){
        case "setDeliveryJobNotification":
            console.log("choose setDeliveryJobNotification+action.payload", action.payload);
            return {
                ...state,
                ...(action.payload)
            };
            break;
        default:
            return state;
    }

}