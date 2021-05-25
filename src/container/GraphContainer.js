import React from 'react';
import Graph from "react-graph-vis";

const SERVER = "https://api.sok.runtimeerrorstudio.com/";

// Number of tags from each domain
const NUM_TAGS = 5;

class GraphContainer extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            graph: {
                nodes: [],
                edges: [],
            },            
            visited_tags: new Set(),
            // Hashmap: ID -> Tag
            nodes_id_map: {},
            // Hashmap: Tag -> ID
            nodes_tag_map: {},
            last_used_id: 0,
        };
    }

    init() {
        fetch(SERVER + "random")
            .then(resp => resp.json())
            .then(data => data["tag"])
            .then(tag => this.reloadGraph(tag));
    }

    getNumEdges(tag_id, edges) {
        // Return the number of edges a given tag ID is being connected to
        return edges.filter(e => e.to === tag_id).length;
    }
    

    extendGraph(clicked_tag, clicked_id) {
        /*
            Extend existing graph instead of re-rendering the whole thing
                given a tag that user has clicked and its ID
        */
        // Keep track of ID for current tag as source
        // Current tag has already been in the nodes list, no need to add
        let source_id = clicked_id;
        let id = this.state.last_used_id;
        let nodes = this.state.graph.nodes;
        let edges = this.state.graph.edges;
        console.log(edges, nodes);
        let nodes_id_map = this.state.nodes_id_map;
        let nodes_tag_map = this.state.nodes_tag_map;
        let visited_tags = this.state.visited_tags;

        fetch(SERVER + "getTopN?n="+ NUM_TAGS + "&tag=" + encodeURIComponent(clicked_tag))
            .then(resp => resp.json())
            .then(data => {
                visited_tags.add(clicked_tag);
                data["ds"].forEach(each_domain => {
                    let domain_name = each_domain["d"]
                    let tags = each_domain["ts"]
                    tags.forEach(t => {
                        let tag_name = t["t"];
                        if (tag_name in nodes_tag_map) {
                            console.log(tag_name, "already exists");
                            edges.push({
                                from: source_id,
                                to: nodes_tag_map[tag_name],
                            });
                        } else {
                            console.log(tag_name, "is new");
                            // Add edges from source to iter'd tag
                            edges.push({
                                from: source_id,
                                to: id,
                            });
                            nodes.push({
                                id: id,
                                label: tag_name,
                                shape: "box",
                            });
                            // Add ID to hashmap for search & vice versa
                            nodes_id_map[id] = tag_name;
                            nodes_tag_map[tag_name] = id;
                            console.log(id);
                            id ++;
                        }
                    });
                });
            })
            .then(data => {
                // Update border width for all nodes
                nodes = nodes.map(n => {
                    // Calculate the border width before inserting into nodes
                    let id = nodes_tag_map[n.label];
                    let border_width = this.getNumEdges(id, edges);
                    n.borderWidth = border_width;
                    return n;
                });

                // Need the below two lines to re-draw the graph for some reason
                const {network} = this.state;
                network.setData({
                    nodes,
                    edges,
                });

                this.setState({
                    graph: {
                        nodes: nodes,
                        edges: edges,
                    },
                    nodes_id_map: nodes_id_map,
                    nodes_tag_map: nodes_tag_map,
                    visited_tags: visited_tags,
                    last_used_id: id,
                }, () => console.log("extend graph done", this.state.graph));
            });
    }

    reloadGraph(source_tag) {
        /*
            Re-render graph with a new source_tag
        */
        // Init source tag as id 0
        let source_id = 0;
        let id = 1;
        let nodes = [{ id: source_id, label: source_tag, shape: "box" }];
        let edges = [];
        let nodes_id_map = {};
        let nodes_tag_map = {};
        nodes_id_map[source_id] = source_tag;
        nodes_tag_map[source_tag] = source_id;
        let visited_tags = this.state.visited_tags;
        fetch(SERVER + "getTopN?n=" + NUM_TAGS + "&tag=" + encodeURIComponent(source_tag))
            .then(resp => resp.json())
            .then(data => {
                    visited_tags.add(source_tag)
                    data["ds"].forEach(each_domain => {
                        let domain_name = each_domain["d"];
                        let tags = each_domain["ts"];
                        tags.forEach(t => {
                            let tag_name = t["t"];
                            // Don't add duplicated tags
                            if (!(tag_name in nodes_tag_map)) {
                                nodes.push({
                                    id: id,
                                    label: tag_name,
                                    shape: "box",
                                });
                                // Add ID to hashmap for search & vice versa
                                nodes_id_map[id] = tag_name;
                                nodes_tag_map[tag_name] = id;
                                // Add edges from source to iter'd tag
                                edges.push({
                                    from: source_id,
                                    to: id,
                                });
                                id ++;
                            }
                        });
                    });
                }
            )
            .then(data => {

                // Need the below two lines to re-draw the graph for some reason
                const {network} = this.state;
                network.setData({
                    nodes,
                    edges,
                });

                this.setState({
                    graph: {
                        nodes: nodes,
                        edges: edges,
                    },
                    nodes_id_map: nodes_id_map,
                    nodes_tag_map: nodes_tag_map,
                    visited_tags: visited_tags,
                    last_used_id: id,
                }, () => console.log("reload graph done", this.state));
            });
    }

    componentDidMount() {
        this.init();
    }



    render() {
        return (
            <div>
                <Graph 
                    graph={this.state.graph}
                    getNetwork={network => this.setState({ network })}
                    physics = {{ 
                        enabled: true, 
                        stabilization: { 
                            iterations: 0
                        }
                    }}
                    options = {{
                        edges: {
                            color: "#B8E9DE",
                            arrows: {
                                to: { 
                                    enabled: false,
                                }
                            },
                        },
                        height: window.innerHeight * 0.95 + "px",
                    }}
                    events = {{
                        doubleClick: (event) => {
                            if (event.nodes.length > 0){
                                let node_id = event.nodes[0];
                                let node_name = this.state.nodes_id_map[node_id];
                                this.setState({
                                    nodes: [],
                                    visited_tags: new Set(),
                                    nodes_id_map: {},
                                    nodes_tag_map: {},
                                    edges: [],
                                    id: 0,
                                }, () => this.reloadGraph(node_name));
                            }
                        },
                        hold: (event) => {
                            if (event.nodes.length > 0){
                                let node_id = event.nodes[0];
                                let node_name = this.state.nodes_id_map[node_id];
                                if (!this.state.visited_tags.has(node_name)) {
                                    this.extendGraph(node_name, node_id);
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    }
}


export default GraphContainer;