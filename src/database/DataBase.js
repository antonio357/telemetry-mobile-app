import * as SQLite from "expo-sqlite";


const db = SQLite.openDatabase("logs.db");

export default db;
