package in.Shashank.foodiesapi.controller;

import in.Shashank.foodiesapi.io.CartRequest;
import in.Shashank.foodiesapi.io.CartResponse;
import in.Shashank.foodiesapi.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.CacheResponse;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request){
       String foodId =  request.getFoodId();
       if(foodId ==null || foodId.isEmpty()){
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "FoodId not found");

       }
       return cartService.addToCart(request);

    }

    @GetMapping
    public CartResponse getcart(){

        return cartService.getCart();

    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void ClearCart(){
        cartService.clearCart();
    }

    @PostMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request){
        String foodId =  request.getFoodId();
        if(foodId ==null || foodId.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "FoodId not found");
        }

        return cartService.removeFromCart(request);
    }

}
