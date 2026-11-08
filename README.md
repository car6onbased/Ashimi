# Ashimi Adefesobi’s portfolio

The source for [ashimi-portfolio.netlify.app](https://ashimi-portfolio.netlify.app/).
The tag `netlify-2026-11-07` captures the exact public files from the last manual deployment before this workflow.

- `python3 scripts/build.py` assembles the site in `dist` and checks its local page links.
- `python3 -m http.server 8765 --bind 127.0.0.1 --directory dist` serves the build locally.
- Change `VERSION` for each release. The build puts that number in the pull-out menu.
- Work on a branch and open a pull request. Once the Netlify project is linked to this repository, review its Deploy Preview before merging into the production branch `main`. Tag the verified production commit `vX.Y.Z`.

`public/service-simulator/council-playable/index.html` is the source for both the world’s deep URL and the home page. Public pages, assets and original fictional scenarios belong in `public/`. Publish only material intended for the site. Keep interview preparation, client source material and credentials outside this repository.
