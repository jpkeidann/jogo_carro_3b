class Obj {
    constructor(x, y, w, h, a) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a
    }

    des_carro() {
        let img = new Image()
        img.src = this.a
        des.drawImage(img, this.x, this.y, this.w, this.h)
    }

    des_quad() {
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h, this.a)
    }

}

class Carro extends Obj {
    parry = false
    parryTempo = 0

    accel = 0
    veloc = 0
    dir = 0
    vida = 5
    pontos = 0
    frame = 1
    tempo = 0

    mov_car() {
        this.veloc += this.accel * this.dir

        // desaceleração:
        this.veloc *= 0.85

        // limita velocidade
        const maxVel = 10
        if (this.veloc > maxVel) this.veloc = maxVel
        if (this.veloc < -maxVel) this.veloc = -maxVel

        // move
        this.y += this.veloc
        if (this.y < 0) {
            this.y = 0
        } else if (this.y > 652) {
            this.y = 652
        }

        // parte do mov_car que usa o parry
        if (this.parryTempo > 0) {
            this.parryTempo--
        } else {
            this.parry = false
        }
    }

    colid(objeto) {
        if ((this.x < objeto.x + objeto.w) &&
            (this.x + this.w > objeto.x) &&
            (this.y < objeto.y + objeto.h) &&
            (this.y + this.h > objeto.y)) {
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

    anim(nome) {
        this.tempo += 1
        if (this.tempo > 12) {
            this.tempo = 0
            this.frame += 1
        }
        if (this.frame > 4) {
            this.frame = 1
        }
        //carro_001_bg
        this.a = "./img/" + nome + this.frame + "_bg.png"
    }

    getParryBox() {
        return {
            x: this.x + this.w, // frente do carro
            y: this.y + 10,
            w: 40,
            h: this.h - 20
        }
    }
}

class CarroInimigo extends Obj {
    projTempo = 50 // tempo que o carro é um projétil
    proj = false
    //velocidade de volta:
    vx = 0
    vy = 0

    //velocidade de carro:
    vel = 5

    //atributos para animação bonitinha
    projTempoMax = 60

    startX = 0
    startY = 0

    dirX = 0
    dirY = 0

    recomeca() {
        this.x = 1300
        this.y = Math.floor(Math.random() * (638 - 62) + 62)
    }

    mov_car(){
        if(this.proj){
    
            let t = 1 - (this.projTempo / this.projTempoMax) // 0 → 1
            let ease = easeOutCubic(t)
    
            this.x = this.startX + this.dirX * ease
            this.y = this.startY + this.dirY * ease
    
            this.projTempo--
    
            if(this.projTempo <= 0){
                this.proj = false
            }
    
        } else {
    
            this.x -= this.vel
    
            if(this.x <= -200){            
                this.recomeca()
            }
        }
    }

    ativarProjetil(){
        this.proj = true
    
        let ang = (Math.random() * Math.PI / 2) - (Math.PI / 4)
        let distancia = 300
    
        this.startX = this.x
        this.startY = this.y
    
        this.dirX = Math.cos(ang) * distancia
        this.dirY = Math.sin(ang) * distancia
    
        this.projTempo = this.projTempoMax
    }
}

class Estrada extends Obj {
    mov_est() {
        this.x -= 6
        if (this.x < - 60) {
            this.x = 1300
        }
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
