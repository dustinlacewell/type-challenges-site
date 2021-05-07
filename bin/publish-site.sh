#!/usr/bin/env bash

rm -fr dist/apps/site

yarn build

yarn nx export

# disable jekyll
touch dist/apps/site/exported/.nojekyll

# set custom domain
echo 'type-tetris.ldlework.com' > dist/apps/site/exported/CNAME

# publish
npx gh-pages --dotfiles -d dist/apps/site/exported/ --remove '.'
