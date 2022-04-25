package tud.bpws21.dbd.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.ResourceUtils;
import tud.bpws21.dbd.config.model.*;
import java.io.IOException;

// Control configuration of the whole application
// File: control_config.json
public class ControlConfiguration {
    public Uhr uhr;

    @JsonProperty("zn")
    public ZN[] zn;

    @JsonProperty("telefone")
    public Telefone[] telefone;

    @JsonProperty("booster")
    public Booster booster;

    @JsonProperty("ortsbetrieb")
    public Ortsbetrieb ortsbetrieb;

    @JsonProperty("block")
    public Block[] block;

    @JsonProperty("handregler")
    public Handregler[] handregler;

    @JsonProperty("rechner")
    public Rechner rechner;

    @JsonProperty("znpi")
    public ZNPi znpi;

    ControlConfiguration(){}

    public static ControlConfiguration generate() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(ResourceUtils.getFile(Config.CONTROL_CONFIG_FILE), ControlConfiguration.class);
    }
}