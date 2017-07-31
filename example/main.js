var distorter, example;

jQuery(document).ready(function($) {

  distorter = FisheyeGl({
    image: 'images/grid.png'
  });

  function onSliderChange() {
    readSliders();  
    distorter.run();
    writeHash();
    updateDisplay();
  }
  $("dl").on("change", onSliderChange);
  $("dl input").on("mousemove", onSliderChange);

  readHash();
  setSliders();
  readSliders();  
  distorter.run();
  updateDisplay();

  function updateDisplay() {
    $("#display .a")[0].innerHTML     = distorter.lens.a;
    $("#display .b")[0].innerHTML     = distorter.lens.b;
    $("#display .Fx")[0].innerHTML    = distorter.lens.Fx;
    $("#display .Fy")[0].innerHTML    = distorter.lens.Fy;
    $("#display .scale")[0].innerHTML = distorter.lens.scale;
    $("#display .x")[0].innerHTML     = distorter.fov.x;
    $("#display .y")[0].innerHTML     = distorter.fov.y;
  }

  function readSliders() {
    distorter.lens.a     = parseFloat($("#a_label")[0].innerHTML = $("#a").val());
    distorter.lens.b     = parseFloat($("#b_label")[0].innerHTML = $("#b").val());
    distorter.lens.Fx    = parseFloat($("#Fx_label")[0].innerHTML = $("#Fx").val());
    distorter.lens.Fy    = parseFloat($("#Fy_label")[0].innerHTML = $("#Fy").val());
    distorter.lens.scale = parseFloat($("#scale_label")[0].innerHTML = $("#scale").val());
    distorter.fov.x      = parseFloat($("#fovx").val());
    distorter.fov.y      = parseFloat($("#fovy").val());
  }

  function writeHash() {
    setUrlHashParameter("a",     distorter.lens.a);
    setUrlHashParameter("b",     distorter.lens.b);
    setUrlHashParameter("Fx",    distorter.lens.Fx);
    setUrlHashParameter("Fy",    distorter.lens.Fy);
    setUrlHashParameter("scale", distorter.lens.scale);
    setUrlHashParameter("x",     distorter.fov.x);
    setUrlHashParameter("y",     distorter.fov.y);
  }

  function readHash() { 
    distorter.lens.a     = parseFloat(getUrlHashParameter("a"))     || distorter.lens.a;
    distorter.lens.b     = parseFloat(getUrlHashParameter("b"))     || distorter.lens.b;
    distorter.lens.Fx    = parseFloat(getUrlHashParameter("Fx"))    || distorter.lens.Fx;
    distorter.lens.Fy    = parseFloat(getUrlHashParameter("Fy"))    || distorter.lens.Fy;
    distorter.lens.scale = parseFloat(getUrlHashParameter("scale")) || distorter.lens.scale;
    distorter.fov.x      = parseFloat(getUrlHashParameter("x"))     || distorter.fov.x;
    distorter.fov.y      = parseFloat(getUrlHashParameter("y"))     || distorter.fov.y; 
  }

  // not quite working:
  //$(window).on('hashchange', function() {
  //  readHash();
  //  adjustLens();
  //});

  function useHash(hashString) {
    window.location.hash = hashString;
    readHash();
    setSliders();
    updateDisplay();
    distorter.run();
  }

  function setSliders() {
    $("#a").val(distorter.lens.a);
      $("#a_label")[0].innerHTML = distorter.lens.a;
    $("#b").val(distorter.lens.b);
      $("#b_label")[0].innerHTML = distorter.lens.b;
    $("#Fx").val(distorter.lens.Fx);
      $("#Fx_label")[0].innerHTML = distorter.lens.Fx;
    $("#Fy").val(distorter.lens.Fy);
      $("#Fy_label")[0].innerHTML = distorter.lens.Fy;
    $("#scale").val(distorter.lens.scale);
      $("#scale_label")[0].innerHTML = distorter.lens.scale;
    $("#fovx").val(distorter.fov.x);
    $("#fovy").val(distorter.fov.y);
  }


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

      var reader = new FileReader();
      reader.onload = function(e) {

        var dataurl = distorter.getSrc();
//        var bin = atob(dataurl.split(',')[1]);
//        var exif = EXIF.readFromBinaryFile(new BinaryFile(bin));
//        console.log(exif);

        var uniq = (new Date()).getTime();
        $('#previous').prepend('<a target="_blank" class="' + uniq + '" href="' + dataurl + '"></a>');
        $('.' + uniq).append(distorter.getImage());
        distorter.setImage(event.target.result, function callback() {
          $('#grid').height($('#canvas').height());
          $('#grid').width($('#canvas').width());
        });

      }
      reader.readAsDataURL(f);

      // EXIF
      var exifReader = new FileReader();

      $('.exif').html('');
      exifReader.onload = function(e) {
        var exif = EXIF.readFromBinaryFile(e.target.result);
        $('.exif-camera').html(exif.Make + ', ' + exif.Model);
        $('.exif').html(JSON.stringify(exif));
      }
      exifReader.readAsArrayBuffer(f);
    }
  }

  function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  $('#canvas').on('dragover', onDragOver, false);
  $('#canvas')[0].addEventListener('drop', onDrop, false);


  window.onresize = resizeGrid;
  setTimeout(resizeGrid, 0);

  function resizeGrid() {
    $('#grid').height($('#canvas').height());
    $('#grid').width($('#canvas').width());
  }

  example = {
    useHash:       useHash,
    readHash:      readHash,
    writeHash:     writeHash,
    setSliders:    setSliders,
    readSliders:   readSliders,  
    updateDisplay: updateDisplay
  }

});
