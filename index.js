const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.feature-slide');

let index = 0;
let direction = 1;

function bounceMarquee() {
  index += direction;

  // Reverse direction when reaching the end or start
  if (index === slides.length - 1 || index === 0) {
    direction = -direction;
  }

  // Adjust the movement for the "bounce" effect
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

// Set interval to keep sliding back and forth like a bouncing marquee
setInterval(bounceMarquee, 2000); // Slide every 2 seconds


// Ensuring responsiveness
window.addEventListener('resize', function() {
  if (window.innerWidth <= 768) {
    // Adjust styles for small screens
    document.querySelector('#hero h1').style.fontSize = '28px';
    document.querySelector('#hero p').style.fontSize = '16px';
  } else {
    // Reset styles for larger screens
    document.querySelector('#hero h1').style.fontSize = '50px';
    document.querySelector('#hero p').style.fontSize = '22px';
  }
});
