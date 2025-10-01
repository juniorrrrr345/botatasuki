require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbName = process.env.DB_NAME || 'bot.db';
const dbPath = path.join(__dirname, dbName);

console.log(`📦 Migration de la base de données: ${dbName}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erreur lors de l\'ouverture de la base de données:', err);
        process.exit(1);
    }
    console.log('✅ Base de données connectée');
    
    // Ajouter les colonnes pour le service Localisation
    db.serialize(() => {
        // Vérifier si les colonnes existent déjà
        db.all("PRAGMA table_info(config)", (err, columns) => {
            if (err) {
                console.error('❌ Erreur lors de la vérification des colonnes:', err);
                db.close();
                return;
            }
            
            const columnNames = columns.map(col => col.name);
            
            // Ajouter localisation_text si elle n'existe pas
            if (!columnNames.includes('localisation_text')) {
                console.log('➕ Ajout de la colonne localisation_text...');
                db.run(
                    "ALTER TABLE config ADD COLUMN localisation_text TEXT DEFAULT '📌 SERVICE LOCALISATION\n\nTrouvez-nous facilement'",
                    (err) => {
                        if (err) {
                            console.error('❌ Erreur lors de l\'ajout de localisation_text:', err);
                        } else {
                            console.log('✅ Colonne localisation_text ajoutée');
                        }
                    }
                );
            } else {
                console.log('⏭️  La colonne localisation_text existe déjà');
            }
            
            // Ajouter localisation_image si elle n'existe pas
            if (!columnNames.includes('localisation_image')) {
                console.log('➕ Ajout de la colonne localisation_image...');
                db.run(
                    "ALTER TABLE config ADD COLUMN localisation_image TEXT",
                    (err) => {
                        if (err) {
                            console.error('❌ Erreur lors de l\'ajout de localisation_image:', err);
                        } else {
                            console.log('✅ Colonne localisation_image ajoutée');
                        }
                        
                        // Fermer la base de données après toutes les opérations
                        setTimeout(() => {
                            db.close((err) => {
                                if (err) {
                                    console.error('❌ Erreur lors de la fermeture:', err);
                                } else {
                                    console.log('\n🎉 Migration terminée avec succès !');
                                    console.log('📝 Vous pouvez maintenant redémarrer votre bot');
                                }
                            });
                        }, 1000);
                    }
                );
            } else {
                console.log('⏭️  La colonne localisation_image existe déjà');
                
                // Fermer la base de données
                setTimeout(() => {
                    db.close((err) => {
                        if (err) {
                            console.error('❌ Erreur lors de la fermeture:', err);
                        } else {
                            console.log('\n✅ Aucune migration nécessaire');
                        }
                    });
                }, 500);
            }
        });
    });
});
