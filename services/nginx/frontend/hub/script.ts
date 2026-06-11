// function makeDraggable(fenetre, barre) {
//   let isDragging = false;
//   let offsetX = 0;
//   let offsetY = 0;

//   barre.addEventListener('mousedown', function(e) {
//     isDragging = true;
//     offsetX = e.clientX - fenetre.offsetLeft;
//     offsetY = e.clientY - fenetre.offsetTop;
//   });

//   document.addEventListener('mousemove', function(e) {
//     if (isDragging) {
//       fenetre.style.left = (e.clientX - offsetX) + 'px';
//       fenetre.style.top  = (e.clientY - offsetY) + 'px';
//     }
//   });

//   document.addEventListener('mouseup', function() {
//     isDragging = false;
//   });
// }

// const son = new Audio('../son/windows-xp-startup.mp3');
// const song = new Audio('../son/sound.mp3');

// document.querySelector('.play_button a').addEventListener('click', function(e) {
//   e.preventDefault(); // bloque la redirection
//   son.play();
//   setTimeout(function() {
//     window.location.href = '../game/game.html'; // redirige après le son
//   }, 3000); // attend 500ms
// });

// makeDraggable(document.querySelector('#window-log'),  document.querySelector('#window-log .titlebar'));
// makeDraggable(document.querySelector('#window-title'),  document.querySelector('#window-title .titlebar'));
// makeDraggable(document.querySelector('#window-chat'),  document.querySelector('#window-chat .titlebar'));

// let count = 42;

// const btn = document.getElementById("compteur");

// btn.addEventListener("click", () => {
//   count--;
//   btn.innerText = count;
//   if (count == 40) {
//     document.querySelectorAll('.window').forEach(function(window) {
//   window.classList.add('maClasse');
// });
//   }
//   if (count == 30)
//   {
//     document.getElementById('screamer').style.display = 'block';
//     song.play();
// 	setTimeout(function()
// 	{
// 		document.getElementById('screamer').style.display = 'none';
// 	}, 1500);
//   }
// });

// document.querySelector('#chat-input-row button').addEventListener('click', function() {
//   const input = document.querySelector('#chat-input-row input');
//   const texte = input.value;

//   const message = document.createElement('div');
//   message.classList.add('chat-line');
//   message.textContent = texte;

//   document.querySelector('#chat-messages').appendChild(message);
//   input.value = '';
// });

// document.querySelector('#window-log').addEventListener('click', function() {
//   document.getElementById('window-login').style.display = 'block';
// });