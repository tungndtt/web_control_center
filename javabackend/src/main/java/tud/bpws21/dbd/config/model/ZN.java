package tud.bpws21.dbd.config.model;

import java.util.HashMap;

public class ZN extends UidElement{
    ZN(){
        this.properties = new HashMap<>();
        this.properties.put("status", 0);
    }
}
