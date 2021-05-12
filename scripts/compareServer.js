$(document).ready(async () => {
  try {
    const info = await axios.get("/info");

    const addOptions = (dom, array) => {
      const select = document.getElementsByName(dom)[0];
      for (value in array) {
        const option = document.createElement("option");
        option.text = array[value];
        option.value = array[value];
        select.add(option);
      }
    };

    const data = info.data;

    const auxArrayServers = data.map((e) => e.EPC);

    const arrayServers = auxArrayServers.filter((item, index) => {
      return auxArrayServers.indexOf(item) === index;
    });
    arrayServers.sort();
    addOptions("server1", arrayServers);
    addOptions("server2", arrayServers);
  } catch (e) {
    console.log(e);
  }
});

let graficoFecha;
let select = document.getElementsByName("server1")[0];
let select2 = document.getElementsByName("server2")[0];
let selectedOption = "";
let selectedOption2 = "";

select.addEventListener("change", () => {
  selectedOption = select.options[select.selectedIndex].value;
});
select2.addEventListener("change", () => {
  selectedOption2 = select2.options[select2.selectedIndex].value;
});

const crearGrafico = async () => {
  $("#compServ").removeClass("d-none");
  const fechaInicio = document.getElementById("initDate").value;
  const fechaTermino = document.getElementById("endDate").value;
  if (
    selectedOption == "" ||
    (selectedOption == "--Seleccione un server--" && selectedOption2 == "") ||
    selectedOption2 == "--Seleccione un server--"
  ) {
    alert("Debe elegir al menos un servidor");
  } else if (!fechaInicio || !fechaTermino) {
    alert("Debe ingresar ambas fechas para continuar");
  } else {
    const paylaod = {
      fechaInicio,
      fechaTermino,
      selectedOption,
      selectedOption2,
    };
    const result = await axios.post("/historico-fecha", paylaod);
    let convertedData;
    let convertedData2;

    if (result.data.rows) {
      const dataHistorica = new Map();
      result.data.rows.map((e) =>
        dataHistorica.set(e.fecha, parseFloat(e.temperature))
      );
      convertedData = Object.fromEntries(dataHistorica);
    } else {
      const dataHistorica = new Map();
      result.data.map((e) =>
        dataHistorica.set(e.fecha, parseFloat(e.temperature))
      );
      convertedData = Object.fromEntries(dataHistorica);
    }

    if (result.data.rows2) {
      const dataHistorica = new Map();
      result.data.rows2.forEach((e) =>
        dataHistorica.set(e.fecha, parseFloat(e.temperature))
      );
      convertedData2 = Object.fromEntries(dataHistorica);
    }

    const ctx = document.getElementById("historico-fecha").getContext("2d");
    if (graficoFecha) {
      let nodoPadre = document.getElementById("compServ");
      let ctx = document.getElementById("historico-fecha");
      nodoPadre.removeChild(ctx);
      graficoFecha.destroy();
      nodoPadre.innerHTML =
        "<canvas id='historico-fecha' style='margin:auto; width:80vw; height:50vh;'></canvas>";
      let cnvs = document.getElementById("historico-fecha");

      graficoFecha = new Chart(cnvs, {
        data: {
          datasets: [
            {
              type: "line",
              label: "Selector 1",
              data: convertedData,
              backgroundColor: "#43C4FC",
              borderColor: "#43C4FC",
              borderWidth: 1,
            },
            {
              type: "line",
              label: "Selector 2",
              data: convertedData2,
              backgroundColor: "#ff9000",
              borderColor: "#ff9000",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              min: 5,
              max: 45,
              ticks: {
                callback: (value, index, values) => {
                  return value + "°C";
                },
                color: "#fff",
                display: true,
              },
              grid: {
                color: "#f3ff17",
              },
              stacked: true
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#fff",
              },
              stacked: true
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
      });
    } else {
      graficoFecha = new Chart(ctx, {
        data: {
          datasets: [
            {
              type: "line",
              label: "Selector 1",
              data: convertedData,
              backgroundColor: "#43C4FC",
              borderColor: "#43C4FC",
              borderWidth: 1,
            },
            {
              type: "line",
              label: "Selector 2",
              data: convertedData2,
              backgroundColor: "#ff9000",
              borderColor: "#ff9000",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              min: 5,
              max: 45,
              ticks: {
                callback: (value, index, values) => {
                  return value + "°C";
                },
                color: "#fff",
                display: true,
              },
              grid: {
                color: "#f3ff17",
              },
              stacked: true
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#fff",
              },
              stacked: true
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
      });
    }
  }
};

const back = () => {
  let token = localStorage.getItem("token-usuario");
  if (token) {
    window.location = `/home?token=${token}`;
  } else {
    window.location = "/login";
  }
};
