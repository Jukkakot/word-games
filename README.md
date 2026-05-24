# Word Games

Suomenkielisiä sanapelejä selaimessa. Rakennettu React + TypeScript + Vite.

## Pelit

### Yhteydet — Löydä neljän ryhmiä

Suomalainen versio Connections-pelistä. Löydä neljä sanaa joilla on jokin yhteinen yhteys — kaikki neljä muodostavat yhdyssanan saman liiteosan kanssa (esim. TASKU, OTSA, JALKA, KATTO → _lamppu_).

- Valitse 4 sanaa ja paina **Tarkista**
- Vihje paljastaa 2 sanaa yhdestä ryhmästä (max 3 vihjettä)
- Jokaisella pelikerralla arvotaan 4 satunnaista ryhmää 38 ryhmän poolista
- Debug-tila: paina **D** nähdäksesi ryhmien värit ruuduilla

## Kehitys

```bash
npm install
npm run dev
```

## Julkaisu

Pushaus `master`-haaraan käynnistää GitHub Actions -deployn GitHub Pagesiin automaattisesti.
