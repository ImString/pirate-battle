# Pirate Battle

Jogo de combate naval no navegador, construído com React 19, TypeScript, PixiJS 8, `@pixi/react`, Zustand e Vite. Sobreviva até o fim do tempo e ganhe um ponto por inimigo destruído pelos seus disparos.

As regras de movimentação, combate, colisão e navegação dos inimigos estão implementadas em `src/game/entities` e `src/game/collision`. Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para os fluxos e decisões internas.

## Estado da solução

- Implementados: partida, dois tipos de inimigos, disparos frontais e laterais, colisões com terreno e limites, pausa, opções persistidas e histórico local paginado.
- Ranking: interface com estado vazio e paginação, sem fonte de dados ou integração remota conectada pelo `App`.
- Não há backend, seletor de cenários de rede, cache de ranking ou fila persistente de resultados pendentes.
- Playwright está nas dependências de desenvolvimento, mas o repositório ainda não contém configuração nem testes E2E.

## Setup

Use Node.js 22.12 ou superior e Yarn Classic 1.22.22, conforme o campo `packageManager` do `package.json`. O Vite instalado também aceita Node 20.19 ou superior da linha 20.

Na raiz do projeto:

```sh
yarn install --frozen-lockfile
yarn dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`. Se a porta estiver ocupada, ele poderá escolher outra. Em celulares e tablets, use a orientação horizontal. Para acessar pela rede local:

```sh
yarn dev --host 0.0.0.0
```

## Comandos

Os comandos usam os scripts existentes ou os executáveis locais instalados pelo Yarn.

| Objetivo                                | Comando        |
| --------------------------------------- | -------------- |
| Desenvolvimento                         | `yarn dev`     |
| Build, incluindo verificação de tipos   | `yarn build`   |
| Preview do build                        | `yarn preview` |
| Lint                                    | `yarn lint`    |
| Verificação de tipos sem gerar o bundle | `yarn tsc -b`  |

Para preview, rode primeiro `yarn build` e depois `yarn preview`; a porta padrão é 4173. O preview serve `dist/` e não é um servidor de produção.

## Variáveis de ambiente

Nenhuma variável de ambiente é exigida ou consumida pelo código atual. Não há `.env.example`, URL de API, credencial ou variável para escolher cenários. Criar uma variável `VITE_*` não habilita funcionalidades ainda ausentes.

As imagens e spritesheets são servidos de `public/assets`, por URLs absolutas `/assets/...`. A aplicação pressupõe publicação na raiz do domínio; hospedagem em subdiretório exige revisão desses caminhos.

## Controles e partida

No menu, use **Play** para iniciar, **Options** para configurar e **Match History** para consultar os resultados locais.

| Tecla  | Ação                                         |
| ------ | -------------------------------------------- |
| W      | Avançar na direção da proa                   |
| A / D  | Girar à esquerda / direita                   |
| Espaço | Disparo frontal, uma bala                    |
| Q / E  | Salva lateral esquerda / direita, três balas |
| ESC    | Pausar                                       |

Também há botões na tela para mouse e toque. Mantenha a tecla ou botão pressionado para movimentação ou disparos contínuos; as armas respeitam seus intervalos. Não há ré, inércia ou limite de munição. Girar sem avançar é permitido.

O botão de pausa abre **Resume**, **Options** e **Main Menu**. Perder foco, ocultar a aba ou girar um dispositivo com toque para vertical pausa a partida. O retorno exige **Resume**; os controles ativos são limpos para evitar movimento preso.

A partida termina quando o jogador perde os 100 pontos de vida ou o tempo chega a zero. **Play Again** inicia outra partida. Voltar ao menu cancela a partida e não registra um resultado. Recarregar perde a partida em andamento.

## Configuração de gameplay

Em **Options**, as alterações são salvas automaticamente e valem para novas partidas, inclusive quando feitas durante uma pausa. A configuração da partida atual é congelada ao iniciar.

| Campo                | Padrão       | Validação              | Interface                                |
| -------------------- | ------------ | ---------------------- | ---------------------------------------- |
| `duration`           | 120 s        | Inteiro entre 60 e 180 | Passos de 15 s                           |
| `enemySpawnInterval` | 6 s          | Inteiro entre 5 e 30   | Passos de 5 s, limitados às extremidades |
| `enemySpawnDistance` | 360 unidades | Número finito positivo | Apenas configuração em código            |

Os limites e padrões ficam em `src/game/config.ts`. O valor inicial de spawn é 6 s, embora o incremento visual seja 5 s; o validador aceita inteiros no intervalo, não exige múltiplos do passo. A distância de spawn não é salva nas opções locais.

Para restaurar as opções, execute no console do navegador, na origem da aplicação, e recarregue:

```js
localStorage.removeItem('pirate-battle:options');
location.reload();
```

Para apagar somente o histórico, substitua a chave por `pirate-battle:history`. Isso remove os resultados armazenados nessa origem. Portas diferentes têm armazenamento separado.

## Como reproduzir falhas e verificar recuperação

### Falha de imagens da interface

1. Bloqueie `*ui_scene_background.png*` antes de recarregar.
2. A inicialização deve exibir **Unable to load images** e a ação de tentar novamente. Requisições que ficam penduradas têm timeout de 30 s por imagem.
3. Remova o bloqueio e use a ação de retry. As imagens já carregadas são reaproveitadas.

### Falha dos spritesheets do jogo

1. Carregue o menu normalmente; depois bloqueie `*ships_miscellaneous_sheet.json*`.
2. Clique em **Play**. A carga rejeitada é registrada no console; a tela pode permanecer em **Preparing the ships for battle**.
3. Remova o bloqueio e recarregue para recuperar. Essa etapa ainda não tem mensagem de erro ou retry na interface.

### Falha ao salvar no navegador

No console, antes de mudar uma opção ou terminar uma partida, simule uma falha nas duas chaves da aplicação:

```js
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (key, value) {
	if (key === 'pirate-battle:options' || key === 'pirate-battle:history') {
		throw new DOMException('Falha simulada', 'QuotaExceededError');
	}
	return originalSetItem.call(this, key, value);
};
```

As opções continuam válidas para novas partidas nesta sessão. Um resultado finalizado continua visível no histórico em memória. A interface informa que não conseguiu salvar. Para resetar a simulação, execute `Storage.prototype.setItem = originalSetItem` no mesmo console. Uma nova alteração de opções ou uma nova partida concluída tenta salvar novamente; o histórico grava a lista inteira, incluindo os resultados anteriores ainda em memória. Não há retry automático. Recarregar antes de um salvamento bem-sucedido perde os dados não persistidos.

### Dados locais inválidos

```js
localStorage.setItem('pirate-battle:options', '{invalido');
localStorage.setItem('pirate-battle:history', '{invalido');
location.reload();
```

Faça isso apenas se puder descartar os dados locais existentes. O carregamento deve usar as opções padrão e histórico vazio, sem interromper a aplicação. Use os comandos de remoção das chaves para resetar. Entradas individuais inválidas de uma lista de histórico são descartadas.

### Pausa e limites do mapa

Inicie uma partida, mantenha W pressionado e alterne de aba: ao retornar, o tempo deve estar pausado e o controle liberado. Use **Resume**, aproxime-se das ilhas e dos limites e dispare: barcos devem parar no terreno e balas devem desaparecer ao atingir terreno/limites. Redimensionar a janela pode reposicionar barcos ou remover inimigos sem espaço válido; veja as limitações em [ARCHITECTURE.md](./ARCHITECTURE.md).
