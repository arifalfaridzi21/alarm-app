const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =======================
// CONNECT MONGODB
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// =======================
// SCHEMA
// =======================
const alarmSchema = new mongoose.Schema({
  title: String,
  time: String
});

const Alarm = mongoose.model("Alarm", alarmSchema);

// =======================
// ROUTES API
// =======================

// Ambil semua alarm
app.get("/api/alarms", async (req, res) => {
  const alarms = await Alarm.find();
  res.json(alarms);
});

// Tambah alarm
app.post("/api/alarms", async (req, res) => {
  const newAlarm = new Alarm(req.body);
  await newAlarm.save();
  res.json(newAlarm);
});

// Hapus alarm
app.delete("/api/alarms/:id", async (req, res) => {
  await Alarm.findByIdAndDelete(req.params.id);
  res.json({ message: "Alarm deleted" });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
