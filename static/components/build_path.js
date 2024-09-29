/*// Log when build_path.js is loaded
console.log("build_path.js is loaded");

// Disable default right-click context menu globally (for testing)
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();  // Prevent the default browser menu
    console.log("Global contextmenu event triggered");
});

// Function to create the right-click context menu
function createContextMenu(event, component) {
    console.log("Right-clicked on component:", component.id);

    // Prevent default right-click menu
    event.preventDefault();  // Important: This should stop the browser's default context menu

    // Remove any existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        console.log("Removing existing context menu");
        existingMenu.remove();
    }

    // Create the context menu
    console.log("Creating context menu for component:", component.id);
    
    const menu = document.createElement('div');
    menu.classList.add('context-menu');
    
    // Add "Make a Connection" option with an icon
    const makeConnection = document.createElement('div');
    makeConnection.classList.add('context-menu-item');
    makeConnection.innerHTML = '<i class="fas fa-link"></i> Make a Connection';
    makeConnection.addEventListener('click', function() {
        console.log("Make a Connection clicked for component:", component.id);
        startConnection(component);
        menu.remove();  // Remove the menu after clicking
    });

    // Add "Delete Component" option with an icon
    const deleteComponent = document.createElement('div');
    deleteComponent.classList.add('context-menu-item');
    deleteComponent.innerHTML = '<i class="fas fa-trash"></i> Delete Component';
    deleteComponent.addEventListener('click', function() {
        console.log("Delete Component clicked for component:", component.id);
        deleteComponentFromWindow(component);
        menu.remove();  // Remove the menu after clicking
    });

    // Append options to the menu
    menu.appendChild(makeConnection);
    menu.appendChild(deleteComponent);

    // Style and position the menu near the mouse click
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;

    console.log("Context menu added to the DOM at position:", event.pageY, event.pageX);

    // Append the menu to the document
    document.body.appendChild(menu);

    // Remove the menu when clicking outside
    document.addEventListener('click', function removeMenu() {
        menu.remove();
        console.log("Context menu removed");
        document.removeEventListener('click', removeMenu);
    });
}

// Add right-click event to each component in the main window
function addContextMenuToComponent(component) {
    console.log("Adding right-click (contextmenu) event to component:", component.id);
    
    component.addEventListener('contextmenu', function(event) {
        console.log("Right-click detected on component:", component.id);
        event.preventDefault();  // Ensure this prevents the default browser context menu
        createContextMenu(event, component);
    });
}

// Check if the components in the main window are selected
const graphComponents = document.querySelectorAll('.graph-component');  // Renamed to graphComponents
console.log("Number of graph components found:", graphComponents.length);

// Attach context menu to each component
graphComponents.forEach(component => {
    console.log("Adding contextmenu listener to graph component:", component.id);
    addContextMenuToComponent(component);
});*/


/*// Remove the duplicate declaration of graphWindow if it's already declared in graph.js
// Assuming graphWindow is already declared in graph.js and accessible globally

// Variable to track if we're in connection mode
let connectionMode = false;
let startComponent = null;
let endComponent = null;

// Add event listeners for left-clicking graph components to start and confirm connections
document.addEventListener('click', handleComponentClick);
document.addEventListener('contextmenu', cancelConnectionOnRightClick);

function handleComponentClick(event) {
    const clickedComponent = event.target.closest('.graph-component');

    if (connectionMode) {
        if (clickedComponent && clickedComponent !== startComponent) {
            // Second click to confirm connection
            endComponent = clickedComponent;
            console.log(`Second component clicked: ${endComponent.getAttribute('data-tooltip')}`);
            createArrowBetweenComponents(startComponent, endComponent);
            cleanupAfterConnection();
        } else {
            console.log("Clicked outside. Cancelling connection.");
            cleanupAfterConnection();
        }
    } else if (clickedComponent) {
        // First click to start connection
        startComponent = clickedComponent;
        console.log(`First component clicked: ${startComponent.getAttribute('data-tooltip')}`);
        connectionMode = true;
        startComponent.classList.add('selected');
    }
}

function cancelConnectionOnRightClick(event) {
    if (connectionMode) {
        console.log("Right-click detected, cancelling connection.");
        cleanupAfterConnection();
    }
}

function createArrowBetweenComponents(startComponent, endComponent) {
    console.log(`Creating an arrow between: ${startComponent.getAttribute('data-tooltip')} and ${endComponent.getAttribute('data-tooltip')}`);

    const startPos = getComponentCenterPosition(startComponent);
    const endPos = getComponentCenterPosition(endComponent);

    console.log(`Start Component Position: (${startPos.x}, ${startPos.y})`);
    console.log(`End Component Position: (${endPos.x}, ${endPos.y})`);

    const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
    const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

    console.log(`Relative Start: (${relativeStart.x}, ${relativeStart.y}), Relative End: (${relativeEnd.x}, ${relativeEnd.y})`);

    drawArrow(relativeStart, relativeEnd);
}

function drawArrow(start, end) {
    const svg = d3.select(graphWindow).select('svg');
    if (svg.empty()) {
        console.log("Creating new SVG container");
        d3.select(graphWindow).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);
    }

    // Redraw the SVG selection to ensure the container exists
    const svgContainer = d3.select(graphWindow).select('svg');

    console.log("Drawing line with coordinates:");
    console.log(`Start: (${start.x}, ${start.y})`);
    console.log(`End: (${end.x}, ${end.y})`);

    svgContainer.append('line')
        .attr('x1', start.x)
        .attr('y1', start.y)
        .attr('x2', end.x)
        .attr('y2', end.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
}

// Get the center position of a component for arrow drawing
function getComponentCenterPosition(component) {
    const rect = component.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Cleanup after connection is done or cancelled
function cleanupAfterConnection() {
    connectionMode = false;
    startComponent?.classList.remove('selected');
    startComponent = null;
    endComponent = null;
}

// Cancelling the connection if the user right-clicks
function cancelConnection(event) {
    console.log("Right-click detected, cancelling connection.");
    cleanupAfterConnection();
}

// Handle right-click events to cancel ongoing connections
function cancelConnectionOnRightClick(event) {
    event.preventDefault();
    if (connectionMode) {
        console.log("Right-click detected, cancelling connection.");
        cleanupAfterConnection();
    }
}*/


/*// Assuming graphWindow is already declared in graph.js and accessible globally
let connectionMode = false;
let startComponent = null;
let endComponent = null;
let connections = []; // Array to store connections

// Add event listeners for left-clicking graph components to start and confirm connections
document.addEventListener('click', handleComponentClick);
document.addEventListener('contextmenu', cancelConnectionOnRightClick);

function handleComponentClick(event) {
    const clickedComponent = event.target.closest('.graph-component');

    if (connectionMode) {
        if (clickedComponent && clickedComponent !== startComponent) {
            // Second click to confirm connection
            endComponent = clickedComponent;
            console.log(`Second component clicked: ${endComponent.getAttribute('data-tooltip')}`);

            // Check if the connection already exists
            const connectionExists = connections.some(conn => {
                return (
                    (conn.start === startComponent && conn.end === endComponent) ||
                    (conn.start === endComponent && conn.end === startComponent)
                );
            });

            if (!connectionExists) {
                createArrowBetweenComponents(startComponent, endComponent);
                connections.push({ start: startComponent, end: endComponent });
            } else {
                console.log("Connection already exists. No new arrow drawn.");
            }
            
            cleanupAfterConnection();
        } else {
            console.log("Clicked outside. Cancelling connection.");
            cleanupAfterConnection();
        }
    } else if (clickedComponent) {
        // First click to start connection
        startComponent = clickedComponent;
        console.log(`First component clicked: ${startComponent.getAttribute('data-tooltip')}`);
        connectionMode = true;
        startComponent.classList.add('selected');
    }
}

function cancelConnectionOnRightClick(event) {
    if (connectionMode) {
        console.log("Right-click detected, cancelling connection.");
        cleanupAfterConnection();
    }
}

function createArrowBetweenComponents(startComponent, endComponent) {
    console.log(`Creating an arrow between: ${startComponent.getAttribute('data-tooltip')} and ${endComponent.getAttribute('data-tooltip')}`);

    const startPos = getComponentCenterPosition(startComponent);
    const endPos = getComponentCenterPosition(endComponent);

    console.log(`Start Component Position: (${startPos.x}, ${startPos.y})`);
    console.log(`End Component Position: (${endPos.x}, ${endPos.y})`);

    const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
    const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

    console.log(`Relative Start: (${relativeStart.x}, ${relativeStart.y}), Relative End: (${relativeEnd.x}, ${relativeEnd.y})`);

    const line = drawArrow(relativeStart, relativeEnd);

    // Store the arrow for future reference and updating
    connections.push({ start: startComponent, end: endComponent, line });

    // Add drag event listeners to keep the arrow attached when components are dragged
    makeArrowFollowComponents(startComponent, endComponent, line);
}

// Function to draw an arrow between two components
function drawArrow(start, end) {
    const svg = d3.select(graphWindow).select('svg');
    if (svg.empty()) {
        console.log("Creating new SVG container with arrowhead marker");
        d3.select(graphWindow).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .append('defs') // Define arrowhead in the SVG defs section
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 7)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 Z') // This defines a triangular arrowhead
            .attr('fill', 'black'); // Set arrowhead color
    }

    const svgContainer = d3.select(graphWindow).select('svg');

    console.log("Drawing line with coordinates:");
    console.log(`Start: (${start.x}, ${start.y})`);
    console.log(`End: (${end.x}, ${end.y})`);

    return svgContainer.append('line')
        .attr('x1', start.x)
        .attr('y1', start.y)
        .attr('x2', end.x)
        .attr('y2', end.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)'); // Attach the arrowhead at the end of the line
}


// Function to make the arrow follow the components while dragging
function makeArrowFollowComponents(startComponent, endComponent, line) {
    const updateLinePosition = () => {
        const startPos = getComponentCenterPosition(startComponent);
        const endPos = getComponentCenterPosition(endComponent);

        const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
        const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

        line
            .attr('x1', relativeStart.x)
            .attr('y1', relativeStart.y)
            .attr('x2', relativeEnd.x)
            .attr('y2', relativeEnd.y);
    };

    // Bind the dragging event to update the arrow's position
    startComponent.addEventListener('mousemove', updateLinePosition);
    endComponent.addEventListener('mousemove', updateLinePosition);
}

// Get the center position of a component for arrow drawing
function getComponentCenterPosition(component) {
    const rect = component.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Cleanup after connection is done or cancelled
function cleanupAfterConnection() {
    connectionMode = false;
    startComponent?.classList.remove('selected');
    startComponent = null;
    endComponent = null;
}*/


/*// Assuming graphWindow is already declared in graph.js and accessible globally
let connectionMode = false;
let startComponent = null;
let endComponent = null;
let connections = []; // Array to store connections

// Disable new component adding while building a connection
function disableComponentAdding() {
    const components = document.querySelectorAll('.component');
    components.forEach(comp => comp.style.pointerEvents = 'none');
}

// Re-enable adding new components
function enableComponentAdding() {
    const components = document.querySelectorAll('.component');
    components.forEach(comp => comp.style.pointerEvents = 'auto');
}

// Initialize the "Build Connection" process
function initiateBuildConnection() {
    // Disable adding new components
    disableComponentAdding();

    // Enter connection mode
    connectionMode = true;
    console.log("Connection mode enabled. Select two components to connect.");
}

// Add event listeners to the components to detect clicks for connection
document.addEventListener('click', handleComponentClick);

// Handle component clicks for building connections
function handleComponentClick(event) {
    if (!connectionMode) return; // Only handle clicks in connection mode

    const clickedComponent = event.target.closest('.graph-component');

    if (clickedComponent && !startComponent) {
        // First component clicked to start connection
        startComponent = clickedComponent;
        console.log(`First component clicked: ${startComponent.getAttribute('data-tooltip')}`);
        startComponent.classList.add('selected'); // Highlight the selected component
    } else if (clickedComponent && clickedComponent !== startComponent) {
        // Second component clicked to establish connection
        endComponent = clickedComponent;
        console.log(`Second component clicked: ${endComponent.getAttribute('data-tooltip')}`);

        // Prevent multiple connections between the same components
        const connectionExists = connections.some(conn => {
            return (
                (conn.start === startComponent && conn.end === endComponent) ||
                (conn.start === endComponent && conn.end === startComponent)
            );
        });

        if (connectionExists) {
            console.log("Connection already exists between these two components. No new arrow created.");
        } else {
            // Create arrow connection between the two components
            createConnection(startComponent, endComponent);
        }
        
        // Reset connection mode
        cleanupAfterConnection();
    }
}

// Function to create an arrow connection between two components
function createConnection(startComponent, endComponent) {
    if (!startComponent || !endComponent) {
        console.log("Invalid start or end component. Cannot create a connection.");
        return;
    }

    console.log(`Creating an arrow between: ${startComponent.getAttribute('data-tooltip')} and ${endComponent.getAttribute('data-tooltip')}`);

    const startPos = getComponentCenterPosition(startComponent);
    const endPos = getComponentCenterPosition(endComponent);

    console.log(`Start Component Position: (${startPos.x}, ${startPos.y})`);
    console.log(`End Component Position: (${endPos.x}, ${endPos.y})`);

    const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
    const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

    console.log(`Relative Start: (${relativeStart.x}, ${relativeStart.y}), Relative End: (${relativeEnd.x}, ${relativeEnd.y})`);

    const line = drawArrow(relativeStart, relativeEnd);

    // Store the arrow for future reference and updating
    connections.push({ start: startComponent, end: endComponent, line });

    // Add drag event listeners to keep the arrow attached when components are dragged
    makeArrowFollowComponents(startComponent, endComponent, line);
}

// Function to clean up after the connection is made
function cleanupAfterConnection() {
    connectionMode = false;
    startComponent?.classList.remove('selected');
    startComponent = null;
    endComponent = null;

    // Re-enable adding new components
    enableComponentAdding();
    console.log("Connection mode disabled.");
}

// Get the center position of a component for arrow drawing
function getComponentCenterPosition(component) {
    const rect = component.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Function to draw an arrow between two components
function drawArrow(start, end) {
    const svg = d3.select(graphWindow).select('svg');
    if (svg.empty()) {
        console.log("Creating new SVG container with arrowhead marker");
        d3.select(graphWindow).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .append('defs') // Define arrowhead in the SVG defs section
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 7)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 Z') // This defines a triangular arrowhead
            .attr('fill', 'black'); // Set arrowhead color
    }

    const svgContainer = d3.select(graphWindow).select('svg');

    console.log("Drawing line with coordinates:");
    console.log(`Start: (${start.x}, ${start.y})`);
    console.log(`End: (${end.x}, ${end.y})`);

    return svgContainer.append('line')
        .attr('x1', start.x)
        .attr('y1', start.y)
        .attr('x2', end.x)
        .attr('y2', end.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)'); // Attach the arrowhead at the end of the line
}

// Function to make the arrow follow the components while dragging
function makeArrowFollowComponents(startComponent, endComponent, line) {
    const updateLinePosition = () => {
        const startPos = getComponentCenterPosition(startComponent);
        const endPos = getComponentCenterPosition(endComponent);

        const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
        const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

        line
            .attr('x1', relativeStart.x)
            .attr('y1', relativeStart.y)
            .attr('x2', relativeEnd.x)
            .attr('y2', relativeEnd.y);
    };

    // Bind the dragging event to update the arrow's position
    startComponent.addEventListener('mousemove', updateLinePosition);
    endComponent.addEventListener('mousemove', updateLinePosition);
}

// Event listener for the "Build Connection" button
document.getElementById('build-connection').addEventListener('click', initiateBuildConnection);*/

/*// Assuming graphWindow is already declared in graph.js and accessible globally
let connectionMode = false;
let deleteMode = false;
let startComponent = null;
let endComponent = null;
let connections = []; // Array to store connections

// Disable new component adding while building a connection
function disableComponentAdding() {
    const components = document.querySelectorAll('.component');
    components.forEach(comp => comp.style.pointerEvents = 'none');
}

// Re-enable adding new components
function enableComponentAdding() {
    const components = document.querySelectorAll('.component');
    components.forEach(comp => comp.style.pointerEvents = 'auto');
}

// Initialize the "Build Connection" process
function initiateBuildConnection() {
    // Disable adding new components
    disableComponentAdding();

    // Change the button color to red to indicate an ongoing process
    const buildConnectionButton = document.getElementById('build-connection');
    buildConnectionButton.style.backgroundColor = 'red';
    buildConnectionButton.textContent = 'Building...';

    // Enter connection mode
    connectionMode = true;
    console.log("Connection mode enabled. Select two components to connect.");
}

// Initialize the "Delete" process
function initiateDelete() {
    // Disable adding new components
    disableComponentAdding();

    // Change the button color to red to indicate an ongoing process
    const deleteButton = document.getElementById('delete');
    deleteButton.style.backgroundColor = 'red';
    deleteButton.textContent = 'Deleting...';

    // Enter delete mode
    deleteMode = true;
    console.log("Delete mode enabled. Select a component to delete.");
}

// Add event listeners to the components to detect clicks for connection or deletion
document.addEventListener('click', handleComponentClick);

// Handle component clicks for building connections or deleting components
function handleComponentClick(event) {
    const clickedComponent = event.target.closest('.graph-component');

    if (connectionMode && clickedComponent && !startComponent) {
        // First component clicked to start connection
        startComponent = clickedComponent;
        console.log(`First component clicked: ${startComponent.getAttribute('data-tooltip')}`);
        startComponent.classList.add('selected'); // Highlight the selected component
    } else if (connectionMode && clickedComponent && clickedComponent !== startComponent) {
        // Second component clicked to establish connection
        endComponent = clickedComponent;
        console.log(`Second component clicked: ${endComponent.getAttribute('data-tooltip')}`);

        // Prevent multiple connections between the same components
        const connectionExists = connections.some(conn => {
            return (
                (conn.start === startComponent && conn.end === endComponent) ||
                (conn.start === endComponent && conn.end === startComponent)
            );
        });

        if (connectionExists) {
            console.log("Connection already exists between these two components. No new arrow created.");
        } else {
            // Create arrow connection between the two components
            createConnection(startComponent, endComponent);
        }

        // Reset connection mode
        cleanupAfterConnection();
    }

    // Handle delete mode
    if (deleteMode && clickedComponent) {
        console.log(`Component clicked for deletion: ${clickedComponent.getAttribute('data-tooltip')}`);
        deleteComponent(clickedComponent);
        cleanupAfterDelete();
    }
}

// Function to create an arrow connection between two components
function createConnection(startComponent, endComponent) {
    if (!startComponent || !endComponent) {
        console.log("Invalid start or end component. Cannot create a connection.");
        return;
    }

    console.log(`Creating an arrow between: ${startComponent.getAttribute('data-tooltip')} and ${endComponent.getAttribute('data-tooltip')}`);

    const startPos = getComponentCenterPosition(startComponent);
    const endPos = getComponentCenterPosition(endComponent);

    const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
    const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

    const line = drawArrow(relativeStart, relativeEnd);

    // Store the arrow for future reference and updating
    connections.push({ start: startComponent, end: endComponent, line });

    // Add drag event listeners to keep the arrow attached when components are dragged
    makeArrowFollowComponents(startComponent, endComponent, line);
}

// Function to delete a component and its associated connections
function deleteComponent(component) {
    // Remove the component from the DOM
    component.remove();

    // Filter out all connections associated with the component
    connections = connections.filter(conn => {
        if (conn.start === component || conn.end === component) {
            // Remove the arrow from the SVG
            conn.line.remove();
            return false;
        }
        return true;
    });

    console.log(`Deleted component and associated connections.`);
}

// Function to clean up after the connection is made
function cleanupAfterConnection() {
    connectionMode = false;
    startComponent?.classList.remove('selected');
    startComponent = null;
    endComponent = null;

    // Re-enable adding new components
    enableComponentAdding();

    // Revert the button color back to normal
    const buildConnectionButton = document.getElementById('build-connection');
    buildConnectionButton.style.backgroundColor = '#007BFF'; // Blue color
    buildConnectionButton.textContent = 'Build Connection';

    console.log("Connection mode disabled.");
}

// Function to clean up after the deletion is done
function cleanupAfterDelete() {
    deleteMode = false;

    // Re-enable adding new components
    enableComponentAdding();

    // Revert the button color back to normal
    const deleteButton = document.getElementById('delete');
    deleteButton.style.backgroundColor = '#007BFF'; // Blue color
    deleteButton.textContent = 'Delete';

    console.log("Delete mode disabled.");
}

// Get the center position of a component for arrow drawing
function getComponentCenterPosition(component) {
    const rect = component.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Function to draw an arrow between two components
function drawArrow(start, end) {
    const svg = d3.select(graphWindow).select('svg');
    if (svg.empty()) {
        d3.select(graphWindow).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .append('defs') // Define arrowhead in the SVG defs section
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 7)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 Z') // This defines a triangular arrowhead
            .attr('fill', 'black'); // Set arrowhead color
    }

    const svgContainer = d3.select(graphWindow).select('svg');

    return svgContainer.append('line')
        .attr('x1', start.x)
        .attr('y1', start.y)
        .attr('x2', end.x)
        .attr('y2', end.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)'); // Attach the arrowhead at the end of the line
}

// Function to make the arrow follow the components while dragging
function makeArrowFollowComponents(startComponent, endComponent, line) {
    const updateLinePosition = () => {
        const startPos = getComponentCenterPosition(startComponent);
        const endPos = getComponentCenterPosition(endComponent);

        const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
        const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

        line
            .attr('x1', relativeStart.x)
            .attr('y1', relativeStart.y)
            .attr('x2', relativeEnd.x)
            .attr('y2', relativeEnd.y);
    };

    // Bind the dragging event to update the arrow's position
    startComponent.addEventListener('mousemove', updateLinePosition);
    endComponent.addEventListener('mousemove', updateLinePosition);
}

// Event listener for the "Build Connection" button
document.getElementById('build-connection').addEventListener('click', initiateBuildConnection);

// Event listener for the "Delete" button
document.getElementById('delete').addEventListener('click', initiateDelete);*/


/*// Variables to track state
let connectionMode = false;
let deleteMode = false;
let startComponent = null;
let endComponent = null;
let connections = []; // Array to store connections

console.log("Script Loaded");

// Add event listeners for Build Connection and Delete buttons
document.getElementById('build-connection').addEventListener('click', () => {
    connectionMode = true;
    deleteMode = false;
    startComponent = null;
    endComponent = null;

    console.log("Build Connection Mode Enabled");

    // Disable component selection and update button text and color
    disableComponentSelection();
    document.getElementById('build-connection').textContent = 'Building...';  // Update text to indicate active mode
    document.getElementById('build-connection').style.backgroundColor = 'red';  // Change button color to red
    document.getElementById('delete').style.backgroundColor = '#007BFF';  // Reset delete button color

    // Attach click event listeners to components when in build mode
    document.querySelectorAll('.graph-component').forEach(component => {
        component.addEventListener('click', handleComponentClickForConnection);
    });
});

document.getElementById('delete').addEventListener('click', () => {
    deleteMode = true;
    connectionMode = false;
    startComponent = null;
    endComponent = null;

    console.log("Delete Mode Enabled");

    // Disable component selection and update button text and color
    disableComponentSelection();
    document.getElementById('delete').textContent = 'Deleting...';  // Update text to indicate active mode
    document.getElementById('delete').style.backgroundColor = 'red';  // Change button color to red
    document.getElementById('build-connection').style.backgroundColor = '#007BFF';  // Reset build connection button color
    document.getElementById('build-connection').textContent = 'Build Connection'; // Reset build button text

    // Attach click event listeners to components when in delete mode
    document.querySelectorAll('.graph-component').forEach(component => {
        component.addEventListener('click', handleComponentClickForDeletion);
    });
});

// Disable the component selection panel during connection/deletion mode
function disableComponentSelection() {
    const components = document.querySelectorAll('.component');
    components.forEach(comp => {
        comp.style.pointerEvents = 'none';
    });
    console.log("Component selection disabled.");
}

// Re-enable component selection after the operation is done
function enableComponentSelection() {
    const components = document.querySelectorAll('.component');
    components.forEach(comp => {
        comp.style.pointerEvents = 'auto';
    });
    console.log("Component selection enabled.");
}

// Handle click events on graph components for connection mode
function handleComponentClickForConnection(event) {
    const clickedComponent = event.target.closest('.graph-component');
    console.log("Component clicked for connection:", clickedComponent?.getAttribute('data-tooltip'));

    if (connectionMode) {
        handleConnection(clickedComponent);
    }
}

// Handle click events on graph components for deletion mode
function handleComponentClickForDeletion(event) {
    const clickedComponent = event.target.closest('.graph-component');
    console.log("Component clicked for deletion:", clickedComponent?.getAttribute('data-tooltip'));

    if (deleteMode) {
        handleDeletion(clickedComponent);
    }
}

// Handle connection process between components
function handleConnection(clickedComponent) {
    console.log("Handling connection...");

    if (!startComponent) {
        startComponent = clickedComponent;
        startComponent.classList.add('selected');
        console.log("Start Component Selected:", startComponent.getAttribute('data-tooltip'));
    } else if (clickedComponent !== startComponent) {
        endComponent = clickedComponent;
        console.log("End Component Selected:", endComponent.getAttribute('data-tooltip'));

        // Prevent duplicate connections
        const connectionExists = connections.some(conn => 
            (conn.start === startComponent && conn.end === endComponent) ||
            (conn.start === endComponent && conn.end === startComponent)
        );

        if (!connectionExists) {
            console.log("Creating new arrow connection.");
            createArrowBetweenComponents(startComponent, endComponent);
            connections.push({ start: startComponent, end: endComponent });
        } else {
            console.log("Connection already exists.");
        }

        cleanupAfterConnection();
    } else {
        console.log("Clicked on the same component, nothing happens.");
    }
}

// Handle component deletion and associated arrows
function handleDeletion(clickedComponent) {
    console.log("Deleting component:", clickedComponent.getAttribute('data-tooltip'));
    deleteComponentAndConnections(clickedComponent);
    cleanupAfterDelete();
}

// Function to create the arrow between components at their edges
function createArrowBetweenComponents(startComponent, endComponent) {
    console.log(`Creating an arrow between: ${startComponent.getAttribute('data-tooltip')} and ${endComponent.getAttribute('data-tooltip')}`);

    const startPos = getComponentEdgePosition(startComponent, endComponent);
    const endPos = getComponentEdgePosition(endComponent, startComponent);

    console.log(`Start Component Position: (${startPos.x}, ${startPos.y})`);
    console.log(`End Component Position: (${endPos.x}, ${endPos.y})`);

    const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
    const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

    console.log(`Drawing arrow from (${relativeStart.x}, ${relativeStart.y}) to (${relativeEnd.x}, ${relativeEnd.y})`);

    const line = drawArrow(relativeStart, relativeEnd);

    connections.push({ start: startComponent, end: endComponent, line });

    makeArrowFollowComponents(startComponent, endComponent, line);
}

// Function to calculate component edge positions
function getComponentEdgePosition(component, targetComponent) {
    const rect = component.getBoundingClientRect();
    const targetRect = targetComponent.getBoundingClientRect();

    const componentCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };

    const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2
    };

    const angle = Math.atan2(targetCenter.y - componentCenter.y, targetCenter.x - componentCenter.x);
    const radius = rect.width / 2;

    const edgeX = componentCenter.x + radius * Math.cos(angle);
    const edgeY = componentCenter.y + radius * Math.sin(angle);

    console.log(`Component Edge Position: (${edgeX}, ${edgeY})`);

    return { x: edgeX, y: edgeY };
}

// Function to draw an arrow
function drawArrow(start, end) {
    const svg = d3.select(graphWindow).select('svg');
    if (svg.empty()) {
        console.log("Creating new SVG container with arrowhead marker");
        d3.select(graphWindow).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 7)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
            .attr('fill', 'black');
    }

    const svgContainer = d3.select(graphWindow).select('svg');

    console.log("Drawing arrow on SVG.");

    return svgContainer.append('line')
        .attr('x1', start.x)
        .attr('y1', start.y)
        .attr('x2', end.x)
        .attr('y2', end.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
}

// Function to make the arrow follow the components while dragging
function makeArrowFollowComponents(startComponent, endComponent, line) {
    const updateLinePosition = () => {
        const startPos = getComponentEdgePosition(startComponent, endComponent);
        const endPos = getComponentEdgePosition(endComponent, startComponent);

        const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
        const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

        line
            .attr('x1', relativeStart.x)
            .attr('y1', relativeStart.y)
            .attr('x2', relativeEnd.x)
            .attr('y2', relativeEnd.y);

        console.log("Arrow position updated to follow components.");
    };

    startComponent.addEventListener('mousemove', updateLinePosition);
    endComponent.addEventListener('mousemove', updateLinePosition);
}

// Function to delete a component and its connections
function deleteComponentAndConnections(component) {
    console.log(`Deleting component: ${component.getAttribute('data-tooltip')}`);

    connections = connections.filter(conn => {
        if (conn.start === component || conn.end === component) {
            conn.line.remove();
            return false;
        }
        return true;
    });

    component.remove();
    console.log("Deleted component and its connections.");
}

// Cleanup after connection creation
function cleanupAfterConnection() {
    connectionMode = false;
    startComponent.classList.remove('selected');
    startComponent = null;
    endComponent = null;
    document.getElementById('build-connection').textContent = 'Build Connection';
    document.getElementById('build-connection').style.backgroundColor = '#007BFF';
    enableComponentSelection();

    console.log("Connection creation cleaned up.");
}

// Cleanup after deletion is done
function cleanupAfterDelete() {
    deleteMode = false;
    document.getElementById('delete').style.backgroundColor = '#007BFF';
    document.getElementById('delete').textContent = 'Delete';
    enableComponentSelection();
    console.log("Delete mode cleaned up.");
}*/


let buildMode = false;
let deleteMode = false;
let startComponent = null;
let endComponent = null;
let connections = [];

// Function to handle build connection button click
document.getElementById('build-connection').addEventListener('click', function () {
    buildMode = true;
    deleteMode = false;
    disableComponentSelection(); // Disable adding new components while building connections
    document.getElementById('build-connection').textContent = 'Building...';
    document.getElementById('build-connection').style.backgroundColor = 'red'; // Change button color during operation
    console.log('Build Connection Mode Enabled');
});

// Function to handle delete button click
document.getElementById('delete').addEventListener('click', function () {
    deleteMode = true;
    buildMode = false;
    disableComponentSelection(); // Disable adding new components while deleting
    document.getElementById('delete').textContent = 'Deleting...';
    document.getElementById('delete').style.backgroundColor = 'red'; // Change button color during operation
    console.log('Delete Mode Enabled');
});

// Function to disable component selection while in build or delete mode
function disableComponentSelection() {
    document.querySelectorAll('.component').forEach(component => {
        component.style.pointerEvents = 'none';
    });
    console.log('Component selection disabled.');
}

// Function to enable component selection after build or delete mode
function enableComponentSelection() {
    document.querySelectorAll('.component').forEach(component => {
        component.style.pointerEvents = 'auto';
    });
    console.log('Component selection enabled.');
}

// Handle click events for building connections and deletion
document.getElementById('graph-window').addEventListener('click', function (event) {
    if (buildMode) {
        handleComponentClickForConnection(event);
    } else if (deleteMode) {
        handleComponentClickForDeletion(event);
    }
});

// Handle click events on graph components for building connections
function handleComponentClickForConnection(event) {
    const clickedComponent = event.target.closest('.graph-component');
    if (!clickedComponent) {
        console.log("Clicked outside, cancelling connection.");
        cleanupAfterConnection();
        return;
    }

    if (!startComponent) {
        // First click selects the start component
        startComponent = clickedComponent;
        startComponent.classList.add('selected');
        console.log("First component selected:", startComponent.getAttribute('data-tooltip'));
    } else {
        // Second click selects the end component
        endComponent = clickedComponent;
        if (startComponent === endComponent) {
            console.log("Cannot connect a component to itself. Cancelling.");
            cleanupAfterConnection();
            return;
        }
        console.log("Second component selected:", endComponent.getAttribute('data-tooltip'));

        // Check if the connection already exists in the specified direction
        const connectionExists = connections.some(conn => {
            return (conn.start === startComponent && conn.end === endComponent);
        });

        if (!connectionExists) {
            createArrowBetweenComponents(startComponent, endComponent);
            connections.push({ start: startComponent, end: endComponent });
            console.log("Connection created.");
        } else {
            console.log("Connection already exists in this direction. No new arrow drawn.");
        }
        cleanupAfterConnection();
    }
}

// Handle click events on graph components for deletion mode
function handleComponentClickForDeletion(event) {
    const clickedComponent = event.target.closest('.graph-component');
    console.log("Component clicked for deletion:", clickedComponent?.getAttribute('data-tooltip'));

    if (deleteMode && clickedComponent) {
        handleDeletion(clickedComponent);
    }
}

// Handle component deletion and associated arrows
function handleDeletion(clickedComponent) {
    console.log("Deleting component:", clickedComponent.getAttribute('data-tooltip'));

    // Remove all connections associated with the component
    deleteComponentAndConnections(clickedComponent);

    // After deletion, clean up the delete mode
    cleanupAfterDelete();
}

// Function to delete a component and its connections
function deleteComponentAndConnections(component) {
    // Filter out and remove all connections associated with the component
    connections = connections.filter(conn => {
        if (conn.start === component || conn.end === component) {
            console.log(`Deleting connection between ${conn.start?.getAttribute('data-tooltip')} and ${conn.end?.getAttribute('data-tooltip')}`);
            
            // Check if the connection's line exists before trying to remove it
            if (conn.line) {
                conn.line.remove();  // Remove the SVG line (arrow)
            }
            
            return false;  // Remove this connection from the list
        }
        return true;  // Keep the connection if not associated with the component
    });

    // Check if the component exists before trying to remove it
    if (component) {
        component.remove();
        console.log(`Component ${component.getAttribute('data-tooltip')} deleted.`);
    }
}


// Cleanup after connection is created or cancelled
function cleanupAfterConnection() {
    buildMode = false;
    startComponent?.classList.remove('selected');
    startComponent = null;
    endComponent = null;

    // Reset the button text and color
    document.getElementById('build-connection').textContent = 'Build Connection';
    document.getElementById('build-connection').style.backgroundColor = '#28a745';
    enableComponentSelection();
    console.log("Connection mode cleaned up.");
}

// Cleanup after deletion is done
function cleanupAfterDelete() {
    deleteMode = false;
    startComponent = null;
    endComponent = null;

    // Reset the button text and color
    document.getElementById('delete').textContent = 'Delete Component';
    document.getElementById('delete').style.backgroundColor = '#28a745';
    
    enableComponentSelection();
    console.log("Delete mode cleaned up.");
}

// Function to create an arrow between two components
function createArrowBetweenComponents(startComponent, endComponent) {
    console.log(`Creating an arrow between: ${startComponent.getAttribute('data-tooltip')} and ${endComponent.getAttribute('data-tooltip')}`);

    const startPos = getComponentCircumferencePosition(startComponent, endComponent);
    const endPos = getComponentCircumferencePosition(endComponent, startComponent);

    const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
    const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

    const line = drawArrow(relativeStart, relativeEnd);

    // Store the arrow for future reference and updating
    connections.push({ start: startComponent, end: endComponent, line });

    // Add drag event listeners to keep the arrow attached when components are dragged
    makeArrowFollowComponents(startComponent, endComponent, line);
}

// Function to draw an arrow between two components
function drawArrow(start, end) {
    const svg = d3.select(graphWindow).select('svg');
    if (svg.empty()) {
        d3.select(graphWindow).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 7)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
            .attr('fill', 'black');
    }

    const svgContainer = d3.select(graphWindow).select('svg');

    return svgContainer.append('line')
        .attr('x1', start.x)
        .attr('y1', start.y)
        .attr('x2', end.x)
        .attr('y2', end.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
}

// Function to calculate the circumference position based on angle
function getComponentCircumferencePosition(component, targetComponent) {
    const rect = component.getBoundingClientRect();
    const targetRect = targetComponent.getBoundingClientRect();
    const dx = targetRect.left - rect.left;
    const dy = targetRect.top - rect.top;
    const angle = Math.atan2(dy, dx);
    const radius = rect.width / 2; // Assuming the component is circular

    return {
        x: rect.left + radius + radius * Math.cos(angle),
        y: rect.top + radius + radius * Math.sin(angle)
    };
}

// Function to make the arrow follow the components while dragging
function makeArrowFollowComponents(startComponent, endComponent, line) {
    const updateLinePosition = () => {
        const startPos = getComponentCircumferencePosition(startComponent, endComponent);
        const endPos = getComponentCircumferencePosition(endComponent, startComponent);

        const relativeStart = { x: startPos.x - graphWindow.getBoundingClientRect().left, y: startPos.y - graphWindow.getBoundingClientRect().top };
        const relativeEnd = { x: endPos.x - graphWindow.getBoundingClientRect().left, y: endPos.y - graphWindow.getBoundingClientRect().top };

        line
            .attr('x1', relativeStart.x)
            .attr('y1', relativeStart.y)
            .attr('x2', relativeEnd.x)
            .attr('y2', relativeEnd.y);
    };

    startComponent.addEventListener('mousemove', updateLinePosition);
    endComponent.addEventListener('mousemove', updateLinePosition);
}
