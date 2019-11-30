if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
    });
  });
}

firebase.initializeApp({
  apiKey: "AIzaSyAZtUFUY7ohnGrg-VvvzY_Nt86orQ-jy5c",
  authDomain: "php-slot.firebaseapp.com",
  databaseURL: "https://php-slot.firebaseio.com",
  projectId: "php-slot",
  storageBucket: "php-slot.appspot.com",
  messagingSenderId: "70660833075",
  appId: "1:70660833075:web:4d26029157621e2f77c846",
  measurementId: "G-TM09YLSMLR"
});
firebase.analytics();

const db = firebase.firestore();
const docRef = db.collection("count").doc("count");


const targetPs = {};
const targetHs = {};
const targetReel = document.querySelector('.c-slot__reel');
let results = {};

const init = () => {
  results = {};
  document.querySelector('.js-restart').setAttribute('disabled', true);
  document.querySelector('.js-result').classList.add('is-hidden');

  (async () => {
    const doc = await docRef.get();
    const data = doc.data();
    document.querySelector('.js-reel-count').textContent = data['total'];
    document.querySelector('.js-php-count').textContent = data['php'];
  })();

  document.querySelectorAll('.js-stop').forEach((elm) => {
    elm.removeAttribute('disabled');
  });

  document.querySelectorAll('.js-p').forEach((targetP) => {
    targetP.classList.remove('is-hidden');

    targetPs[targetP.closest('.js-reel').getAttribute('data-target')] = targetP.animate([
      {transform: 'translate3d(0, -100%, 0)'},
      {transform: 'translate3d(0, 100%, 0)'}
    ], {
      duration: 500,
      iterations: Infinity
    });
  });

  document.querySelectorAll('.js-h').forEach((targetH) => {
    targetH.classList.remove('is-hidden');

    targetHs[targetH.closest('.js-reel').getAttribute('data-target')] = targetH.animate([
      {transform: 'translate3d(0, -100%, 0)'},
      {transform: 'translate3d(0, 100%, 0)'}
    ], {
      duration: 500,
      delay: 250,
      iterations: Infinity
    });
  });
};

document.querySelectorAll('.js-stop').forEach((target) => {
  target.addEventListener('click', (elm) => {
    elm.currentTarget.setAttribute('disabled', true);
    targetId = elm.currentTarget.getAttribute('data-target');
    const playerP = targetPs[targetId];
    const playerH = targetHs[targetId];

    playerP.pause();
    playerH.pause();

    const targetP = document.querySelector(`.js-reel[data-target="${targetId}"] .js-p`);
    const targetH = document.querySelector(`.js-reel[data-target="${targetId}"] .js-h`);
    const rectP = targetP.getBoundingClientRect();
    const rectReel = targetReel.getBoundingClientRect();

    if (rectP.bottom - rectReel.top > 0 && rectP.bottom - rectReel.top < rectReel.height) {
      results[targetId] = 'P';
      targetH.classList.add('is-hidden');
    } else {
      results[targetId] = 'H';
      targetP.classList.add('is-hidden');
    }

    playerP.cancel();
    playerH.cancel();

    if (results['1'] === 'P' && results['2'] === 'H' && results['3'] === 'P') {
      document.querySelector('.js-result').classList.remove('is-hidden');
      let phpCount = localStorage.getItem('php-count');
      localStorage.setItem('php-count', ++phpCount);
      document.querySelector('.js-your-php-count').textContent = phpCount;

      (async () => {
        const doc = await docRef.get();
        const data = doc.data();
        let phpCount = data['php'];
        docRef.set({
          'php': ++phpCount
        }, { merge: true });
        document.querySelector('.js-php-count').textContent = phpCount;
      })();
    }
    if (results['1'] && results['2'] && results['3']) {
      document.querySelector('.js-restart').removeAttribute('disabled');
      let reelCount = localStorage.getItem('reel-count');
      localStorage.setItem('reel-count', ++reelCount);
      document.querySelector('.js-your-reel-count').textContent = reelCount;

      (async () => {
        const doc = await docRef.get();
        const data = doc.data();
        let reelCount = data['total'];
        docRef.set({
          'total': ++reelCount,
        }, { merge: true });
        document.querySelector('.js-reel-count').textContent = reelCount;
      })();
    }
  })
});

document.querySelector('.js-restart').addEventListener('click', () => {
  init();
});

window.addEventListener('load', () => {
  init();
  const reelCount = localStorage.getItem('reel-count') ? localStorage.getItem('reel-count') : 0;
  localStorage.setItem('reel-count', reelCount);
  document.querySelector('.js-your-reel-count').textContent = reelCount;

  const phpCount = localStorage.getItem('php-count') ? localStorage.getItem('php-count') : 0;
  localStorage.setItem('php-count', phpCount);
  document.querySelector('.js-your-php-count').textContent = phpCount;
});

const targetInstall = document.querySelector('.js-install-button');
window.addEventListener('beforeinstallprompt', (e) => {
  targetInstall.classList.remove('is-hidden');
  e.preventDefault();
  deferredPrompt = e;
  targetInstall.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});