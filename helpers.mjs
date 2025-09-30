const sec = 1000;
const min = 60 * sec;

const sensor_keys = {
  4198: "lat",
  4197: "lng",
  3000: "battery",
  4209: "motion",
  4200: "sos",
  3576: "position_status",
};

const valid_keys = {
  4198: "lat",
  4197: "lng",
  3000: "battery",
  4209: "motion",
  4200: "sos",
  3576: "position_status",
};

export const parser = (topic, payload, devices) => {
  // /device_sensor_data/450498702230784/2CF7F1C070700149/1/vs/4198 {"value":44.995116,"timestamp":1759186369000}
  let result;
  const payloadObj = JSON.parse(payload);
  const topicItems = topic.split("/");
  const topicEUI = topicItems[3];
  const topicVar = sensor_keys[topicItems[6]] || topicItems[6];
  if (devices?.length > 0) {
    const target = devices.filter((d) => d.eui == topicEUI);
    if (target.length == 1) {
      result = {
        id: target[0].id,
        date: new Date(payloadObj.timestamp),
        variable: topicVar,
        val: payloadObj.value,
        valid: valid_keys[topicItems[6]] ? true : false,
      };
      return result;
    }
    console.log("target not found");
    console.log("topic:", topic);
    console.log("payload:", payloadObj);
    return false;
  }
  console.log("devices not found");
  return result;
};

export const now = () => {
  return new Date().toLocaleString("sv");
};

// console.log(
//   parser(
//     "/device_sensor_data/450498702230784/2CF7F1C070700149/1/vs/4197",
//     ' {"value":-93.39616,"timestamp":1759241065000}',
//     [{ eui: "2CF7F1C070700149", id: 22 }]
//   )
// );

export const hr = 60 * min;
