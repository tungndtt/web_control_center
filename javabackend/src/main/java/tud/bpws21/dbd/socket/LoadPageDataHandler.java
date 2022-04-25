package tud.bpws21.dbd.socket;

import info.dornbach.dbdclient.DBDClient;
import info.dornbach.dbdclient.DBDListener;
import tud.bpws21.dbd.config.Config;
import tud.bpws21.dbd.config.model.*;
import java.util.Date;

// Handler for loading pages data
public class LoadPageDataHandler {

    // subscribe to variables & load data from DBD server and initialize the control state
    public static void LoadDataFromDBD() throws Exception {
        // check if there is connection to DBD server
        if(Socket.dbdclient == null) {
            return;
        }

        // init clock
        String timeVariable = "ZEITDELTA",
                speedUpVariable = "SPEEDUP";
        Socket.dbdclient.subscribeAndQuery(timeVariable);
        Socket.dbdclient.subscribeAndQuery(speedUpVariable);
        Thread.sleep(100);
        Uhr uhr = new Uhr();
        uhr.currentTime = new Date();
        uhr.startTime = Socket.dbdclient.getValue(timeVariable);
        uhr.speedUp = Socket.dbdclient.getValue(speedUpVariable);
        uhr.stop = uhr.startTime != 0;
        Config.controlConfiguration.uhr = uhr;

        // subscribe & load data in Booster
        Booster.Place[] bo_places = Config.controlConfiguration.booster.places;
        for(Booster.Place place: bo_places) {
            String valueVariable = String.format("bo%si", place.uid).toUpperCase(),
                    tryVariable = String.format("bo%sv", place.uid).toUpperCase();
            Socket.dbdclient.subscribeAndQuery(valueVariable);
            Socket.dbdclient.subscribeAndQuery(tryVariable);
            initPropertyValueAsynchronously(valueVariable, place, "status");
            initPropertyValueAsynchronously(valueVariable, place, "try");
        }
        String boosterAuto = "BOOSTERAUTO";
        Socket.dbdclient.subscribeAndQuery(boosterAuto);
        Socket.dbdclient.addDBDListener(boosterAuto, new DBDListener() {
            @Override
            public void valueUpdated(DBDClient dbdClient, String s, int newValue, int oldValue) {
                Socket.dbdclient.removeDBDListener(boosterAuto, this);
                Config.controlConfiguration.booster.auto = newValue;
            }
        });

        // subscribe & load data in Ortsbetrieb
        Ortsbetrieb.Place[] ort_places = Config.controlConfiguration.ortsbetrieb.places;
        for(Ortsbetrieb.Place place: ort_places) {
            String variable = place.uid.toUpperCase();
            Socket.dbdclient.subscribeAndQuery(variable);
            initPropertyValueAsynchronously(variable, place, "technique");
        }

        Ortsbetrieb.Durchschaltung durchschaltung = Config.controlConfiguration.ortsbetrieb.durchschaltung;
        String buchsbaumVariable = durchschaltung.uid.toUpperCase();
        Socket.dbdclient.subscribeAndQuery(buchsbaumVariable);
        initPropertyValueAsynchronously(buchsbaumVariable, durchschaltung, "status");

        Ortsbetrieb.Other[] others = Config.controlConfiguration.ortsbetrieb.others;
        for(Ortsbetrieb.Other other: others) {
            String variable = other.uid.toUpperCase();
            Socket.dbdclient.subscribeAndQuery(variable);
            initPropertyValueAsynchronously(variable, other, "option");
        }

        // subscribe & load data in ZN
        ZN[] zns = Config.controlConfiguration.zn;
        for(ZN zn: zns) {
            String variable = String.format("zn%saus", zn.uid).toUpperCase();
            Socket.dbdclient.subscribeAndQuery(variable);
            initPropertyValueAsynchronously(variable, zn, "status");
        }

        // subscribe & load data in Telefone
        Telefone[] telefones = Config.controlConfiguration.telefone;
        for(Telefone telefone: telefones) {
            String variable = telefone.uid.toUpperCase();
            Socket.dbdclient.subscribeAndQuery(variable);
            initPropertyValueAsynchronously(variable, telefone, "number");
        }

        // subscribe & load data in Block
        Block[] blocks = Config.controlConfiguration.block;
        for(Block block: blocks) {
            for(Block.Place place: block.places) {
                for(Block.Controller controller: place.controllers) {
                    String variable = controller.uid.toUpperCase();
                    Socket.dbdclient.subscribeAndQuery(variable);
                    initPropertyValueAsynchronously(variable, controller, "status");
                }
            }
        }

        // subscribe & load data in Handregler
        Handregler[] handreglers = Config.controlConfiguration.handregler;
        for(Handregler handregler: handreglers) {
            String variable = handregler.uid.toUpperCase();
            Socket.dbdclient.subscribeAndQuery(variable);
            initPropertyValueAsynchronously(variable, handregler, "controller");
        }

        // subscribe & load data in Rechner
        Rechner.Computer[] computers = Config.controlConfiguration.rechner.computers;
        for(Rechner.Computer computer: computers) {
            String bootVariable = String.format("estw%sboot", computer.uid).toUpperCase(),
                screenVariable = String.format("estw%sscrnsvr", computer.uid).toUpperCase(),
                projectVariable = String.format("estw%sproject", computer.uid).toUpperCase(),
                systemVariable = String.format("estw%ssystem", computer.uid).toUpperCase();
            Socket.dbdclient.subscribeAndQuery(bootVariable);
            Socket.dbdclient.subscribeAndQuery(screenVariable);
            Socket.dbdclient.subscribeAndQuery(projectVariable);
            Socket.dbdclient.subscribeAndQuery(systemVariable);
            initPropertyValueAsynchronously(bootVariable, computer, "boot");
            initPropertyValueAsynchronously(screenVariable, computer, "screensaver");
            initPropertyValueAsynchronously(projectVariable, computer, "project");
            initPropertyValueAsynchronously(systemVariable, computer, "system");
        }

        // subscribe & load data in ZNPi
        ZNPi znPi = Config.controlConfiguration.znpi;
        for(ZNPi.Place place: znPi.places) {
            String desktopVariable = String.format("zn%sdesktop", place.uid).toUpperCase(),
                volumeVariable = String.format("zn%svolume", place.uid).toUpperCase(),
                projectVariable = String.format("zn%sznproject", place.uid).toUpperCase(),
                notificationVariable = String.format("zn%snotification", place.uid).toUpperCase();
            Socket.dbdclient.subscribeAndQuery(desktopVariable);
            Socket.dbdclient.subscribeAndQuery(volumeVariable);
            Socket.dbdclient.subscribeAndQuery(projectVariable);
            Socket.dbdclient.subscribeAndQuery(notificationVariable);
            initPropertyValueAsynchronously(desktopVariable, place, "desktop");
            initPropertyValueAsynchronously(volumeVariable, place, "volume");
            initPropertyValueAsynchronously(projectVariable, place, "project");
            initPropertyValueAsynchronously(notificationVariable, place, "notification");
        }
    }

    // transfer the control state to the frontend
    public static void LoadDataToFrontend() {
        Socket.addEventListener("load", (client, data) -> {
            Socket.serverSocket.getClient(client.getSessionId()).sendEvent("load", Config.controlConfiguration);
        });
    }

    private static void initPropertyValueAsynchronously(String variable, UidElement element, String property) {
        Socket.dbdclient.addDBDListener(variable, new DBDListener() {
            @Override
            public void valueUpdated(DBDClient dbdClient, String s, int newValue, int oldValue) {
                Socket.dbdclient.removeDBDListener(variable, this);
                element.setPropertyValue(property, newValue);
            }
        });
    }
}
