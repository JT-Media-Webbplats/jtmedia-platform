#!/usr/bin/env bash
# PreToolUse-hook: stoppar all SSH/SCP/SFTP från Claude i det här projektet som inte
# går via scripts/seo-ssh.sh (som sätter tids-, minnes- och diskgränser på servern).
# Reagerar när ssh står där ett kommando börjar (radstart, efter ; && || | ( $( ` eller
# ett citattecken, efter rsync -e, xargs, exec, sudo, env …), inte när ordet bara
# nämns i text som "grep ssh" eller "~/.ssh/config".
cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0

rest=$(printf '%s' "$cmd" | sed -E 's#(\./)?scripts/seo-ssh\.sh##g')
start='(^|[;&|(`'"'"'"]|\$\(|\s-e|\b(xargs|exec|sudo|env|nohup|time|command|timeout|parallel|watch)(\s+-?[^[:space:]]+)*)'
tool='(ssh|scp|sftp|sshfs|sshpass)'
if printf '%s' "$rest" | grep -Eq "${start}[[:space:]]*${tool}([[:space:]]|['\"]|\$)"; then
  echo "Blockerat: SSH mot servern får bara köras via scripts/seo-ssh.sh <användare@jtmedia-srv01.oderland.com> '<kommando>'. Den sätter gränser så att servern inte kan krascha." >&2
  exit 2
fi
exit 0
