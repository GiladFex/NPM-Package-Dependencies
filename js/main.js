// FLOW OF CONTENT:
// whenver you enter an input: jquery records a keypress which sends an ajax to get autocomplete suggestions
// if package exsist with this name- creates graph:
// graph creation is a recursive function which seeks all dependencies.
// each dependency is a circles (function createCircles(), which uses image search api to provide pictures for interactiveness)
// the level of the dependency is written inside the variable "lines", and if a dependency comes more than once it takes note of that
// in the end, creates a

$(document).ready(function() {

  // on finish typing (200 ms of nothing) of any search, updates the description. this prevents ajax requests for every keypress.
  var timer = null;
  $('.PackageName').keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(getPackageFromNPM, 200)
  });

  //makes http request to get a json with a lot of keys to a new json with the key of "_id" only
  //note: Any input is alright. it just wouldn't find anything if input is wrong.
  var NPMPackageNames = {};

  //shows description and calls function which creates graph.
  function getPackageFromNPM() {
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
          dep = [];
          con = [];
          GetDependencies(result);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
          $(".card-panel").fadeOut(200);
        }
      });
    }
  }

  //recursive function which gets ALL dependencies and creates graphs.
  var dep = [];
  var con = [];

  function GetDependencies(result) {
    if (result.dependencies != null) {
      for (var i = 0; i < Object.keys(result.dependencies).length; i++) {
        con.push({
          from: result.name,
          to: Object.keys(result.dependencies)[i]
        });
        if (dep.indexOf(Object.keys(result.dependencies)[i]) == -1) {
          $.ajax({
            url: "https://registry.npmjs.org/" + Object.keys(result.dependencies)[i] + "/" + Object.values(result.dependencies)[i],
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(newResult) {
              GetDependencies(newResult);
            }
          });
          dep.push(Object.keys(result.dependencies)[i]);
        }
      }
    }
    console.log(dep);
    console.log(con);

  }


  // VIS JS - Network Chart configurations.
  // create an array with node for each dependency.
  var nodes;
  var nodes = null;
  var lines = null;
  var network = null;

  // CHART VISUALIZAION //

  function resetAll() {
    if (network !== null) {
      network.destroy();
      network = null;
    }
  }

  // the circles
  function createCircles() {
    resetAll();
    nodes = [{
        id: "hello",
        shape: 'circularImage',
        image: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
        label: "angular!"
      },
      {
        id: 2,
        shape: 'circularImage',
        image: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
        label: "react"
      },
      {
        id: 3,
        shape: 'circularImage',
        image: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
        label: "a"
      },
      {
        id: 4,
        shape: 'circularImage',
        image: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
        label: "b"
      }
    ];
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

  // the lines.
  var lines = [{
      from: "hello",
      to: 2
    },
    {
      from: 2,
      to: 3
    },
    {
      from: 2,
      to: 4
    }
  ];



  createCircles(); //remove in the end - so far just so i have a chart without doing anything


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
      zoomView: false,
      keyboard: true
    },
    physics: {
      enabled: false
    }
  };

  network = new vis.Network(container, data, options);

});
