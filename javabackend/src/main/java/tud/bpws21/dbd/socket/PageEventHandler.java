package tud.bpws21.dbd.socket;

import info.dornbach.dbdclient.DBDClient;
import org.apache.log4j.Logger;
import tud.bpws21.dbd.config.Config;
import tud.bpws21.dbd.config.model.*;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Date;

// Handler for events from pages
public class PageEventHandler {

    private static Logger logger = Logger.getLogger(PageEventHandler.class);

    // Uhr handler
    public static void UhrHandler() {
        // add logic for "Uhr" handler
        if(Socket.dbdclient != null) {
            DBDClient.DBDSimulationClock clock = (DBDClient.DBDSimulationClock) Socket.dbdclient.getClock();
            Uhr uhr = Config.controlConfiguration.uhr;
            Socket.addEventListener("uhr", (client, data) -> {
                HashMap<String, Object> dataObject = (HashMap<String, Object>) data;
                String operation = (String) dataObject.get("operation");
                Object value = dataObject.get("value");
                switch(operation) {
                    case "start_time": {
                        uhr.startTime = (Long) value;
                        clock.setSimulationTime(new Date((Long) value));
                        break;
                    }
                    case "stop": {
                        clock.setClockStopped((Boolean) value);
                        break;
                    }
                    case "time": {
                        uhr.currentTime = clock.getSimulationTime();
                        Socket.broadcast("uhr_update", uhr);
                        break;
                    }
                    case "reset": {
                        clock.setOffset(0);
                        break;
                    }
                    case "speed_up": {
                        clock.setSpeedup((Integer) value);
                        break;
                    }
                    default:
                        break;
                }
            });
            clock.addTimeChangeListener(timeChangeEvent -> {
                uhr.currentTime = timeChangeEvent.getNewValue();
                uhr.stop = clock.isClockStopped();
                uhr.speedUp = clock.getSpeedup();
                Socket.broadcast("uhr_update", uhr);
            });
        }
    }

    // Booster handler
    public static void BoosterHandler() {
        // logic for "Booster" handler
        Socket.addEventListener("booster", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            List<String> uidList = (List) dataObject.get("uid_list");
            int value = (Integer) dataObject.get("value");
            String operation = (String) dataObject.get("operation");
            switch(operation) {
                case "auto": {
                    if(Socket.dbdclient != null) {
                        Socket.dbdclient.setValue("BOOSTERAUTO", value);
                    } else {
                        Socket.broadcast("booster_auto", value);
                    }
                    break;
                }
                default: {
                    if(Socket.dbdclient != null) {
                        forwardRequestToDBD("bo%ss", uidList, value);
                    } else {
                        directResponseWithoutDBDConnection(
                            "booster_update", Config.controlConfiguration.booster.places,
                            uidList, "status", value
                        );
                    }
                    break;
                }
            }

        });
        listenDBDResponse(
            Config.controlConfiguration.booster.places,
            new String[][]{{"bo%si", "booster_update", "status"}, {"bo%sv", "booster_try", "try"}}
        );
        Socket.dbdclient.addDBDListener("BOOSTERAUTO", (dbdClient, s, newValue, oldValue) -> {
            logger.info("DBD Response on event [BOOSTERAUTO]: booster automation = " + newValue);
            Config.controlConfiguration.booster.auto = newValue;
            Socket.broadcast("booster_auto", newValue);
        });
    }

    // Ortsbetrieb handler
    public static void OrtsbetriebHandler() {
        // logic for "Ortsbetrieb" handler
        Socket.addEventListener("ortsbetrieb", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            switch((String) dataObject.get("target")) {
                case "places": {
                    Map<String, Integer> uidMapValue = (Map<String, Integer>) dataObject.get("uid_map");
                    for(Map.Entry<String, Integer> entry: uidMapValue.entrySet()) {
                        if(Socket.dbdclient != null) {
                            forwardRequestToDBD("%s", List.of(entry.getKey()), entry.getValue());
                        } else {
                            directResponseWithoutDBDConnection(
                                "ortsbetrieb_place_update", Config.controlConfiguration.ortsbetrieb.places,
                                List.of(entry.getKey()), "technique", entry.getValue()
                            );
                        }
                    }
                    break;
                }
                case "buchsbaum": {
                    Ortsbetrieb.Durchschaltung durchschaltung = Config.controlConfiguration.ortsbetrieb.durchschaltung;
                    if(dataObject.get("operation").equals("select")) {
                        int value = (Integer) dataObject.get("value");
                        String uid = durchschaltung.uid;
                        if(Socket.dbdclient != null) {
                            forwardRequestToDBD("%s", List.of(uid), value);
                        } else {
                            directResponseWithoutDBDConnection(
                                "ortsbetrieb_durchschaltung_update", Config.controlConfiguration.ortsbetrieb.others,
                                List.of(uid), "status", value
                            );
                        }
                    } else {
                        if(Socket.dbdclient != null) {
                            System.out.println("receive signal");
                            for(int signal : durchschaltung.signals) {
                                Socket.dbdclient.setValue(signal+"i", 4096);
                                Socket.dbdclient.setValue(signal+"s", 4096);
                            }
                        }
                    }
                    break;
                }
                case "others": {
                    int value = (Integer) dataObject.get("value");
                    String uid = (String) dataObject.get("uid");
                    if(Socket.dbdclient != null) {
                        forwardRequestToDBD("%s", List.of(uid), value);
                    } else {
                        directResponseWithoutDBDConnection(
                            "ortsbetrieb_other_update", Config.controlConfiguration.ortsbetrieb.others,
                            List.of(uid), "option", value
                        );
                    }
                    break;
                }
                default:
                    break;
            }
        });
        listenDBDResponse(
            Config.controlConfiguration.ortsbetrieb.places,
            new String[][]{{"%s", "ortsbetrieb_place_update", "technique"}}
        );
        listenDBDResponse(
            Config.controlConfiguration.ortsbetrieb.others,
            new String[][]{{"%s", "ortsbetrieb_other_update", "option"}}
        );
        listenDBDResponse(
            new UidElement[]{Config.controlConfiguration.ortsbetrieb.durchschaltung},
            new String[][]{{"%s", "ortsbetrieb_durchschaltung_update", "status"}}
        );
    }

    // ZN handler
    public static void ZNHandler() {
        // logic for "ZN" handler
        Socket.addEventListener("zn", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            int value = (Integer) dataObject.get("value");
            List<String> uidList = (List) dataObject.get("uid_list");
            if(Socket.dbdclient != null) {
                forwardRequestToDBD("zn%saus", uidList, value);
            } else {
                directResponseWithoutDBDConnection(
                    "zn_update", Config.controlConfiguration.zn, 
                    uidList, "status", value
                );
            }
        });
        listenDBDResponse(
            Config.controlConfiguration.zn,
            new String[][]{{"zn%saus", "zn_update", "status"}}
        );
    }

    // Telefone handler
    public static void TelefoneHandler() {
        // logic for "Telefone" handler
        Socket.addEventListener("telefone", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            String uid = (String) dataObject.get("uid");
            int value = (Integer) dataObject.get("value");
            if(Socket.dbdclient != null) {
                forwardRequestToDBD("%s", List.of(uid), value);
            } else {
                directResponseWithoutDBDConnection(
                    "telefone_update", Config.controlConfiguration.telefone, 
                    List.of(uid), "number", value
                );
            }
        });
        listenDBDResponse(
            Config.controlConfiguration.telefone,
            new String[][]{{"%s", "telefone_update", "number"}}
        );
    }

    // Block handler
    public static void BlockHandler() {
        Socket.addEventListener("block", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            String uid = (String) dataObject.get("uid");
            int value = (Integer) dataObject.get("value");
            if(Socket.dbdclient != null) {
                forwardRequestToDBD("%s", List.of(uid), value);
            } else {
                List<UidElement> controllers = new LinkedList<>();
                Block[] blocks = Config.controlConfiguration.block;
                for(Block block: blocks) {
                    for(Block.Place place: block.places) {
                        for(Block.Controller controller: place.controllers) {
                            controllers.add(controller);
                        }
                    }
                }
                directResponseWithoutDBDConnection(
                    "block_update", (UidElement[]) controllers.toArray(), 
                    List.of(uid), "status", value
                );
            }
        });
        Block[] blocks = Config.controlConfiguration.block;
        for(Block block: blocks) {
            for(Block.Place place: block.places) {
                listenDBDResponse(
                    place.controllers,
                    new String[][]{{"%s", "block_update", "status"}}
                );
            }
        }
    }

    // Handregler handler
    public static void HandreglerHandler() {
        // logic for "Handregler" handler
        Socket.addEventListener("handregler", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            String uid = (String) dataObject.get("uid");
            int value = (Integer) dataObject.get("value");
            if(Socket.dbdclient != null) {
                forwardRequestToDBD("%s", List.of(uid), value);
            } else {
                directResponseWithoutDBDConnection(
                    "handregler_update", Config.controlConfiguration.handregler, 
                    List.of(uid), "controller", value
                );
            }

        });
        listenDBDResponse(
            Config.controlConfiguration.handregler,
            new String[][]{{"%s", "handregler_update", "controller"}}
        );
    }

    // Rechner Handler
    public static void RechnerHandler() {
        // logic for "Rechner" handler
        Socket.addEventListener("rechner", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            int value = (Integer) dataObject.get("value");
            List<String> uidList = (List<String>) dataObject.get("uid_list");
            String operation = (String) dataObject.get("operation");
            if(Socket.dbdclient != null) {
                switch(operation) {
                    case "screensaver":
                        operation = "scrnsvr";
                        break;
                    case "system":
                        operation = "system";
                        break;
                    case "project":
                        operation = "project";
                        break;
                    default:
                        operation = "boot";
                        break;
                }
                String eventFormat = "estw%s"+operation;
                forwardRequestToDBD(eventFormat, uidList, value);
            } else {
                String replyEvent = null;
                switch(operation) {
                    case "screensaver":
                        replyEvent = "rechner_screensaver_update";
                        break;
                    case "system":
                        replyEvent = "rechner_operatingsystem_update";
                        break;
                    case "project":
                        replyEvent = "rechner_project_update";
                        break;
                    default:
                        replyEvent = "rechner_boot_update";
                        break;
                }
                directResponseWithoutDBDConnection(
                    replyEvent, Config.controlConfiguration.rechner.computers, 
                    uidList, operation, value
                );
            }
        });
        listenDBDResponse(
            Config.controlConfiguration.rechner.computers,
            new String[][]{
                {"estw%sboot", "rechner_boot_update", "boot"},
                {"estw%sscrnsvr", "rechner_screensaver_update", "screensaver"},
                {"estw%sproject", "rechner_project_update", "project"},
                {"estw%ssystem", "rechner_system_update", "system"}
            }
        );
    }

    // ZNPi Handler
    public static void ZNPiHandler() {
        // logic for ZNPi
        Socket.addEventListener("znpi", (client, data) -> {
            HashMap<String, Object> dataObject = (HashMap) data;
            String uid = (String) dataObject.get("uid");
            int value = (Integer) dataObject.get("value");
            String operation = (String) dataObject.get("operation");
            String[] definedOperations = new String[]{"desktop", "volume", "znproject", "notification"};
            boolean executable = false;
            for(String definedOperation: definedOperations) {
                if(definedOperation.equals(operation)) {
                    executable = true;
                    break;
                }
            }
            if(executable) {
                if(Socket.dbdclient != null) {
                    String eventFormat = "zn%s"+operation;
                    forwardRequestToDBD(eventFormat, List.of(uid), value);
                } else {
                    String replyEvent = String.format("znpi_%s_update", operation);
                    directResponseWithoutDBDConnection(
                        replyEvent, Config.controlConfiguration.znpi.places,
                        List.of(uid), operation, value
                    );
                }
            }
        });
        listenDBDResponse(
            Config.controlConfiguration.znpi.places,
            new String[][]{
                {"zn%sdesktop", "znpi_desktop_update", "desktop"},
                {"zn%svolume", "znpi_volume_update", "volume"},
                {"zn%sznproject", "znpi_project_update", "project"},
                {"zn%snotification", "znpi_notification_update", "notification"}
            }
        );
    }

    // Listen to DBD server based on variable change, where args = [<variable format>, <reply event>, <to-be-updated property>].
    // Then it will:
    // - After the response is received, broadcast to all users on <reply event>
    // - Update the control state's property <to-be-updated property>
    private static void listenDBDResponse(UidElement[] uidElements, String[][] args) {
        if(Socket.dbdclient != null) {
            for(final UidElement uidElement: uidElements) {
                for(String[] arg: args) {
                    String variableFormat = arg[0], replyEvent = arg[1], toUpdateProperty = arg[2];
                    String variable = String.format(variableFormat, uidElement.uid).toUpperCase();
                    Socket.dbdclient.addDBDListener(variable, (dbdClient, name, newValue, oldValue) -> {
                        logger.info(String.format(
                            "DBD Response on event [%s]: Element = '%s'; New Value = %d", 
                            variable, uidElement.name, newValue)
                        );
                        Socket.broadcast(replyEvent, uidElement.uid, newValue);

                        // update the control state with the new value
                        uidElement.setPropertyValue(toUpdateProperty, newValue);
                    });
                }
            }
        }
    }

    // Forward the request of changing variable to DBD server
    private static void forwardRequestToDBD(String variableFormat, List<String> uidList, int newValue) {
        for(String uid: uidList) {
            String variable = String.format(variableFormat, uid);
            Socket.dbdclient.setValue(variable, newValue);
        }
    }

    // Reply the request directly if there is no DBD connection available
    // Update the control state of element with corresponding uid
    private static void directResponseWithoutDBDConnection(
        String replyEvent, UidElement[] uidElements, List<String> uid_list, String property, int value
    ) {
        HashSet<String> uid_set = new HashSet<>(uid_list);
        for(UidElement uidElement: uidElements) {
            if(uid_set.contains(uidElement.uid)) {
                uidElement.setPropertyValue(property, value);
            }
        }
        Socket.broadcast(replyEvent, uid_list, value);
    }
}
