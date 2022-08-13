const COLORS = {
    white: {cell:"#fff", bg:"#eee", br:"#999", boomb: "#faa", txt: "#555"}, 
    gray:  {cell:"#676767", bg:"#353535", br:"#222", boomb: "#923", txt: "#aaa"},
    black:  {cell:"#000", bg:"#222", br:"#555", boomb: "#730", txt: "#aaa"},
    green: {cell:"#7f5", bg:"#4a3", br:"#050", boomb: "#933", txt: "#fff"},
    blue:  {cell:"#75f", bg:"#43a", br:"#005", boomb: "#936", txt: "#fff"},
}

const menu = document.querySelector(".menu-list");
const time = document.querySelector("#menu-list__item--time");
const lessMines = document.querySelector("#menu-list__item--less-mines");
const flags = document.querySelector("#menu-list__item--flags");
const canvas = document.querySelector('#canvas');

let board = new Board(canvas, 'easy', {time, lessMines, flags}, COLORS["white"]); // easy, normal, medium, hard


canvas.addEventListener('mousemove', e => {
    board.mouseMove(e);
});

canvas.addEventListener('mousedown', e => {
    board.mouseDown(e);
});

// disabled contextmenu
canvas.oncontextmenu = () => false;


let menuButton = document.querySelector(".menu-button");
let configForm = document.querySelector(".config");

menuButton.addEventListener('click', e => {
    configForm.classList.toggle('config--hide');
});

configForm.addEventListener('submit', e => {
    e.preventDefault();
    let form = e.target;

    let inputCheckedId = form.querySelector('.config__dificultys input[type="radio"]:checked').id;
    let dif = inputCheckedId.split("--")[1];

    let inputColorCheckedId = form.querySelector('.config__colors input[type="radio"]:checked').id;
    let colors = inputColorCheckedId.split("--")[1];

    // apply changes to ui
    document.body.style.backgroundColor = COLORS[colors]["cell"];
    menu.style.color = COLORS[colors]["txt"];
    menu.style.borderColor = COLORS[colors]["br"];
    menu.style.backgroundColor = COLORS[colors]["bg"];
    
    menuButton.style.color = COLORS[colors]["txt"];

    configForm.style.color = COLORS[colors]["txt"];
    configForm.style.backgroundColor = COLORS[colors]["bg"];
    configForm.style.borderColor = COLORS[colors]["br"];


    // apply changes to board
    if (board.dificulty !== dif){
        board.dificulty = dif;
        board.initialize();
    }
    board.COLORS = COLORS[colors];
    board.draw();

    configForm.classList.toggle('config--hide');
});