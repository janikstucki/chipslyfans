# Chipslyfans Kick-Off

## Zweck und Ziel
Ziel ist es, die wichtigsten Komponenten eines Content-Sharing-Netzwerks umzusetzen, bei dem registrierte Nutzer kostenpflichtig Inhalte abonnieren können. Der Spaßfaktor und die thematische Begrenzung auf Chips-Bilder dient dazu, ein klares und gleichzeitig witziges Konzept umzusetzen.

## Entscheid
Unsere Idee entspricht sicherlich den Anforderungen des IPT7.1. Wir nutzen nicht nur neue Technologien, sondern verbinden diese mit bereits bekanntem. Beispiel: Wir nutzen MariaDB in Verbindung mit Node.js und Vue.js. 

## Aufwand & Entscheid
Realisierbarkeit im IPT-Rahmen
Das Projekt bietet viele Lernmöglichkeiten im Bereich Webentwicklung:

- Authentifizierung & Sessions

- REST APIs / Backend-Integration

- File-Upload & Speicherung

- Datenbanken (z. B. für User, Posts, Abos)

- Frontend-Komponenten & UI/UX

- Integration externer Projekte (ChipsyTok)

Die geplante Umsetzung in Teamarbeit und mit bereits definierten Schnittstellen zum Nachbarprojekt ist im gegebenen Zeitrahmen realistisch, zumal auf unnötige Komplexität (z. B. Videos oder externe Payment-Anbieter) bewusst verzichtet wird.
## Inhalt &  Umfang
###  Benutzer & Authentifizierung
- Login & Registrierung via ChipsyTok-Konto
- Eigenes Profil einsehen und bearbeiten

### Inhalte erstellen & verwalten
- Bilder hochladen (nur Chips-Bilder erlaubt)
- Bilder können hinter einer **Paywall** gepostet werden

### Interaktion
- Beiträge können:
  - Kommentiert
  - Geliked
  - Geteilt
  - Zur eigenen Sammlung hinzugefügt werden

### Abonnement-Modell
- Nutzer*innen können Profile abonnieren (kostenpflichtig)
- Verwaltung und Kündigung von Abos möglich

### Nachrichten & Kommunikation
- Direktnachrichten zwischen Nutzer*innen

### Feed
- Personalisierter Feed mit einfachem Algorithmus
  - z. B. basierend auf Likes, Abos oder Interaktionen

### Profile
- Anzeige des eigenen Profils und fremder Profile
- Abonnenten sehen Paywall-Inhalte, andere nur öffentliche Inhalte

## a. Funktionale Anforderungen 
| Funktion | Beschreibung | Priorität |
|----------|--------------|-----------|
| Registrierung & Login via ChipsyTok | Nutzer können sich mit ChipsyTok-Konto anmelden | **M** |
| Eigene Chips-Bilder hochladen | Upload-Funktion mit optionaler Paywall | **M** |
| Beiträge kommentieren, liken, teilen | Soziale Interaktionen mit Posts | **M** |
| Beiträge zur eigenen Sammlung hinzufügen | User können Inhalte speichern | **S** |
| Kostenpflichtige Abos | Bezahlte Abonnements anderer Profile | **M** |
| Abonnements verwalten/kündigen | Kontrolle über laufende Abos | **M** |
| Direktnachrichten | Kommunikation zwischen Nutzern | **S** |
| Profilseite anzeigen (eigen & fremd) | Übersicht der geposteten Inhalte und Infos | **M** |
| Feed mit Algorithmus | Personalisierter Content-Stream | **C** |
| Admin-Funktionen / Moderation | Inhalte prüfen und ggf. entfernen | **W** |

## b. Nichtfunktionale Anforderungen
- **Benutzerfreundlichkeit (UX)**: Intuitive Navigation, saubere Strukturierung
- **Responsives Design**: Optimierung für Desktop und mobile Geräte
- **Datenschutz**: Sicherer Umgang mit Userdaten und Bildern
- **Performance**: Schnelle Ladezeiten, effiziente Datenbankabfragen
- **Fehlertoleranz**: Klare Fehlermeldungen bei z. B. ungültigem Upload
- **Zugänglichkeit**: Grundlegende Barrierefreiheit sicherstellen

## c. Risiken oder Unklarheiten
- **Integration mit ChipsyTok**: Die Anbindung an das Authentifizierungssystem eines anderen Projekts könnte Probleme machen, wenn deren API nicht stabil oder nicht dokumentiert ist.
- **Bezahlsystem/Paywall**: Falls eine echte Bezahlfunktion nötig wird, ist das technisch und rechtlich komplex – vermutlich wird dies simuliert.
- **Feed-Algorithmus**: Wie personalisiert man Inhalte sinnvoll, ohne echten Daten-Overhead?
- **Bildinhalte moderieren**: Keine automatische Prüfung, ob es sich tatsächlich um Chips-Bilder handelt.
- **Direktnachrichten**: Umsetzung in kurzer Zeit evtl. zu aufwendig – eventuell als einfaches Chat-UI umsetzen.