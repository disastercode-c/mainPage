const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  getDataAmb,
  dateConverter,
  getTempServers,
  infoDoor,
  convertDateAmb,
} = require("./scripts/renderData");
const {
  getTempServ,
  getInfoSensor,
  specificInfoServer,
  getDataHistoricaAmb,
  getHistoricoConFecha,
  getStateDoor,
  login,
  getInfoAlarmas,
  getInfoDoor,
  getInfoDoorWDate,
} = require("./db/query");
require("dotenv").config();
const Handlebars = require("handlebars");
const enviar = require("./mailer/mailer");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/components",
  })
);
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/vendor", express.static(__dirname + "/vendor"));

Handlebars.registerHelper("ifcond", (v1, v2, options) => {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.listen(3000, console.log("Servidor encendido en el puerto 3000"));

app.get("/", (req, res) => {
  res.render("Index", { layout: "Index" });
});

app.get("/door", async (req, res) => {
  const infoPuerta = await getStateDoor();
  res.send(infoPuerta);
});

app.get("/home", async (req, res) => {
  const { token } = req.query;
  try {
    jwt.verify(token, "secret", async (err, data) => {
      if (err) {
        const { message } = err;
        res.status(401).send({ error: "401 UNAUTHORIZED", message });
      } else {
        const usuario = data;
        if (data.nombre == "admin") {
          const result = await getDataAmb();
          const door = await getStateDoor();
          const dataDoor = infoDoor(door);
          res.render("newHome", {
            layout: "newHome",
            info: result,
            door: dataDoor,
            user: usuario,
          });
        }else if(data.nombre == "hortiadmin"){
          res.render("Hortihome", {layout: "Hortihome"})
        }else if(data.nombre == "patroladmin"){
          res.render("Patrolhome", {layout: "Patrolhome"})
        }
      }
    });
  } catch (e) {
    res.status(500).send({ error: "500 INTERNAL SERVER ERROR", message: e });
  }
});

app.get("/detalles", (req, res) => {
  res.render("Details", { layout: "Details" });
});

app.get("/info", async (req, res) => {
  const result = await getTempServ();
  const info = getTempServers(result);
  res.send(info);
});

app.get("/infoSensor", async (req, res) => {
  const result = await getInfoSensor();
  res.send(result);
});

app.post("/specific", async (req, res) => {
  const { label } = req.body;
  const result = await specificInfoServer(label);
  const info = dateConverter(result);
  res.status(200).send(info);
});

app.get("/historic_amb", async (req, res) => {
  const data = await getDataHistoricaAmb();
  const result = convertDateAmb(data);
  res.send(result);
});

app.post("/historico-fecha", async (req, res) => {
  const { fechaInicio, fechaTermino, selectedOption, selectedOption2 } =
    req.body;
  const info = await getHistoricoConFecha(
    fechaInicio,
    fechaTermino,
    selectedOption,
    selectedOption2
  );
  const result = dateConverter(info);
  res.status(200).send(result);
});

app.get("/test", (req, res) => {
  res.render("Test", { layout: "Test" });
});

app.get("/login", (req, res) => {
  res.render("Login", { layout: "Login" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await login(username, password);
    const user = JSON.stringify(result);
    if (user) {
      const token = jwt.sign(user, "secret");
      res.status(200).send({ token: token });
    } else {
      res.send({error:"404" , message: "Nombre de usuario o contraseña incorrectos"});
    }
  } catch (err) {
    res.status(500).send({ error: "500 Internal Server Error", message: err });
  }
});


app.get("/lienzo", (req, res) => {
  res.render("lienzo", { layout: "lienzo" });
});

app.get("/alerts", async (req, res) => {
  const info = await getInfoAlarmas();
  res.status(200).send(info);
});

app.post("/index", async (req, res) => {
  const {fName, email, phone, msg} = req.body
  let tel = phone
  try
  {
    if(tel != ""){
      let result = await enviar(fName, email, phone, msg)
      if(result){
        res.send(result)
      }
    }else{
      tel = 0;
      let result = await enviar(fName, email, phone, msg)
      if(result){
        res.send(result)
      }
    }
  }
  catch(e){
    console.log(e)
    res.send(e)
  }
});

app.get("/door-details", async (req, res) => {
  const result = await getInfoDoor();
  const maxTime = result.maxTime[0].max;
  const fechaMax = result.maxTime[0].fecha;
  const countOpen = result.countOpen[0].count;
  res.render("DoorDetails", {
    layout: "DoorDetails",
    max: maxTime,
    fechaMax: fechaMax,
    count: countOpen,
  });
});

app.get("/patrol", (req,res)=>{
  res.render("Patrolhome", {layout: "Patrolhome"})
})

