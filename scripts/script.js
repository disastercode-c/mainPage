$(document).ready(async () => {
  try {
    const info = await axios.get("/info");

    let infoGraphics = new Map();
    info.data.forEach((db) =>
      infoGraphics.set(db.EPC, parseFloat(db.Temperature))
    );
    const datosConvertidos = Object.fromEntries(infoGraphics);
    renderGraphics(datosConvertidos);
  } catch (e) {
    console.log(e);
  }
});


const renderGraphics = (datosConvertidos) => {
  var ctx = document.getElementById("myAreaChart").getContext("2d");
  const handleClick = (evt) => {
    const selectedBar = evt.chart.tooltip.dataPoints[0].label;
    historicDetails(selectedBar);
  };

  myChart = new Chart(ctx, {
    data: {
      datasets: [
        {
          type: "bar",
          data: datosConvertidos,
          label: "Temperatura °C",
          backgroundColor: ["#43C4FC"],
          borderWidth: 1,
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 40,
          ticks: {
            maxTicksLimit: 5,
            padding: 10,
            callback: (value, index, values) => {
              return value + "°C";
            },
            display: true,
            color: "red",
          },
          grid: {
            color: "#cccccc",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#111",
          },
        },
      },
      onClick: handleClick,
      plugins: {
        legend: {
          labels: {
            color: "#111",
            boxWidth: 30,
          },
        },
      },
    },
  });
};

const historicDetails = async (selectedBar) => {
  $("#historic").removeClass("d-none");
  $("#graficoServidores").addClass("d-none");
  $("#infoSensores").addClass("d-none");
  $("#cammap").addClass("d-none");
  $("#tablaServer").addClass("d-none");
  const maxTemp = [];
  const minTemp = [];
  const label = selectedBar;
  const payload = { label };
  const result = await axios.post("/specific", payload);

  const graficohistorico = result.data.map((e) => {
    return { fecha: e.fecha, temperatura: e.temperature };
  });

  const labels = result.data.map((e) => e.fecha);
  const fechas = labels.filter((item, index) => {
    return labels.indexOf(item) === index;
  });

  for (i = 0; i < fechas.length; i++) {
    let datoFiltrado = graficohistorico.filter((e) => e.fecha == fechas[i]);
    datoFiltrado.sort((a, b) => (a["temperatura"] < b["temperatura"] ? 1 : -1));
    let tempMax = datoFiltrado[0];
    maxTemp.push(tempMax);
    datoFiltrado.sort((a, b) => (a["temperatura"] < b["temperatura"] ? -1 : 1));
    let tempMin = datoFiltrado[0];
    minTemp.push(tempMin);
  }

  const dataHistorica = new Map();
  minTemp.forEach((e) => dataHistorica.set(e.fecha, parseFloat(e.temperatura)));
  const minHistorico = Object.fromEntries(dataHistorica);
  const maxHistorica = new Map();
  maxTemp.forEach((e) => {
    maxHistorica.set(e.fecha, parseFloat(e.temperatura));
  });
  const maxHistorico = Object.fromEntries(maxHistorica);
  const ctx = document.getElementById("historicGraphics").getContext("2d");

  $("#titulohistorico").append(label);

  const data = {
    labels: fechas,
    datasets: [
      {
        label: "Temperatura Mínima",
        data: minHistorico,
        backgroundColor: "#43C4FC",
      },
      {
        label: "Temperatura Máxima",
        data: maxHistorico,
        backgroundColor: "#ff9000",
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Temperaturas Máx-Min",
          color: "#fff",
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#fff",
          },
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            callback: (value, index, values) => {
              return value + "°C";
            },
            color: "#fff",
          },
          grid: {
            color: "#cccccc",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#fff",
            boxWidth: 30,
          },
        },
      },
    },
  };
  historicGraphic = new Chart(ctx, config);
};

const back = () => {
  let token = localStorage.getItem("token-usuario");
  if (token) {
    window.location = `/home?token=${token}`;
  } else {
    window.location = "/login";
  }
};

const getHistoricInfo = async () => {
  try {
    let maxHum = [];
    let minHum = [];
    let maxTemp = [];
    let minTemp = [];
    let maxPpm = [];
    let minPpm = [];
    const result = await axios.get("/historic_amb");
    const fechas = result.data.map((e) => e.fecha);
    const labels = fechas.filter((item, index) => {
      return fechas.indexOf(item) === index;
    });

    const humedad = result.data.map((e) => ({
      fecha: e.fecha,
      humedad: e.humedad,
    }));
    for (i = 0; i < labels.length; i++) {
      let dataHumedadFiltrada = humedad.filter((e) => e.fecha == labels[i]);
      dataHumedadFiltrada.sort((a, b) =>
        a["humedad"] < b["humedad"] ? 1 : -1
      );
      let humMax = dataHumedadFiltrada[0];
      maxHum.push(humMax);
      dataHumedadFiltrada.sort((a, b) =>
        a["humedad"] < b["humedad"] ? -1 : 1
      );
      let humMin = dataHumedadFiltrada[0];
      minHum.push(humMin);
    }

    const temperatura = result.data.map((e) => ({
      fecha: e.fecha,
      temperatura: e.tmpAmb,
    }));
    for (i = 0; i < labels.length; i++) {
      let dataTemperaturaFiltrada = temperatura.filter(
        (e) => e.fecha == labels[i]
      );
      dataTemperaturaFiltrada.sort((a, b) =>
        a["temperatura"] < b["temperatura"] ? 1 : -1
      );
      let tempMax = dataTemperaturaFiltrada[0];
      maxTemp.push(tempMax);
      dataTemperaturaFiltrada.sort((a, b) =>
        a["temperatura"] < b["temperatura"] ? -1 : 1
      );
      let tempMin = (dataTemperaturaFiltrada = dataTemperaturaFiltrada[0]);
      minTemp.push(tempMin);
    }

    const particulas = result.data.map((e) => ({
      fecha: e.fecha,
      particulado: e.gas,
    }));
    for (i = 0; i < labels.length; i++) {
      let dataPpmFiltrada = particulas.filter((e) => e.fecha == labels[i]);
      dataPpmFiltrada.sort((a, b) =>
        a["particulado"] < b["particulado"] ? 1 : -1
      );
      let ppmMax = dataPpmFiltrada[0];
      maxPpm.push(ppmMax);
      dataPpmFiltrada.sort((a, b) =>
        a["particulado"] < b["particulado"] ? 1 : -1
      );
      let ppmMin = dataPpmFiltrada[0];
      minPpm.push(ppmMin);
    }

    renderHistoricGraphics(
      maxHum,
      minHum,
      maxTemp,
      minTemp,
      maxPpm,
      minPpm,
      labels
    );
  } catch (err) {
    console.log(err);
  }
};

const renderHistoricGraphics = (
  maxHum,
  minHum,
  maxTemp,
  minTemp,
  maxPpm,
  minPpm,
  labels
) => {
  $("#graficoServidores").addClass("d-none");
  $("#infoSensores").addClass("d-none");
  $("#cammap").addClass("d-none");
  $("#tablaServer").addClass("d-none");
  $("#historicAmb").removeClass("d-none");

  let graphicsHistoricHum;
  let graphicsHistoricTemp;
  let graphicsHistoricPpm;

  if (graphicsHistoricHum || graphicsHistoricTemp || graphicsHistoricPpm) {
    graphicsHistoricHum.destroy();
    graphicsHistoricTemp.destroy();
    graphicsHistoricPpm.destroy();
  }

  const auxMax = new Map();
  maxHum.forEach((e) => {
    auxMax.set(e.fecha, parseFloat(e.humedad));
  });
  const humedadMaxima = Object.fromEntries(auxMax);

  const auxMin = new Map();
  minHum.forEach((e) => {
    auxMin.set(e.fecha, parseFloat(e.humedad));
  });
  const humedadMinima = Object.fromEntries(auxMin);

  const auxTempMax = new Map();
  maxTemp.forEach((e) => {
    auxTempMax.set(e.fecha, parseFloat(e.temperatura));
  });
  const temperaturaMaxima = Object.fromEntries(auxTempMax);
  const auxTempMin = new Map();
  minTemp.forEach((e) => {
    auxTempMin.set(e.fecha, parseFloat(e.temperatura));
  });
  const temperaturaMinima = Object.fromEntries(auxTempMin);

  const auxPpmMax = new Map();
  maxPpm.forEach((e) => {
    auxPpmMax.set(e.fecha, parseFloat(e.particulado));
  });
  const ppmMaximo = Object.fromEntries(auxPpmMax);

  const auxPpmMin = new Map();
  minPpm.forEach((e) => {
    auxPpmMin.set(e.fecha, parseFloat(e.particulado));
  });
  const ppmMinimo = Object.fromEntries(auxPpmMin);

  const ctx = $("#historicHum");
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Humedad mínima",
        data: humedadMinima,
        backgroundColor: "#00ffff",
        borderColor: "#00ffff",
      },
      {
        label: "Humedad máxima",
        data: humedadMaxima,
        backgroundColor: "#ff3300",
        borderColor: "#ff3300",
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {
      plugins: {
        title: {
          title: {
            display: true,
            text: "Humedad Min-Máx",
          },
        },
        legend: {
          labels: {
            color: "#fff",
            boxWidth: 30,
          },
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#fff",
          },
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          grid: {
            color: "#cccccc",
          },
          ticks: {
            color: "#fff",
          },
        },
      },
    },
  };
  graphicsHistoricHum = new Chart(ctx, config);

  const dataTemp = {
    labels: labels,
    datasets: [
      {
        label: "Humedad mínima",
        data: temperaturaMinima,
        backgroundColor: "#00ffff",
        borderColor: "#00ffff",
      },
      {
        label: "Humedad máxima",
        data: temperaturaMaxima,
        backgroundColor: "#ff3300",
        borderColor: "#ff3300",
      },
    ],
  };
  const configTemp = {
    type: "line",
    data: dataTemp,
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            color: "#fff",
          },
        },
        y: {
          stacked: true,
          grid: {
            color: "#cccccc",
          },
          ticks: {
            color: "#fff",
          },
        },
      },
      plugins: {
        title: {
          title: {
            display: true,
            text: "Humedad Min-Máx",
          },
        },
        legend: {
          labels: {
            color: "#fff",
            boxWidth: 30,
          },
        },
      },
    },
  };
  const temp = document.getElementById("historicTemp").getContext("2d");
  graphicsHistoricTemp = new Chart(temp, configTemp);

  const dataPpm = {
    labels: labels,
    datasets: [
      {
        label: "PPM Mínimo",
        data: ppmMinimo,
        backgroundColor: "#00ffff",
        borderColor: "#00ffff",
      },
      {
        label: "PPM Máximo",
        data: ppmMaximo,
        backgroundColor: "#ff3300",
        borderColor: "#ff3300",
      },
    ],
  };
  const configPpm = {
    type: "line",
    data: dataPpm,
    options: {
      plugins: {
        title: {
          title: {
            display: true,
            text: "Humedad Min-Máx",
          },
        },
        legend: {
          labels: {
            color: "#fff",
            boxWidth: 30,
          },
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            color: "#fff",
          },
        },
        y: {
          stacked: true,
          grid: {
            color: "#cccccc",
          },
          ticks: {
            color: "#fff",
          },
        },
      },
    },
  };
  const ppm = document.getElementById("historicPpm").getContext("2d");
  graphicsHistoricPpm = new Chart(ppm, configPpm);
};

const cierraSesion = () => {
  localStorage.removeItem('token-usuario');
  window.location = '/'
}

const verCam = () => {
  $("#camarita").removeClass("d-none");
  $("#cambtn2").addClass("d-none");
  $("#cambtn1").removeClass("d-none")
}
const ocultarCam = () => {
  $("#camarita").addClass("d-none");
  $("#cambtn2").removeClass("d-none");
  $("#cambtn1").addClass("d-none")
}