let des = document.getElementById('des').getContext('2d')

let carroInimigo = new CarroInimigo(1300, 325, 80, 50, './img/carro_02_bg.png')
let carroInimigo2 = new CarroInimigo(1700, 125, 80, 50, '/img/carro_03_bg.png')
let carroInimigo3 = new CarroInimigo(2200, 400, 80, 50, '/img/carro_04_bg.png')
let estrada = new Estrada(10, 345, 40, 10, 'white')
let carro = new Carro(100, 325, 80, 50, '../img/carro_001_bg.png')
// let medidaCarro = new Carro(100, 325, 85, 50, 'green')

let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let motor = new Audio('./img/motor.wav')
let batida = new Audio('./img/batida.mp3')
motor.volume = 0.5
motor.loop = true
batida.volume = 0.5

let jogar = true
let fase = 1

let velocidadeCar = 1

let hitstop = 0

document.addEventListener('keydown', (e) => {
    motor.play()
    if (e.key === 'w' || e.key === 'ArrowUp') {
        carro.dir = -1.5
        carro.accel = velocidadeCar
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
        carro.dir = 1.5
        carro.accel = velocidadeCar
    }
    if (e.key === 'f' && carro.parryTempo == 0){
        carro.parry = true
        carro.parryTempo = 10 // tempo em que a colisão existe
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp' ||e.key === 's' || e.key === 'ArrowDown') {
        carro.accel = 0
    }
})

function colisaoParry() {
    if (!carro.parry) return

    let p = carro.getParryBox()

    function bate(inimigo){
        if (
            p.x < inimigo.x + inimigo.w &&
            p.x + p.w > inimigo.x &&
            p.y < inimigo.y + inimigo.h &&
            p.y + p.h > inimigo.y
        ) {
            hitstop = 20
            inimigo.ativarProjetil()
        }
    }

    bate(carroInimigo)
    bate(carroInimigo2)
    bate(carroInimigo3)
}

function colisaoEntreInimigos(){
    let inimigos = [carroInimigo, carroInimigo2, carroInimigo3]

    for(let i = 0; i < inimigos.length; i++){
        for(let j = i+1; j < inimigos.length; j++){
            let a = inimigos[i]
            let b = inimigos[j]

            if(a.proj || b.proj){
                if(
                    a.x < b.x + b.w &&
                    a.x + a.w > b.x &&
                    a.y < b.y + b.h &&
                    a.y + a.h > b.y
                ){
                    a.recomeca()
                    b.recomeca()

                    carro.pontos += 15 // recompensa extra
                }
            }
        }
    }
}

//animação bonitinha:
function easeOutCubic(t){
    return 1 - Math.pow(1 - t, 3)
}

function game_over() {
    if (carro.vida <= 0) {
        jogar = false
        motor.pause()
        // música com o jogo parado
    }
}

function ver_fase() {
    if (carro.pontos > 20 && fase === 1) {
        fase = 2
        carroInimigo.vel = 8
        carroInimigo2.vel = 8
        carroInimigo3.vel = 8
    } else if (carro.pontos > 40 && fase === 2) {
        fase = 3
        carroInimigo.vel = 13
        carroInimigo2.vel = 13
        carroInimigo3.vel = 13
    }
}

function colisao() {
    if (!carro.parry && carro.colid(carroInimigo)) {
    if (carro.colid(carroInimigo)) {
        batida.play()
        carroInimigo.recomeca()
        carro.vida -= 1

    }
    if (carro.colid(carroInimigo2)) {
        batida.play()
        carroInimigo2.recomeca()
        carro.vida -= 1
    }
    if (carro.colid(carroInimigo3)) {
        batida.play()
        carroInimigo3.recomeca()
        carro.vida -= 1
    }
    console.log('vida: ', carro.vida)
    }
}

function pontuacao() {
    if (carro.point(carroInimigo)) {
        carro.pontos += 5
        carroInimigo.recomeca()
    }
    if (carro.point(carroInimigo2)) {
        carro.pontos += 5
        carroInimigo2.recomeca()
    }
    if (carro.point(carroInimigo3)) {
        carro.pontos += 5
        carroInimigo3.recomeca()
    }
}

function desenha() {
    if (jogar) {
        estrada.des_quad()
        carroInimigo.des_carro()
        carroInimigo2.des_carro()
        carroInimigo3.des_carro()
        carro.des_carro()
        t1.des_text('Pontos: ' + carro.pontos, 1000, 40, 'yellow', '26px Arial')
        t2.des_text('Vidas: ' + carro.vida, 40, 40, 'red', '26px Arial')
        fase_txt.des_text('Fase: ' + fase, 550, 40, 'white', '26px Arial')
    } else {
        t1.des_text('GAME OVER', 450, 350, 'yellow', '60px Arial')
        t2.des_text('Pontuação Final: ' + carro.pontos, 480, 400, 'white', '25px Arial')
    }
}


function atualiza() {
    if(hitstop > 0){
        hitstop--
        des.fillStyle = "rgba(255,255,255,0.5)"
        des.fillRect(0, 0, 1200, 700)
    }else{
        des.clearRect
        if (jogar) {
            carro.mov_car()
            carro.anim('carro_00')
            carroInimigo.mov_car()
            carroInimigo2.mov_car()
            carroInimigo3.mov_car()
            colisaoParry()
            colisaoEntreInimigos()
            estrada.mov_est()
            colisao()
            pontuacao()
            ver_fase()
            game_over()
        }
    }
}

function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

main()