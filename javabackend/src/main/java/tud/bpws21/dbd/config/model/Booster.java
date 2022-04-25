package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;

public class Booster {
    @JsonProperty("places")
    public Place[] places;

    @JsonProperty("groups")
    public Group[] groups;

    public int auto;

    Booster(){
        this.auto = 0;
    }

    public static class Place extends UidElement{
        Place() {
            this.properties = new HashMap<>();
            this.properties.put("try", 0);
            this.properties.put("status", 0);
        }
    }

    public static class Group {
        @JsonProperty("name")
        public String name;

        @JsonProperty("list")
        public String[] list;
    }
}
