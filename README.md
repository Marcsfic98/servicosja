# Kit de GIT para trabalhar no PI

Fala pessoal

🚫 NUNCA, NUNCA trabalhem diretamente na branch main. 🚫

A main é a versão oficial e funcional do nosso projeto. Vocês vão trabalhar em uma "faixa de trabalho" (uma branch) separada de vocẽs mesmo e só é juntada à main depois de ser revisada e aprovada (através de um Pull Request - PR).

Passo 0: Sincronizar (Antes de Começar)

Antes de escrever qualquer código, garantam que voces estão na versão mais atualizadas do projeto.

Comandos:

1. Vai para a branch principal
    git checkout main
2. Puxa as atualizações mais recentes do GitHub
    git pull origin main

Passo 1: Criar a tua "Faixa de Trabalho" (A Branch)

Agora que está atualizado, cria a sua "faixa" para trabalhar isolado.

Comandos:

1.Cria a tua branch E muda-te para ela de uma só vez
    git checkout -b nome-da-tua-branch

2. Dica de Nomenclatura (IMPORTANTE):

Do Back-end e a tarefa é o "login API": git checkout -b feature/backend/login-api

Do Front-end e a tarefa é a "página de login": git checkout -b feature/frontend/login-page

Passo 2: Trabalhar (Codificar e Salvar)

Comandos:

1. (Opcional, mas recomendado) verifica o que foi modificado!

git status

2. adiciona as modificações ao "cesto de compras" para salvar

git add . 
(O "." significa "todos os ficheiros que modifiquei nesta pasta")

3. Salva o checkpoint com uma mensagem CLARA

git commit -m "O que é que eu fiz nesta alteração?"

Exemplo de MÁ mensagem: git commit -m "coisas"

Exemplo de BOA mensagem: git commit -m "Adiciona validação de email no registo de cliente"

Passo 3: Enviar para o GitHub (Push)

Quando a tua tarefa estiver pronta, envia a tua branch (com todos os commits) para o GitHub.

Comando:

git push origin nome-da-tua-branch

(Dica: Na primeira vez que fizeres push, o Git pode sugerir um comando um pouco mais longo, como git push --set-upstream origin .... É só copiar e colar o que ele sugerir!)

Passo 4: Pedir a Revisão (Pull Request - PR)

Este é o passo final e crucial.

Vai ao site do GitHub.

O GitHub vai mostrar uma barra amarela/verde sugerindo "Criar um Pull Request" para a branch que acabaste de enviar. Clica nela!

Coloca um bom título, uma breve descrição e atribui um "Revisor".

Passo 5: Repetir!

Se PR. Se estiver tudo bem, vai ser feito o "Merge" (juntar) o teu trabalho à main. Se houver ajustes, vão ser comentados na PR.

Assim que o PR for aprovado e "mergeado", a tarefa está feita! pode apagar a tua branch (o GitHub oferece um botão para isso) e voltar ao Passo 0 para a próxima tarefa!

Resumo dos 6 Comandos Essenciais (para imprimir)

git pull origin main (Para Atualizar antes de começar)

git checkout -b <nome-branch> (Para Criar a tua faixa de trabalho)

git status (Para Verificar o que fizeste)

git add . (Para Preparar os ficheiros para salvar)

git commit -m "mensagem" (Para Salvar o teu progresso local)

git push origin <nome-branch> (Para Enviar o teu trabalho para o GitHub)
