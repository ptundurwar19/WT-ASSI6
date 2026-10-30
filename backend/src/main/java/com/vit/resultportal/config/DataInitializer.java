package com.vit.resultportal.config;

import com.vit.resultportal.model.Role;
import com.vit.resultportal.model.StudentResult;
import com.vit.resultportal.model.User;
import com.vit.resultportal.repository.StudentResultRepository;
import com.vit.resultportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner createDefaultUsers(UserRepository userRepository, 
                                         StudentResultRepository resultRepository, 
                                         PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                userRepository.save(new User("admin", encoder.encode("admin123"), Role.ADMIN));
            }
            if (!userRepository.existsByUsername("student")) {
                userRepository.save(new User("student", encoder.encode("student123"), Role.STUDENT));
            }
            if (!resultRepository.existsByUsername("student")) {
                StudentResult sample = new StudentResult();
                sample.setUsername("student");
                sample.setStudentName("Sample VIT Student");
                sample.setPrn("12210001");
                sample.setBranch("Computer Engineering");
                sample.setSemester(4);
                sample.setSubject1("Data Structures & Algorithms");
                sample.setMse1(26.0);
                sample.setEse1(63.0);
                sample.setSubject2("Database Management Systems");
                sample.setMse2(27.5);
                sample.setEse2(59.5);
                sample.setSubject3("Web Technology");
                sample.setMse3(28.0);
                sample.setEse3(64.0);
                sample.setSubject4("Software Engineering");
                sample.setMse4(25.0);
                sample.setEse4(61.0);
                resultRepository.save(sample);
            }
        };
    }
}
