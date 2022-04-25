package tud.bpws21.dbd.usermanager;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import tud.bpws21.dbd.config.Config;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Component
// A bean component for managing the users in system
// Automatically generated once the application starts
// File: users.json
public class UserManager {

    private static Logger logger = Logger.getLogger(Config.class);

    private static Users users;

    @PostConstruct
    public static void init() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            users = objectMapper.readValue(ResourceUtils.getFile(Config.USERS_CONFIG_FILE), Users.class);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
    }

    public static Map<String, Object> getUser(String username, String password) {
        if(users != null) {
            for(User user : users.users) {
                if(user.username.equals(username) && user.password.equals(password)) {
                    return Map.of("id", user.id, "username", user.username, "info", user.information);
                }
            }
        }
        return null;
    }

    static class Users {
        @JsonProperty("users")
        User[] users;
    }

    static class User {
        @JsonProperty("id")
        long id;

        @JsonProperty("username")
        String username;

        @JsonProperty("password")
        String password;

        @JsonProperty("info")
        Information information;
    }

    static class Information {
        @JsonProperty("email")
        String email;

        @JsonProperty("role")
        String role;

        @JsonProperty("department")
        String department;

        @JsonProperty("contact")
        String contact;
    }
}
