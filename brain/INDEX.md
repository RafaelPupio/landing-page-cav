# LandingPageCav brain — hub

**Regra para o Claude:** leia ESTE arquivo, depois abra só a(s) nota(s) que a tarefa precisa. Nunca leia o vault inteiro. Ao terminar qualquer tarefa, atualize [[status]] e acrescente uma linha em [[log/decisions]].

## Notas
- [[status]] — o estado agora (me atualize)
- [[projeto/objetivo]] — para que a página existe e o que está fora de escopo
- [[projeto/identidade-visual]] — cores, tipografia, elementos gráficos do folder
- [[projeto/conteudo]] — de onde vem cada texto e como editar sem programar
- [[projeto/seo]] — o que faz a igreja aparecer no Google
- [[projeto/deploy]] — domínio, hospedagem, o que depende do Rafael
- [[rafael]] — quem é o usuário e como conversar com ele (arquivo LOCAL, fora do git por privacidade — existe só na máquina do Rafael)
- [[log/decisions]] — decisões datadas (só acrescentar, nunca reescrever)

## Regras duras (sempre)
1. **Texto da igreja é sagrado.** O conteúdo vem do folder impresso e é reproduzido verbatim. Nunca reescrever, resumir, modernizar ou "melhorar" o texto doutrinário — só corrigir erro tipográfico evidente, e registrando em [[log/decisions]].
2. **Nenhum texto hardcoded em componente.** Tudo passa por `content/site.json`. Se não está no JSON, não aparece na tela.
3. `/editar` e `/api/content` existem só em desenvolvimento. Se algum dia responderem em produção, é bug de segurança — qualquer visitante reescreveria o site.
4. Mobile-first não é preferência, é o caso de uso: quase todo o tráfego vem do link da bio do Instagram, no celular.
5. Antes de declarar qualquer trabalho pronto: `npm test && npm run build` passando, e este brain atualizado.

## Documentos de referência
- Spec: `docs/superpowers/specs/2026-08-08-landing-cav-design.md` — inclui o apêndice com todo o texto do folder transcrito. É a fonte durável do conteúdo.
- Plano: `docs/superpowers/plans/2026-08-08-landing-cav.md` — 14 tarefas em TDD.
