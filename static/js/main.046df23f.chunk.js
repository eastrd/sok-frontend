(this["webpackJsonpsok-frontend"]=this["webpackJsonpsok-frontend"]||[]).push([[0],{252:function(t,e,n){"use strict";n.r(e);var s=n(8),o=n.n(s),a=n(105),i=n.n(a),r=n(106),d=n(107),u=n(110),h=n(109),c=n(108),p=n.n(c),g=n(4),l="https://api.sok.runtimeerrorstudio.com/",f=function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(t){var s;return Object(r.a)(this,n),(s=e.call(this,t)).state={graph:{nodes:[],edges:[]},visited_tags:new Set,nodes_id_map:{},nodes_tag_map:{},last_used_id:0},s}return Object(d.a)(n,[{key:"init",value:function(){var t=this;fetch(l+"random").then((function(t){return t.json()})).then((function(t){return t.tag})).then((function(e){return t.reloadGraph(e)}))}},{key:"getNumEdges",value:function(t,e){return e.filter((function(e){return e.to===t})).length}},{key:"extendGraph",value:function(t,e){var n=this,s=e,o=this.state.last_used_id,a=this.state.graph.nodes,i=this.state.graph.edges;console.log(i,a);var r=this.state.nodes_id_map,d=this.state.nodes_tag_map,u=this.state.visited_tags;fetch(l+"getTopN?n=5&tag="+encodeURIComponent(t)).then((function(t){return t.json()})).then((function(e){u.add(t),e.ds.forEach((function(t){t.d;t.ts.forEach((function(t){var e=t.t;e in d?(console.log(e,"already exists"),i.push({from:s,to:d[e]})):(console.log(e,"is new"),i.push({from:s,to:o}),a.push({id:o,label:e,shape:"box"}),r[o]=e,d[e]=o,console.log(o),o++)}))}))})).then((function(t){a=a.map((function(t){var e=d[t.label],s=n.getNumEdges(e,i);return t.borderWidth=s,t})),n.state.network.setData({nodes:a,edges:i}),n.setState({graph:{nodes:a,edges:i},nodes_id_map:r,nodes_tag_map:d,visited_tags:u,last_used_id:o},(function(){return console.log("extend graph done",n.state.graph)}))}))}},{key:"reloadGraph",value:function(t){var e=this,n=1,s=[{id:0,label:t,shape:"box"}],o=[],a={},i={};a[0]=t,i[t]=0;var r=this.state.visited_tags;fetch(l+"getTopN?n=5&tag="+encodeURIComponent(t)).then((function(t){return t.json()})).then((function(e){r.add(t),e.ds.forEach((function(t){t.d;t.ts.forEach((function(t){var e=t.t;e in i||(s.push({id:n,label:e,shape:"box"}),a[n]=e,i[e]=n,o.push({from:0,to:n}),n++)}))}))})).then((function(t){e.state.network.setData({nodes:s,edges:o}),e.setState({graph:{nodes:s,edges:o},nodes_id_map:a,nodes_tag_map:i,visited_tags:r,last_used_id:n},(function(){return console.log("reload graph done",e.state)}))}))}},{key:"componentDidMount",value:function(){this.init()}},{key:"render",value:function(){var t=this;return Object(g.jsx)("div",{children:Object(g.jsx)(p.a,{graph:this.state.graph,getNetwork:function(e){return t.setState({network:e})},physics:{enabled:!0,stabilization:{iterations:0}},options:{edges:{color:"#000000",arrows:{to:{enabled:!1}}},height:.95*window.innerHeight+"px"},events:{doubleClick:function(e){if(e.nodes.length>0){var n=e.nodes[0],s=t.state.nodes_id_map[n];t.setState({nodes:[],visited_tags:new Set,nodes_id_map:{},nodes_tag_map:{},edges:[],id:0},(function(){return t.reloadGraph(s)}))}},hold:function(e){if(e.nodes.length>0){var n=e.nodes[0],s=t.state.nodes_id_map[n];t.state.visited_tags.has(s)||t.extendGraph(s,n)}}}})})}}]),n}(o.a.Component);var _=function(){return Object(g.jsx)("div",{className:"App",children:Object(g.jsx)(f,{})})};i.a.render(Object(g.jsx)(_,{}),document.getElementById("root"))}},[[252,1,2]]]);
//# sourceMappingURL=main.046df23f.chunk.js.map