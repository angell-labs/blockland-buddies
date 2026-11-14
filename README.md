# Blockland Buddies

An original blocky sandbox game for kids, made for iPad Safari. Build, explore England and Hawaii, adopt pets, and learn reading and math along the way.

**Play:** https://angell-labs.github.io/blockland-buddies/

## First time: family setup
The first time the game opens, a grown-up adds up to 4 kids, each with a name and age (4–12). The age picks the learning level:

- Ages 4–7 → 🌱 **Little Builder**: picture words, adding small numbers, everything can be read aloud.
- Ages 8–12 → 🚀 **Big Builder**: vocabulary, times tables, making change in the shop.

Each kid gets a big button on the "Who's playing?" screen, with their own avatar, coins, passport stamps, journal and progress. To change names, ages or levels later, or to add or remove a kid: **👪 Grown-ups** (answer the adding question) → **✏️ Edit kids**. Everything is saved in Safari on that iPad only. Nothing is sent anywhere.

Tip: in Safari tap **Share → Add to Home Screen** so it opens full screen like an app.

## Play Together (2+ iPads)
1. On the first iPad: menu → **👫 Play Together → 📡 Host**. It shows a 4-letter room code, then pick the world to share.
2. On the other iPad: **👫 Play Together → 🔗 Join** and type the code.

Both iPads need internet. The game uses the free public PeerJS service only to introduce the iPads; after that they talk directly to each other. The host iPad keeps the shared world (saved in its Safari storage), so the host should stay in the game while others play. Kids can only send 12 fixed emoji/phrases to each other; there's no typing to each other.

## Updates
The game checks for a new version when it opens and every few minutes. Saves are kept.

## Credits
All game code, textures and creatures are original. Uses [three.js](https://threejs.org) (MIT) and [PeerJS](https://peerjs.com) (MIT), both included in `vendor/`.
