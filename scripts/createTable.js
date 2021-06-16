const renderTable = async() => {
  try{
    $("#graficoServidores").addClass("d-none");
    $("#infoSensores").addClass("d-none");
    $("#cammap").addClass("d-none");
    $("#historicAmb").addClass("d-none");
    $("#tablaServer").removeClass("d-none")
  
    const info = await axios.get('/info')
    const { data: dataArray } = info;
    let rows = "";
    $.each(dataArray, (i, row) => {
      rows += `<tr>
        <td>${row.EPC}</td>
        <td>${row.Temperature}</td>
        <td>${row.fecha}</td>
        </tr>`;
    });
  
    $('#dataTable tbody').append(rows);
    $('#dataTable').DataTable({
      "paging": true,
      "pagingType": "first_last_numbers",
      "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, 100,"All"] ],
      "search": "Buscar",
      "searchPlaceholder": 'Ingrese dato',
      "zeroRecords": "No se han encontrado coincidencias",
      "paginate": {
        "first": "Primera",
        "last": "Última",
        "next": "Siguiente",
        "previous": "Anterior"
      }
    });
  }catch(e){
    console.log(e)
  }};

