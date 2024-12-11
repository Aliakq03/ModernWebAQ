const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require("cors");

// Middleware  
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to our server hello there ");
});
//My data
const data = {
  about: {
    name: "Bob Ross",
    title: "Painter and Art Mentor", 
    description: "Passionate about painting and exploring nature."
  },
  experience: [
    { company: "The Joy of Painting", role: "Host", duration: "1983 - 1994" },
    { company: "Alexander", role: "Painter", duration: "1981 - 1983" },
    { company: "Military", role: "Air Force", duration: "1961 - 1981" }
  ],
  education: [
    { school: "Elizabeth Forward High School", degree: "Diploma", grad: "1951" },
  ],
  skills: ["Acrylics", "Oils", "Pastels", "Landscapes", "Portraits"],

};

//endpoints
app.get("/api/getOverview", (req, res) => {
  res.json(data.about);
});
app.get("/api/getExp", (req, res) => {
  res.json(data.experience);
});
app.get("/api/getEdu", (req, res) => {
  res.json(data.education);
});
app.get("/api/getSkills", (req, res) => {
  res.json(data.skills);
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
