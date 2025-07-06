function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  // Show waveform animation
  document.getElementById("waveform").classList.remove("hidden");

  recognition.onresult = async function (event) {
    // Hide waveform after result
    document.getElementById("waveform").classList.add("hidden");

    const spokenQuestion = event.results[0][0].transcript;
    const questionBox = document.getElementById("questionBox");
    questionBox.textContent = `You asked: "${spokenQuestion}"`;

    // 🔥 FIX: Make sure the question box becomes visible
    questionBox.classList.add("show");

    try {
      const res = await fetch('/analyze-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: spokenQuestion })
      });

      const data = await res.json();
      document.getElementById("answerBox").textContent = data.answer;
    } catch (err) {
      document.getElementById("answerBox").textContent = "❌ Failed to get AI response. " + err.message;
    }
  };

  recognition.onerror = function (event) {
    document.getElementById("waveform").classList.add("hidden");
    alert("Speech recognition error: " + event.error);
  };
}
