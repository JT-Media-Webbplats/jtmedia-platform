# Contributing till jtmedia-platform

Välkommen! Den här filen beskriver hur vi jobbar tillsammans i repot — det dagliga flödet, steg för steg — så att ingen "förstör" för någon annan och vi alltid har synkade filer.

## Förutsättningar

Du behöver:

- **Node.js** installerat (samma version som står i `package.json`)
- **Git** installerat och inloggat på GitHub (via `gh auth login`)
- **Claude Code** installerat (`npm install -g @anthropic-ai/claude-code`)
- **Access** till:
  - GitHub-repot
  - Supabase-projektet (för env-variabler)
  - Vercel-projektet (valfritt, för att se deploys)

## Första uppsättningen (engångsgrej per dator)

```bash
git clone https://github.com/JT-Media-Webbplats/jtmedia-platform.git
cd jtmedia-platform
npm install
cp .env.local.example .env.local
nano .env.local   # klistra in värdena, Ctrl+O, Enter, Ctrl+X

git config --global user.name "Ditt Namn"
git config --global user.email "din@email.com"

brew install gh
gh auth login

npm run dev
```

## Dagligt flöde

### När du sätter dig för att jobba

```bash
cd jtmedia-platform
git checkout main
git pull
git checkout -b dittnamn/uppgift
claude
```

Exempel grennamn: `theo/fix-kontaktformular`, `jakob/lagg-till-case-studie`.

### Medan du jobbar

Kolla ändringar i andra terminalflik:

```bash
git status
git diff
npm run dev
```

### När du är klar

```bash
git add .
git commit -m "Kort beskrivning"
git push
```

Första gången på en ny gren: `git push -u origin dittnamn/uppgift`.

### Öppna Pull Request

1. Gå till GitHub → klicka **"Compare & pull request"**
2. Skriv titel + beskrivning → **Create pull request**
3. Vänta på Vercel Preview-länk → testa
4. Andra personen granskar → **Merge pull request** → **Confirm merge**
5. Klicka **Delete branch**

### Efter merge

```bash
git checkout main
git pull
git branch -d dittnamn/gammal-gren
```

## Merge conflicts

Om Git hittar konflikter:

1. Öppna filen, leta `<<<<<<<`, `=======`, `>>>>>>>`
2. Välj rätt version, ta bort markörerna
3. `git add .` → `git commit` → `git push`

Claude Code kan hjälpa: *"help me resolve this merge conflict"*.

## Vercel

- `main` → production
- Alla andra grenar → Preview URL per PR
- Rollback via Vercel-dashboarden om något går fel

## Supabase

- Schema-ändringar: säg till den andra innan
- Migrations ligger i `supabase/migrations/`
- `.env.local` delas **aldrig** via Git

## Claude Code

- Varje person kör sin egen Claude-session lokalt
- Git synkar er, inte Claude
- `CLAUDE.md` är delad kontext — uppdatera vid arkitekturförändringar

## Gyllene regler

**Alltid:**
- `git pull` på `main` innan ny gren
- Egen gren per uppgift
- Committa ofta
- Pusha innan datorn stängs
- Säg till när du börjar/slutar
- Läs diff:en innan merge

**Aldrig:**
- Jobba direkt på `main`
- Hoppa över `git pull`
- `git push --force`
- Committa `.env.local`
- Merge:a egen PR utan att titta igenom
- Ändra databasschema utan att säga till

## Felsökning

**"fatal: not a git repository"** → `cd jtmedia-platform`
**"no such file: package.json"** → samma, `cd` in i projektet
**"Authentication failed"** → `gh auth login`
**"nothing to commit"** → filen sparades inte (glömde Ctrl+O + Enter?)
**Merge conflict** → se avsnittet ovan eller be Claude om hjälp

## Kommandoreferens

```bash
cd jtmedia-platform
git checkout main && git pull
git checkout -b dittnamn/uppgift

git status
git diff
npm run dev

git add .
git commit -m "Beskrivning"
git push

git checkout main && git pull
git branch -d dittnamn/gammal-gren

git log --oneline -10
git branch -a
git stash / git stash pop
```

---

Git kommer ihåg allt. Det är omöjligt att göra sönder något permanent så länge ni följer flödet ovan.
