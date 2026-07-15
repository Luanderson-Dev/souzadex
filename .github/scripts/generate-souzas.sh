set -euo pipefail

entries=""
shopt -s nullglob nocaseglob
for f in assets/images/*.{jpg,jpeg,png,gif}; do
  commit=$(git log --diff-filter=A --format=%H -- "$f" | tail -1)
  if [ -z "$commit" ]; then
    continue
  fi
  ts=$(git show -s --format=%ct "$commit")
  # A API resolve o autor do commit para a conta atual: login pode mudar com
  # rename, mas o id é imutável — por isso guardamos os dois.
  author=$(gh api "repos/$GITHUB_REPOSITORY/commits/$commit" --jq '"\(.author.login // "")|\(.author.id // "")"' 2>/dev/null || true)
  login=${author%%|*}
  id=${author##*|}
  if [ -z "$login" ]; then
    login=$(git show -s --format=%an "$commit")
    id=""
  fi
  entries+="$ts|$(basename "$f")|$login|$id"$'\n'
done
shopt -u nullglob nocaseglob

{
  echo "const SOUZAS = ["
  printf '%s' "$entries" | sort -t'|' -k1,1n | while IFS='|' read -r ts file login id; do
    if [ -n "$id" ]; then
      echo "  { file: \"$file\", author: \"$login\", authorId: $id },"
    else
      echo "  { file: \"$file\", author: \"$login\" },"
    fi
  done
  echo "];"
} > souzas.js

echo "souzas.js gerado:"
cat souzas.js
