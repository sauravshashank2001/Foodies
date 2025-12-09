package in.Shashank.foodiesapi.service;

import in.Shashank.foodiesapi.io.CartRequest;
import in.Shashank.foodiesapi.io.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
