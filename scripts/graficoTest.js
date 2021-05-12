const newGrafico = async(selectedServer)=>{
    $("#home").hide();
    $("#historic").removeClass("d-none");
    const label = selectedServer;
    const payload = { label };
    const result = await axios.post("/specific", payload);
    const labels = ['01-04-2021', '02-04-2021','03-04-2021', '04-04-2021','05-04-2021', '06-04-2021', '07-04-2021']
    const data = {
        labels: labels,
        datasets: [{
            data: [{'17:00:00': 28}]
        }]
    }
    const config = {
        type: '',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Históricos temperatura'
            }
          }
        },
      };
    const ctx = documnent.getElementById("historicGraphics").getContext("2d");
    historicGraphic = new Chart(ctx, {});
    
}
