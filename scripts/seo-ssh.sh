#!/usr/bin/env bash
# Skyddad SSH mot kundsajterna på jtmedia-srv01. Det enda sättet Claude får köra
# kommandon på servern (en hook i .claude/settings.json stoppar vanlig ssh).
#
#   scripts/seo-ssh.sh <användare@jtmedia-srv01.oderland.com> '<kommando>'
#
# Skydd:
#   - bara konton på jtmedia-srv01.oderland.com
#   - kommandon som kan fylla disken, starta bakgrundsprocesser eller aldrig
#     avslutas vägras innan något skickas
#   - på servern: max 90 s väggtid, 60 s CPU, 2 GB minne, 100 MB per skriven fil,
#     lägsta prioritet. Når kommandot en gräns dödas hela processgruppen.
#   - varje körning loggas i ~/Library/Logs/jtmedia-seo-ssh.log
set -uo pipefail

WALL_SECONDS=90
CPU_SECONDS=60
MEM_KB=2097152      # 2 GB
FILE_KB=102400      # 100 MB
MAX_OUTPUT=200000   # tecken tillbaka till Claude

LOG="$HOME/Library/Logs/jtmedia-seo-ssh.log"

die() { echo "seo-ssh: $*" >&2; exit 2; }

[ $# -eq 2 ] || die "användning: scripts/seo-ssh.sh <användare@jtmedia-srv01.oderland.com> '<kommando>'"
TARGET="$1"
CMD="$2"

[[ "$TARGET" =~ ^[a-z0-9_-]+@jtmedia-srv01\.oderland\.com$ ]] \
  || die "målet måste vara ett konto på jtmedia-srv01.oderland.com, fick '$TARGET'"

# Kommandon som kan ta ner servern eller ändra mer än SEO-jobbet ska. Text inom
# citattecken (nya titlar, alt-texter) räknas inte, så "som du kan lita på" stoppas
# inte. Att köra text som kommando (bash -c, eval, xargs) är i stället spärrat.
BARE=$(printf '%s' "$CMD" | sed -E "s/'[^']*'//g; s/\"[^\"]*\"//g")
deny() {
  if printf '%s' "$BARE" | grep -Eiq -- "$1"; then
    die "vägrat: $2. Kommandot skickades inte."
  fi
}
deny '(^|[^&>])&([^&>]|$)'                          'bakgrundsprocess (&)'
deny '\b(bash|sh|zsh|dash|ksh)\s+-[a-z]*c|(^|[;&|(]\s*)(eval|source|exec)\b|\bxargs\b' 'kommando gömt i text'
# $(…) och `…` körs även inom dubbla citattecken, bara enkla citattecken skyddar.
if printf '%s' "$CMD" | sed -E "s/'[^']*'//g" | grep -Eq '\$\(|`'; then
  die "vägrat: kommandosubstitution (\$( ) eller backticks). Kommandot skickades inte."
fi
deny '\b(nohup|setsid|disown|screen|tmux|crontab)\b' 'bakgrundsprocess eller schemaläggning'
deny '\b(tail|less|more)\b.*(-f|-F|--follow)|\bwatch\b' 'kommando som aldrig avslutas'
deny '\b(while|until)\s+(true|:|\[\s*1\s*\])'        'oändlig loop'
deny '\bfind\s+(/|~|\$HOME|\.\.)'                    'find över hela hemkatalogen eller servern'
deny '\b(du|ncdu)\b'                                 'du över katalogträd'
deny '\b(grep|rg)\b[^|;]*\s-[a-zA-Z]*[rR]\b[^|;]*\s(/|~|\$HOME|\.\.)' 'rekursiv sökning över hela hemkatalogen'
deny '\b(mysqldump|mysqlimport|tar|zip|unzip|gzip|gunzip|rsync|scp|wget|dd|fallocate|truncate|yes)\b' 'kopiering, arkiv eller stora filer'
deny '\bcurl\b.*\s(-o|-O|--output|--remote-name)\b'  'nedladdning till fil'
deny '\brm\b|\bshred\b|\bchmod\b|\bchown\b'          'radering eller ändrade rättigheter'
deny '\bwp\s+(db\s+(export|import|reset|drop|clean|optimize|repair)|export|import|search-replace|core|user|plugin\s+(install|update|delete|activate|deactivate)|theme\s+(install|update|delete|activate)|media\s+regenerate|cron\s+event\s+run|eval-file|package|config|cache\s+flush)\b' 'tung eller riskabel WP-CLI-åtgärd (fråga Jakob)'

# Identitetsfil från Claude-appens SSH-konfiguration, annars standardnyckeln.
IDENTITY="$HOME/.ssh/id_ed25519"
CONF="$HOME/Library/Application Support/Claude/ssh_configs.json"
if [ -f "$CONF" ] && command -v jq >/dev/null; then
  hit=$(jq -r --arg h "$TARGET" '(if type=="array" then . else (.configs // .sshConfigs // []) end)[] | select(.sshHost==$h) | .sshIdentityFile // empty' "$CONF" 2>/dev/null | head -1)
  [ -n "$hit" ] && IDENTITY="${hit/#\~/$HOME}"
fi

mkdir -p "$(dirname "$LOG")"
printf '%s\t%s\t%s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$TARGET" "$(printf '%s' "$CMD" | tr '\n' ' ')" >> "$LOG"

# Kommandot skickas via stdin, så inga citattecken behöver escapas. timeout lägger
# sig i en egen processgrupp och dödar hela gruppen, även barnprocesser.
REMOTE="ulimit -t $CPU_SECONDS; ulimit -v $MEM_KB; ulimit -f $FILE_KB; exec timeout -k 5 $WALL_SECONDS nice -n 19 bash -s"

out=$(printf '%s\n' "$CMD" | ssh \
  -o BatchMode=yes -o IdentitiesOnly=yes -o LogLevel=ERROR -i "$IDENTITY" \
  -o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=2 \
  "$TARGET" "$REMOTE" 2>&1)
code=$?

if [ ${#out} -gt $MAX_OUTPUT ]; then
  printf '%s\n[seo-ssh: utdata avkortad, %s tecken totalt]\n' "${out:0:$MAX_OUTPUT}" "${#out}"
else
  printf '%s\n' "$out"
fi

case $code in
  124|137) echo "seo-ssh: kommandot nådde tidsgränsen (${WALL_SECONDS} s) och stoppades på servern." >&2 ;;
  152)     echo "seo-ssh: kommandot nådde CPU-gränsen (${CPU_SECONDS} s) och stoppades." >&2 ;;
  153)     echo "seo-ssh: kommandot försökte skriva en fil större än 100 MB och stoppades." >&2 ;;
esac
printf '%s\t%s\texit %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$TARGET" "$code" >> "$LOG"
exit $code
