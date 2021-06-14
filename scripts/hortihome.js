/*!
 * Start Bootstrap - SB Admin 2 v4.1.3 (https://startbootstrap.com/theme/sb-admin-2)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin-2/blob/master/LICENSE)
 */

!(function (s) {
  "use strict";
  s("#sidebarToggle, #sidebarToggleTop").on("click", function (e) {
    s("body").toggleClass("sidebar-toggled"),
      s(".sidebar").toggleClass("toggled"),
      s(".sidebar").hasClass("toggled") &&
        s(".sidebar .collapse").collapse("hide");
  }),
    s(window).resize(function () {
      s(window).width() < 768 && s(".sidebar .collapse").collapse("hide"),
        s(window).width() < 480 &&
          !s(".sidebar").hasClass("toggled") &&
          (s("body").addClass("sidebar-toggled"),
          s(".sidebar").addClass("toggled"),
          s(".sidebar .collapse").collapse("hide"));
    }),
    s("body.fixed-nav .sidebar").on(
      "mousewheel DOMMouseScroll wheel",
      function (e) {
        if (768 < s(window).width()) {
          var o = e.originalEvent,
            l = o.wheelDelta || -o.detail;
          (this.scrollTop += 30 * (l < 0 ? 1 : -1)), e.preventDefault();
        }
      }
    ),
    s(document).on("scroll", function () {
      100 < s(this).scrollTop()
        ? s(".scroll-to-top").fadeIn()
        : s(".scroll-to-top").fadeOut();
    }),
    s(document).on("click", "a.scroll-to-top", function (e) {
      var o = s(this);
      s("html, body")
        .stop()
        .animate(
          { scrollTop: s(o.attr("href")).offset().top },
          1e3,
          "easeInOutExpo"
        ),
        e.preventDefault();
    });
})(jQuery);


const cierraSesion = () => {
  localStorage.removeItem('token-usuario');
  window.location = '/'
}

const init = ()=> {
  const ros = new ROSLIB.Ros({
    url: "ws://"
  });

  ros.on('connection', ()=>{
    console.log("Connected to websocket server.")
  })

  ros.on('error', (error)=>{
    console.log("Error connecting to web socket server: ", error)
  })

  ros.on('close', ()=>{
    console.log('Connection to websocket closed.')
  })

  const disconnect = ()=>{
    ros.close()
  }

  let map = new ROSLIB.Topic({
    ros: ros,
    name: "/map",
    messageType: "/navs_msgs/OccupancyGrid"
  });

  map.subscribe((data)=>{
    console.log("mapa: ", data)
  });

  viewer = new ROS3D.Viewer({
    divID: "viewer-map",
    width: 1000,
    height: 750,
    antialias: true,
    background: "#676767",
  })

  viewer.addObject(new ROS3D.Grid());

  let tfClient = new ROSLIB.TFClient({
    ros: ros,
    angularThres: 0.01,
    transThres: 0.01,
    rate: 8.5,
    fixedFrame: "/map"
  })

  laser = new ROS3D.PointCloud2({
    ros: ros,
    tfClient: tfClient,
    rootObject: viewer.scene,
    topic: "/cloud",
  })

  let odometry = new ROSLIB.Topic({
    ros: ros,
    name: "/odom",
    messageType: "/nav_msgs/Odometry"
  })

  odometry.subscribe((data)=>{
    console.log("odometry: ", data)
  })

  let position = new ROSLIB.Topic({
    ros: ros,
    name: "/amcl_pose",
    messageType: "/geometry_msgs/PoseWithCovarianceStamped"
  });

  position.subscribe((data)=>{
    console.log("position: ", data)
  })

  let localmapobs = new ROSLIB.Topic({
    ros: ros,
    name: "/move_base/local_costmap/costmap",
    type: "/nav_msgs/OcuppancyGrid"
  })

  localmapobs.subscribe((data)=>{
    console.log("mapa local: ", data)
  });

  let globalMap = new ROSLIB.Topic({
    ros: ros,
    name: "/move_base/TebLocalPlannerROS/global_plan",
    messageType: "/nav_msgs/Path"
  });

  globalMap.subscribe((data)=>{
    console.log("globalmap", data)
  });

  let footprint = new ROSLIB.Topic({
    ros: ros,
    name: "/move_base/local_costmap/footprint",
    messageType: "/geometry_msgs/PolygonStamped",
  });

  footprint.subscribe((data)=>{
    console.log("footprint: ", data)
  })

  let objetive = new ROSLIB.Topic({
    ros: ros,
    name: "/move_base/current_goal",
    messageType: "/geometry_msgs/PoseStamped",
  });

  objetive.subscribe((data)=>{
    console.log("objetive :", data)
  });

  let pulseL = new ROSLIB.Topic({
    ros: ros,
    name: "/hortirover/lwheel_ticks",
    messageType: "/std_msgs/Int32"
  });

  let pulseR = new ROSLIB.Topic({
    ros: ros,
    name: "/hortirover/rwheel_ticks",
    messageType: "/std_msgs/Int32"
  });

  pulseL.subscribe((data)=>{
    console.log("pulseL: ", data)
  })

  pulseR.subscribe((data)=>{
    console.log("pulseR: ", data)
  })

  let steerWheel = new ROSLIB.Topic({
    ros: ros,
    name: "/hortirover/steer_wheel",
    messageType: "std_msgs/Int32"
  });

  steerWheel.subscribe((data)=>{
    console.log("SteerWheel: ", data)
  })

  let keyvel = new ROSLIB.Topic({
    ros: ros,
    name: "/key_vel",
    messageType: "/geometry_msgs/Twist"
  });

  const forward = ()=>{
    let twistmsg = new ROSLIB.Message({
      linear: {x: 1, y: 0, z: 0,},
      angular: {x:0, y: 0, z: 0},
    });
    keyvel.publish(twistmsg)
  }

  const stop = ()=>{
    let stopmsg = new ROSLIB.Message({
      linear: {x:0, y:0, z:0,},
      angular: {x:0, y:0, z:0,},
    });
    keyvel.publish(stopmsg);
  }

  const backward = ()=>{
    let backmsg = new ROSLIB.Message({
      linear: {x:-1, y:0, z:0},
      angular: {x:0, y:0, z:0},
    });
    keyvel.publish(backmsg);
  }

  const turnleft = ()=>{
    let turnleftmsg = new ROSLIB.Message({
      linear: {x:0.5, y:0, z:0,},
      angular: {x:0, y:0, z:0.5},
    });
    keyvel.publish(turnleftmsg);
  }

  const turnright = ()=>{
    let turnrightmsg = new ROSLIB.Message({
      linear: {x:0.5, y:0, z:0,},
      angular: {x:0, y:0, z:-0.5,},
    });
    keyvel.publish(turnrightmsg)
  }

}

