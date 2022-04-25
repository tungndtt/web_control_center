package tud.bpws21.dbd.socket;

import tud.bpws21.dbd.config.Config;
import tud.bpws21.dbd.config.ControlProfile;
import java.util.HashMap;

// Handler for other stuffs
public class UtilsHandler {

    public static void LoadControlProfiles() {
        Socket.addEventListener("load profiles", (client, data) -> {
            Socket.broadcast("profiles", Config.controlProfiles);
        });
    }

    public static void SetControlProfile() {
        Socket.addEventListener("profile", (client, data) -> {
            int value = ((HashMap<String, Integer>) data).get("value");
            ControlProfile controlProfile = Config.controlProfiles.get(value);
            for(ControlProfile.Profile profile: controlProfile.profiles) {
                Socket.dbdclient.setValue(profile.uid, profile.value);
            }
        });
    }
}
