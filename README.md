# 🌎 Mapa de Calor de Exportações por NCM

Este projeto é uma aplicação em **React** que permite visualizar, por meio de um **mapa de calor mundial interativo**, os países que mais **importam determinado NCM (Nomenclatura Comum do Mercosul)** do Brasil, com base nos dados públicos de comércio exterior.

## 🚀 Funcionalidades

- 🔍 Buscar por um **código NCM** e gerar um mapa de calor dos países importadores.
- 📊 Alternar entre **Valor FOB (em reais)** ou **Peso Líquido (em kg)** como métrica de análise.
- 🎨 Mapa colorido com **escala de cor dinâmica**, ajustada automaticamente com base no maior valor da métrica.
- 🌐 Utiliza **Topologia geográfica (TopoJSON)** para exibir o mapa mundial com precisão.

## 🧠 Tecnologias utilizadas

- React
- react-simple-maps
- D3.js (d3-scale & d3-fetch)
- TypeScript

## 📁 Estrutura do Projeto

```
/public
├── csv/
│   └── exportacao_heatmap_com_iso3.csv
├── features.json
/src
├── components/
    └── ui/ (componentes do ShadCN)
    ├── HeatMap.tsx
├── assets/
    └── iso3_to_id.json
├── lib/
    └── utils.ts
├── App.tsx
├── index.css
├── main.tsx
└──vite-env.d.ts
```

## 📊 Formato do CSV

| Campo          | Descrição                                  |
|----------------|---------------------------------------------|
| NCM            | Código NCM do produto exportado             |
| CO_PAIS        | Código numérico do país                     |
| vl_fob_total   | Valor total FOB exportado (em reais)        |
| kg_liq_total   | Peso líquido total exportado (em kg)        |
| ISO3           | Código do país no formato ISO Alpha-3       |

## 🛠️ Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/seu-repo.git
```
```bash
cd seu-repo
```
### 2. Instalar as dependências
```bash
npm install
```

### 3. Executar a aplicação
```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5174

## ⚠️ Observações importantes

- O CSV precisa conter a coluna `ISO3` para funcionar corretamente com o mapa.
- O mapa mundial (`features.json`) deve estar no formato TopoJSON e conter `id` ou `ISO_A3` por país.
- Os valores nulos, inválidos ou países não presentes no mapa são automaticamente ignorados.

