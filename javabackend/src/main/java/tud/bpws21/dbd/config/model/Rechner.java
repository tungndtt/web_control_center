package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;

public class Rechner {
    @JsonProperty("computers")
    public Computer[] computers;

    @JsonProperty("groups")
    public Group[] groups;

    @JsonProperty("projects")
    public Project[] projects;

    Rechner(){}

    public static class Computer extends UidElement{
        @JsonProperty("type")
        public String type;

        @JsonProperty("os")
        public String[] operatingSystems;

        Computer() {
            this.properties = new HashMap<>();
            this.properties.put("boot", 0);
            this.properties.put("screensaver", 0);
            this.properties.put("project", 0);
            this.properties.put("system", 0);
        }
    }

    public static class Group {
        @JsonProperty("name")
        public String name;

        @JsonProperty("list")
        public String[] list;
    }

    public static class Project {
        @JsonProperty("name")
        public String name;

        @JsonProperty("value")
        public int value;
    }
}
