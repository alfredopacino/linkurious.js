var container = document.getElementById('graph-container');

var i,
    s,
    N = 700,
    E = 1000,
    g = {
      nodes: [],
      edges: []
    };

// Generate a random graph:
for (i = 0; i < N; i++)
  g.nodes.push({
    id: 'n' + i,
    label: 'Node ' + i,
    x: Math.random()*2,
    y: Math.random(),
    size: Math.random(),
    color: '#666',
    //active: [false, true][Math.random() * 1.15 | 0]
  });

for (i = 0; i < E; i++)
  g.edges.push({
    id: 'e' + i,
    source: 'n' + (Math.random() * N | 0),
    target: 'n' + (Math.random() * N | 0),
    size: Math.random(),
    color: '#ccc',
    //active: [false, true][Math.random() * 1.05 | 0],
    label: 'Edge edgy '+i
  });

s = new sigma({
  graph: g,
  settings: settings
});

// Initialize camera:
s.addCamera('cam'),

// Initialize the two renderers:
s.addRenderer({
  container: container,
  type: 'canvas',
  camera: 'cam'
});

s.refresh();