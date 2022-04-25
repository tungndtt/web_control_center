package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;

public class Handregler extends UidElement{
    @JsonProperty("options")
    public Option[] options;

    Handregler(){
        this.properties = new HashMap<>();
        this.properties.put("controller", 0);
    }

    public static class Option {
        @JsonProperty("name")
        public String name;

        @JsonProperty("value")
        public int value;
    }
}
