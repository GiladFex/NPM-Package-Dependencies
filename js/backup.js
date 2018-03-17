// FLOW OF CONTENT:
// whenver you enter an input: jquery records a keypress which sends an ajax to get autocomplete suggestions
// if package exsist with this name- creates graph:
// graph creation is a recursive function which seeks all dependencies.
// each dependency is a circles (function createCircles(), which uses image search api to provide pictures for interactiveness)
// the level of the dependency is written inside the variable "lines", and if a dependency comes more than once it takes note of that
// in the end, creates a

$(document).ready(function() {

  // on finish (150 ms of nothing) of any search, updates the description
  var timer = null;
  $('.PackageName').keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(getPackageFromNPM, 150)
  });

  //makes http request to get a json with a lot of keys to a new json with the key of "_id" only
  //note: Any input is alright. it just wouldn't find anything if input is wrong.
  var NPMPackageNames = {};

  //shows description and calls function which creates graph.
  function getPackageFromNPM() {
    if ($(".PackageName").val() == "") //empty string
    {
      $(".card-panel").fadeOut(400);
    } else {
      $.ajax({
        url: "https://registry.npmjs.org/" + $(".PackageName").val() + "/latest",
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
          resetAll();
          $(".card-panel").fadeIn(400);
          $(".description").text(result.description);
          nodes = [];
          lines = [];
          GetDependencies(result);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
          $(".card-panel").fadeOut(400);
        }
      });
    }
  }

  //recursive function which gets ALL dependencies and creates graphs.


  function GetDependencies(result) {
    if (result.dependencies != null) {
      for (var i = 0; i < Object.keys(result.dependencies).length; i++) {
        lines.push({
          from: result.name,
          to: Object.keys(result.dependencies)[i]
        });
        if (nodes.indexOf(Object.keys(result.dependencies)[i]) == -1) {
          $.ajax({
            url: "https://registry.npmjs.org/" + Object.keys(result.dependencies)[i] + "/" + Object.values(result.dependencies)[i],
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(newResult) {
              GetDependencies(newResult);
            }
          });
          nodes.push({
            id: Object.keys(result.dependencies)[i],
            shape: 'circularImage',
            image: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
            label: Object.keys(result.dependencies)[i]
          });
        }
      }
    }
    console.log(nodes);
    console.log(lines);
  }


  // VIS JS - Network Chart configurations.
  // create an array with node for each dependency.
  var nodes = [];
  var lines = [];
  var network = null;

  // CHART VISUALIZAION //

  function resetAll() {
    if (network !== null) {
      network.destroy();
      network = null;
    }
  }


  // gets images off the internet for better visualization
  // function getImage(PackageName) {
  //   $.ajax({
  //     url: "https: //api.qwant.com/api/search/images?count=1&offset=1&q=" + PackageName,
  //     type: 'GET',
  //     contentType: "application/json; charset=utf-8",
  //     dataType: "json",
  //     success: function(result) {
  //       return result.result.items.media;
  //     }
  //   });
  // }


  // create a network -- static data for the chart
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
      zoomView: false
    },
    physics: {
      enabled: false
    }
  };

  network = new vis.Network(container, data, options);

});
