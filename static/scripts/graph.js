/*// Select the main window where components will be placed
const graphWindow = document.getElementById('graph-window');

// Add event listeners to each component in the component panel
const components = document.querySelectorAll('.component');

components.forEach(component => {
    component.addEventListener('click', function() {
        // Get the component's ID, tooltip (name), and background color
        const componentId = this.id;
        const componentName = this.getAttribute('data-tooltip');
        const componentColor = window.getComputedStyle(this).backgroundColor;

        // Create a new component in the main window
        createComponentInGraphWindow(componentId, componentName, componentColor);
    });
});

function createComponentInGraphWindow(componentId, componentName, componentColor) {
    // Create a div for the component
    const newComponent = document.createElement('div');
    newComponent.classList.add('graph-component');  // Add a class for styling
    newComponent.setAttribute('data-tooltip', componentName);  // For displaying tooltip
    newComponent.style.backgroundColor = componentColor;  // Set the color to match the left panel

    // Set the content (icon) for the new component
    switch (componentId) {
        case 'load_balancer':
            newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
            break;
        case 'server':
            newComponent.innerHTML = '<i class="fas fa-server"></i>';
            break;
        case 'client':
            newComponent.innerHTML = '<i class="fas fa-user"></i>';
            break;
        case 'cache':
            newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
            break;
        case 'database':
            newComponent.innerHTML = '<i class="fas fa-database"></i>';
            break;
        case 'aws':
            newComponent.innerHTML = '<i class="fab fa-aws"></i>';
            break;
        default:
            return;  // Exit if the component ID is unrecognized
    }

    // Create a label to show the name of the component
    const label = document.createElement('span');
    label.innerText = componentName;
    label.style.position = 'absolute';  // Position label outside the circle
    label.style.top = '70px';  // Slightly below the component
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';  // Center it horizontally
    label.style.fontWeight = 'bold';  // Make text bold
    label.style.color = 'black';  // Black color for better contrast
    label.style.fontSize = '14px';  // Slightly larger text

    // Add the label below the component
    newComponent.appendChild(label);

    // Add draggable functionality
    newComponent.style.position = 'absolute';  // Absolute positioning
    const componentSize = 60; // Size of the component
    newComponent.style.top = getRandomPosition(graphWindow.offsetHeight, componentSize) + 'px';  // Random top position
    newComponent.style.left = getRandomPosition(graphWindow.offsetWidth, componentSize) + 'px';  // Random left position
    makeDraggable(newComponent);  // Make the component draggable

    // Append the component to the main window
    graphWindow.appendChild(newComponent);
}

// Function to make the component draggable
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
    
        // Calculate new positions
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        // Get current component dimensions and position
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
    
        // Get the boundaries of the main window
        const windowWidth = graphWindow.offsetWidth;
        const windowHeight = graphWindow.offsetHeight;
        
        // Get the height of the black input bar (bottom bar)
        const bottomBarHeight = document.querySelector('.input-bar').offsetHeight;
    
        // Calculate new top and left positions, ensuring the component stays inside the main window
        let newTop = element.offsetTop - offsetY;
        let newLeft = element.offsetLeft - offsetX;
    
        // Boundary checks to prevent dragging outside the main window
        if (newTop < 0) newTop = 0; // Prevent moving above the top boundary
        if (newLeft < 0) newLeft = 0; // Prevent moving to the left of the boundary
        if (newTop + elementHeight > windowHeight - bottomBarHeight) newTop = windowHeight - bottomBarHeight - elementHeight; // Prevent moving below the black line
        if (newLeft + elementWidth > windowWidth) newLeft = windowWidth - elementWidth; // Prevent moving beyond the right boundary
    
        // Apply the new top and left values
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }
        

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function to generate a random position, ensuring it stays within the main window
function getRandomPosition(max, elementSize) {
    return Math.floor(Math.random() * (max - elementSize - 20)) + 10;
}*/


/*// Select the main window where components will be placed
const graphWindow = document.getElementById('graph-window');

// Add event listeners to each component in the component panel
const components = document.querySelectorAll('.component');

components.forEach(component => {
    component.addEventListener('click', function() {
        // Get the component's ID, tooltip (name), and background color
        const componentId = this.id;
        const componentName = this.getAttribute('data-tooltip');
        const componentColor = window.getComputedStyle(this).backgroundColor;

        // Create a new component in the main window
        createComponentInGraphWindow(componentId, componentName, componentColor);
    });
});

function createComponentInGraphWindow(componentId, componentName, componentColor) {
    // Create a div for the component
    const newComponent = document.createElement('div');
    newComponent.classList.add('graph-component');  // Add a class for styling
    newComponent.setAttribute('data-tooltip', componentName);  // For displaying tooltip
    newComponent.style.backgroundColor = componentColor;  // Set the color to match the left panel

    // Set the content (icon) for the new component
    switch (componentId) {
        case 'load_balancer':
            newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
            break;
        case 'server':
            newComponent.innerHTML = '<i class="fas fa-server"></i>';
            break;
        case 'client':
            newComponent.innerHTML = '<i class="fas fa-user"></i>';
            break;
        case 'cache':
            newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
            break;
        case 'database':
            newComponent.innerHTML = '<i class="fas fa-database"></i>';
            break;
        case 'aws':
            newComponent.innerHTML = '<i class="fab fa-aws"></i>';
            break;
        default:
            return;  // Exit if the component ID is unrecognized
    }

    // Create a label to show the name of the component
    const label = document.createElement('span');
    label.innerText = componentName;
    label.style.position = 'absolute';  // Position label outside the circle
    label.style.top = '70px';  // Slightly below the component
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';  // Center it horizontally
    label.style.fontWeight = 'bold';  // Make text bold
    label.style.color = 'black';  // Black color for better contrast
    label.style.fontSize = '14px';  // Slightly larger text

    // Add the label below the component
    newComponent.appendChild(label);

    // Add draggable functionality
    newComponent.style.position = 'absolute';  // Absolute positioning
    const componentSize = 60; // Size of the component
    const labelHeight = 30; // Approximate height of the label
    const bottomBarHeight = document.querySelector('.input-bar').offsetHeight; // Get the height of the bottom bar

    // Ensure the component and label appear within the correct boundaries (considering the bottom bar and label height)
    const maxTop = graphWindow.offsetHeight - componentSize - labelHeight - bottomBarHeight;
    const maxLeft = graphWindow.offsetWidth - componentSize;

    newComponent.style.top = getRandomPosition(maxTop, componentSize) + 'px';  // Random top position with boundaries
    newComponent.style.left = getRandomPosition(maxLeft, componentSize) + 'px';  // Random left position with boundaries

    makeDraggable(newComponent);  // Make the component draggable

    // Append the component to the main window
    graphWindow.appendChild(newComponent);
}

// Function to make the component draggable
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
    
        // Calculate new positions
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        // Get current component dimensions and position
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const labelHeight = 30; // Approximate height of the label
    
        // Get the boundaries of the main window
        const windowWidth = graphWindow.offsetWidth;
        const windowHeight = graphWindow.offsetHeight;
        
        // Get the height of the black input bar (bottom bar)
        const bottomBarHeight = document.querySelector('.input-bar').offsetHeight;
    
        // Calculate new top and left positions, ensuring the component stays inside the main window
        let newTop = element.offsetTop - offsetY;
        let newLeft = element.offsetLeft - offsetX;
    
        // Boundary checks to prevent dragging outside the main window (considering the label)
        if (newTop < 0) newTop = 0; // Prevent moving above the top boundary
        if (newLeft < 0) newLeft = 0; // Prevent moving to the left of the boundary
        if (newTop + elementHeight + labelHeight > windowHeight - bottomBarHeight) newTop = windowHeight - bottomBarHeight - elementHeight - labelHeight; // Prevent moving below the black line
        if (newLeft + elementWidth > windowWidth) newLeft = windowWidth - elementWidth; // Prevent moving beyond the right boundary
    
        // Apply the new top and left values
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }
        
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function to generate a random position, ensuring it stays within the main window
function getRandomPosition(max, elementSize) {
    return Math.floor(Math.random() * (max - elementSize - 20)) + 10;
}*/


// Select the main window where components will be placed
const graphWindow = document.getElementById('graph-window');

// Add event listeners to each component in the component panel
const components = document.querySelectorAll('.component');



components.forEach(component => {
    component.addEventListener('click', function() {
        createComponent(this);
    });
});

function createComponent(component, name = null) {
    // Get the component's ID, tooltip (name), and background color
    const componentId = component.id;
    const componentName = name || component.getAttribute('data-tooltip');
    const componentColor = window.getComputedStyle(component).backgroundColor;

    // Create a new component in the main window
    createComponentInGraphWindow(componentId, componentName, componentColor);
}

function createComponentInGraphWindow(componentId, componentName, componentColor) {
    // Create a div for the component
    const newComponent = document.createElement('div');
    newComponent.classList.add('graph-component');  // Add a class for styling
    newComponent.setAttribute('data-tooltip', componentName);  // For displaying tooltip
    newComponent.setAttribute('name', componentName);
    newComponent.style.backgroundColor = componentColor;  // Set the color to match the left panel

    // Set the content (icon) for the new component
    switch (componentId) {
        case 'load_balancer':
            newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
            break;
        case 'server':
            newComponent.innerHTML = '<i class="fas fa-server"></i>';
            break;
        case 'client':
            newComponent.innerHTML = '<i class="fas fa-user"></i>';
            break;
        case 'cache':
            newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
            break;
        case 'database':
            newComponent.innerHTML = '<i class="fas fa-database"></i>';
            break;
        case 'aws':
            newComponent.innerHTML = '<i class="fab fa-aws"></i>';
            break;
            case 'api_gateway':
                newComponent.innerHTML = '<i class="fa-solid fa-code"></i>';
                break;
            case 'msg_queue':
                newComponent.innerHTML = '<i class="fa-solid fa-message"></i>';
                break;
            case 'cdn':
                newComponent.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> <i class="fa-solid fa-cloud-download-alt"></i>';
                break;
            case 'dns':
                newComponent.innerHTML = '<i class="fas fa-globe"></i><i class="fas fa-address-book"></i>';
                break;
            case 'firewall':
                newComponent.innerHTML = '<i class="fas fa-shield-halved"></i><i class="fas fa-fire"></i>';
                break;
            case 'aths':
                newComponent.innerHTML = '<i class="fas fa-server"></i><i class="fas fa-user"></i>';
                break;
        default:
            return;  // Exit if the component ID is unrecognized
    }

    // Create a label to show the name of the component
    const label = document.createElement('span');
    label.innerText = componentName;
    label.style.position = 'absolute';  // Position label outside the circle
    label.style.top = '70px';  // Slightly below the component
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';  // Center it horizontally
    label.style.fontWeight = 'bold';  // Make text bold
    label.style.color = 'black';  // Black color for better contrast
    label.style.fontSize = '14px';  // Slightly larger text

    // Add the label below the component
    newComponent.appendChild(label);

    // Add draggable functionality
    newComponent.style.position = 'absolute';  // Absolute positioning
    const componentSize = 60; // Size of the component
    const labelHeight = 30; // Approximate height of the label
    const bottomBarHeight = document.querySelector('.input-bar').offsetHeight; // Get the height of the bottom bar

    // Ensure the component and label appear within the correct boundaries (considering the bottom bar and label height)
    const maxTop = graphWindow.offsetHeight - componentSize - labelHeight - bottomBarHeight;
    const maxLeft = graphWindow.offsetWidth - componentSize;

    let top = getRandomPosition(maxTop, componentSize);
    let left = getRandomPosition(maxLeft, componentSize);

    // Ensure no overlap when placing
    while (isOverlapping(newComponent, top, left)) {
        top = getRandomPosition(maxTop, componentSize);
        left = getRandomPosition(maxLeft, componentSize);
    }

    newComponent.style.top = top + 'px';
    newComponent.style.left = left + 'px';

    makeDraggable(newComponent);  // Make the component draggable

    // Append the component to the main window
    graphWindow.appendChild(newComponent);
}

// Function to make the component draggable
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();

        // Calculate new positions
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Get current component dimensions and position
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const labelHeight = 30; // Approximate height of the label

        // Get the boundaries of the main window
        const windowWidth = graphWindow.offsetWidth;
        const windowHeight = graphWindow.offsetHeight;
        
        // Get the height of the black input bar (bottom bar)
        const bottomBarHeight = document.querySelector('.input-bar').offsetHeight;

        // Calculate new top and left positions, ensuring the component stays inside the main window
        let newTop = element.offsetTop - offsetY;
        let newLeft = element.offsetLeft - offsetX;

        // Boundary checks to prevent dragging outside the main window (considering the label)
        if (newTop < 0) newTop = 0; // Prevent moving above the top boundary
        if (newLeft < 0) newLeft = 0; // Prevent moving to the left of the boundary
        if (newTop + elementHeight + labelHeight > windowHeight - bottomBarHeight) newTop = windowHeight - bottomBarHeight - elementHeight - labelHeight; // Prevent moving below the black line
        if (newLeft + elementWidth > windowWidth) newLeft = windowWidth - elementWidth; // Prevent moving beyond the right boundary

        // Update the element's position temporarily to check for overlaps
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";

        // If the new position causes overlap, revert the position
        if (isOverlapping(element, newTop, newLeft)) {
            element.style.top = (element.offsetTop + offsetY) + "px";
            element.style.left = (element.offsetLeft + offsetX) + "px";
        }
    }
        
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function to check if a component is overlapping with others
function isOverlapping(newElement, top, left) {
    const existingComponents = document.querySelectorAll('.graph-component');
    const newRect = {
        top: top,
        left: left,
        bottom: top + newElement.offsetHeight,
        right: left + newElement.offsetWidth
    };

    for (let i = 0; i < existingComponents.length; i++) {
        const component = existingComponents[i];
        if (component === newElement) continue; // Skip the element itself

        const rect = {
            top: component.offsetTop,
            left: component.offsetLeft,
            bottom: component.offsetTop + component.offsetHeight,
            right: component.offsetLeft + component.offsetWidth
        };

        // Check if the rectangles overlap
        if (
            newRect.left < rect.right &&
            newRect.right > rect.left &&
            newRect.top < rect.bottom &&
            newRect.bottom > rect.top
        ) {
            return true; // Overlap detected
        }
    }
    return false; // No overlap
}

// Function to generate a random position, ensuring it stays within the main window
function getRandomPosition(max, elementSize) {
    return Math.floor(Math.random() * (max - elementSize - 20)) + 10;
}
