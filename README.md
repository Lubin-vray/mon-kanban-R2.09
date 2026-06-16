readme = """# 🗂️ KanbanRT — Application Kanban React + Supabase

> Application web de gestion de tâches en style Kanban, développée dans le cadre du BUT Réseaux & Télécommunications — Semestre 2 (R2.09 — Initiation au développement Web) à l'IUT de Roanne.

## 👥 Équipe

| Membre | Rôle principal |
|--------|----------------|
| VRAY Lubin | Composants React, routing, Navbar, ProfilePage, UI |
| BACOT Dimitri | Supabase (BDD, Auth, RLS, Storage), déploiement Vercel, API Resend |

## 🚀 Application déployée

🔗 **[https://mon-kanban-r2-09.vercel.app/](https://mon-kanban-r2-09.vercel.app/)**

## 🛠️ Stack technique

| Technologie | Usage |
|-------------|-------|
| React 18 + Vite | Frontend SPA |
| React Router DOM | Navigation multi-pages |
| Supabase | Auth JWT + PostgreSQL + Storage |
| Vercel | Hébergement + CI/CD + API Routes |
| Resend | Envoi d'emails transactionnels |
| Git + GitHub | Versioning + collaboration |

## 📁 Arborescence du projet

```
mon-kanban/
├── api/
│   └── send-email.js          # Fonction serverless Vercel (Resend)
├── src/
│   ├── lib/
│   │   └── supabase.js         # Client Supabase
│   ├── pages/
│   │   ├── LoginPage.jsx       # Inscription / Connexion
│   │   ├── DashboardPage.jsx   # Dashboard principal (Kanban)
│   │   └── ProfilePage.jsx     # Profil utilisateur
│   ├── components/
│   │   ├── Navbar.jsx          # Barre de navigation responsive
│   │   ├── TaskCard.jsx        # Carte d'une tâche avec badges
│   │   ├── TaskForm.jsx        # Formulaire de création de tâche
│   │   ├── TaskList.jsx        # Liste des tâches (colonnes Kanban)
│   │   └── UserTable.jsx       # Tableau des utilisateurs
│   └── App.jsx                 # Routeur principal + gestion session
├── .env.local                  # Variables d'environnement (non commité)
├── .gitignore
├── package.json
└── vite.config.js
```

## ⚙️ Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/Lubin-vray/mon-kanban-R2.09
cd mon-kanban

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Ouvrir .env.local et renseigner les valeurs ci-dessous

# 4. Lancer l'application (avec support des API Routes)
npx vercel dev

# Alternative sans emails (Vite seul, plus rapide)
npm run dev
```

## 🗃️ Variables d'environnement requises

Créer un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://gxsdjnfidzjdyfrxpbju.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_jkhmxOgkd0r_8wBnZPsECA_K9dzH3lZ
RESEND_API_KEY=re_Hd1irLRu_LEV8TAFPdPhULrGMhcFs9WLp
```

> ⚠️ **Ne jamais commiter `.env.local`** — Ce fichier est exclu par `.gitignore`
> Les mêmes variables doivent être configurées dans Vercel → Settings → Environment Variables

## ✅ Fonctionnalités implémentées

### Fonctionnalités obligatoires
- 🔐 **Inscription** avec email + mot de passe (Supabase Auth)
- 🔑 **Connexion / Déconnexion** avec session JWT persistante
- 🛡️ **Routes protégées** — redirection `/login` si non authentifié
- 📋 **Dashboard Kanban** — 4 colonnes : À faire / En cours / Validation / Terminée
- ➕ **Création de tâche** — titre, description, statut, priorité, catégorie, date d'échéance
- 🗑️ **Suppression de tâche** avec confirmation utilisateur
- 🏷️ **Badges colorés** — priorité (rouge/jaune/vert), statut, catégorie

### Fonctionnalités avancées (TD4)
- 🧭 **Navbar responsive** avec indicateur de lien actif et mini avatar
- 👤 **Page profil** — modification du nom complet, bio, mot de passe, photo de profil
- 🖼️ **Upload d'avatar** — stocké dans Supabase Storage (bucket `avatars`)
- 📧 **Email automatique** — envoyé au créateur lors de la création d'une tâche avec échéance

### Fonctionnalité libre (US-10)
- 💬 **Commentaires sur les tâches** — lecture et écriture en BDD (`task_comments`)

## 🗃️ Modèle de données (résumé)

| Table | Colonnes clés |
|-------|--------------|
| `boards` | id, name, created_by (FK auth.users) |
| `categories` | id, name, color |
| `tasks` | id, title, status, priority, board_id (FK), category_id (FK), due_date |
| `profiles` | id (= auth.users.id), full_name, avatar_url, bio |
| `task_comments` | id, task_id (FK), user_id (FK), content, created_at |

## 🔒 Sécurité

- Row Level Security (RLS) activé sur toutes les tables Supabase
- Clé API Resend stockée côté serveur uniquement (API Route Vercel)
- Aucune clé `service_role` exposée côté client
- `.env.local` exclu de l'historique Git

## 📄 Licence

Projet académique — BUT R&T — IUT de Roanne — Université Jean Monnet — 2025/2026
"""