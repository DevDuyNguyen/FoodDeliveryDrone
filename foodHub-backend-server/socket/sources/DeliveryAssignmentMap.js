/*
orderId->{
    accountId of delivery partner:,
    timeout:Js timeout,
    count: how many time this order is assigned,
    refuser:[accountId]
}
*/
let deliveryAssignmentMap=new Map();

module.exports=deliveryAssignmentMap