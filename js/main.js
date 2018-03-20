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
      image: 'https://res.cloudinary.com/snyk/image/upload/v1468845142/logo/snyk-avatar.png', //was about to add custom image with search api but I couldn't find ONE decent service.
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
