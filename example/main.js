var distorter;

jQuery(document).ready(function($) {

  distorter = FisheyeGl({
    image: 'images/grid.png'
  });

  $("dl").on("change", adjustLens);
  $("dl input").on("mousemove", adjustLens);

  function adjustLens(e) {
    distorter.lens.a = $("#a_label")[0].innerHTML = $("#a").val();
    distorter.lens.b = $("#b_label")[0].innerHTML = $("#b").val();
    distorter.lens.F = $("#F_label")[0].innerHTML = $("#F").val();
    distorter.lens.scale = $("#scale_label")[0].innerHTML = $("#scale").val();
    distorter.fov.x = $("#fovx").val();
    distorter.fov.y = $("#fovy").val();
    distorter.run();
    $("#display .a")[0].innerHTML = distorter.lens.a;
    $("#display .b")[0].innerHTML = distorter.lens.b;
    $("#display .F")[0].innerHTML = distorter.lens.F;
    $("#display .scale")[0].innerHTML = distorter.lens.scale;
    $("#display .x")[0].innerHTML = distorter.fov.x;
    $("#display .y")[0].innerHTML = distorter.fov.y;
  }

  $("#a").val(distorter.lens.a);
    $("#a_label")[0].innerHTML = distorter.lens.a;
  $("#b").val(distorter.lens.b);
    $("#b_label")[0].innerHTML = distorter.lens.b;
  $("#F").val(distorter.lens.F);
    $("#F_label")[0].innerHTML = distorter.lens.F;
  $("#scale").val(distorter.lens.scale);
    $("#scale_label")[0].innerHTML = distorter.lens.scale;
  $("#fovx").val(distorter.fov.x);
  $("#fovy").val(distorter.fov.y);

  adjustLens();

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
        $('#previous').prepend(distorter.getImage());
        distorter.setImage(event.target.result, function callback() {
          $('#grid').height($('#canvas').height());
          $('#grid').width($('#canvas').width());
        });
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

  setTimeout(function() {
    $('#grid').height($('#canvas').height());
    $('#grid').width($('#canvas').width());
  }, 0);

});
