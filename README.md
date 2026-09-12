# Real Tab

Real Tab is a stylish new-tab homepage for searching the web. It shows the current time and date, a rotating NASA Astronomy Picture of the Day background, quick links, and current news headlines.

## Setup

Clone the repository and install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root with your NASA API key:

```env
VITE_NASA_API_KEY=your_actual_key_here
```

You can get a free NASA API key from [api.nasa.gov](https://api.nasa.gov/).

Start the development server:

```bash
npm run dev
```

Open the URL printed in the terminal, usually [http://localhost:5173](http://localhost:5173/).

## Features

- Web search
- NASA Astronomy Picture of the Day background
- Current date and time
- Quick links to GitHub, YouTube, Reddit, Gmail, and Notion
- BBC news headlines with category filters
- Light and dark mode settings
- Responsive layout

## Deploy Your Own Copy

1. Push the repository to GitHub.
2. Add your NASA API key as a repository secret named `VITE_NASA_API_KEY` under **Settings → Secrets and variables → Actions**.
3. Under **Settings → Pages**, set **Source** to **GitHub Actions**.
4. Push to `master`. The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the site.

Your site will be available at:

`https://realguy-beep.github.io/Realtab/`

## Built With

- HTML
- CSS
- JavaScript
- [Vite](https://vite.dev/)
- [NASA APIs](https://api.nasa.gov/)
- [BBC RSS feeds](https://www.bbc.co.uk/news/10628494)

well wont write much info or they gonna flag for ai lol 
nvm thx for checking out readme
