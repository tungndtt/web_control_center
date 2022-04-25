package tud.bpws21.dbd.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.ResourceUtils;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// Control profiles for the application
// Directory: */profiles/
public class ControlProfile {

    @JsonProperty("name")
    public String name;

    @JsonProperty("profiles")
    public Profile[] profiles;

    ControlProfile(){}

    public static class Profile {
        @JsonProperty("uid")
        public String uid;

        @JsonProperty("value")
        public int value;
    }

    public static List<ControlProfile> generate() throws FileNotFoundException {
        File profileDir = ResourceUtils.getFile(Config.CONTROL_PROFILE_DIR);
        List<ControlProfile> controlProfiles = new ArrayList<>();
        if(profileDir.isDirectory()) {
            ObjectMapper objectMapper = new ObjectMapper();
            for(File profileFile : profileDir.listFiles()) {
                try {
                    ControlProfile controlProfile = objectMapper.readValue(profileFile, ControlProfile.class);
                    controlProfiles.add(controlProfile);
                } catch (IOException e) {}
            }
        }
        return controlProfiles;
    }
}