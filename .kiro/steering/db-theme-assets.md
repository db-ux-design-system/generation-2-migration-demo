# DB Theme assets

`@db-ux/db-theme`, `@db-ux/db-theme-fonts` and `@db-ux/db-theme-icons` ship fonts, icons and images encrypted (`*.enc`). The Generation 3 build fails until they are decrypted.

- Decryption needs a `.env` file in the project root with `ASSET_PASSWORD` and `ASSET_INIT_VECTOR` from the Marketingportal. The file is git-ignored. Never read, print or commit its values.
- The `postinstall` scripts of the three packages decrypt the files. They must be allowed via `allowScripts` in `package.json` (npm 11).
- After adding or changing `.env`, run `npm rebuild @db-ux/db-theme @db-ux/db-theme-fonts @db-ux/db-theme-icons`.
- Check: `node_modules/@db-ux/db-theme-fonts/build/assets/` must contain `.woff2` files, not only `.woff2.enc`.
- `vite.config.ts` needs the alias `'@db-ux': path.resolve('node_modules/@db-ux')`, otherwise the `@db-ux/...` asset URLs in the theme CSS stay unresolved.
- If the build fails with `ENOENT` for a file under `node_modules/@db-ux/db-theme*/build/`, the assets are still encrypted. Check the `.env` first.
