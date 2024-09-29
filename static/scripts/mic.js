/*// Check if the browser supports the Web Speech API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let micButton = document.getElementById('mic-button');
let stopButton = null;
let isRecording = false;

// Initialize Speech Recognition
if (window.SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = true; // Get real-time text as the user speaks
    recognition.continuous = true; // Continuous recognition

    recognition.onresult = function (event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        // Append the recognized speech to the textarea
        document.getElementById('user-input').value = transcript;
    };

    recognition.onend = function () {
        if (isRecording) {
            recognition.start(); // Restart recognition if it was stopped accidentally
        }
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        stopRecording(); // Stop recording on error
    };
} else {
    alert('Sorry, your browser does not support speech recognition.');
}

// Function to start recording
function startRecording() {
    if (recognition && !isRecording) {
        recognition.start();
        isRecording = true;
        micButton.textContent = 'Recording...';

        // Create and show the Stop button next to mic button
        stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.style.backgroundColor = 'red';
        stopButton.style.marginLeft = '10px';
        stopButton.onclick = stopRecording;
        micButton.parentElement.appendChild(stopButton);
    }
}

// Function to stop recording
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        micButton.textContent = '🎤';

        // Remove the Stop button
        if (stopButton) {
            stopButton.remove();
            stopButton = null;
        }
    }
}

// Event listener to start recording on mic button click
micButton.addEventListener('click', startRecording);*/

// Check if the browser supports the Web Speech API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let micButton = document.getElementById('mic-button');
let stopButton = document.getElementById('stop-button');
let isRecording = false;

// Initialize Speech Recognition
if (window.SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = true; // Get real-time text as the user speaks
    recognition.continuous = true; // Continuous recognition

    recognition.onresult = function (event) {
        let transcript = '';
        let isFinal = false;  // Flag to check if it's the final result

        // Loop through the results and append only final results to textarea
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript = event.results[i][0].transcript;
            isFinal = event.results[i].isFinal;  // Check if the result is final
        }

        if (isFinal) {
            // Append only the final result to the textarea
            const textArea = document.getElementById('user-input');
            textArea.value += transcript + ' ';  // Add space between words
        }
    };

    recognition.onend = function () {
        if (isRecording) {
            recognition.start(); // Restart recognition if it was stopped accidentally
        }
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        stopRecording(); // Stop recording on error
    };
} else {
    alert('Sorry, your browser does not support speech recognition.');
}

// Function to start recording
function startRecording() {
    if (recognition && !isRecording) {
        recognition.start();
        isRecording = true;
        micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';

        // Create and show the Stop button next to mic button
        stopButton = document.createElement('button');
        stopButton.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        stopButton.style.backgroundColor = 'red';
        stopButton.onclick = stopRecording;
        micButton.parentElement.appendChild(stopButton);
    }
}

// Function to stop recording
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';

        // Remove the Stop button
        if (stopButton) {
            stopButton.remove();
            stopButton = null;
        }
    }
}

// Event listener to start recording on mic button click
micButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);