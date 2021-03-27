const canvas = document.getElementById("canvasId")
const ctx = canvas.getContext("2d")

ctx.canvas.width = 1680
ctx.canvas.height = 1050



let colour = "black"
let paint = false

window.addEventListener("mousedown", (event) =>{
    paint = true
    draw()
})

window.addEventListener("mouseup", () =>{
    paint = false
    ctx.beginPath()
})

window.addEventListener("mousemove", (event) =>{
    draw()
})


function draw(){
    if(paint){
        ctx.lineWidth = 10
        ctx.lineCap = "round"
        ctx.lineTo(event.clientX, event.clientY)
        ctx.strokeStyle = colour
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(event.clientX, event.clientY)
    }
}


function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeColour(){
    console.log(colour);
    element = document.getElementById("colourPicker")
    colour = element.options[element.selectedIndex].value
    console.log(colour);
}