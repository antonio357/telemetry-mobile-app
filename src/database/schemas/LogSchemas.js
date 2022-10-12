export const LogSchema = {
  name: "Log", 
  embedded: true, // vai ser interno a outro schema
  properties: {
    time: "string",
    value: "string",
  },
};

export const SensorLogsSchema = {
  name: "SensorLogs", // nome do schema
  properties: {
    _id: "string", // 0 _ de _id é pra não dar comflito com o id próprio
    wsClientUrl: "string",
    portName: "string",
    date: "string",
    initTimestamp: "string",
    logs: { type: "list", objectType: "Log" }, // array de logs
  },
  primaryKey: "_id",
};
