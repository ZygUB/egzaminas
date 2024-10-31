const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = "mongodb://192.168.8.111:27017/egzaminas"; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Sėkmingai prisijungta prie MongoDB"))
  .catch(err => console.error("Nepavyko prisijungti prie MongoDB:", err));

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: String,
  location: String,
  description: String,
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  comments: [{ type: String }]
});

const Event = mongoose.model("Event", eventSchema);

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Renginys nerastas" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Serverio klaida gaunant renginio informaciją", error: err.message });
  }
});

app.post("/events", async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/events/:id/comments", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.comments.push(req.body.comment);
      await event.save();
      res.status(201).json(event);
    } else {
      res.status(404).json({ message: "Renginys nerastas" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/events/:id/rating", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.rating = (event.rating * event.ratingsCount + req.body.rating) / (event.ratingsCount + 1);
      event.ratingsCount += 1;
      await event.save();
      res.json(event);
    } else {
      res.status(404).json({ message: "Renginys nerastas" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/events/:id/category", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Renginys nerastas" });
    event.category = req.body.category;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const vartotojoSchema = new mongoose.Schema({
  slapyvardis: { type: String, required: true, unique: true },
  elPastas: { type: String, required: true, unique: true },
  slaptazodis: { type: String, required: true }
});

const Vartotojas = mongoose.model("Vartotojas", vartotojoSchema);

app.post("/users/register", async (req, res) => {
  const { slapyvardis, elPastas, slaptazodis } = req.body;

  try {
    if (!slapyvardis || !elPastas || !slaptazodis) {
      return res.status(400).json({ sekme: false, zinute: 'Visi laukai yra privalomi' });
    }

    const egzistuojantisVartotojas = await Vartotojas.findOne({ $or: [{ slapyvardis }, { elPastas }] });
    if (egzistuojantisVartotojas) {
      return res.status(400).json({ sekme: false, zinute: 'Vartotojas su tokiu slapyvardžiu arba el. paštu jau egzistuoja' });
    }

    const uzsifruotasSlaptazodis = await bcrypt.hash(slaptazodis, 10);

    const vartotojas = new Vartotojas({ slapyvardis, elPastas, slaptazodis: uzsifruotasSlaptazodis });
    await vartotojas.save();

    res.status(201).json({ sekme: true, zinute: 'Vartotojas sėkmingai užregistruotas' });
  } catch (klaida) {
    res.status(500).json({ sekme: false, zinute: 'Įvyko serverio klaida', klaida: klaida.message });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { slapyvardis, slaptazodis } = req.body;

    if (!slapyvardis || !slaptazodis) {
      return res.status(400).json({ sekme: false, zinute: 'Visi laukai yra privalomi' });
    }

    const vartotojas = await Vartotojas.findOne({ slapyvardis });
    if (!vartotojas) {
      return res.status(400).json({ sekme: false, zinute: 'Neteisingas slapyvardis arba slaptažodis' });
    }

    const arTeisingasSlaptazodis = await bcrypt.compare(slaptazodis, vartotojas.slaptazodis);
    if (!arTeisingasSlaptazodis) {
      return res.status(400).json({ sekme: false, zinute: 'Neteisingas slapyvardis arba slaptažodis' });
    }

    res.json({ sekme: true, zinute: 'Sėkmingai prisijungta', vartotojas: { slapyvardis: vartotojas.slapyvardis, elPastas: vartotojas.elPastas } });
  } catch (klaida) {
    res.status(500).json({ sekme: false, zinute: 'Įvyko serverio klaida', klaida: klaida.message });
  }
});

app.delete('/events/:id', async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Renginys nerastas' });
    res.json({ message: 'Renginys sėkmingai ištrintas' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveris paleistas ant ${PORT} prievado`));