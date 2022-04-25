package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;

public class ZNPi {
    @JsonProperty("places")
    public Place[] places;

    @JsonProperty("desktops")
    public String[] desktops;

    @JsonProperty("projects")
    public Project[] projects;

    @JsonProperty("volume")
    public int[] volume;

    @JsonProperty("notifications")
    public String[] notifications;

    public static class Project {
        @JsonProperty("name")
        public String name;

        @JsonProperty("value")
        public int value;
    }

    public static class Place extends UidElement {
        Place(){
            this.properties = new HashMap<>();
            this.properties.put("desktop", 0);
            this.properties.put("project", 0);
            this.properties.put("volume", 0);
            this.properties.put("notification", 0);
        }
    }
}
