package tud.bpws21.dbd.rest;

import org.springframework.web.bind.annotation.*;
import tud.bpws21.dbd.usermanager.UserManager;
import tud.bpws21.dbd.token.Token;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class Login {

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Map<String, Object> requestLogin(@RequestBody Map<String, String> body) {
        if(body.containsKey("username") && body.containsKey("password")) {
            Map<String, Object> userInfo = UserManager.getUser(body.get("username"), body.get("password"));
            if(userInfo != null) {
                String token = Token.generate((Long) userInfo.get("id"), (String) userInfo.get("username"));
                return Map.of("token", token, "username", userInfo.get("username"), "info", userInfo.get("info"));
            }
        }
        return null;
    }
}
