class Obj {
    constructor(x, y, w, h, a) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a
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

    accel = 0
    veloc = 0
    dir = 0
    vida = 5
    frame = 0
    pontos = 0
    tempo = 0

    mov_player(limiteCima, limiteBaixo) {
        this.veloc += this.accel * this.dir

        // desaceleração
        this.veloc *= 0.85

        // limite de velocidade
        const maxVel = 10
        if (this.veloc > maxVel) this.veloc = maxVel
        if (this.veloc < -maxVel) this.veloc = -maxVel

        this.y += this.veloc

        // limites
        if (this.y < limiteCima - 60) {
            this.y = limiteCima - 60
            this.veloc = 0
        } else if (this.y > limiteBaixo - 30) {
            this.y = limiteBaixo - 30
            this.veloc = 0
        }
    }

    colid(objeto, colid_x, colid_y, colid_w, colid_h) {
        if (((this.x + colid_x) < objeto.x + objeto.w) &&
            ((this.x + colid_x) + colid_w > objeto.x) &&
            ((this.y + colid_y) < objeto.y + objeto.h) &&
            ((this.y + colid_y) + colid_h > objeto.y)) {
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

    recomeca() {
        this.x = canvas.width + Math.random() * 300
        let minY = bg3.y
        let maxY = bg3.y + bg3.h - this.h

        this.y = Math.random() * (maxY - minY) + minY
    }

    mov_car() {
        this.x -= this.vel
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