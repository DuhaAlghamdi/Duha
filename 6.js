// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - First Edge Object
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//
var _v = [],
    _e = []; // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main() {
    // create a graph (default undirected)
    var g = new Graph();

    // set input graph properties (label, directed etc.)
    g.label = 'Figure 3.10 (Levitin, 3rd edition)';



    // use global input arrays _v and _e to initialize its internal data structures
    g.read_graph(_v, _e);

    // use print_graph() method to check graph
    g.print_graph();

    // report connectivity status if available
    //var connect = g.connectedComp;


    // perform depth-first search and output stored result
    g.connectedComp = g.topoSearch(g.connectedComp);
    g.Counter++;
    document.write("<p>dfs_push: ", g.dfs_push, "</p>");

    // report connectivity status if available
    document.write("<p> ", g.componentInfo(), "</p>");
    var connect = g.connectedComp;
    if (connect == 0) {
        document.write("<p>no connectivity info </p>");
    }


    // perform breadth-first search and output stored result
    g.topoSearch(g.dfsImpl);
    document.write("<p>bfs_order: ", g.bfs_out, "</p>");

    // output the graph adjacency matrix


    document.write("<p>first row matrix: ", g.adjMatrix()[0], "</p>");

    document.write("<p>last row matrix: ", g.adjMatrix()[g.nv - 1], "</p>");

}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v) {
    // user input fields

    this.label = v.label; // vertex can be labelled

    // more fields to initialize internally

    this.visit = false; // vertex can be marked visited or "seen"
    this.adjacent = new List(); // init an adjacency list

    // --------------------
    // member methods use functions defined below

    this.adjacentById = adjacentByIdImpl; // return target id of incident edges in array
    this.vertexInfo = vertexInfoImpl;
    this.insertAdjacent = insertAdjacentImpl;
    this.incidentEdge = incidentEdgeImpl;
    this.list_varts = listVertsImpl;

}

// -----------------------------------------------------------------------
// Edge object constructor
function Edge(vert_i, weight) {
    this.target_v = vert_i;
    if (weight == undefined) {
        this.weight = null; // Edge weight or cost
    }
    else {
        this.weight = weight;
    }

}


// -----------------------------------------------------------------------
// Graph object constructor

function Graph() {
    this.vert = []; // vertex list (an array of Vertex objects)
    this.nv = 0; // number of vertices
    this.ne = 0; // number of edges
    this.digraph = false; // true if digraph, false otherwise (default undirected)
    this.dfs_push = []; // DFS order output
    this.bfs_out = []; // BFS order output
    this.label = ""; // identification string to label graph

    // --------------------
    // student property fields next

    this.connectedComp = 0; // number of connected comps set by DFS; 0 (default) for no info
    this.adjMatrix = makeAdjMatrix // graph adjacency matrix to be created on demand
    this.weighted = false;

    // --------------------
    // member methods use functions defined below

    this.read_graph = better_input; // default input reader method
    this.print_graph = printGraphImpl; // better printer function


    this.add_edge2 = addEdgeImpl3; // replace (don't change old .add_edge)
    this.dfs = dfsImpl; // DFS a connected component
    this.bfs = bfsImpl; // BFS a connected component

    // --------------------
    // student methods next; implementing functions in student code section at end

    this.isConnected = isConnectedImpl;
    this.componentInfo = componentInfoImpl;

    this.topoSearch = topoSearchImpl; // perform a topological search
    this.Counter = 1;


}


// -------------------------------------------------------
// Functions used by methods of Graph object. Similar to
// normal functions but use object member fields and
// methods, depending on which object is passed by the
// method call through the self variable: this.
//

// --------------------




function addEdgeImpl3(u_i, v_i, weight) {
    // fetch vertices using their id, where u: edge source vertex, v: target vertex
    var u = this.vert[u_i];
    var v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    // (first create edge object using v_i as target, then pass edge object)
    var edge = new Edge(v_i, weight);
    // check if the graph weighted or not 

    u.insertAdjacent(edge);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph) {
        edge = new Edge(u_i, weight);
        v.insertAdjacent(edge);
    }
}

function listVertsImpl() {
    // list vertices	
    for (var i = 0; i < this.nv; i++) {
        var v = this.vert[i];
        document.write("VERTEX: ", i, v.vertexInfo(), "<br>");
    }
}

// --------------------
function better_input(v, e) {

    // set number of vertices and edges fields
    this.nv = v.length;
    this.ne = e.length;

    // input vertices into internal vertex array

    for (var i = 0; i < this.nv; i++) {
        this.vert[i] = new Vertex(v[i]);
    }

    // input vertex pairs from edge list input array
    // remember to pass vertex ids to add_edge() 
    for (var j = 0; j < this.ne; j++) {
        this.add_edge2(e[j].u, e[j].v, e[j].w);
    }


    // double edge count if graph undirected 
    if (!this.digraph) {
        this.ne = e.length * 2;
    }
    if (!(e[0].w == undefined)) {
        this.weighted = true;
    }


}

// --------------------
function better_output() {


}

// --------------------


// --------------------
function dfsImpl(v_i) {
    // get landing vert by id then process
    var v = this.vert[v_i];
    v.visit = true;
    this.dfs_push[this.dfs_push.length] = v_i;

    // recursively traverse unvisited adjacent vertices
    var w = v.adjacentById();
    for (var i = 0; i < w.length; i++) {

        if (!this.vert[w[i]].visit) {
            this.dfs(w[i]);

        }

    }

}
//---------------------
function componentInfoImpl() {
    if (this.connectedComp == 0) {
        return ("no connectivity info");
    }
    else if (this.connectedComp > 1) {
        return ("DISCONNECTED " + this.connectedComp);
    }
    else if (this.isConnected) {
        return ("CONNECTED");
    }
}

// --------------------
function bfsImpl(v_i) {
    // get vertex v by its id
    var v = this.vert[v_i];

    // process v 
    v.visit = true;
    this.bfs_out[this.bfs_out.length] = v_i;

    // initialize queue with v
    var queue = new Queue();
    queue.enqueue(v);


    // while queue not empty
    while (!queue.isEmpty()) {
        // dequeue and process a vertex, u
        var u = queue.dequeue();
        // queue all unvisited vertices adjacent to u
        var w = u.adjacentById();
        for (var i = 0; i < w.length; i++) {
            if (!this.vert[w[i]].visit) {
                this.vert[w[i]].visit = true;
                queue.enqueue(this.vert[w[i]]);
                this.bfs_out[this.bfs_out.length] = w[i];
            }
        }

    }


}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------

function adjacentByIdImpl() {
    var out = [];
    var e = this.adjacent.traverse();
    for (var i = 0; i < e.length; i++)
        out[i] = e[i].target_v;
    return out;

}

// --------------------

//-------------------
function isConnectedImpl() {
    return this.connectedComp == 1;
}

// --------------------
function topoSearchImpl(fun) {
    var i;
    // mark all vertices unvisited
    for (i = 0; i < this.nv; i++) {
        this.vert[i].visit = false;
    }

    // traverse unvisited connected component 	
    for (i = 0; i < this.nv; i++) {
        if (!this.vert[i].visit) {
            this.Counter == 1 ?
                (fun++ , this.dfs(i)) : this.bfs(i);
        }
    }
    return fun;

}

// --------------------


function makeAdjMatrix() {
    // initially create row elements and zero the adjacency matrix
    var matrix = [];

    for (var i = 0; i < this.nv; i++) {
        matrix[i] = [];
        for (var j = 0; j < this.nv; j++) {
            matrix[i][j] = 0;
        }
    }

    // for each vertex, set 1 for each adjacency
    for (var i = 0; i < this.nv; i++) {
        w = this.vert[i].adjacentById();
        for (var j = 0; j < w.length; j++) {
            matrix[i][w[j]] = 1;
        }
    }

    return matrix;
}


function printGraphImpl() {
    document.write("<p>GRAPH {", this.label, "} ", this.weighted ? "" : "UN", "WEIGHTED, ", this.digraph ? "" : "UN", "DIRECTED - ", this.nv, " VERTICES, ", this.ne, " EDGES:</p>");
    document.write("<p> ", this.componentInfo(), "</p>");
    // list vertices	
    for (var i = 0; i < this.nv; i++) {
        var v = this.vert[i];
        document.write("VERTEX: ", i, v.vertexInfo(), "<br>");
    }




}

function incidentEdgeImpl() {


}

function vertexInfoImpl() {

    return ("{" + this.label + "} - VISIT: " + this.visit +
        " - ADJACENCY: " + this.adjacentById());

}

function makeGraphImpl(n, m, w) {

}

function insertAdjacentImpl(edge) {
    this.adjacent.insert(edge);
}