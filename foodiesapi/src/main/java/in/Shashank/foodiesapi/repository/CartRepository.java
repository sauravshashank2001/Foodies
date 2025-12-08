package in.Shashank.foodiesapi.repository;

import in.Shashank.foodiesapi.entity.CartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends MongoRepository<CartEntity, String> {
}
