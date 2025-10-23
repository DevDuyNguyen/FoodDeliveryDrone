// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// export default function CheckRequest() {
//   const [requestData, setRequestData] = useState(null);
//   const [responseData, setResponseData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Lấy _id từ Redux state
//   const { account: { _id } } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Kiểm tra _id tồn tại
//       if (!_id) {
//         setError('Không tìm thấy Account ID trong trạng thái xác thực');
//         setLoading(false);
//         return;
//       }

//       // Kiểm tra _id là ObjectId hợp lệ
//       if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
//         setError('Account ID không hợp lệ (không phải ObjectId)');
//         setLoading(false);
//         return;
//       }

//       // Chuẩn bị dữ liệu request (param)
//       const requestInfo = {
//         accountId: _id,
//       };

//       // Lưu dữ liệu request để hiển thị
//       setRequestData(requestInfo);

//       // Log để debug
//       console.log('Redux _id:', _id);
//       console.log('Request param:', requestInfo);

//       try {
//         // Xây dựng URL với accountId làm param
//         const url = `${process.env.REACT_APP_SERVER_URL}/Delivery/getOrderDetail/${_id}`;
//         console.log('Request URL:', url);

//         // Gửi yêu cầu GET thật
//         const response = await axios.get(url);

//         // Lưu dữ liệu phản hồi
//         setResponseData(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.log('API error:', err.response?.data);
//         setError(err.response?.data?.error || 'Lỗi khi gọi API');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [_id]);

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-600 bg-gray-100 min-h-screen">
//         Đang gửi yêu cầu...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-600 bg-gray-100 min-h-screen">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-5 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Kiểm Tra Dữ Liệu Request và Response</h1>
//       <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">Dữ liệu gửi đi trong yêu cầu GET</h2>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
//           <pre className="text-sm text-gray-700 overflow-x-auto">
//             {JSON.stringify(requestData, null, 2)}
//           </pre>
//         </div>

//         <h2 className="text-xl font-semibold mb-4 text-gray-800">Dữ liệu nhận được từ API</h2>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <pre className="text-sm text-gray-700 overflow-x-auto">
//             {JSON.stringify(responseData, null, 2)}
//           </pre>
//         </div>

//         <p className="mt-4 text-sm text-gray-600">
//           Endpoint: <code className="bg-gray-200 px-1 rounded">{`${process.env.REACT_APP_SERVER_URL}/getOrderDetail/${_id}`}</code>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export default function Invoice() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy _id từ Redux state
  const { account } = useSelector((state) => state.auth);
  const _id = account?._id;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!_id) {
        setError('Không tìm thấy Account ID trong trạng thái xác thực');
        setLoading(false);
        return;
      }

      // Kiểm tra _id là ObjectId hợp lệ
      if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
        setError(`Account ID không hợp lệ: "${_id}" (phải là chuỗi 24 ký tự hex)`);
        setLoading(false);
        return;
      }

      try {
        // Sử dụng URL với accountId trong params
        const url = `${process.env.REACT_APP_SERVER_URL}/delivery/getOrderDetail/${_id}`;
        console.log('Request URL:', url);

        // Gửi yêu cầu GET
        const response = await axios.get(url);

        // Ánh xạ dữ liệu từ API
        const partnerInfo = response.data;
        const deliveryDetail = partnerInfo.deliveryDetails[0];
        const orderData = deliveryDetail?.order;

        if (!orderData || !deliveryDetail) {
          throw new Error('Không tìm thấy dữ liệu đơn hàng hoặc chi tiết giao hàng');
        }

        // Tính tổng tiền từ items
        const calculatedTotalAmount = orderData.items.reduce((total, currentItem) => {
          return total + (currentItem.quantity * currentItem.item.price);
        }, 0);

        // Xử lý địa chỉ khách hàng (chỉ lấy street)
        const userAddress = orderData.user?.userId?.address || orderData.user?.address;
        const customerAddress = userAddress?.street || 'N/A';

        // Xử lý địa chỉ nhà hàng (ưu tiên seller.sellerId.formattedAddress)
        const restaurantAddress = orderData.seller?.sellerId?.formattedAddress || orderData.seller?.name || 'N/A';

        // Ánh xạ items (chỉ để tính totalAmount, không hiển thị)
        const mappedItems = orderData.items.map(item => ({
          name: item.item.title,
          quantity: item.quantity,
          price: item.item.price,
        }));

        // Tạo object mappedOrder
        const mappedOrder = {
          orderId: orderData._id || 'N/A',
          restaurantAddress: restaurantAddress,
          restaurantPhone: orderData.seller?.phone?.toString() || orderData.seller?.sellerId?.address?.phoneNo?.toString() || 'N/A',
          customer: {
            name: orderData.user?.userId
              ? `${orderData.user.userId.firstName} ${orderData.user.userId.lastName}`.trim()
              : orderData.user?.name || 'N/A',
            address: customerAddress,
            phone: userAddress?.phoneNo?.toString() || 'N/A',
          },
          totalAmount: calculatedTotalAmount,
          deliveryFee: deliveryDetail.deliveryCharge || 0,
          status: orderData.status || 'Chờ Thanh Toán',
          items: mappedItems,
        };

        setOrder(mappedOrder);
        setLoading(false);
      } catch (err) {
        console.log('API error:', err.response?.data);
        setError(err.response?.data?.error || err.message || 'Lỗi khi tải dữ liệu hóa đơn');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [_id]);

  const handlePickupConfirm = () => {
    if (!order || order.status === 'Completed') return;

    // Chuyển trạng thái dựa trên trạng thái hiện tại
    const newStatus = order.status === 'Out For Delivery' ? 'Completed' : 'Out For Delivery';
    setOrder({ ...order, status: newStatus });
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu hóa đơn...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  const grandTotal = order.totalAmount + order.deliveryFee;

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Quản Lý Hóa Đơn</h1>
      
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row justify-center items-start md:justify-between p-4 mb-6 text-white rounded-t-lg bg-gradient-to-r from-green-500 to-green-600 border-b-4 border-green-700">
          <div className="flex-1 p-2 text-center md:text-left">
            <h3 className="text-xl font-semibold">FoodHub Việt Nam</h3>
            <p className="text-sm">Mã số thuế: 123456789</p>
            <p className="text-sm">Địa chỉ: 456 Đường C, Hà Nội, 10000</p>
            <p className="text-sm">Điện thoại: 0905123456 | Email: info@foodhub.vn</p>
          </div>
          <div className="p-2 text-center md:text-right">
            <h2 className="text-4xl font-extrabold tracking-tight">HÓA ĐƠN</h2>
            <p className="text-sm mt-1">Số hóa đơn: {order.orderId}</p>
            <p className="text-sm">Ngày phát hành: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        <div className="space-y-2 mb-8 p-4 border rounded-lg bg-gray-50 text-gray-700">
          <div className="flex flex-col md:flex-row md:items-center">
            <strong className="w-full md:w-1/3 font-semibold">Địa chỉ và SĐT nhà hàng:</strong>
            <span className="w-full md:w-2/3">{`${order.restaurantAddress}, ${order.restaurantPhone}`}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center">
            <strong className="w-full md:w-1/3 font-semibold">Thông tin người nhận:</strong>
            <span className="w-full md:w-2/3">{`${order.customer.name} - ${order.customer.phone}`}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center">
            <strong className="w-full md:w-1/3 font-semibold">Địa chỉ giao hàng:</strong>
            <span className="w-full md:w-2/3">{order.customer.address}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center">
            <strong className="w-full md:w-1/3 font-semibold">Trạng thái:</strong>
            <span className="px-3 py-1 text-sm font-bold text-green-800 bg-green-200 rounded-full inline-block">
              {order.status}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dashed border-gray-300 flex flex-col items-end">
          <div className="w-full md:w-1/2 space-y-1 text-right text-gray-700">
            <div className="flex justify-between text-base">
              <span>Tổng tiền hàng:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Phí giao hàng:</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-xl font-extrabold text-red-600 pt-2 border-t mt-2">
              <span>TỔNG THANH TOÁN:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            className={`mt-6 px-6 py-3 font-semibold rounded-lg transition duration-300 ease-in-out shadow-lg 
              ${order.status === 'Completed' 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            onClick={handlePickupConfirm}
            disabled={order.status === 'Completed'}
          >
            {order.status === 'Completed' ? 'Completed' : order.status === 'Out For Delivery' ? 'Complete' : 'Pickup Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}