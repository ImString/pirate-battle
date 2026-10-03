# Arquitetura

Este documento descreve a implementação presente no repositório. Ranking remoto, cenários de rede integrados e recuperação persistente de registros pendentes são requisitos ainda não implementados; não há contrato HTTP definido.

## Organização e responsabilidades

| Área | Responsabilidade |
| --- | --- |
| `src/app` | Navegação entre telas e preload de imagens da interface |
| `src/screens`, `src/components` | Menus, controles DOM, HUD, pausa, resultado e histórico |
| `src/game/entities` | Estado e regras de movimentação, ataques, IA e ciclo da partida |
| `src/game/collision`, `src/game/map` | Layout compartilhado, máscaras do terreno e consultas de colisão |
| `src/game/rendered` | Integração PixiJS, mapa e representação das entidades |
| `src/game/stores` | Estado Zustand de partida, configuração, histórico e texturas |
| `src/utils/ConfigStorage.ts`, `HistoryStorage.ts` | Contratos de leitura, validação e escrita local |
| `src/types` | Tipos compartilhados de domínio e navegação |

A organização separa regras de jogo de componentes visuais. As entidades são classes TypeScript; não dependem de React ou PixiJS. `Game` coordena as regras, enquanto barcos e projéteis recebem callbacks para consultar o mapa. A navegação usa um estado `ScreenPage` no `App`, sem roteador ou URLs por tela.

## React e PixiJS

React controla menus, HUD e botões HTML. `GameRenderer` monta `Application` de `@pixi/react`, registra `Container`, `Sprite` e `TilingSprite` com `extend`, ativa `ResizePlugin` e usa o ticker compartilhado. O canvas acompanha a janela. A inicialização também registra `@pixi/devtools`, sem condição por ambiente.

`GameEngine` usa `useTick` para conduzir a simulação e transforma as listas de entidades em componentes Pixi com IDs estáveis. `BoatRender` lê posição, rotação e vida da classe de domínio; os componentes de projétil e explosão seguem o mesmo modelo.

`useMatchStore` mantém referências mutáveis de `Game` e `Player`. Cada tick altera o domínio e publica `set({ game })`; os consumidores que assinam o store inteiro renderizam novamente, ainda que a referência de `game` seja a mesma. Isso simplifica a ligação entre simulação e UI, mas pode custar renderizações a cada frame. Um consumidor que selecionasse somente `state.game` não teria a mesma notificação pela igualdade da referência.

`getGameViewport` usa `scale = min(1, largura / 1280, altura / 720)` e divide as dimensões da janela por essa escala. A simulação trabalha em coordenadas lógicas, e o container Pixi aplica a escala. O mundo depende da proporção e do tamanho da janela, em vez de usar uma câmera sobre um mapa fixo.

## Ciclo da simulação

Fluxo principal:

```text
Controls → MatchStore → Game/Player
Ticker → GameEngine → MatchStore.tickGame → Game.update
Game → entidades, ataques, colisões, spawn e término
MatchStore → HistoryStore (ao terminar) + atualização da UI
```

`startMatch` resolve as opções, cria `Game`, define o mapa e adiciona um jogador próximo de 55% da largura e 60% da altura, procurando água livre se necessário. A configuração é congelada com `Object.freeze` por partida.

O primeiro tick após início ou retomada é descartado. `GameEngine` limita o delta do ticker a 0,1 s e pausa quando a página está oculta ou sem foco. `Game.update` rejeita deltas inválidos e divide o tempo recebido em subpassos de **no máximo 1/60 s**; o último pode ser menor. Não há acumulador de timestep fixo ou interpolação. A limitação do delta evita saltos grandes, mas descarta tempo de frames muito lentos.

Em cada subpasso:

1. Verifica derrota, atualiza tempo decorrido e contador restante.
2. Atualiza/remove explosões e remove inimigos mortos.
3. Move o jogador e processa ataques mantidos ou pendentes.
4. Escolhe o jogador vivo mais próximo para cada inimigo, move a IA e resolve abalroamento ou tiro.
5. Move projéteis, aplica dano e pontuação e remove projéteis inativos.
6. Verifica derrota e tempo esgotado; se ambos ocorrerem no passo, derrota tem precedência.
7. Acumula o intervalo de spawn e tenta criar o próximo inimigo.

Estados: `running`, `paused` e `finished`. Pausa e retomada limpam direções e ataques. `Escape`, perda de foco e mudança de visibilidade pausam; orientação vertical em dispositivos com toque também pausa via `OrientationGuard`. A retomada exige foco e visibilidade.

Os controles guardam fontes por ação, combinando teclado e múltiplos ponteiros. `pointer capture`, cancelamento e desmontagem liberam ações. A fila `pendingPlayerAttacks` preserva um toque de ataque entre ticks, sujeito ao cooldown; ela não é uma fila de resultados para sincronização.

## Movimentação, colisões e mapa

O barco gira e depois avança usando `x -= sin(rotação) × distância` e `y += cos(rotação) × distância`. Na rotação zero, a proa aponta para baixo na tela. A/D simultâneos cancelam a rotação. Não há aceleração, ré ou deslizamento; terreno bloqueia a proposta de movimento sem causar dano.

`MapLayout` fornece o mesmo layout de ilhas para renderização e colisão. `TerrainMasks` contém máscaras binárias de tiles 64 × 64 codificadas em base64, decodificadas uma vez. `MapCollision.resize` aplica posição e escala das ilhas aos colliders. Tiles sem máscara não bloqueiam o jogo, permitindo elementos decorativos.

As colisões usam:

- **Terreno:** círculo de raio 28 para barcos, consultado contra pixels sólidos da máscara; raio 6 para balas.
- **Limites:** caixa delimitadora alinhada aos eixos que considera a rotação do casco, com semidimensões originais 33 × 56,5. Ao girar perto da borda, a posição é ajustada para caber.
- **Barco/projétil e contato do Chaser:** distância entre centros comparada à soma dos raios.
- **Movimento:** avanço e trajetória dos projéteis subdivididos em deslocamentos de até 2 unidades para reduzir atravessamento de obstáculos.
- **Linha de visão:** amostragem a cada até 2 unidades com raio de consulta; ilhas impedem o tiro do Shooter.

Projéteis do jogador atingem apenas inimigos; projéteis inimigos atingem apenas jogadores. Uma bala aplica dano uma vez e é desativada. Não há colisão física geral entre barcos ou separação de inimigos sobrepostos.

Spawn começa em uma posição aleatória e, se necessário, busca água válida em uma grade de 8 unidades. A posição também precisa liberar pontos 32 e 64 unidades abaixo, para permitir o avanço inicial. A distância ao jogador considera o máximo entre a opção de distância, os raios mais 180 e, para Shooter, o alcance mais os raios. Inimigos também respeitam margem de 32 unidades entre seus raios no spawn. Se não houver lugar, a tentativa é descartada; a alternância de tipos só avança após sucesso.

Em resize, jogadores inválidos são reposicionados; inimigos inválidos procuram outro spawn ou são removidos. Balas fora da área válida desaparecem. Não é uma partida determinística: o spawn usa `Math.random` e o mundo muda com a janela.

## IA, combate e balanceamento

`Enemy` compartilha orientação e busca de caminho entre Chaser e Shooter. Tenta aproximação direta e usa A* em oito direções, com grade de 28 unidades e limite de 600 nós fechados quando o terreno bloqueia. Recalcula após 1 s, deslocamento do alvo de pelo menos 56 unidades ou bloqueio de avanço. A navegação verifica segmentos em passos de até 8 unidades. Se não alcançar o alvo, retorna o caminho do nó que mais se aproximou; não garante solução global.

| Regra | Valor atual |
| --- | --- |
| Vida de todos os barcos | 100 |
| Velocidade do jogador | 180 unidades/s |
| Rotação do jogador | 1,5π rad/s |
| Velocidade Chaser / Shooter | 160 / 130 unidades/s |
| Rotação dos inimigos | π rad/s |
| Abalroamento do Chaser | 25 de dano; o próprio inimigo é destruído |
| Shooter | Alcance 300; para a 210 se puder se aproximar diretamente |
| Tiro do Shooter | Intervalo 1,4 s, linha de visão e mira com tolerância de 10° |
| Ataque frontal do jogador | Uma bala a cada 0,4 s |
| Ataque lateral do jogador | Três balas paralelas por lado a cada 0,9 s |
| Bala | 10 de dano, 460 unidades/s, vida máxima 3 s |
| Explosão | 0,6 s |
| Pontuação | +1 por inimigo morto por projétil do jogador |

O jogador é mais rápido que ambos os inimigos, permitindo escapar e reposicionar. As armas têm cooldowns independentes, podendo disparar simultaneamente. Salvas laterais ampliam a cobertura; o frontal tem cadência maior. O Chaser sacrifica o próprio casco sem conceder ponto de combate. O Shooter começa com cooldown cheio, precisa mirar e não atira através de ilhas. Os spawns alternam Chaser/Shooter para combinar pressão de contato e distância, sem progressão automática de dificuldade.

Esses valores são decisões codificadas, não balanceamento validado por telemetria. Configurações de duração/spawn e dimensões de mapa diferentes não têm normalização de pontuação; seriam relevantes para comparar resultados em um ranking futuro.

## Gerenciamento de recursos e cache

O preload de UI usa objetos `Image`, seis cargas concorrentes e timeout de 30 s por imagem. Só libera o menu quando todas as imagens requeridas estão prontas. Mantém um `Map` de imagens decodificadas durante a sessão, compartilha a promise de carga e oferece retry que reaproveita sucessos. Não há descarte explícito desse cache antes do reload.

`TextureStore` carrega três spritesheets locais com `Assets.load`: mapa, barcos e UI. Uma cadeia de promises serializa carga e descarte, evitando operações concorrentes de desmontagem/remontagem. Sheets já presentes são reutilizados; `Assets` também gerencia seu cache.

Ao desmontar `GameRenderer`, o descarte é adiado com `setTimeout(0)` e só ocorre se não há partida ou ela terminou. Partidas pausadas preservam texturas para voltar de Options. `destroyAllTextures` limpa o store e chama `Assets.unload`. `BoatRender` destrói as texturas derivadas das barras de vida na desmontagem, preservando a fonte compartilhada. Entidades inativas são removidas das listas; não há pool de objetos.

Uma falha de spritesheet chega ao console, mas mantém `isLoading` sem uma interface de erro/retry. A recuperação operacional é remover a falha e recarregar. Os arquivos de áudio existem em `public/assets/sounds`, porém não há reprodução de áudio implementada.

## Persistência local e contratos

Os stores inicializam a partir de `localStorage`, com leitura/escrita protegidas por `try/catch`. Não há persistência de partida em andamento ou sincronização entre abas.

**Opções:** chave `pirate-battle:options`, JSON com `duration` e `enemySpawnInterval`. A resolução valida cada valor e aplica seu padrão quando inválido. `enemySpawnDistance` é configuração de código e não é restaurada do armazenamento.

**Histórico:** chave `pirate-battle:history`, array com até 100 entradas. O contrato em `src/types/history.ts` é:

```ts
interface HistoryEntry {
  id: string;
  completedAt: string;
  points: number;
  duration: number;
  result: 'time-up' | 'defeated';
}
```

O produtor usa UUID (ou fallback com data e aleatoriedade), timestamp ISO, pontuação e duração decorrida em segundos inteiros. A leitura exige ID não vazio, data parseável, pontuação/duração inteiras seguras não negativas e resultado válido. Remove entradas inválidas, ordena por data decrescente, deduplica por ID e limita a 100; JSON inválido retorna lista vazia. Essa limpeza na leitura não reescreve o armazenamento automaticamente.

`MatchStore.tickGame` registra o resultado após a transição de término; ticks seguintes não processam partidas finalizadas. `HistoryStore.recordMatch` também evita duplicação por ID, insere no início e salva a lista completa. Cancelamento e reload durante a partida não geram registro. `HistoryScreen` mostra cinco entradas por página; o nome exibido é estático, sem conta de usuário.

Falha de escrita mantém os dados no store em memória e marca `historySaveFailed` ou `configSaveFailed`. O histórico e o resultado final mostram o aviso; Options mostra o aviso de configuração. Uma nova escrita bem-sucedida limpa a respectiva flag.

## Ranking, contratos remotos e recuperação de pendências

A integração existente conecta o menu e a aba do histórico a `RankingScreen`. A tela aceita uma prop opcional `entries` e pagina em blocos de cinco, mas `App` não fornece essa prop; a aplicação exibe a lista vazia. O tipo visual `RankingEntry` contém `id`, `date`, `time`, `points`, `duration` e `result`, sem validação, busca ou ordenação de dados integrada. Não há chamadas HTTP, endpoints, autenticação, paginação remota, timeout, política de retry ou contrato de resposta. Axios consta das dependências, mas não é usado. `HistoryEntry` e `RankingEntry` não devem ser tratados como contratos de uma API existente.

Não existe cache de ranking, TTL ou fallback de dados remotos. O histórico carregado em Zustand é uma cópia local para a sessão, distinta dos caches de assets descritos acima.

Também não existe outbox durável, estado `pending/synced`, retry ao reconectar ou idempotência no servidor. Se a escrita local falhar, uma nova partida concluída tenta salvar a lista inteira e pode recuperar os resultados ainda em memória. Duplicar o mesmo ID não força retry, porque `recordMatch` retorna antes da escrita. Fechar/recarregar antes de salvar perde os registros não persistidos.

Para atender futuramente à integração remota, ainda seria necessário definir contratos, ordenação e paginação de ranking, identidade, validação do resultado, chave de idempotência, cache com expiração e fila persistente com confirmação/retry. São lacunas de implementação, não garantias da versão atual. A seleção manual e o reset de falhas de assets estão documentados no [README.md](./README.md).

## Limitações

- Ranking e cenários de rede integrados não implementados; sem testes Playwright/configuração apesar da dependência instalada.
- Sem validação autoritativa de pontuação: dados e relógio local podem ser alterados pelo usuário.
- Colisões circulares aproximam o casco; a proa visual pode se aproximar mais do terreno que o centro permite. Barcos podem se sobrepor fora do contato específico do Chaser.
- A* tem orçamento limitado; grande quantidade de inimigos pode aumentar o custo de CPU. Não há índice espacial, limite explícito de inimigos ou pool.
- Publicação de estado e reconciliação React por frame podem limitar desempenho em dispositivos modestos.
- Resize pode alterar a dificuldade ao reposicionar/remover entidades. Falta de água válida para o jogador não possui tratamento visual específico.
- A explosão de derrota é criada no domínio, mas a tela final desmonta o renderer; sua animação não é apresentada até o fim.
- Persistência depende da origem e disponibilidade de `localStorage`; não há schema versionado, migração, backup ou recuperação após perda de uma escrita.
- Assets pressupõem a raiz `/assets`; não há service worker ou garantia de funcionamento offline após reload.
