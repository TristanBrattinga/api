const recognition = new webkitSpeechRecognition() || new SpeechRecognition()

const messageInput = document.getElementById('message-input')
const speechButton = document.getElementById('microphone-button')

if (recognition) {
    recognition.lang = 'nl-NL'
    recognition.continuous = true
    recognition.interimResults = true

    speechButton.addEventListener('click', () => {
        recognition.start()
        console.log("Recognition started")
    })

    recognition.onresult = event => {
        const result = event.results[event.results.length - 1][0].transcript;
        console.log(result)
        messageInput.value = result
    };
}