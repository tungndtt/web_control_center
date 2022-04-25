package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;

public class Block {
    @JsonProperty("name")
    public String name;

    @JsonProperty("places")
    public Place[] places;

    Block(){}

    public static class Place {
        @JsonProperty("name")
        public String name;

        @JsonProperty("controllers")
        public Controller[] controllers;
    }

    public static class Controller extends UidElement {
        @JsonProperty("options")
        public Option[] options;

        Controller() {
            this.properties = new HashMap<>();
            this.properties.put("status", 1);
        }
    }

    public static class Option {
        @JsonProperty("name")
        public String name;

        @JsonProperty("value")
        public int value;

        @JsonProperty(value = "color")
        public String color;
    }
}
