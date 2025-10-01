# 🔄 Migration pour le service Localisation

## 📌 Problème

Si vous avez installé le bot **AVANT** l'ajout du service Localisation, votre base de données ne contient pas les colonnes nécessaires pour sauvegarder le texte et la vidéo de Localisation.

**Symptôme** : Quand vous modifiez le texte ou la vidéo de Localisation, rien ne se sauvegarde.

## ✅ Solution : Script de Migration

### Sur votre VPS :

```bash
# 1. Aller dans le dossier du bot
cd /opt/multi-bots/botatasuki

# 2. Récupérer les dernières modifications depuis GitHub
git pull origin main

# 3. Arrêter le bot temporairement
pm2 stop botatasuki

# 4. Lancer le script de migration
node migrate-localisation.js

# 5. Redémarrer le bot
pm2 restart botatasuki

# 6. Vérifier que tout fonctionne
pm2 logs botatasuki
```

## 📋 Ce que fait le script

Le script ajoute automatiquement à votre base de données :
- ✅ `localisation_text` - Pour stocker le texte du service
- ✅ `localisation_image` - Pour stocker la vidéo du service

## 🆕 Pour les nouvelles installations

Si vous installez le bot pour la **première fois** maintenant, **vous n'avez PAS besoin** de ce script. Les colonnes sont créées automatiquement lors de la première installation.

## ⚠️ Note importante

- Le script est **sécurisé** : il vérifie si les colonnes existent déjà avant de les ajouter
- Vous pouvez l'exécuter plusieurs fois sans problème
- Il ne supprime aucune donnée existante

## 🔍 Vérifier que la migration a fonctionné

Après avoir lancé le script, vous devriez voir :
```
📦 Migration de la base de données: botatasuki.db
✅ Base de données connectée
➕ Ajout de la colonne localisation_text...
✅ Colonne localisation_text ajoutée
➕ Ajout de la colonne localisation_image...
✅ Colonne localisation_image ajoutée

🎉 Migration terminée avec succès !
📝 Vous pouvez maintenant redémarrer votre bot
```

## 🆘 En cas de problème

Si vous avez une erreur, vérifiez :
1. Que le bot est bien arrêté (`pm2 stop botatasuki`)
2. Que vous êtes dans le bon dossier
3. Que le fichier `.env` est correct avec `DB_NAME=botatasuki.db`

## 📞 Support

Si ça ne fonctionne toujours pas, vérifiez les logs :
```bash
pm2 logs botatasuki --lines 50
```
