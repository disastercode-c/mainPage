let aux = document.getElementById('lienzo');
let lienzo = aux.getContext('2d');
let auxLine= 15;
let currentValX = 575;
let currentValY = 820;
let newValX ; 
let newValY;
let moved = document.getElementById('roboc');
// moved.style.top=currentValY
// moved.style.left=currentValX
moved.style.transform = `translate(${currentValX}px, ${currentValY}px)`

lienzo.fillRect(currentValX,currentValY, 15, 15)

const getInfoPos = (posX, posY)=>{
    newValX = posX;
    newValY = posY;
    if(currentValX != newValX || currentValY !=newValY){
        marcaCamino(newValX, newValY)
    }

}

const marcaCamino = (val1, val2)=>{
    lienzo.clearRect(currentValX,currentValY, auxLine,auxLine)
    lienzo.fillRect(val1, val2,auxLine,auxLine)
    currentValX = val1
    currentValY = val2
}

setInterval(() => {
    let auxY = currentValY - 5
    if(auxY > 300){
        getInfoPos(currentValX, auxY)
    }else if(auxY > 200){
        getInfoPos(565, auxY)
    }
    moved.style.transform = `translate(${currentValX}px, ${auxY}px)`
    
}, 500);


