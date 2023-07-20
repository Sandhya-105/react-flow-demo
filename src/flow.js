import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
    addEdge,
    ConnectionLineType,
    Panel,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import Api from './api.js';
import 'reactflow/dist/style.css';

// creating a new instance of the dagregraph with an empty label
const dagreGraph = new dagre.graphlib.Graph(); 
dagreGraph.setDefaultEdgeLabel(() => ({})); 

// node width and height
const nodeWidth = 172;
const nodeHeight = 36;

// layout position for nodes
const getLayoutedElements = (nodes, edges, direction = 'TB') => {

    dagreGraph.setGraph({ rankdir: direction });
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};


// the main chart
const LayoutFlow = ({ doi }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(null);
    const [edges, setEdges, onEdgesChange] = useEdgesState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api(doi);
            //console.log(response)
            const links = []
            const p_node = [{ id: response.data.metadata.doi, data: { label: response.data.metadata['title'] }, type: 'input' }]

            for (let i = 0; i < response.data.metadata.related_identifiers.length - 1; i++) {
                const doi = response.data.metadata.related_identifiers[i].identifier;
                const child_response = await Api(doi.slice(-7));

                const c_node = { id: child_response.data.metadata.doi, data: { label: child_response.data.metadata['title'] }, type: 'output' }
                links.push({ id: `e${response.data.metadata.doi}-${child_response.data.metadata.doi}`, source: response.data.metadata.doi, target: child_response.data.metadata.doi, label: response.data.metadata.related_identifiers[i].relation })
                p_node.push(c_node)
            }
            //console.log(p_node, links)
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                p_node,
                links
            );
            setNodes(layoutedNodes)
            setEdges(layoutedEdges)
        };
        if (doi != '') {
            fetchData();
        }
    }, [doi]);

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
            ),
        []
    );

    if (!nodes || !edges) {
        return null;
    }
    return (
        <div style={{ height: 800 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
            ></ReactFlow>
        </div>

    );
};

export default LayoutFlow;