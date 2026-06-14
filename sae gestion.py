from datetime import datetime    # Importe l'objet datetime pour la gestion des dates
import json                      # Importe le module pour manipuler des données JSON
import csv                       # Importe le module pour manipuler des fichiers CSV


try:                             # Début de la gestion d'erreurs (try/except)
    with open ("concentrations-polluants-dans-lair-ambiant.json", "r", encoding="utf-8") as file:
                                 # Ouvre le fichier JSON                                
        fichierjson = json.load(file) # Charge le contenu du fichier JSON
                                 
except FileNotFoundError:        # Si le fichier est introuvable
    print("Fichier introuvable") # Affiche un message d'erreur
    exit()                       # Termine le programme

with open("polluants.csv", "w", newline="", encoding="utf-8-sig") as csvfile:
                                 # Ouvre/Crée le fichier CSV 
    writer = csv.writer(csvfile, delimiter=";")
                                 # Crée l'objet CSV (délimiteur : point-virgule)

    writer.writerow(["Nom_Station", "Latitude", "Longitude", "Date de prélèvement",
                     "Nom_Polluant", "Valeur", "Unité"])
                                 # Écrit les en-têtes de colonnes dans le CSV

    for m in fichierjson:        # Boucle sur chaque enregistrement dans les données JSON
        fields = m["fields"]     # Récupère le dictionnaire des champs

        NomStation = m["fields"]["nom_station"]
                                 # Extrait le nom de la station
        Latitude = m["fields"]["geo_point"][0]
                                 # Extrait la Latitude
        Longitude = m["fields"]["geo_point"][1]
                                 # Extrait la Longitude

        # Conversion de la date → format français
        Datedeprelevement = fields.get("date_debut")
                                 # Récupère la date de prélèvement
        if Datedeprelevement:    # Vérifie si une date est présente
            try:                 # Début de la gestion d'erreurs pour le format de date
                dt = datetime.fromisoformat(Datedeprelevement)
                                 # Convertit la chaîne ISO en objet datetime
                Datedeprelevement = dt.strftime("%d/%m/%Y %H:%M")
                                 # Formate la date au format français (JJ/MM/AAAA HH:MM)
            except Exception:    # Si le formatage échoue
                pass             # Ignore l'erreur et garde la date 


        Nom_Polluant = m["fields"]["nom_poll"]
                                 # Extrait le nom du polluant
        
        try:                     # Début de la gestion d'erreurs pour la valeur
            Valeur = m["fields"]["valeur"]
                                 # Extrait la valeur du polluant
            
        except:                  # Si la valeur est manquante
            Valeur = ""          # Définit la valeur comme une chaîne vide
            
        unite = m["fields"]["unite"]
                                 # Extrait l'unité de mesure
        
        # Vérifie que toutes les valeurs sont présentes
        def manquante(x):        # Définit une fonction pour vérifier si une valeur est manquante
            return x is None or (isinstance(x, str) and x.strip() == "")
                                 # Retourne vrai si x est None ou une chaîne vide/blanche
        

        champs = [NomStation, Latitude, Longitude, Datedeprelevement,
                  Nom_Polluant, Valeur, unite]
                                 # Crée la liste des données à écrire

        if any(manquante(v) for v in champs):
                                 # Vérifie si n'importe quel champ est manquant
            
            continue             # Si manquant, passe à l'enregistrement JSON suivant

        #  Écriture dans le CSV (bien indentée dans la boucle)
        writer.writerow(champs)  # Écrit l'enregistrement complet dans le fichier CSV
        
        
        
        
        
        
        
        
        