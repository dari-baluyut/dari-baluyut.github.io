const coords = { x: 0, y: 0 };
const trail = document.querySelectorAll(".cursorTrail");

const colors = [
    "#ffb56b",
    "#fdaf69",
    "#f89d63",
    "#f59761",
    "#ef865e",
    "#ec805d",
    "#e36e5c",
    "#df685c",
    "#d5585c",
    "#d1525c",
    "#c5415d",
    "#c03b5d",
    "#b22c5e",
    "#ac265e",
    "#9c155f",
    "#950f5f",
    "#830060",
    "#7c0060",
    "#680060",
    "#60005f",
    "#48005f",
    "#3d005e"
];

trail.forEach(function (particle, index) {
    particle.x = 0;
    particle.y = 0;
    particle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animateTrail() {
    let x = coords.x;
    let y = coords.y;
    
    trail.forEach(function (particle, index) {
        particle.style.left = x - 12 + "px";
        particle.style.top = y - 12 + "px";
        
        particle.style.scale = (trail.length - index) / trail.length;
        
        particle.x = x;
        particle.y = y;

        const nextParticle = trail[index + 1] || trail[0];
        x += (nextParticle.x - x) * 0.3;
        y += (nextParticle.y - y) * 0.3;
    });
    
    requestAnimationFrame(animateTrail);
}

animateTrail();