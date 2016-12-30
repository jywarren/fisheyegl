var distorter;

jQuery(document).ready(function($) {

  distorter = FisheyeGl({
    image: 'images/grid.png'
  });

  $("dl").on("change", function(e){
    distorter.lens.a = $("#a_label").innerHTML = $("#a").val();
    distorter.lens.b = $("#b_label").innerHTML = $("#b").val();
    distorter.lens.F = $("#F_label").innerHTML = $("#F").val();
    distorter.lens.scale = $("#scale_label").innerHTML = $("#scale").val();
    distorter.fov.x = $("#fovx").val();
    distorter.fov.y = $("#fovy").val();
    distorter.run();
  });

  $("#a").val(distorter.lens.a);
    $("#a_label").innerHTML = distorter.lens.a;
  $("#b").val(distorter.lens.b);
    $("#b_label").innerHTML = distorter.lens.b;
  $("#F").val(distorter.lens.F);
    $("#F_label").innerHTML = distorter.lens.F;
  $("#scale").val(distorter.lens.scale);
    $("#scale_label").innerHTML = distorter.lens.scale;
  $("#fovx").val(distorter.fov.x);
  $("#fovy").val(distorter.fov.y);


  // Drag & Drop behavior

  $('#canvas').on('dragenter',function(e) {
    $('.zone').addClass('hover');
  });

  $('#canvas').on('dragleave',function(e) {
    $('.zone').removeClass('hover');
  });

  var onDrop = function(e) {
    e.preventDefault();
    e.stopPropagation(); // stops the browser from redirecting.

    var files = e.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
      // Read the File objects in this FileList.

      reader = new FileReader()
      reader.onload = function(e) {
        distorter.setImage(event.target.result);
      }
      reader.readAsDataURL(f);
 
    }
  }

  function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  $('#canvas').on('dragover', onDragOver, false);
  $('#canvas')[0].addEventListener('drop', onDrop, false);

});
