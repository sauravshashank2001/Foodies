package in.Shashank.foodiesapi.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import in.Shashank.foodiesapi.entity.OrderEntity;
import in.Shashank.foodiesapi.io.OrderRequest;
import in.Shashank.foodiesapi.io.OrderResponse;
import in.Shashank.foodiesapi.repository.CartRepository;
import in.Shashank.foodiesapi.repository.OrderRepository;
import lombok.AllArgsConstructor;
import netscape.javascript.JSObject;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private CartRepository cartRepository;

    @Value("${razorpay_key}")
    private String RAZORPAY_KEY;
    @Value("${razorpay_secret}")
    private String RAZORPAY_SECRET;

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) {

        try{
            OrderEntity newOrder = convertToEntity(request);
            newOrder = orderRepository.save(newOrder);


            //create razorpay payment order
            RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY,RAZORPAY_SECRET);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",newOrder.getAmount());
            orderRequest.put("currency", "INR");
            orderRequest.put("payment_capture", 1);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            newOrder.setRazorPayOrderId(razorpayOrder.get("id"));
            String loggedInUserId = userService.findByUserId();
            newOrder.setUserId(loggedInUserId);
            newOrder = orderRepository.save(newOrder);
            return convertToResponse(newOrder);
        }
        catch(RazorpayException e){
            throw new RuntimeException("Razorpay order creation failed", e);

        }


    }

    @Override
    public void verifyPayment(Map<String, String> paymentData, String status) {
       String razorpayOrderId =  paymentData.get("razorpay_order_id");
       OrderEntity exisitingOrder = orderRepository.findByRazorPayOrderId(razorpayOrderId)
               .orElseThrow(()-> new RuntimeException("Order not found"));

       exisitingOrder.setPaymentStatus(status);
       exisitingOrder.setRazorPaySignature(paymentData.get("razorpay_signature"));
       exisitingOrder.setRazorpayPaymentId(paymentData.get("razorpay_payment_id"));

       orderRepository.save(exisitingOrder);
       if("paid".equalsIgnoreCase(status)){
           cartRepository.deleteByUserId(exisitingOrder.getUserId());
       }

    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());

    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(()->new RuntimeException("Order not found"));

        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    private OrderEntity convertToEntity(OrderRequest request){
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build();
    }

    private OrderResponse convertToResponse(OrderEntity newOrder){
        return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .razorPayOrderId(newOrder.getRazorPayOrderId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderItems())
                .build();
    }
}
