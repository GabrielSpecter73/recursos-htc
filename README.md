# Recursos grátis do High Ticket Clube

Site estático de `recursos.htclube.com`: a central com os kits grátis que o Gabriel promete nos vídeos.
Cada kit tem a parte aberta (`/<slug>/`), o cadastro e a entrega (`/<slug>/acesso/`, fora do Google).

## Como gerar

O site sai dos kits do YouTube Hub (`16-materiais/<slug>/`: `material.md`, `pagina.md` e `recurso.json`).
Não edite o HTML daqui à mão: ele é refeito toda vez.

```
cd ~/Desktop/"YouTube Hub"
python3 tools/recursos.py              # prévia com rascunho, em .cache/recursos-previa (nunca vai pro git)
python3 tools/recursos.py publicar     # só kits aprovado/no_ar aqui nesta pasta + commit + push
python3 tools/recursos.py lista        # kits e status
```

Esta pasta só recebe kit aprovado/no_ar. Kit novo: criar `16-materiais/<slug>/recurso.json` (copiar o de um kit
pronto). Kit com `"acesso": "aberto"` (ele disse no vídeo que não precisa de e-mail) mostra o kit inteiro na página,
sem formulário.

## Como foi publicado

1. Repositório no GitHub e push.
2. Escolher um dos dois:
   - **GitHub Pages:** Settings, Pages, branch `main`, pasta raiz. O arquivo `CNAME` já tem `recursos.htclube.com`.
   - **Vercel:** importar o repositório, sem comando de build, pasta raiz. Em Domains, adicionar `recursos.htclube.com`.
3. No DNS do `htclube.com` (GoDaddy), criar um registro CNAME:
   - nome `recursos`
   - valor `<usuario>.github.io` (GitHub Pages) ou `cname.vercel-dns.com` (Vercel)
4. Esperar o certificado HTTPS sair e abrir https://recursos.htclube.com.

## Antes de ir pro ar

- Cada kit já tem o form do GHL "Material grátis" (`6o6xbaWZyhLuDJ2fn6XQ`) embutido, com `?material=<slug>`.
- Depois do site no ar, no GHL (com o ok dele):
  - form "Material grátis", Ao enviar → Abrir URL:
    `https://recursos.htclube.com/{{contact.material}}/acesso/?nome={{contact.first_name}}`
  - automação "Entrega de material": o link do e-mail sai de `lp.htclube.com/{{contact.material}}-entrega`
    e vira `https://recursos.htclube.com/{{contact.material}}/acesso/`.
  Antes disso o form ainda leva pra entrega antiga no `lp.htclube.com`.

## Links

O botão de 30 dias grátis vai pro `https://www.htclube.com/` com os UTMs. Se a pessoa chegou com UTMs na URL
(o link da descrição do vídeo), a página repassa os mesmos pro botão. Sem UTM, vai `utm_content=g-mat-<slug>`.
Na página inicial, `utm_content=g-mat-central`.
