package in.Shashank.foodiesapi.service;

import in.Shashank.foodiesapi.entity.UserEntity;
import in.Shashank.foodiesapi.io.UserRequest;
import in.Shashank.foodiesapi.io.UserResponse;
import in.Shashank.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request){
        UserEntity newUser = convertToEntity(request);
        newUser =  userRepository.save(newUser);
        return convertToResponse(newUser);


    }

    @Override
    public String findByUserId() {
        userRepository.findByEmail();
    }

    private UserEntity convertToEntity(UserRequest request){

        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();

    }
    private UserResponse convertToResponse(UserEntity registeredUser){
        return UserResponse.builder()
                .id(registeredUser.getId())
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .build();
    }
}
