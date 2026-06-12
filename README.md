# Clock

## GitHub Pages Hosting Setup

This repository is ready to deploy as a static GitHub Pages site.

### Recommended workflow

1. Keep the static site files in the repository root (`index.html`, `style.css`, `script.js`, `js/`, `css/`).
2. Use the GitHub Actions workflow in `.github/workflows/deploy.yml` to deploy to GitHub Pages.
3. Configure the `Weather` environment in GitHub repository settings:
   - Go to `Settings > Secrets and variables > Environments > Weather`
   - Add secret `WEATHER_API_KEY`
4. Push to the `main` branch to trigger deployment.

### Notes

- `js/config.js` contains a placeholder API key that is replaced during deployment by GitHub Actions.
- The API key is injected only at deploy time; it is not stored in the repository.
- If you want to test locally, you must provide a local API key manually or use a local build script.
