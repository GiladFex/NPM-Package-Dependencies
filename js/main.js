// FLOW OF CONTENT:
// whenver you enter an input: jquery records a keypress which sends an ajax to get autocomplete suggestions
// if package exsist with this name- goes to the recursive function, which gets all dependencies and makes a graph out of them.
// graph is made of nodes and lines, both are arraies of jsons.


$(document).ready(function() {

  // VIS JS - Network Chart configurations.
  // create an array with node for each dependency.
  var nodes = new vis.DataSet();
  var lines = new vis.DataSet();
  var network = null;

  // on finish typing (200 ms of nothing) of any search, updates the description. this prevents ajax requests for every keypress.
  var timer = null;
  $('.PackageName').keyup(function(e) {

    // get keycode of current keypress event
       var code = (e.keyCode || e.which);

       // do nothing if it's an arrow key -- allows graph navigation without losing focus
       if(code == 37 || code == 38 || code == 39 || code == 40) {
           return;
       }

      clearTimeout(timer);
      timer = setTimeout(getPackageFromNPM, 200);

  });

  //makes http request to get a json with a lot of keys to a new json with the key of "_id" only
  //note: Any input is alright. it just wouldn't find anything if input is wrong.
  var NPMPackageNames = {};

  //shows description and calls the recursive function -- if found.
  function getPackageFromNPM() {
    resetGraph();
    if ($(".PackageName").val() == "") //empty string
    {
      $(".card-panel").fadeOut(200);
    } else {
      $.ajax({
        url: "https://registry.npmjs.org/" + $(".PackageName").val() + "/latest",
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
          $(".card-panel").fadeIn(200);
          $(".description").text(result.description);
          addNode(($(".PackageName").val()), ($(".PackageName").val()) + " latest");
          GetDependencies(result);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
          $(".card-panel").fadeOut(200);
        }
      });
    }
  }

  //clears canvas for future use
  function resetGraph() {
    nodes.clear();
    lines.clear();
  }

  //recursive function which gets ALL dependencies and creates graphs - nodes and lines.
  function GetDependencies(result) {
    if (result.dependencies != null) {
      for (var i = 0; i < Object.keys(result.dependencies).length; i++) {
        try {
          addLine(result.name, Object.keys(result.dependencies)[i]);
        } catch (e) {

        }
        try {
          addNode(Object.keys(result.dependencies)[i], Object.keys(result.dependencies)[i] + " " + Object.values(result.dependencies)[i].slice(1));
          $.ajax({
            url: "https://registry.npmjs.org/" + Object.keys(result.dependencies)[i] + "/" + Object.values(result.dependencies)[i],
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(newResult) {
              GetDependencies(newResult);
            }
          });
        } catch (e) {

        }
      }
    } else {
      // no dependencies
    }
  }

  //adds one line
  function addLine(from, to) {
    lines.add({
      from: from,
      to: to
    });
  }

  function addNode(id, label) {
    nodes.add({
      id: id,
      shape: 'circularImage',
      image: 'data:image/jpeg;base64,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', //was about to add custom image with search api but I couldn't find ONE decent service.
      label: label
    });
  }

  //  VIS JS STATIC SETTINGS  //
  var container = document.getElementById('mynetwork');

  var data = {
    nodes: nodes,
    edges: lines
  };
  var options = {
    height: '100%',
    width: '100%',
    layout: {
      hierarchical: {
        direction: "UD",
        sortMethod: "directed"
      }
    },
    interaction: {
      dragNodes: false,
      dragView: false,
      zoomView: false,
      keyboard: true
    },
    physics: {
      enabled: false
    }
  };

  network = new vis.Network(container, data, options);

});
