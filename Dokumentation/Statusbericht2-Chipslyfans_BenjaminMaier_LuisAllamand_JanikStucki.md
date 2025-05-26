# Statusbericht 2 - Chipslyfans IPT6.1  

## Aktueller Projektstatus  

### Backend-Entwicklung  
 **Post-Verwaltung**: 100% abgeschlossen  
   - Bilder-Upload via Amazon S3 integriert  
 **Benutzerverwaltung**: Basisimplementierung fertig, Vertiefung in Arbeit  
 **Registrierung & Login**: Vollständig implementiert  
 **Authentifizierung**: Funktioniert stabil (JWT)  
 **Datenbankstruktur**: User- und Post-Tabellen finalisiert  
**Zusatzfunktionen**:  
   - Kommentarfunktion in Entwicklung  
   - Zahlungsabwicklung mit Stripe (Backend-Entwurf)  
   - Subscription-Verwaltung: 70% (Abo-Löschen/Kündigen, Bezahlung)  

### Frontend-Entwicklung  
**Grundlegende Views**: 100% umgesetzt  
   - Post-Details einsehbar  
   - UserProfile-Ansicht implementiert  
**Payment-Frontend**: 100% fertig  
 **UserPosts**: Laden und Anzeige funktional  

## Abweichungen vom Plan  
**Fokusverschiebung**:  
   - Priorisierung von Zahlungsfunktionen & Bild-Uploads  
   - Messaging und Collections vorerst zurückgestellt  

## Technische Details  

### Backend & Datenbank  
- **Technologien**: Node.js (Express.js), MariaDB  
- **Neuer Funktionsumfang**:  
  - Subscription-Management (Aktivieren/Kündigen)  
  - Bild-Uploads via Amazon S3  
  - Einzelne UserProfile abrufbar  

### Mehrsprachigkeit  
**Frontend**: i18n weiterhin aktiv  
**Datenbank**: Keine native Mehrsprachigkeit für Nutzerinhalte geplant (nutzergenerierte Inhalte bleiben in Originalsprache).  
   - Option: Spätere Integration der DeepL-API (nicht im aktuellen Scope).  

### Hosting  
- Keine Änderungen: Backend läuft lokal, Produktionsmigration folgt.  

## Visuelle Dokumentation  
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
![alt text](image-8.png)