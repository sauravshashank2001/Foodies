package in.Shashank.foodiesapi.service;

import in.Shashank.foodiesapi.io.UserRequest;
import in.Shashank.foodiesapi.io.UserResponse;

public interface UserService {
   UserResponse registerUser(UserRequest request);

   String findByUserId();
}
