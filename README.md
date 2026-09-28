# Organiza AI

MVP de organização financeira pessoal por conversa natural, criado a partir do PRD do curso.

## Sobre o projeto

Projeto desenvolvido para o curso **Santander — Construa seu primeiro App com IA**. O desafio propõe a criação de um aplicativo com IA usando a abordagem de *vibe coding*.

### Processo de desenvolvimento

O projeto foi construído com **Codex**, usando a abordagem de *vibe coding*: a ideia, os requisitos do PRD e as decisões de interface foram transformados em prompts objetivos para orientar a criação e a evolução do aplicativo. A solução foi revisada para priorizar uma experiência acessível, educativa e fácil de demonstrar.

## Rodar localmente

1. Copie `.env.example` para `.env` e, se quiser IA real, configure o provedor e sua chave.
2. No PowerShell, execute `npm.cmd start`.
3. Abra `http://localhost:3000`.

Sem arquivo `.env` ou com `AI_PROVIDER=demo`, a aplicação funciona com interpretação local para a apresentação do MVP. Os dados ficam apenas no `localStorage` do navegador.

## Escolher a IA

Defina uma das opções no `.env`:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-4.1-mini
```

ou:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=sua_chave
GEMINI_MODEL=gemini-2.0-flash
```

O servidor recebe a chave somente por variável de ambiente: nunca a coloque em `public/app.js` ou envie ao GitHub. Se estiver usando um `.env`, carregue as variáveis no terminal ou use o gerenciador de segredos da plataforma de deploy.

## Funcionalidades do MVP

- **Conversa natural para registrar movimentações:** na tela inicial, o usuário pode escrever ou ditar frases como “gastei R$ 30 no mercado” ou “recebi R$ 1.500 de salário”. O app identifica o valor e registra a movimentação como gasto ou receita.
- **Categorização automática:** cada despesa é classificada em categorias como Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Contas, Compras ou Outros. A resposta no chat informa a categoria identificada para que o usuário possa conferir o registro.
- **Entrada por voz:** o botão de voz usa o reconhecimento de fala disponível no navegador para preencher a mensagem. Caso o recurso não seja suportado, o app avisa e mantém o registro por texto disponível.
- **Metas financeiras:** pelo chat ou pela aba **Metas**, o usuário pode criar objetivos de economia, informando nome, valor e prazo. Também é possível adicionar valores já guardados e acompanhar uma barra de progresso com o percentual concluído.
- **Resumo financeiro:** o topo da aplicação mostra o saldo do período, o total gasto e o andamento da primeira meta ativa. Esses indicadores são atualizados a cada novo lançamento.
- **Relatório mensal simples:** a aba **Relatórios** agrupa os gastos por categoria, apresenta um gráfico de barras e explica em texto qual foi a maior despesa registrada no período.
- **Dicas educativas:** a partir dos lançamentos, o app mostra uma orientação curta para ajudar o usuário a observar seus hábitos. As dicas não fazem recomendações de investimento nem substituem orientação financeira profissional.
- **Modo demonstração e IA configurável:** sem chave de API, o app funciona em modo demonstração com uma interpretação local de frases comuns. Quem baixar o projeto pode ativar a OpenAI ou o Gemini pelo arquivo `.env`; nesse modo, a IA interpreta mensagens mais livres e responde em linguagem simples.
- **Privacidade e acessibilidade:** os registros ficam no `localStorage` do navegador durante o MVP. A interface inclui alto contraste, navegação por teclado, rótulos para leitores de tela, linguagem clara e feedback visual para facilitar o uso.

As recomendações têm finalidade educativa e não substituem orientação financeira profissional.
