# Selenium JS Toolshop QA

Projeto profissional de automacao web criado do zero com Selenium WebDriver puro em JavaScript, Mocha, Chai, Faker e Mochawesome.

Repositorio oficial do projeto: [https://github.com/DouglasAntoni0/selenium.git](https://github.com/DouglasAntoni0/selenium.git)

## Alvo Escolhido

O alvo escolhido foi o [Practice Software Testing - Toolshop](https://practicesoftwaretesting.com), usando a API publica em [https://api.practicesoftwaretesting.com](https://api.practicesoftwaretesting.com).

Justificativa tecnica:

- E uma plataforma criada especificamente para treinamento e automacao de testes.
- Possui fluxo realista de e-commerce: catalogo, busca, produto, carrinho, checkout, pagamento, login, cadastro e contato.
- Exibe contratos de automacao estaveis via `data-test`, reduzindo seletores frageis.
- E mais previsivel do que demos com excesso de anuncios, pop-ups e carregamentos instaveis.
- Permite criar massa dinamica via UI e API publica, mantendo os testes independentes entre execucoes.

## Escopo Automatizado

A suite cobre caminhos felizes e fluxos de excecao:

- Login com sucesso usando usuario dinamico preparado pela API.
- Login com senha invalida.
- Validacao de campos obrigatorios no login.
- Cadastro de novo cliente pela UI com Faker.
- Validacoes obrigatorias no cadastro vazio.
- Busca de produtos por termo.
- Busca sem resultado.
- Ordenacao de produtos por menor preco.
- Adicao de produto ao carrinho.
- Atualizacao de quantidade com recalcule de total.
- Remocao de item do carrinho.
- Checkout completo como convidado com validacao de valor.
- Bloqueio de finalizacao quando pagamento bancario esta incompleto.
- Envio de formulario de contato com dados dinamicos.
- Validacoes obrigatorias do formulario de contato.

## Arquitetura

O projeto usa Page Object Model com separacao explicita de responsabilidade.

```text
.github/workflows/
  selenium-tests.yml              # Pipeline GitHub Actions
src/
  config/
    environment.js                # URLs, timeouts e flags de execucao
  driver/
    driverFactory.js              # Criacao do Chrome WebDriver
  locators/
    *.locators.js                 # Seletores centralizados por dominio
  pages/
    *.js                          # Page Objects com acoes de usuario
  utils/
    catalogApi.js                 # Apoio de dados para produtos dinamicos
    httpClient.js                 # Cliente HTTP simples para setups
    money.js                      # Parser e arredondamento monetario
    testDataFactory.js            # Massa dinamica com Faker
    userApi.js                    # Cadastro de usuario por API
    waits.js                      # Esperas explicitas inteligentes
tests/
  support/
    driverLifecycle.js            # Setup/teardown do browser
  specs/
    *.spec.js                     # Scripts de teste
```

As esperas sao explicitas (`until.elementLocated`, `until.elementIsVisible`, `until.elementIsEnabled` e predicates customizados). A suite evita `sleep` fixo e espera sinais reais do sistema, como URL, elemento visivel, contador do carrinho, total recalculado ou confirmacao de pedido.

## Tecnologias

- Node.js
- JavaScript CommonJS
- Selenium WebDriver (`selenium-webdriver`)
- Mocha
- Chai
- Mochawesome
- Faker (`@faker-js/faker`)
- Dotenv
- Cross-env
- Rimraf
- Chrome / Chrome Headless
- ChromeDriver local para Windows
- GitHub Actions

## Instalacao

Requisitos locais:

- Node.js 20.18+.
- Google Chrome instalado.
- Acesso a internet para o site e API do Toolshop.

Instale as dependencias:

```bash
npm install
```

Opcionalmente, copie o arquivo de exemplo de ambiente:

```bash
cp .env.example .env
```

No PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

## Execucao Local

Rodar a suite em modo headless:

```bash
npm test
```

Ou diretamente:

```bash
npm run test:headless
```

Rodar com navegador visivel:

```bash
npm run test:headed
```

Gerar relatorio Mochawesome:

```bash
npm run test:report
```

O relatorio HTML fica em:

```text
mochawesome-report/index.html
```

## Observacao Sobre ChromeDriver

Neste ambiente local o Chrome instalado era `149.0.7827.201`, por isso o projeto fixa `chromedriver@149` para execucao local previsivel.

Se o seu Chrome local estiver em outra major version, voce pode deixar o Selenium Manager escolher o driver compativel:

```powershell
$env:USE_PACKAGED_CHROMEDRIVER='false'; npm run test:headless
```

No GitHub Actions o workflow usa `browser-actions/setup-chrome@v2` para instalar Chrome for Testing e ChromeDriver compativeis, passando `CHROME_BINARY` e `CHROMEDRIVER_BINARY` para a factory.

## Resultados Obtidos

Ultima execucao local validada:

```text
Comando: npm run test:report
Resultado: 15 passing
Duracao: aproximadamente 3 minutos
Relatorio: mochawesome-report/index.html
Audit: 0 vulnerabilidades no npm audit --json
```

Resumo por suite:

```text
Autenticacao e cadastro de clientes: 5 passing
Carrinho de compras: 3 passing
Catalogo e busca de produtos: 3 passing
Checkout completo: 2 passing
Formulario de contato: 2 passing
```

## CI/CD GitHub Actions

O workflow fica em:

```text
.github/workflows/selenium-tests.yml
```

Ele executa a cada push na branch `main` e tambem pode ser disparado manualmente por `workflow_dispatch`.

Pipeline:

- Faz checkout do repositorio.
- Configura Node.js com `lts/*`, ou seja, a LTS mais recente disponivel no GitHub Actions.
- Instala dependencias com npm.
- Exibe a versao do Chrome.
- Executa `npm run test:report` em Chrome headless.
- Publica `mochawesome-report` como artefato da execucao.

## Variaveis de Ambiente

```text
BASE_URL=https://practicesoftwaretesting.com
API_URL=https://api.practicesoftwaretesting.com
HEADLESS=true
UI_TIMEOUT_MS=45000
PAGE_LOAD_TIMEOUT_MS=90000
RETRY_ATTEMPTS=1
USE_PACKAGED_CHROMEDRIVER=true|false
CHROME_BINARY=C:\Program Files\Google\Chrome\Application\chrome.exe
CHROMEDRIVER_BINARY=C:\path\to\chromedriver.exe
```

## Boas Praticas Aplicadas

- POM com paginas pequenas e orientadas a comportamento.
- Locators centralizados por dominio funcional.
- Dados dinamicos com Faker e e-mails curtos/validos para respeitar validacoes do front.
- Setup de usuario por API apenas quando melhora independencia do teste.
- Validacao monetaria com arredondamento centralizado.
- Esperas explicitas reutilizaveis.
- Relatorio HTML para analise de execucao.
- Workflow pronto para CI em push na `main`.
