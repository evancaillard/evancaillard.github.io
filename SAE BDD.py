
import csv
import mysql.connector
from unidecode import unidecode
from datetime import datetime
import re

def nettoyer(texte: str) -> str:
    return (
        unidecode(texte.strip())
        .replace("_", "")
        .replace(" ", "")
        .replace("&", "and")
        .lower()
        .capitalize()
    )

def date_mysql(date_str: str) -> str:
    return datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d")

def lire_csv(fichier):
    with open(fichier, encoding="latin-1") as f:
        lecteur = csv.reader(f, delimiter=";")
        next(lecteur)
        yield from lecteur

def fetch_id(cursor, query, params):
    cursor.execute(query, params)
    res = cursor.fetchone()
    return res[0] if res else None

db = mysql.connector.connect(host="localhost", user="root", password="", database="myDataBase")
c = db.cursor(buffered=True)


# 1. PARTENAIRES


verif = set()

for ligne in lire_csv("partenaire.csv"):
    nom, ville = nettoyer(ligne[0]), nettoyer(ligne[1])
    cle = (nom.lower(), ville.lower())

    if cle in verif:
        print(f"DOUBLON ignoré : {nom} / {ville}")
        continue

    verif.add(cle)

    c.execute(
        "INSERT INTO entrepot VALUES (NULL,%s,%s,%s,%s)",
        ("", nom, "", ville),
    )

    print(f"INSÉRÉ : {nom} / {ville}")

db.commit()


# 2. ENTREES


for ligne in lire_csv("entree.csv"):
    date_, quantite = date_mysql(ligne[0]), ligne[1]
    partenaire = nettoyer(ligne[2])

    id_entrepot = fetch_id(
        c,
        "SELECT idEntrepot FROM entrepot WHERE nomEntrepot=%s",
        (partenaire,),
    )

    if not id_entrepot:
        print(f"PARTENAIRE INCONNU : {partenaire}")
        continue

    c.execute(
        "INSERT INTO livraison_entrante VALUES (NULL,%s,%s,%s)",
        (date_, quantite, id_entrepot),
    )

    print(f"INSÉRÉ : {date_} | {quantite}")

db.commit()


# 3. VEHICULES + LIVREURS


for ligne in lire_csv("vehicule_livreur.csv"):
    typeVeh, nomLivreur = ligne[0].strip(), ligne[4].strip()

    if typeVeh:
        typeVeh = nettoyer(typeVeh)
        autonomie, capacite = ligne[1], ligne[2]
        nb = int(ligne[3])

        for _ in range(nb):
            c.execute(
                "INSERT INTO vehicule VALUES (NULL,%s,%s,%s)",
                (autonomie, capacite, typeVeh),
            )

        print(f"INSÉRÉ : {nb}x {typeVeh}")

    if nomLivreur:
        nom, prenom = nettoyer(nomLivreur), nettoyer(ligne[5])
        date_ = date_mysql(ligne[6])

        c.execute(
            "INSERT INTO conducteurs_livreurs VALUES (NULL,%s,%s,%s,'')",
            (nom, prenom, date_),
        )

        print(f"LIVREUR : {nom} {prenom}")

db.commit()


# CORRESPONDANCES

CORRESPONDANCE_VEHICULES = {
    "Utilitaire Elec": "Utilitaireelectrique",
    "Velo Cargo": "Velo-Cargo",
    "Tri Porteur": "Triporteur",
}

def normaliser_vehicule(v):
    v_clean = nettoyer(v)
    return CORRESPONDANCE_VEHICULES.get(v, v_clean)


# 4. TOURNEES


for ligne in lire_csv("tournee.csv"):
    date_ = date_mysql(ligne[0])
    type_veh = normaliser_vehicule(ligne[1])
    autonomie, capacite = ligne[2], ligne[3]
    nom_livreur = nettoyer(ligne[4])

    id_vehicule = fetch_id(
        c,
        "SELECT idVehicule FROM vehicule WHERE type=%s AND autonomie=%s AND capacite=%s LIMIT 1",
        (type_veh, autonomie, capacite),
    )

    if not id_vehicule:
        print(f"VÉHICULE INCONNU : {type_veh}")
        continue

    id_conducteur = fetch_id(
        c,
        "SELECT idConducteur FROM conducteurs_livreurs WHERE nom=%s",
        (nom_livreur,),
    )

    if not id_conducteur:
        print(f"LIVREUR INCONNU : {nom_livreur}")
        continue

    c.execute(
        "INSERT INTO tournee VALUES (NULL,%s,0,'En cours',%s)",
        (date_, id_conducteur),
    )
    id_tournee = c.lastrowid

    c.execute(
        "INSERT INTO utilise VALUES (%s,%s)",
        (id_tournee, id_vehicule),
    )

    for prov in ligne[5:]:
        if not prov.strip():
            continue

        nom_entrepot = nettoyer(prov)
        id_entrepot = fetch_id(
            c,
            "SELECT idEntrepot FROM entrepot WHERE nomEntrepot=%s",
            (nom_entrepot,),
        )

        if not id_entrepot:
            print(f"ENTREPÔT INCONNU : {nom_entrepot}")
            continue

        c.execute(
            "INSERT INTO livraison_entrante VALUES (NULL,%s,0,%s)",
            (date_, id_entrepot),
        )
        id_livraison = c.lastrowid

        c.execute(
            "INSERT INTO apporter VALUES (%s,%s)",
            (id_livraison, id_tournee),
        )

    print(f"TOURNÉE : {date_}")

db.commit()


# 5. LIVRAISONS


for ligne in lire_csv("livraison.csv"):
    date_ = date_mysql(ligne[0])
    nom_client, ville = nettoyer(ligne[1]), nettoyer(ligne[2])
    type_veh = normaliser_vehicule(ligne[3])
    adresse, nb = ligne[5], int(ligne[6] or 0)
    nom_livreur = nettoyer(ligne[7])

    id_vehicule = fetch_id(
        c,
        "SELECT idVehicule FROM vehicule WHERE type=%s LIMIT 1",
        (type_veh,),
    )

    id_conducteur = fetch_id(
        c,
        "SELECT idConducteur FROM conducteurs_livreurs WHERE nom=%s",
        (nom_livreur,),
    )

    if not id_vehicule or not id_conducteur:
        print("ERREUR véhicule/livreur")
        continue

    id_tournee = fetch_id(
        c,
        "SELECT idTournee FROM tournee WHERE date_=%s AND idConducteur=%s",
        (date_, id_conducteur),
    )

    if not id_tournee:
        c.execute(
            "INSERT INTO tournee VALUES (NULL,%s,0,'En cours',%s)",
            (date_, id_conducteur),
        )
        id_tournee = c.lastrowid

        c.execute(
            "INSERT INTO utilise VALUES (%s,%s)",
            (id_tournee, id_vehicule),
        )

    id_client = fetch_id(
        c,
        "SELECT idClient FROM client WHERE nom=%s AND ville=%s",
        (nom_client, ville),
    )

    if not id_client:
        cp = re.search(r'\b\d{5}\b', adresse)
        cp = cp.group() if cp else ""

        c.execute(
            "INSERT INTO client VALUES (NULL,%s,'',%s,%s,%s,'')",
            (nom_client, cp, adresse, ville),
        )
        id_client = c.lastrowid

    c.execute(
        "INSERT INTO livraison_sortante VALUES (NULL,%s,%s,%s,%s)",
        (date_, nb, id_client, id_tournee),
    )

    print(f"LIVRAISON : {nom_client} | {nb}")

db.commit()

#On execute notre tkinter une fois fini
import greensd_ihm