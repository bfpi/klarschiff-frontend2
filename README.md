# Neue Desktopversion des Klarschiff-Frontend

Dieser überarbeite Version des Frontend für die Klarschiff-Anwendung basiert auf folgenden Technologien und Bibliotheken:
* [OpenLayers 3](http://openlayers.org) - JavaScript-Mapping-Framework für Georeferenzen
* [PROJ4JS](https://github.com/proj4js/proj4js) - JavaScript Bibliothek zur Transfomation von Koordinaten
* [JQuery](http://jquery.com) - JavaScript Bibliothek
* [Bootstrap](http://getbootstrap.com) - HTML, CSS und JavaScript Framework für Responsive Webdesign
* [PHP](http://php.net)

## Voraussetzungen

Zur Zusammenfassung und Komprimierung der notwendigen JavaScripte wird [Node.js](http://nodejs.org/) >= 0.10 und [NPM](http://npmjs.org/) benötigt. Letzteres wird durch die Installation von Node.js mit bereitgestellt.
Eine Installationsanleitung für Debian basierte Systeme ist hier zu finden: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

1. In der Projektwurzel gibt es eine `package.json` zur Definition der notwendigen Pakete und Tools via NPM
  
        npm install

1. Die eigentlichen Aufgaben erledigen Grunt-Tasks:
  1. Installation / Einrichtung der referenzierten Bibliotheken anhand der Konfiguation aus der `Gruntfile.js`: 

          grunt install 

  1. Die Tasks sind für zwei Umgebungen vorbereitet: 
    1. `development`: (Standardkonfiguration), die JavaScripte werden nur zusammengefasst, nicht komprimiert und es gibt einen Wachtdog, der bei Änderungen an den Quelldateien automatisch neue Builds für die Referenz in der Seite erstellt.
    2. `production`: Konfiguration via `GRUNT_ENV=production` (ggf. in der `/etc/profile`). Die Scripte werden für eine bessere Performance zusätzlich komprimiert an den Browser ausgeliefert. Ein automatisierter Watchdienst ist bisher nicht konfiguriert.
  
  1. Für beide Umgebungen wird der Standard-Tasks wie folgt aufgerufen:
  
          grunt
