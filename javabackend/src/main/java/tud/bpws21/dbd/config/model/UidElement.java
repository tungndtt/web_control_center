package tud.bpws21.dbd.config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public abstract class UidElement {
    @JsonProperty("uid")
    public String uid;

    @JsonProperty("name")
    public String name;

    public Map<String, Integer> properties;

    public void setPropertyValue(String property, int value) {
        if(this.properties.containsKey(property)) {
            this.properties.put(property, value);
        }
    }
}
