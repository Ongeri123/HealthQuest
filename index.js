// let xp = 0;
// let level = 1;

// const questions = [
//   {
//     question: "Which of these is NOT a symptom of malaria?",
//     options: ["Fever", "Chills", "Cough", "Sweating"],
//     answer: "Cough"
//   },
//   {
//     question: "What is the best way to prevent the spread of germs?",
//     options: ["Shaking hands", "Washing hands", "Sharing cups", "Sneezing openly"],
//     answer: "Washing hands"
//   }
// ];

// let currentQuestionIndex = 0;

// function renderQuestion() {
//   const q = questions[currentQuestionIndex];
//   const zone = document.getElementById('question-zone');
//   zone.innerHTML = `<h3>${q.question}</h3>`;

//   q.options.forEach(opt => {
//     const btn = document.createElement('button');
//     btn.textContent = opt;
//     btn.onclick = () => handleAnswer(opt === q.answer);
//     zone.appendChild(btn);
//   });
// }

// function handleAnswer(correct) {
//   const feedback = document.getElementById('feedback-zone');
//   if (correct) {
//     xp += 10;
//     feedback.innerHTML = "<p>✅ Correct! +10 XP</p>";
//   } else {
//     feedback.innerHTML = "<p>❌ Oops! Try again next time.</p>";
//   }

//   updateStats();
//   currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
//   setTimeout(() => {
//     feedback.innerHTML = "";
//     renderQuestion();
//   }, 1500);
// }

// function updateStats() {
//   document.getElementById('xp').textContent = xp;
//   document.getElementById('level').textContent = Math.floor(xp / 50) + 1;
// }

// renderQuestion();

// Game 2

document.addEventListener('DOMContentLoaded', () => {
  loadGlossaryGame();
});

async function loadGlossaryGame() {
  const termList = document.getElementById('term-list');
  const defList = document.getElementById('definition-list');

  if (!termList || !defList) {
    console.error('Target containers not found in DOM.');
    return;
  }

  termList.innerHTML = 'Loading terms...';
  defList.innerHTML = '';

  try {
    const res = await fetch('https://www.healthcare.gov/api/v1/glossary.json');
    const data = await res.json();
    const terms = Object.values(data.glossary);

    if (!terms.length) {
      termList.innerHTML = 'Failed to load terms.';
      return;
    }

    // Select 4 random terms
    const selected = terms.sort(() => 0.5 - Math.random()).slice(0, 4);

    termList.innerHTML = '';
    defList.innerHTML = '';

    selected.forEach((entry, idx) => {
      // Create draggable term button
      const termBtn = document.createElement('button');
      termBtn.textContent = entry.title;
      termBtn.className = 'term-button';
      termBtn.dataset.match = `def-${idx}`;
      termBtn.draggable = true;

      termBtn.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', termBtn.dataset.match);
      });

      termList.appendChild(termBtn);

      // Create definition drop zone
      const defDrop = document.createElement('div');
      defDrop.textContent = entry.definitionShort;
      defDrop.className = 'drop-zone';
      defDrop.id = `def-${idx}`;

      defDrop.addEventListener('dragover', (e) => e.preventDefault());

      defDrop.addEventListener('drop', (e) => {
        const draggedMatch = e.dataTransfer.getData('text/plain');
        if (draggedMatch === defDrop.id) {
          defDrop.style.backgroundColor = '#c7f5cd';
          defDrop.textContent += ' ✅';
        } else {
          defDrop.style.backgroundColor = '#f9c2c2';
          defDrop.textContent += ' ❌';
        }
      });

      defList.appendChild(defDrop);
    });
  } catch (error) {
    console.error('Error fetching glossary:', error);
    termList.innerHTML = 'An error occurred while loading terms.';
  }
}
