const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');

let pontos = 0;

const linhasCount = 9;  
const colunasCount = 5;

// propriedades da bolinha 
const bolinha = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  tam: 10,
  velocidade: 4,
  dx: 4,
  dy: -4
};

// propriedades da barra
const barrinha = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  velocidade: 8,
  dx: 0
};

// propriedades dos blocos
const bloquinhosInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 50,
  offsetY: 40,
  visivel: true
};

// cria uma lista/matriz com o numero de blocos
const bloquinhos = [];
for (let i = 0; i < linhasCount; i++) {
  bloquinhos[i] = [];
  for (let j = 0; j < colunasCount; j++) {
    const x = i * (bloquinhosInfo.w + bloquinhosInfo.padding) + bloquinhosInfo.offsetX;
    const y = j * (bloquinhosInfo.h + bloquinhosInfo.padding) + bloquinhosInfo.offsetY;
    bloquinhos[i][j] = { x, y, ...bloquinhosInfo };
  }
}

// desenha a bolinha no canvas
function desenhaBolinha() {
  ctx.beginPath();
  ctx.arc(bolinha.x, bolinha.y, bolinha.tam, 0, Math.PI * 2);
  ctx.fillStyle = '#F2DEA0';
  ctx.fill();
  ctx.closePath();
}

// desenha a barra no canvas
function drawbarrinha() {
  ctx.beginPath();
  ctx.rect(barrinha.x, barrinha.y, barrinha.w, barrinha.h);
  ctx.fillStyle = '#F2DEA0';
  ctx.fill();
  ctx.closePath();
}

// mostra/desenha os pontos 
function mostraPontos() {
  ctx.font = '20px Arial';
  ctx.fillText(`pontos: ${pontos}`, canvas.width - 120, 30);
}

// desenha os bloquinhos no canvas
function desenhaBlocos() {
  bloquinhos.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visivel ? '#2A3740' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// mexer a barrinha
function moveBarrinha() {
  barrinha.x += barrinha.dx;

  // verifica se é parede ou não
  if (barrinha.x + barrinha.w > canvas.width) {
    barrinha.x = canvas.width - barrinha.w;
  }

  if (barrinha.x < 0) {
    barrinha.x = 0;
  }
}

// mexe a bolinha
function movebolinha() {
  bolinha.x += bolinha.dx;
  bolinha.y += bolinha.dy;

  // colisão com a direita/esquerda
  if (bolinha.x + bolinha.tam > canvas.width || bolinha.x - bolinha.tam < 0) {
    bolinha.dx *= -1; // bolinha.dx = bolinha.dx * -1
  }

  // colisão com o top/bottom
  if (bolinha.y + bolinha.tam > canvas.height || bolinha.y - bolinha.tam < 0) {
    bolinha.dy *= -1;
  }

  // colisão com a barra
  if (
    bolinha.x - bolinha.tam > barrinha.x &&
    bolinha.x + bolinha.tam < barrinha.x + barrinha.w &&
    bolinha.y + bolinha.tam > barrinha.y
  ) {
    bolinha.dy = -bolinha.velocidade;
  }

  // colisão com os blocos
  bloquinhos.forEach(column => {
    column.forEach(brick => {
      if (brick.visivel) {
        if (
          bolinha.x - bolinha.tam > brick.x && // lado esquerdo
          bolinha.x + bolinha.tam < brick.x + brick.w && // lado direito
          bolinha.y + bolinha.tam > brick.y && // top 
          bolinha.y - bolinha.tam < brick.y + brick.h // bot
        ) {
          bolinha.dy *= -1;
          brick.visivel = false;

          contarPontos();
          //oscillator.start();
        }
      }
    });
  });

  // colisão com o bot sem ser na barrinha
  if (bolinha.y + bolinha.tam > canvas.height) {
    mostraTodosBlocos();
    pontos = 0;
  }
}

// contar os pontos
function contarPontos() {
  pontos++;

  if (pontos % (linhasCount * linhasCount) === 0) {
    mostraTodosBlocos();
  }
}

// mostra todos os blocos
function mostraTodosBlocos() {
  bloquinhos.forEach(column => {
    column.forEach(brick => (brick.visivel = true));
  });
}

// desenha tudo no canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // limpar a tela
  desenhaBolinha();
  drawbarrinha();
  mostraPontos();
  desenhaBlocos();
}

// atualiza os desenhos e a animação no canvas
function update() {
  moveBarrinha();
  movebolinha();
  draw();
  requestAnimationFrame(update);
}

update();

// detecção das teclas p andar com a barra
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    barrinha.dx = barrinha.velocidade;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    barrinha.dx = -barrinha.velocidade;
  }
}

function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    barrinha.dx = 0;
  }
}

// adicionar os eventos do teclado
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);