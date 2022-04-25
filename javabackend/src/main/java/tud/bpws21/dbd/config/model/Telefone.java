package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;

public class Telefone extends UidElement{
    public Option[] options;

    Telefone(@JsonProperty("options") Option[] options){
        this.options = options;
        this.properties = new HashMap<>();
        this.properties.put("number", options[0].value);
    }

    public static class Option {
        @JsonProperty("name")
        public String name;

        @JsonProperty("value")
        public int value;
    }
}
