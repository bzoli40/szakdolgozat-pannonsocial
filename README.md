# GitHub repository a "Hírmegosztó és eseményszervező oldal fejlesztése" szakdolgozathoz

Hallgató: Birkás Zoltán [FIEVSR]
Témavezető: Éles András

# File-ok

A projekt azon szakdolgozati állományokat tartalmazza, amelyekkel bárki képes az egész rendszert telepíteni és futtatni a saját számítógépén

## Lépések a használathoz
**[FIGYELEM! Szükség lesz a Visual Studio Code (VSC) telepítésére, hiszen ezzel egyszerűbben és hatékonyabban lehet a projektet feltelepíteni és kezelni]**

 1. Böngészőn vagy verziókezelő alkalmazáson keresztül töltsük le a repository-t
 2. Amennyiben be van csomagolva .zip/.rar állományba bontsuk ki
 3. Nyissuk meg kétszer a VSC-t, majd pedig az egyikbe a Frontend (kliens), a másikba pedig a Backend (szerver) könyvtárat nyissuk meg (Open Folder...)
 4. Mindkettőnél nyissunk egy konzolt (Ctrl + ö)
 5. Írjuk be, hogy "npm i" vagy "npm install" és várjunk, hogy a konzol telepítse a könyvtárakba a szükséges modulokat és SDK-kat
 6. Amennyiben ez megvan, indítsuk el a klienst és a szervert az "npm start" utasítással
 7. Ha minden jól ment kész is vagyunk és a böngészőben megnyílt a weboldalunk! Kellemes használatot!

# Amire figyelni kell

 - Ha az egyik rész (Backend vagy Frontend) nem megy, akkor nem működik a rendszer
 - Ha nincs internetünk, akkor sem
 - Ha fut más is a localhost:3000 és 3001 porton, akkor a rendszer lehet belekeveredik, érdemes csak egy dolgot futtatni egy porton VAGY a konfigurációs fájlokban módosítani lehet a használt portokat.