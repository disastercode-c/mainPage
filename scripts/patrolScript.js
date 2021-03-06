const init = () => {
  let imgArray = [];
  const ros = new ROSLIB.Ros({
    url: "ws://192.168.0.206:9090",
  });

  viewer = new ROS3D.Viewer({
    divID: "viewer",
    width: 1100,
    height: 650,
    antialias: true,
    background: "#676767",
    cameraPose : {x:27, y:0, z: 14},
    });

  viewer.addObject(new ROS3D.Grid({
    cellSize:2,
    num_cells: 12
  }));

  mapviewer = new ROS3D.Viewer({
    divID: "map2d",
    width: 1600,
    height: 650,
    antialias: true,
    background: "#000",
    cameraPose: {x: 0, y: 0, z: 14},
  })

  mapviewer.addObject(new ROS3D.Grid())

  tfClient = new ROSLIB.TFClient({
    ros: ros,
    angularThres: 0.01,
    transThres: 0.01,
    rate: 8.5,
    fixedFrame: "/map",
  });
   

  cloudClient = new ROS3D.PointCloud2({
    ros: ros,
    tfClient: tfClient,
    rootObject: viewer.scene,
    topic: "/velodyne_points",
    max_pts: 350000,
    material: {size: 0.09},
    colorsrc: 'rgb',
    colormap: (x)=>{
      console.log(x)
    }
  });

  console.log(cloudClient)

  imClient = new ROS3D.MarkerClient({
    ros: ros,
    tfClient: tfClient,
    topic: "/persona_detect",
    rootObject: viewer.scene,
    lifetime: 3000,
  });

  identifyMarker = new ROS3D.MarkerClient({
    ros: ros,
    tfClient,
    topic: "/identify_detect",
    rootObject: viewer.scene,
    lifetime: 3000,
  });

  headMarker = new ROS3D.MarkerClient({
    ros: ros,
    tfClient,
    topic: "/persona_head",
    rootObject: mapviewer.scene,
    lifetime: 3000,
  });

  let listener = new ROSLIB.Topic({
    ros: ros,
    name: "/patrol/image_raw/compressed",
    messageType: "/sensor_msgs/CompressedImage",
  });

  listener.subscribe(function (msg) {
    let imgdata = "data:image/jpeg;base64," + msg.data;
    imgArray.push(imgdata);
    document.getElementById("threatDetectedPhoto").setAttribute("src", imgdata);
  });

  let streaming = new ROSLIB.Topic({
    ros: ros,
    name: "/patrol/video_raw/compressed",
    messageType: "/sensor_msgs/CompressedImage"
  });

  streaming.subscribe(function (data){
    let streamingData = "data:image/jpeg;base64," + data.data;
    document.getElementById("streamingVideo").setAttribute("src", streamingData)
  })

  warning = new ROSLIB.Topic({
    ros: ros,
    name: '/patrol/amenaza_pose',
    messageType: 'geometry_msgs/Pose'
  })

  // warning.subscribe(function(data){
  //   let posicion = document.getElementsByClassName('stadistics')[2];
  //   posicion.innerHTML = `
  //   <ul>
  //     <li>Posicion en X: ${(data.position.x).toFixed(3)}</li>
  //     <li>Posicion en Y: ${(data.position.y).toFixed(3)}</li>
  //   </ul>`

  //   console.log(data)
  // })

  states = new ROSLIB.Topic({
    ros:ros,
    name: '/patrol/battery_state',
    messageType: 'sensor_msgs/BatteryState'
  })

  states.subscribe(function(data){
    let voltage = document.getElementsByClassName('stadistics')[0];
    let battery = document.getElementsByClassName('stadistics')[1];

    voltage.innerHTML = `<ul><li>Frame_Id: ${data.header.frame_id}</li><li>Voltaje: ${(data.voltage).toFixed(3)}</li></ul>`
    battery.innerHTML = `<ul><li>Battery: ${data.percentage *100} %</li></ul>`

  })
};

const cierraSesion = () => {
  localStorage.removeItem('token-usuario');
  window.location = '/'
}