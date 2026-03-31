class Obj {
    constructor(x, y, w, h, a) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.hitbox = {
            x: 0,
            y: 0,
            w: w,
            h: h
        }
    }


    des_player() {
        let img = new Image()
        img.src = this.a
        des.drawImage(img, this.x, this.y, this.w, this.h)
    }

    des_quad() {
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h, this.a)
    }

}

class Player extends Obj {

    speed = 8
    dirX = 0
    dirY = 0

    vida = 3
    frame = 0
    pontos = 0
    tempo = 0

    // Ataque -------
    cooldown = 0
    cooldownMax = 30 // frames de recarga

    mov_player(limiteCima, limiteBaixo, limiteEsq, limiteDir) {

        // normalizar diagonal
        let dx = this.dirX
        let dy = this.dirY

        if (dx !== 0 && dy !== 0) {
            dx *= 0.8
            dy *= 0.8
        }

        // aplicar movimento direto
        this.x += dx * this.speed
        this.y += dy * this.speed

        // limites Y
        if (this.y < limiteCima - 60) {
            this.y = limiteCima - 60
        } else if (this.y > limiteBaixo - 30) {
            this.y = limiteBaixo - 30
        }

        // limites X
        if (this.x < limiteEsq) {
            this.x = limiteEsq
        } else if (this.x > limiteDir - this.w) {
            this.x = limiteDir - this.w
        }
    }

    colid(objeto) {
        if ((this.x + this.hitbox.x < objeto.x + objeto.hitbox.x + objeto.hitbox.w) &&
            (this.x + this.hitbox.x + this.hitbox.w > objeto.x + objeto.hitbox.x) &&
            (this.y + this.hitbox.y < objeto.y + objeto.hitbox.y + objeto.hitbox.h) &&
            (this.y + this.hitbox.y + this.hitbox.h > objeto.y + objeto.hitbox.y)) {
            console.log(objeto)
            return true
        } else {
            return false
        }
    }

    point(objeto) {
        if (objeto.x <= -100) {
            return true
        } else {
            return false
        }
    }

    anim(nome, frame_count, frame_time) {
        this.tempo += 1
        if (this.tempo > frame_time) {
            this.tempo = 0
            this.frame += 1
        }
        if (this.frame > frame_count) {
            this.frame = 0
        }
        //carro_001_bg
        this.a = "./img/" + nome + this.frame + ".png"
    }
}

class Inimigo extends Obj {
    //velocidade de carro:
    vel = 5
    frame = 0
    tempo = 0

    vida = 3
    vidaMax = 3

    hitTimer = 2 // tempo piscando

    invencivel = 0

    recomeca() {
        this.x = canvas.width + Math.random() * 300
        let minY = bg3.y
        let maxY = bg3.y + bg3.h - this.h

        this.y = Math.random() * (maxY - minY) + minY
    }

    levarDano(dano = 1) {

        this.vida -= dano
        this.hitTimer = 2
        this.invencivel = 15
        this.x += 20

        if (this.vida <= 0) {
            this.recomeca()
            this.vida = this.vidaMax
        }
    }

    mov_car() {
        this.x -= this.vel
        if (this.invencivel > 0) this.invencivel--
    }

    anim(nome, frame_count, frame_time) {
        this.tempo += 1
        if (this.tempo > frame_time) {
            this.tempo = 0
            this.frame += 1
        }
        if (this.frame > frame_count) {
            this.frame = 0
        }
        //carro_001_bg
        this.a = "./img/" + nome + this.frame + ".png"
    }

    des_player() {

        // efeito de piscar
        if (this.hitTimer > 0) {
            this.hitTimer--

            // pisca (não desenha em alguns frames)
            if (this.hitTimer % 2 === 0) return
        }

        let img = new Image()
        img.src = this.a
        des.drawImage(img, this.x, this.y, this.w, this.h)
    }
}

class Text {
    des_text(text, x, y, cor, font) {
        des.fillStyle = cor
        des.lineWidth = '5'
        des.font = font
        des.fillText(text, x, y)
    }
}

class Background {
    constructor(img, speed, w, h, y = 0) {
        this.img = new Image()
        this.img.src = img

        this.speed = speed

        this.w = w
        this.h = h
        this.y = y

        this.x1 = 0
        this.x2 = this.w
    }

    mov() {
        this.x1 -= this.speed
        this.x2 -= this.speed

        // loop baseado no TAMANHO DA IMAGEM
        if (this.x1 <= -this.w) {
            this.x1 = this.x2 + this.w
        }

        if (this.x2 <= -this.w) {
            this.x2 = this.x1 + this.w
        }
    }

    draw() {
        des.drawImage(this.img, this.x1, this.y, this.w, this.h)
        des.drawImage(this.img, this.x2, this.y, this.w, this.h)
    }

    reset() {
        this.x1 = 0
        this.x2 = this.w
    }
}

let imgBala = new Image()
imgBala.src = './img/bala.png';

class Bala {
    constructor(x, y, dir = 1) {
        this.x = x - 80
        this.y = y + 20
        this.w = 32
        this.h = 24
        this.speed = 12
        this.dir = dir
        this.ativa = true
    }

    mov() {
        this.x += this.speed * this.dir

        if (this.x > canvas.width) {
            this.ativa = false
        }
    }

    draw() {
        des.drawImage(imgBala, this.x, this.y, this.w, this.h)
    }

    colid(inimigo) {
        return (
            this.x < inimigo.x + inimigo.w &&
            this.x + this.w > inimigo.x &&
            this.y < inimigo.y + inimigo.h &&
            this.y + this.h > inimigo.y
        )
    }
}

class AtaqueEspada {
    constructor(x, y, sprite) {
        this.x = x + 128
        this.y = y - 64
        this.w = 192
        this.h = 192

        this.img = new Image()
        this.img.src = sprite

        this.frame = 0
        this.timer = 0

        this.frameMax = 5
        this.speed = 2

        this.ativa = true
        this.flip = false
    }

    update() {
        this.timer++
        if (this.timer > this.speed) {
            this.timer = 0
            this.frame++
        }

        if (this.frame >= this.frameMax) {
            this.ativa = false
        }
    }

    draw() {
        let frameW = this.img.width / this.frameMax

        des.save()

        des.translate(this.x + this.w / 2, this.y + this.h / 2)

        if (this.flip) {
            des.scale(1, -1) // flip vertical
        }

        des.drawImage(
            this.img,
            frameW * this.frame, 0,
            frameW, this.img.height,
            -this.w / 2, -this.h / 2,
            this.w, this.h
        )

        des.restore()
    }

    colid(inimigo) {
        return (
            this.x < inimigo.x + inimigo.w &&
            this.x + this.w > inimigo.x &&
            this.y < inimigo.y + inimigo.h &&
            this.y + this.h > inimigo.y
        )
    }
}