# 🎮 Estrutura do Jogo – Evolução dos Videogames

## 📌 1. Conceito Geral

O jogo será um multiplayer em um campo 2D (visão top-down), onde vários jogadores competem coletando objetos que representam elementos da história dos videogames.

O jogo será dividido em fases. Cada fase representa uma geração específica da evolução dos videogames.

Os jogadores devem coletar apenas os objetos que pertencem à geração atual.

---

## 🗺️ 2. Estrutura do Campo

- O jogo acontece em um mapa 2D desenhado no Canvas.
- Os jogadores são representados por quadrados.
- Os objetos aparecem em posições aleatórias do mapa.
- Todos os jogadores disputam os mesmos objetos.

---

## 👤 3. Jogadores

Cada jogador terá:

- Posição (x, y)
- Velocidade
- Pontuação
- Identificador (nome ou número)

O jogador pode se mover pelo mapa usando o teclado.

---

## 📦 4. Objetos

Cada objeto terá:

- Nome
- Geração à qual pertence
- Posição (x, y)
- Status (ativo ou coletado)

Exemplo conceitual:

Objeto:
- Nome: "Atari 2600"
- Geração: 1

---

## 🧠 5. Sistema de Gerações

O jogo será dividido em fases, onde cada fase representa uma geração histórica.

Exemplo de gerações:

### Geração 1 (1970–1980)
Elementos corretos:
- Pong
- Atari 2600
- Cartuchos
- Jogos 2D simples

Elementos incorretos:
- PlayStation 5
- Jogos online
- Realidade Virtual

---

### Geração 2 (1990)
Elementos corretos:
- Super Nintendo
- Mega Drive
- Jogos 16 bits
- CDs

Elementos incorretos:
- Cloud Gaming
- Jogos Mobile

---

### Geração 3 (2000)
Elementos corretos:
- PlayStation 2
- Xbox
- Jogos 3D avançados
- Multiplayer online

Elementos incorretos:
- Streaming de jogos
- VR moderno

---

### Geração Atual
Elementos corretos:
- PlayStation 5
- Xbox Series X
- Jogos em nuvem
- Realidade Virtual
- Jogos Mobile

---

## 🎯 6. Sistema de Pontuação

- Se o jogador coletar um objeto da geração atual → +1 ponto.
- Se coletar um objeto de outra geração → -1 ponto.

O objeto desaparece após ser coletado.

---

## ⏱️ 7. Sistema de Fases

- Cada fase tem tempo limitado (ex: 2 minutos).
- Durante a fase, apenas uma geração é válida.
- Ao final do tempo, o jogo avança para a próxima geração.
- Os objetos passam a pertencer à nova geração.

---

## 🏆 8. Condição de Vitória

- Após todas as gerações serem concluídas, vence o jogador com maior pontuação total.
- O ranking final é exibido na tela.

---

## 🔄 9. Fluxo do Jogo

1. Tela inicial
2. Início da Fase 1 (Geração 1)
3. Jogadores coletam objetos
4. Tempo acaba
5. Início da próxima geração
6. Repetir até última geração
7. Tela final com ranking