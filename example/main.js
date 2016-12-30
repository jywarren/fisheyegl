var distorter;

(function() {

  distorter = FisheyeGl({
    image: 'images/grid.png'
  });

  // mini fake jQuery:
  function $(query){
    return document.querySelector(query);
  }

  $("dl").addEventListener("change", function(e){
    distorter.lens.a = $("#a_label").innerHTML = $("#a").value;
    distorter.lens.b = $("#b_label").innerHTML = $("#b").value;
    distorter.lens.F = $("#F_label").innerHTML = $("#F").value;
    distorter.lens.scale = $("#scale_label").innerHTML = $("#scale").value;
    distorter.fov.x = $("#fovx").value;
    distorter.fov.y = $("#fovy").value;
    distorter.run();
  });

  $("#a").value = $("#a_label").innerHTML = distorter.lens.a;
  $("#b").value = $("#b_label").innerHTML = distorter.lens.b;
  $("#F").value = $("#F_label").innerHTML = distorter.lens.F;
  $("#scale").value = $("#scale_label").innerHTML = distorter.lens.scale;
  $("#fovx").value = distorter.fov.x;
  $("#fovy").value = distorter.fov.y;

})(this);
