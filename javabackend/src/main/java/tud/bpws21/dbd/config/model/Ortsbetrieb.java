package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;
import java.util.Map;

public class Ortsbetrieb {
    @JsonProperty("places")
    public Place[] places;

    @JsonProperty("macros")
    public Macro[] macros;

    @JsonProperty("durchschaltung")
    public Durchschaltung durchschaltung;

    @JsonProperty("others")
    public Other[] others;

    Ortsbetrieb(){}

    public static class Place extends UidElement {
        @JsonProperty("options")
        public String[] options;

        Place() {
            this.properties = new HashMap<>();
            this.properties.put("technique", 0);
        }
    }

    public static class Macro {
        @JsonProperty("name")
        public String name;

        @JsonProperty("map")
        public Map<String, Integer> map;
    }

    public static class Durchschaltung extends UidElement{
        @JsonProperty("options")
        public String[] options;

        @JsonProperty("signals")
        public int[] signals;

        Durchschaltung() {
            this.properties = new HashMap<>();
            this.properties.put("status", 0);
        }
    }

    public static class Other extends UidElement {
        @JsonProperty("options")
        public String[] options;

        Other() {
            this.properties = new HashMap<>();
            this.properties.put("option", 0);
        }
    }
}
