package in.Shashank.foodiesapi.service;

import in.Shashank.foodiesapi.io.FoodRequest;
import in.Shashank.foodiesapi.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {
    String uploadFile(MultipartFile file);

    //adding food service function
    FoodResponse addFood(FoodRequest request, MultipartFile file);

    //getting food service function
    List<FoodResponse> readFoods();

    //Reading food with the id service function
    FoodResponse readFood(String id);

    //delete file from s3
    boolean deleteFile(String filename);

    //delete food from mongo
    void deleteFood(String id);


}
