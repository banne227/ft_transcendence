const son = new Audio('../son/erro.mp3');

document.querySelector('.submit button').addEventListener('click', function(e) {
  e.preventDefault(); // bloque la redirection
  son.play();
  setTimeout(function() {
    window.location.href = './login.html'; // redirige après le son
  }, 1200); // attend 1200ms
});