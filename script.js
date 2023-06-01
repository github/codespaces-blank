const textContainer = document.getElementById('text-container');
const hiddenTextElement = document.getElementById('hidden-text');
const startButton = document.getElementById('start-button');
let animationStarted = false;

function getRandomPosition(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function revealText() {
  const hiddenText = hiddenTextElement.textContent;
  const textLength = hiddenText.length;
  const textDiv = document.createElement('div');
  textDiv.className = 'generated-text';

  // Create span elements for each letter and set initial styles
  for (let i = 0; i < textLength; i++) {
    const span = document.createElement('span');
    span.textContent = hiddenText[i];
    span.style.top = getRandomPosition(0, textContainer.clientHeight - 20) + 'px';
    span.style.left = getRandomPosition(0, textContainer.clientWidth - 20) + 'px';
    textDiv.appendChild(span);
  }

  textContainer.appendChild(textDiv);

  // Animate the appearance of the span elements
  const spanElements = textDiv.querySelectorAll('span');
  spanElements.forEach((span) => {
    setTimeout(() => {
      span.style.opacity = 1;
    }, Math.random() * 1000);
  });

  // Animate the movement of the span elements to their correct positions
  setTimeout(() => {
    spanElements.forEach((span) => {
      const index = Array.prototype.indexOf.call(span.parentNode.children, span);
      span.style.transition = 'all 1s';
      span.style.top = '0';
      span.style.left = (index * 20) + 'px';
    });
  }, 1500);

  animationStarted = false;
}

startButton.addEventListener('click', function() {
  if (!animationStarted) {
    animationStarted = true;

    // Remove any previously generated text
    const previousTextDiv = textContainer.querySelector('.generated-text');
    if (previousTextDiv) {
      textContainer.removeChild(previousTextDiv);
    }

    revealText();
  }
});
