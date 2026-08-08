# Landing page — Comunidade Árvore da Vida

Data: 2026-08-08
Status: aprovado para plano de implementação

## Objetivo

Página única que serve duas portas de entrada:

1. **Busca no Google** — quem procura "igreja em Lucas do Rio Verde" ou o nome da comunidade encontra a página e vê horário, endereço e identidade em segundos.
2. **Link da bio do Instagram** — tráfego quase totalmente de celular, decisão em poucos segundos, precisa de ações imediatas (como chegar, horários, redes).

Além disso, a página é o documento institucional público: história, missão, visão, valores, estrutura de cuidado e o credo completo ("Como Cremos").

Não é objetivo desta fase: blog, agenda de eventos, transmissão ao vivo embutida, doações online, área de membros.

## Dados confirmados

| Campo | Valor | Fonte |
|---|---|---|
| Endereço | Av. das Emas, 2240W — Parque das Emas, Lucas do Rio Verde/MT | Instagram |
| Culto | Domingos, 18h | Instagram |
| Bio | "Conhecer a Deus e torná-Lo conhecido 🌳" | Instagram |
| Instagram | https://www.instagram.com/comunidadearvoredavida | fornecido pelo usuário |
| YouTube | https://youtube.com/@ArvoredaVidaLRV | Instagram |
| Fundação | Abril de 2017 | folder |

Pendentes, entram como marcadores em `content/site.json`: WhatsApp/telefone, e-mail, horários de GCs e demais reuniões, coordenadas geográficas exatas, fotos.

## Layout

**Bento Grid como base, Split Sticky na seção do credo.**

O bento sobrevive melhor à tela de celular vinda do Instagram: cada card é uma resposta inteira e o endereço é encontrado sem leitura linear. O credo, por ser longo (20 declarações), ganha no desktop um painel lateral fixo com índice e no mobile vira acordeão.

A identidade visual do folder impresso vive nos fundos e separadores — não na estrutura.

### Sistema visual

Extraído do folder:

| Token | Valor |
|---|---|
| `verdeEscuro` | `#44581A` |
| `verdeLimao` | `#A3C63C` |
| `creme` | `#F7F5EC` |
| `grafite` | `#1F1F1C` |

Elementos: blobs orgânicos em SVG inline, círculos sólidos, contornos finos em limão, o motivo `✕✕✕` como separador de seção, grade pontilhada. Tipografia Poppins via `next/font` — títulos bold caixa-alta, corpo light.

Fotos: slots circulares/orgânicos que hoje renderizam gradientes no estilo do folder. Trocar por foto real = alterar um caminho em `content/site.json`.

### Seções

| # | Âncora | Conteúdo |
|---|---|---|
| 1 | `#inicio` | Hero: marca, "Conhecer a Deus e torná-Lo conhecido", CTA "Venha nos visitar" |
| 2 | — | Ações rápidas (visível sem rolagem no celular): Como chegar · Horários · Instagram · YouTube |
| 3 | `#historia` | História desde a garagem em Abril/2017 |
| 4 | `#missao` | Missão, Visão (5 itens), Valores (14 chips) — cards bento de tamanhos desiguais |
| 5 | `#cuidado` | Conectar – Crescer – Servir, CTA para os Grupos de Conexão |
| 6 | `#lideranca` | Liderança plural por presbíteros |
| 7 | `#credo` | "Como Cremos" completo, Split Sticky / acordeão, 6 grupos |
| 8 | — | Citação em destaque: "Essas crenças são a base do nosso alicerce…" |
| 9 | `#visita` | Endereço, mapa embutido, horário |
| 10 | — | Rodapé: Instagram, YouTube |

### Agrupamento do credo

As 20 declarações do folder, em 6 grupos de acordeão:

1. **As Escrituras** — Bíblia
2. **Deus, Cristo e o Espírito** — Trindade e criação; Jesus Cristo; Espírito Santo
3. **Queda e salvação** — queda; regeneração; salvação e livre-arbítrio; batismo em águas; batismo no Espírito Santo; dons do Espírito
4. **Família e papéis** — família, casamento e sexualidade; papéis do homem e da mulher
5. **A Igreja** — autonomia da igreja local; reuniões e ceia; caridade; disciplina; sacerdócio de cada crente
6. **Generosidade e últimas coisas** — generosidade e contribuição; ressurreição dos mortos; juízo vindouro

Texto reproduzido integralmente, com todas as referências bíblicas preservadas. Correções apenas de erros tipográficos evidentes do folder ("EspíritoSanto" → "Espírito Santo", "imutávelde" → "imutável de", "procura-los" → "procurá-los").

## Arquitetura

Next.js 15 (App Router) + TypeScript + Tailwind v4. Página única com âncoras, renderizada estaticamente.

```
app/
  layout.tsx          fontes, metadados globais, JSON-LD
  page.tsx            monta as seções na ordem
  editar/page.tsx     editor visual, só em dev
  api/content/route.ts  GET/PUT de site.json, só em dev
  sitemap.ts
  robots.ts
components/
  sections/           Hero, AcoesRapidas, Historia, MissaoVisaoValores,
                      Cuidado, Lideranca, Credo, Citacao, Visita, Rodape
  ui/                 Card, Acordeao, Chip, SeparadorXXX
  decor/              Blob, Circulo, GradePontilhada
content/
  site.json           todo o conteúdo e os tokens de tema
  schema.ts           Zod: valida site.json no build
  load.ts             lê + valida, exporta tipado
```

Cada seção é um componente que recebe sua fatia do conteúdo por props e não importa `site.json` diretamente. Isso mantém os componentes testáveis isoladamente e impede que texto fixo se espalhe pelo código.

## Camada de edição

`content/site.json` concentra 100% do que muda: tokens de cor, textos de todas as seções, as 20 declarações do credo, endereço, horários, links sociais, caminhos de imagem. Nenhum componente carrega texto fixo — o que não está no JSON não aparece na tela.

**Validação.** `content/schema.ts` define o schema Zod. `content/load.ts` valida na importação, então o build falha com mensagem de campo (`visita.horarios está faltando`) em vez de publicar página quebrada.

**Editor visual.** `/editar` renderiza um formulário com um campo por item do JSON e um botão salvar, que escreve via `api/content`. Ambos verificam `process.env.NODE_ENV === 'development'` e retornam 404 em produção — o editor não existe no site publicado.

**Tema.** Os tokens de cor viram variáveis CSS na raiz do `layout.tsx`. Alterar `verdeEscuro` no JSON repinta o site inteiro.

Fase 2 (fora deste escopo): Decap CMS sobre o mesmo JSON, para edição pelo celular com login do GitHub.

## SEO

- `metadata` do Next em pt-BR: title, description, canonical, Open Graph e Twitter Card, com imagem OG própria.
- **JSON-LD `Church`** em `layout.tsx`: `name`, `address` (PostalAddress completo), `geo`, `openingHoursSpecification` (domingo 18h), `sameAs` com Instagram e YouTube, `url`. É o que permite ao Google exibir horário e mapa no resultado.
- `app/sitemap.ts` e `app/robots.ts`.
- HTML semântico: um `h1`, `h2` por seção, âncoras nomeadas.
- Core Web Vitals: sem imagens pesadas acima da dobra, fontes com `next/font` (sem FOUT), decoração em SVG inline.

Ação fora do código, do lado da igreja: criar ou reivindicar o **Perfil da Empresa no Google**, que é quem domina a busca local, e vincular esta página como site oficial.

## Acessibilidade e responsividade

Mobile-first — a maioria do tráfego chega pelo link do Instagram. Contraste mínimo AA em todas as combinações dos tokens (o par limão sobre creme precisa de verificação e provavelmente só serve para elementos decorativos ou texto grande). Acordeão do credo operável por teclado, com `aria-expanded` e `aria-controls`. Blobs decorativos marcados `aria-hidden`.

## Testes

- **Schema** — `site.json` real passa no Zod; JSON incompleto falha com a mensagem esperada.
- **Componentes** — cada seção renderiza os campos que recebe; o acordeão abre, fecha e responde ao teclado.
- **SEO** — o JSON-LD gerado é parseável e contém endereço, horário e `sameAs`.
- **Rotas de dev** — `/editar` e `api/content` retornam 404 com `NODE_ENV=production`.

## Erros e degradação

Campo de texto vazio no JSON: o bloco correspondente não renderiza, em vez de deixar um card vazio. Marcador ainda não preenchido (`[WHATSAPP]`): o botão não aparece. Mapa embutido bloqueado ou offline: cai para link "Abrir no Google Maps".

## Entrega

Hospedagem na Vercel (plano gratuito). Domínio próprio a registrar pela igreja — sugestão `arvoredavidalrv.com.br` no Registro.br. Sem domínio a página funciona em `*.vercel.app`, com desempenho menor na busca.

---

## Apêndice — conteúdo transcrito do folder

Fonte durável do texto que irá para `content/site.json`.

### História

A Comunidade Árvore da Vida nasceu em Abril de 2017. Diante da revelação da Nova Aliança e de tudo que a obra consumada da Cruz nos proporcionou, um grupo de pessoas apaixonadas por Jesus e pelo Seu Reino, ligadas em amor, começou a se reunir em uma garagem para adorar e buscar direções de como manifestar esse Reino através de um Evangelho simples mas cheio de Poder, dando testemunho de Cristo. Esse grupo foi crescendo e debaixo de Uma Palavra da parte de Deus nasceu a Comunidade Árvore da Vida, uma Igreja bíblica, dinâmica e orgânica!

Nosso orgulho não é ser da Comunidade Árvore da Vida. Nosso maior orgulho é ser Igreja de Jesus Cristo, o Senhor!

Seguimos na direção mais importante, que é cumprir a Grande Comissão (Mateus 28.19-20) e viver o Grande Mandamento (Marcos 12.30-31) de nosso Senhor Jesus Cristo até a Sua volta. Assim sabemos que todas as demais questões são apenas meios e, por isso, periodicamente, passamos por processos de ajustes e reajustes, conduzidos pelo Senhor. Contudo, seguimos prioritariamente cumprindo o chamado e obedecendo ao Espírito e à Palavra de Deus, sabendo que Jesus nunca disse que seria fácil, mas Ele disse "… eu estarei sempre com vocês, até o fim dos tempos" (Mateus 28.20).

### Missão

Desejamos revelar o amor do Pai através do evangelho de Jesus, formando discípulos que manifestem este amor através de milagres, sinais e maravilhas, operando nos dons, vivendo uma vida de compaixão e poder, em unidade com o Corpo, envolvendo-se na grande comissão, partindo do princípio de amar a Deus e as pessoas.

### Visão

Amar a Deus; Pregar a Cristo; Servir a todos; Andar em unidade; Manifestar o Reino.

### Valores

Autoridade da Palavra de Deus; Disciplina espiritual; Obra consumada da cruz; Intimidade com o Espírito Santo; Bondade imutável de Deus; Identidade; Manifestação do sobrenatural; Cultura do Reino; Honra; Discipulado; Famílias fortes; Coração ensinável; Generosidade; Adoração.

### Liderança

Cremos na liderança plural da Igreja, através dos Presbíteros, exemplificada no Novo Testamento.

### Cuidado — Conectar, Crescer, Servir

Somos uma família vibrante de crentes cheios de esperança que experimentam profundamente o amor e a presença de Deus e fazem parceria com Jesus para expressar a alegria e o poder de Seu reino em todas as áreas da vida.

**Conectar — Grupos de Conexão.** Ser igreja é muito mais do que um Culto no fim de semana. É sobre conectar-se com outras pessoas, crescer em sua fé e construir uma base sólida para você e sua família. Pensando nisso, nossa igreja possui os Grupos de Conexão (GCs). Por meio da estrutura dos Grupos as pessoas podem ser acompanhadas e discipuladas de perto; lá nós conseguimos promover o discipulado pessoal por meio do crescimento mútuo entre líder e liderado, trazendo e criando a conexão entre pessoas. Os grupos existem para as pessoas serem cuidadas, mas além disso, para serem preparadas, viverem milagres em suas vidas pessoais, serem treinadas e preparadas para servir.

**Crescer.** Pensamos em outras formas de colaborar com o crescimento dos membros além do discipulado, que é essencial; eles podem crescer em conhecimento e serem transformados através de aulas, workshops, retiros e treinamentos ao longo do ano. Não importa em que estágio da vida você está, queremos que você esteja em comunhão com pessoas que o encorajam, ajudam você a crescer!

**Servir.** A igreja não espera cuidar de tudo para fazer algo, mas ela cuida fazendo e faz cuidando. As pessoas que são cuidadas e desenvolvidas nos GCs e que, por serem cuidadas, podem exercer seus dons e talentos de forma específica, são encorajadas a servir como cooperadoras em algum dos nossos departamentos. Acreditamos que uma parte valiosa de ser uma comunidade saudável e florescente é estar sendo ativamente envolvido e adicionando força!

### Como Cremos

Somos uma Comunidade evangélica fundamentada nas Sagradas Escrituras. Esse é um resumo de nossas convicções básicas – devendo ser conhecida e abraçada por todos os nossos membros:

**1. A Bíblia.** CREMOS na inspiração divina da Bíblia Sagrada (2Tm 3.16-17), que se deu por meio da ação do Espírito Santo, usando homens escolhidos (2Pe 1.21), cujo conteúdo é inalterável (Dt 4.2; Ap 22.18,19) e não atualizável (Mt 24.35), para por meio dela nos conduzir à vida eterna (Jo 5.39). A mesma é nossa única regra de fé e prática, que devemos obedecer (Dt 27.10) e jamais podemos ultrapassar (1Co 4.6; Is 8.20). Sua interpretação depende da concordância e soma de suas declarações (Mt 4.5-7; At 15.15).

**2. Deus.** CREMOS em um único Deus (Ef 4.6), eterno (Gn 21.33), revelado em três Pessoas distintas que são iguais em poder, glória e majestade: o Pai, o Filho e o Espírito Santo (Mt 28.19; 2Co 13.13); Criador do Universo, de todas as coisas que há nos céus e na terra (Ap 4.11), visíveis e invisíveis (Hb 11.3), e, em especial, a coroa da Sua criação: os seres humanos (Sl 8.3-8), por um ato sobrenatural e imediato, e não por um processo evolutivo (Gn 2.7; Hb 11.3; Ap 4.11).

**3. Jesus Cristo.** CREMOS no Senhor Jesus Cristo, o Filho de Deus (Hb 4.14), plenamente Deus (Fp 2.5-8; Cl 2.9), plenamente Homem (1Tm 2.5), em sua concepção sobrenatural e nascimento virginal (Mt 1.20-25), em sua morte substitutiva e expiatória (Rm 4.24,25), em sua ressurreição corporal dentre os mortos (Lc 24.36-43; At 3.15) e em sua ascensão aos céus (Lc 24.50,51) de onde há de retornar (At 1.10,11) para consumar sua obra redentora (Fp 3.20,21).

**4. Espírito Santo.** CREMOS no Espírito Santo, junto com o Pai e o Filho, que convence os homens do pecado (Jo 16.11), que regenera o pecador conduzindo à experiência do novo nascimento (Jo 3.5; Tt 3.5); habita no corpo dos justificados (1Co 3.16), é chamado de "o selo da promessa" e "a garantia de nossa herança" (Ef 1.13,14) e guia os filhos de Deus (Jo 16.13; Rm 8.14; 1Jo 2.20,27).

**5. A queda do ser humano.** CREMOS na queda do ser humano, que se deu por meio de Adão e afetou toda a raça humana (Rm 5.12), destituindo-o da glória de Deus com a qual foi criado (Rm 3.23) e que somente o arrependimento (Lc 24.47) seguido da fé (Ef 2.8) na obra redentora de Jesus Cristo pode salvá-lo da ira divina (Rm 5.9) e condenação ao inferno (Mt 23.33) e torná-lo herdeiro da vida eterna (Tt 3.4-7).

**6. Regeneração.** CREMOS na necessidade da regeneração que se dá pela Palavra de Deus (1Pe 1.23) e obra do Espírito Santo (Tt 3.5), a qual Jesus denominou como novo nascimento (Jo 3.5), obra da graça divina recebida através da fé em Jesus Cristo (Ef 2.8,9). Tal experiência engloba o perdão dos pecados, a justificação e o início de um processo de santificação (1Co 6.11) que deve ser aperfeiçoado ao longo da caminhada cristã (2Co 7.1).

**7. Salvação e livre-arbítrio.** CREMOS que a salvação é disponibilizada a todos (Mt 11.28; 1Tm 2.4; 2Pe 3.9) e que o homem é responsável por suas escolhas e decisões (Js 24.15), exercendo livre-arbítrio, e podendo tanto atender ao chamado divino (1Co 7.17) que se dá por meio da sua Palavra que inspira a fé (Rm 10.17), como também resistir à ação divina (At 7.53; Hb 3.7,8) e rejeitar a oferta redentora (Mt 23.37; Jo 5.40; At 13.46).

**8. Batismo em águas.** CREMOS no batismo ordenado por Jesus (Mt 28.19; Mc 16.16) realizado por imersão em águas (At 8.35-39), que expressa publicamente nossa fé (que se identifica, apropria e confessa) na substituição realizada por Cristo em sua morte, sepultamento, ressurreição (Rm 6.3-5) e posição à direita de Deus (Ef 2.6), sendo o selo da fé na nova aliança assim como a circuncisão o foi na antiga aliança (Cl 2.11,12; Rm 4.11).

**9. Batismo no Espírito Santo.** CREMOS no batismo no Espírito Santo, efetuado por Jesus Cristo (Lc 3.15,16).

**10. Dons do Espírito.** CREMOS nos dons do Espírito Santo, que são distribuídos conforme a Sua vontade (1Co 12.11) para edificação da Igreja (1Co 14.5) e que todo o cristão deve procurá-los com zelo (1Co 12.31).

**11. A família.** CREMOS na família, como instituição divina, iniciada pelo casamento entre homem e mulher (Mt 19.4-6) e ampliada pela reprodução dos filhos, sendo que o casamento deve ser digno de honra (Hb 13.4), monogâmico (1Tm 3.2), havendo fidelidade entre os cônjuges e exclusividade no ato conjugal (Mt 5.27,28; 1Co 7.1-5). O novo casamento é permitido, caso seja dissolvido mediante a morte de um dos cônjuges (Rm 7.2; 1Co 7.39) ou em caso de adultério da outra parte (Mt 5.31,32; Mt 19.7-9) – embora em tais circunstâncias acreditemos que primeiro se ofereça perdão e se lute pela reconciliação e restauração. Considerando os parâmetros bíblicos da definição de família, interpretamos como pecado tudo o que, além de desobediência às instruções bíblicas (1Jo 3.4), colide com a revelação do plano divino para a família e a vida conjugal determinada pelo Criador, como as práticas sexuais da fornicação (sexo antes do casamento) e adultério (relação com quem não seja o cônjuge), pois desonram o matrimônio (Hb 13.4); a homossexualidade (Rm 1.26,27; Lv 18.22; 1Co 6.9), a bestialidade (relação com animais – Lv 18.23).

**12. Papéis do homem e da mulher.** Os papéis do homem e da mulher são bem definidos em nosso credo e sua importância vai além da questão reprodutiva; o governo do lar é atribuído ao homem, denominado de cabeça (Ef 5.23; 1Co 11.3) e a quem a esposa deve submissão (Ef 5.22-24; 1Pe 3.1), e esse valor se estende ao governo da igreja – onde as esposas não podem exercer autoridade sobre seus maridos (1Tm 2.12), embora possam servir juntamente com eles (1Co 9.5), inclusive no pastorado. A liderança do homem, em contrapartida, deve ser amorosa, sacrificial e servidora (1Pe 3.7; Cl 3.19), tanto em casa quanto na Igreja (1Pe 5.1-3). Tais distinções visam a funcionalidade prática da estrutura familiar e da igreja sem diminuir a importância, enquanto pessoa, das mulheres – da mesma forma que a submissão que os filhos devem aos seus pais (Ef 6.1-3) não lhes diminui valor e nem significa direito dos pais a abuso comportamental no exercício da sua autoridade (Ef 6.4).

**13. Autonomia da igreja local.** CREMOS na autonomia da igreja local. Ele é a cabeça do corpo formado pelo seu povo – isto é, sua igreja (Cl 1.18). Cremos na Igreja, que é o corpo de Cristo (Ef 1.22,23) e por Ele edificada (Mt 16.18), a universal assembleia dos justos aperfeiçoados (Hb 12.22,23), coluna e fundamento da verdade (1Tm 3.15). Além do aspecto espiritual, essa Igreja também é expressa fisicamente pela congregação dos fiéis (Hb 10.25) em diferentes localidades (Ap 1.11), tendo suas reuniões públicas e nas casas (At 20.20), sem nenhum dia semanal distinto dos demais (Rm 14.5; Cl 2.16,17).

**14. Reuniões e ceia.** Tais ajuntamentos visam a pregação do evangelho (At 5.42), adoração e edificação mútua (1Co 14.26) e celebração da ceia memorial da nova aliança instituída pelo Senhor Jesus – com uso do pão e do fruto da vide (Mt 26.26-29; 1Co 11.23-26). A expressão da fé de seus membros é vista, principalmente, pela obediência das Escrituras (Rm 16.26) e aos mandamentos de Jesus (Mt 28.19; Lc 6.46; Jo 14.21). O posicionamento em prol da verdade (Pv 23.23) e da justiça (Mt 5.6).

**15. Caridade.** A prática da caridade e assistência aos necessitados, que começa por seus membros, também deve se estender a todos, incluindo os de fora da comunidade cristã (Gl 6.10). Nosso credo é uma expressão de obediência que inclui a questão comportamental dos que abraçam a mesma fé e, juntos, almejam andar nela. Não obriga os de fora às mesmas crenças e práticas e nem lhes diminui o valor enquanto pessoas; apenas determina a permanência ou não em nossa comunidade de fé.

**16. Disciplina.** CREMOS na prática da disciplina daqueles que compõem a igreja e pecaram, iniciando pela correção pessoal, estendendo-se à exortação com testemunhas, ao confronto público e podendo terminar com a exclusão (Mt 18.15-17; 1Co 5.2,13). Essa última medida se refere a quem se denomina irmão sem que seu comportamento sustente isso (1Co 5.9-13) e visa poupar a congregação de prejuízos espirituais (1Co 12.26) – embora não signifique proibição à assistência aos cultos, envolve deixar de se relacionar (Tt 3.10,11) e afastar de responsabilidades. O propósito da disciplina não é tratar como inimigo (2Ts 3.14,15) mas tentar promover a restauração (2Tm 2.24,25).

**17. Sacerdócio de cada crente.** CREMOS no sacerdócio e ministério de cada crente (Ap 1.6) bem como na responsabilidade de cada membro do Corpo na edificação da obra de Deus (1Co 12.12-27).

**18. Generosidade.** CREMOS na lei da semeadura e colheita e na generosidade como expressão de quem nós somos em Cristo. Na Nova Aliança, a compreensão da entrega e da contribuição transcende o simples cumprimento de uma regra sobre o pagamento de 10% de dízimos (Mt 5.20). Essa perspectiva vai além de cumprir uma obrigação moral ou legal, pois se baseia na totalidade do princípio do amor e da gratidão a Deus. Ofertas jamais devem ser entregues como uma forma de "barganha" com Deus, ou para ser abençoado. Devemos ofertar motivados pelo amor e com uma atitude de fé e obediência, com alegria e gratidão (2Co 9.6-7). A Nova Aliança enfatiza que a motivação para dar deve ser o amor ao próximo e a Deus, e não o medo de retaliação ou a ameaça de uma maldição. É um chamado para viver em liberdade e em resposta ao sacrifício supremo de Jesus, que nos redimiu e nos libertou de toda maldição.

**19. Ressurreição dos mortos.** CREMOS na ressurreição dos mortos (Mt 22.23-32) como rudimento da doutrina de Cristo (Hb 6.1,2), sendo que haverá distinção de destino dos ressuscitados para a vida eterna e para juízo eterno (Dn 12.2; Jo 5.29).

**20. Juízo vindouro.** CREMOS no juízo vindouro (Hb 9.27) como rudimento da doutrina de Cristo (Hb 6.1,2), que se dará a partir do regresso de Cristo (Ap 22.12), sendo que haverá julgamento das obras dos santos (2Co 5.10) sem questionar o mérito da salvação (1Co 3.15) e também dos ímpios (Ap 20.12-15), não mais havendo oportunidade de salvação (Mt 25.46) e dando, então, início ao estado eterno onde nada mais será mudado (Ap 21.1-4).

### Citação de fechamento

Essas crenças são a base do nosso alicerce. São a sustentação de quem somos. Mesmo que não sejam sempre vistas, elas permitem que toda a estrutura esteja sempre segura, forte e firme.
