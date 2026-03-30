let canvas = document.getElementById('des')
let des = canvas.getContext('2d')

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

window.addEventListener('resize', () => {
    resizeCanvas()

    des.imageSmoothingEnabled = false;
    des.webkitImageSmoothingEnabled = false;
    des.mozImageSmoothingEnabled = false

    // atualizar tamanhos
    bg1.w = canvas.width
    bg1.h = canvas.height * 0.4
    bg1.y = 0

    bg2.w = canvas.width
    bg2.h = canvas.height * 0.3
    bg2.y = canvas.height * 0.1

    bg3.w = canvas.width
    bg3.h = canvas.height * 0.6
    bg3.y = canvas.height * 0.4

    bg1.reset()
    bg2.reset()
    bg3.reset()
})

resizeCanvas()

// Disable smoothing
des.imageSmoothingEnabled = false;
des.webkitImageSmoothingEnabled = false;
des.mozImageSmoothingEnabled = false;

// OBJETOS ------------------------------------------

let bg1 = new Background('./img/background2.png', 1, canvas.width, window.innerHeight * 0.4)

let bg2 = new Background('./img/background3.png', 3, canvas.width, window.innerHeight * 0.3, canvas.height * 0.1)

let bg3 = new Background('./img/background1.png', 6, canvas.width, window.innerHeight * 0.6, canvas.height * 0.4)

let inimigo = new Inimigo((window.innerWidth + 300), bg3.y + 75, 80, 50, './img/carro_02_bg.png')
let inimigo2 = new Inimigo((window.innerWidth + 700), bg3.y + 175, 80, 50, '/img/carro_03_bg.png')
let inimigo3 = new Inimigo((window.innerWidth + 1400), bg3.y + 305, 80, 50, '/img/carro_04_bg.png')
let player = new Player(-200, bg3.y + 50, 128, 128, '../img/guto_01.png')
let player2 = new Player(-200, bg3.y + 275, 128, 128, '../img/renato_00.png')

player.startX = 100
player2.startX = 100

let t1 = new Text()
let t2 = new Text()
let t3 = new Text()
let t4 = new Text()
let fase_txt = new Text()


r = new Audio('./img/motor.wav')

//INTRO ------------------------------------------

let estado = 'transicao'
let tempoTransicao = 0

let fadeSprite = new Image()
fadeSprite.src = './img/fade.png' // spritesheet

let fadeFrame = 0
let fadeTimer = 0

let fadeFrames = 13   // 🔥 MUDE AQUI (quantidade de frames)
let fadeSpeed = 5      // 🔥 MUDE AQUI (velocidade)
let fadeFinalizado = false

let countImgs = [
    './img/cont3.png',
    './img/cont2.png',
    './img/cont1.png',
    './img/contGO.png'
]

let countIndex = 0
let countTimer = 0

function animacaoTransicao() {
    bg1.mov()
    bg2.mov()
    bg3.mov()

    tempoTransicao++

    if (fadeFinalizado) {
        if (player.x < player.startX) {
            player.x += 5
        }

        if (player2.x < player2.startX) {
            player2.x += 5
        }
    }

    // contagem (troca a cada 60 frames ~1s)
    if (fadeFinalizado) {
        countTimer++

        if (countTimer > 60) {
            countTimer = 0
            countIndex++
        }
    }

    // fim da transição
    if (countIndex > 3) {
        estado = 'jogando'
        countIndex = 0
        tempoTransicao = 0
    }

    // animação do fade
    if (!fadeFinalizado) {
        fadeTimer++

        if (fadeTimer > fadeSpeed) {
            fadeTimer = 0
            fadeFrame++
        }

        if (fadeFrame >= fadeFrames) {
            fadeFinalizado = true
        }
    }

    player.anim('guto_0', 6, 3)
    player2.anim('renato_0', 1, 7)
}

function desenhaTransicao() {
    // fundo
    bg1.draw()
    bg3.draw()
    bg2.draw()

    // largura de cada frame do spritesheet
    if (!fadeSprite.complete) return

    let frameW = fadeSprite.width / fadeFrames
    let frameH = fadeSprite.height

    // desenha fade
    if (!fadeFinalizado) {
        des.drawImage(
            fadeSprite,
            frameW * fadeFrame, 0,   // recorte X
            frameW, frameH,          // tamanho do frame
            0, 0,
            canvas.width, canvas.height
        )
    }

    // depois do fade, desenha players + contagem
    if (fadeFinalizado) {
        player.des_player()
        player2.des_player()

        if (countIndex <= 3) {
            let img = new Image()
            img.src = countImgs[countIndex]

            let w = 200
            let h = 200

            des.drawImage(
                img,
                canvas.width / 2 - w / 2,
                canvas.height / 2 - h / 2,
                w,
                h
            )
        }
    }
}

function iniciarTransicao() {
    estado = 'transicao'

    tempoTransicao = 0

    countIndex = 0
    countTimer = 0

    fadeFrame = 0
    fadeTimer = 0
    fadeFinalizado = false

    player.x = -200
    player2.x = -200

    inimigo.recomeca()
    inimigo2.recomeca()
    inimigo3.recomeca()
}

//INPUTS ------------------------------------------

let jogar = true
let fase = 1

let velocidadeCar = 1

document.addEventListener('keydown', (e) => {
    // motor.play()

    // Player 1 — WASD
    if (e.key === 'w') { player.dir = -1.5; player.accel = velocidadeCar }
    if (e.key === 's') { player.dir = 1.5; player.accel = velocidadeCar }

    // Player 2 — Setas
    if (e.key === 'ArrowUp') { player2.dir = -1.5; player2.accel = velocidadeCar }
    if (e.key === 'ArrowDown') { player2.dir = 1.5; player2.accel = velocidadeCar }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') player.accel = 0
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player2.accel = 0
})


//CONTROLADOR DE MORTE ------------------------------
function game_over() {
    if (player.vida <= 0 && player2.vida <= 0) {
        jogar = false
    }
}

//CONTROLADOR DE FASES --------------------------------
function ver_fase() {
    if (player.pontos > 20 && fase === 1) {
        fase = 2

        inimigo.vel = 8
        inimigo2.vel = 8
        inimigo3.vel = 8

        iniciarTransicao()

    } else if (player.pontos > 40 && fase === 2) {
        fase = 3

        inimigo.vel = 13
        inimigo2.vel = 13
        inimigo3.vel = 13

        iniciarTransicao()
    }
}

//CONTROLADOR DE COLISÂO --------------------------------
function colisao() {
    // Player 1
    [inimigo, inimigo2, inimigo3].forEach(inimigo => {
        if (player.colid(inimigo, 36, 44, 60, 48) && player.vida > 0) {
            inimigo.recomeca()
            player.vida -= 1
        }
    })

        // Player 2
        ;[inimigo, inimigo2, inimigo3].forEach(inimigo => {
            if (player2.colid(inimigo, 36, 44, 60, 48) && player2.vida > 0) {
                inimigo.recomeca()
                player2.vida -= 1
            }
        })
}


//CONTROLADOR DE PONTOS --------------------------------
function pontuacao() {
    // Inimigos que saem da tela dão ponto para quem estiver vivo
    ;[inimigo, inimigo2, inimigo3].forEach(inimigo => {
        if (player.point(inimigo)) {
            if (player.vida > 0) player.pontos += 5
            if (player2.vida > 0) player2.pontos += 5
            inimigo.recomeca()
        }
    })
}

//DESENHO DA TELA --------------------------------
function desenha() {
    if (jogar) {
        bg1.draw()
        bg3.draw()
        bg2.draw()

        inimigo.des_player()
        inimigo2.des_player()
        inimigo3.des_player()

        if (player.vida > 0) player.des_player()
        if (player2.vida > 0) player2.des_player()

        t2.des_text('P1 Vidas: ' + player.vida, 40, 40, 'red', '26px Arial')
        t1.des_text('P1 Pontos: ' + player.pontos, 40, 70, 'yellow', '22px Arial')

        t3.des_text('P2 Vidas: ' + player2.vida, 900, 40, '#00cfff', '26px Arial')
        t4.des_text('P2 Pontos: ' + player2.pontos, 900, 70, 'lime', '22px Arial')

        fase_txt.des_text('Fase: ' + fase, 550, 40, 'white', '26px Arial')
    } else {
        t1.des_text('GAME OVER', 420, 300, 'yellow', '60px Arial')
        t3.des_text('P1: ' + player.pontos + ' pts', 430, 420, 'red', '25px Arial')
        t4.des_text('P2: ' + player2.pontos + ' pts', 430, 455, '#00cfff', '25px Arial')
    }
}


//ATUALIZAÇÂO DA FÍSICA --------------------------------
function atualiza() {
    if (estado === 'jogando') {

        bg1.mov()
        bg2.mov()
        bg3.mov()

        let limiteCima = bg3.y
        let limiteBaixo = bg3.y + bg3.h - player.h

        if (player.vida > 0) {
            player.mov_player(limiteCima, limiteBaixo)
        }
        if (player2.vida > 0) {
            player2.mov_player(limiteCima, limiteBaixo)
        }

        player2.anim('renato_0', 1, 7)
        player.anim('guto_0', 6, 3)

        inimigo.mov_car()
        inimigo2.mov_car()
        inimigo3.mov_car()

        colisao()
        pontuacao()
        ver_fase()
        game_over()
    }
}

//LOOP PRINCIPAL --------------------------------
function main() {
    des.clearRect(0, 0, canvas.width, canvas.height)

    if (estado === 'transicao') {
        desenhaTransicao()
        animacaoTransicao()
    } else {
        desenha()
        atualiza()
    }

    requestAnimationFrame(main)
}

main()
