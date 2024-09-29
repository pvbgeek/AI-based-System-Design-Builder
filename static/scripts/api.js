// URL of the Flask endpoint (adjust host and port as needed)
const apiUrl = 'http://127.0.0.1:5000/generate';

// DOM elements
const sendButton = document.getElementById('send-button');
const textArea = document.getElementById('user-input');
const componentsMap = new Map(Array.from(document.querySelectorAll('.component')).map(component => [component.getAttribute('data-tooltip'), component]));

// Function to send input to Flask and receive graph JSON
async function fetchGraphJson(userInput) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const graph = await response.json();
        console.log("Received graph JSON:", graph);
        return graph;

    } catch (error) {
        console.error("Error fetching graph JSON:", error);
    }
}

// Event listener for Send button click
sendButton.addEventListener('click', async () => {
    const userInput = textArea.value.trim();

    // Validate input
    if (!userInput) {
        console.log("User input is empty. Please provide valid input.");
        return;
    }

    console.log("Sending user input to Flask:", userInput);

    // Fetch graph data from Flask
    const graph = await fetchGraphJson(userInput);

    // If graph is received, process it
    if (graph) {
        processGraph(graph);
    }
});

// Function to process the received graph data and create components and connections
function processGraph(graph) {
    // Validate if graph is an array
    if (!Array.isArray(graph)) {
        console.error("Invalid graph format received. Expected an array.");
        return;
    }

    // Clear previous graph data if needed
    clearPreviousGraph();

    const nodeCategories = new Map();

    // Helper function to track nodes by their component type
    const addNode = ({ id, component }) => {
        const nodeList = nodeCategories.get(component) || [];
        const nodeAlreadyExists = !!nodeList.find(node => node.component === component && node.id === id);
        if (!nodeAlreadyExists) nodeList.push({ id, component });
        nodeCategories.set(component, nodeList);
    };

    // Traverse graph to fill nodeCategories
    graph.forEach(node => {
        addNode(node);
        node.adjacencyList.forEach(addNode);
    });

    // Map to keep track of created nodes in the DOM
    const nodes = new Map();

    // Function to create a node name based on its type and ID
    const getNodeName = ({ id, component }) => {
        const category = nodeCategories.get(component);
        const nodeCount = category ? category.length : 0;
        return nodeCount > 1 ? `${component} ${id}` : component;
    };

    // Function to create a component node in the DOM
    const createNode = ({ id, component }) => {
        const nodeKey = `${component}_${id}`;
        const node = nodes.get(nodeKey);
        if (!node) {
            const componentElement = componentsMap.get(titleCase(component));
            if (componentElement) {
                const nodeName = getNodeName({ id, component });
                createComponent(componentElement, nodeName);
            }
            nodes.set(nodeKey, { id, component });
        }
    };

    // Create all nodes
    graph.forEach(node => {
        createNode(node);
        node.adjacencyList.forEach(createNode);
    });

    // Create connections between nodes based on adjacency list
    graph.forEach(node => {
        const sourceNode = document.querySelector(`#graph-window div[name='${getNodeName(node)}']`);
        node.adjacencyList.forEach(adjacentNode => {
            const destinationNode = document.querySelector(`#graph-window div[name='${getNodeName(adjacentNode)}']`);
            if (sourceNode && destinationNode) createArrowBetweenComponents(sourceNode, destinationNode);
        });
    });
}

// Helper function to clear previous graph components and connections
function clearPreviousGraph() {
    document.querySelectorAll('.graph-component').forEach(node => node.remove());
    d3.select('#graph-window svg').remove(); // Remove SVG arrows
}

// Helper function to convert string to title case
const titleCase = (string) =>
    string.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ').trim();
