
const output = document.getElementById("output");
const feur = document.getElementById("feur");
function showChar(e) {
  output.textContent = `Key KeyDown: "${e.key}"
CTRL key KeyDown: ${e.ctrlKey}
`;
}

document.addEventListener("keydown", showChar);

addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') {
    feur.textContent = `Key KeyDown: "${e.key}"
    CTRL key KeyDown: ${e.ctrlKey}
    `;
  }
  if (e.key === 'ArrowDown') {
    feur.textContent = `Key KeyDown: "${e.key}"
    CTRL key KeyDown: ${e.ctrlKey}
    `;
  }
  if (e.key === 'ArrowLeft') {
    feur.textContent = `Key KeyDown: "${e.key}"
    CTRL key KeyDown: ${e.ctrlKey}
    `;
  }
  if (e.key === 'ArrowRight') {
    feur.textContent = `Key KeyDown: "${e.key}"
    CTRL key KeyDown: ${e.ctrlKey}
    `;
  }
});