import mqtt from "mqtt";
import { sensecap_api_key, sensecap_id } from "./credentials.mjs";
import { getDevices, uploadData } from "./db.mjs";
import { hr, now, parser } from "./helpers.mjs";

const host = "sensecap-openstream.seeed.cc"; // same as -h
const port = 1883; // try 8883 if TLS is required
const clientId = `org-${sensecap_id}-quickstart`; // same as -I

let devices;

setInterval(() => {
  getDevices().then((res) => {
    if (res.length > 0) {
      devices = res;
    }
  });
}, 1 * hr);

getDevices().then((res) => {
  if (res.length > 0) {
    devices = res;
  }
});

const options = {
  clientId,
  username: `org-${sensecap_id}`, // -u
  password: sensecap_api_key, // -P
  protocol: "mqtt", // change to "mqtts" if using 8883
  keepalive: 60,
  reconnectPeriod: 1000, // auto-reconnect
  clean: true,
};

const client = mqtt.connect(`mqtt://${host}:${port}`, options);

client.on("connect", () => {
  const topic = `/device_sensor_data/${sensecap_id}/+/+/+/+`;
  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`${now()}, Subscribe error:`, err);
    } else {
      console.log(`${now()}, Subscribed to ${topic}`);
    }
  });
});

client.on("message", (topic, message) => {
  const parsed = parser(topic, message.toString(), devices);
  if (parsed) {
    uploadData(parsed);
  }
});

client.on("error", (err) => {
  console.error("MQTT error:", err);
});
