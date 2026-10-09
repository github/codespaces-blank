# Panduan Server Vanilla+

Folder server: `~/mcserver-vanillaplus` (jalan pintasnya di Explorer: **mcserver-vanillaplus**).
Semua perintah di bawah dijalankan di **Terminal** Codespace. Mulai dengan:

```bash
cd ~/mcserver-vanillaplus
```

Alamat untuk join: **stamina-seahawks.tun.ply.gg** (lewat playit.gg).

---

## 1. Perintah harian

| Mau apa | Perintah |
|---|---|
| Nyalakan server + playit | `./up.sh` |
| Matikan server + playit (aman, world tersimpan) | `./down.sh` |
| Restart (setelah ubah mod/config) | `./restart.sh` |
| Cek jalan/tidak | `./status.sh` |
| Lihat console server | `tmux attach -t mc` |
| Keluar dari console **tanpa** mematikan server | tekan **Ctrl+B**, lepas, lalu **D** |
| Backup world | `./backup.sh` |
| Tambah teman ke whitelist | `./whitelist-add.sh NamaPemain` |

- `./up.sh` aman dijalankan berkali-kali; yang sudah nyala tidak dinyalakan dua kali.
- **Jangan** menyalakan server dengan `./start.sh` langsung: playit tidak ikut nyala, teman tidak bisa join.
- Di console (`tmux attach -t mc`) kamu bisa mengetik perintah server tanpa `/`, mis. `list`, `say halo`, `stop`.
- Server otomatis menyala lagi kalau crash (lihat `crash-restarts.log`).

### Sebelum tidur / selesai main
1. `./down.sh`
2. Matikan Codespace: menu **Codespaces** (kiri bawah) → **Stop Current Codespace**,
   atau di github.com/codespaces → `...` → **Stop codespace**. Codespace yang dibiarkan menyala menghabiskan jatah jam.

### Besoknya
Buka Codespace, lalu:
```bash
~/mcserver-vanillaplus/up.sh
```

---

## 2. Kalau teman tidak bisa join

1. `./status.sh`
   - **Playit: MATI** → `./up.sh`
   - **Server: MATI** → `./up.sh`, tunggu ±1 menit sampai `./status.sh` bilang *sudah selesai start*.
2. Server baru start butuh ±40 detik sebelum bisa dimasuki.
3. Setelah update mod, teman **restart game sekali** (AutoModpack mengunduh mod baru), lalu join lagi.
4. Kalau masih gagal, lihat error terakhir: `tail -50 logs/latest.log`

---

## 3. Update mod

### Mod yang dipasang di server DAN teman (paling umum)
1. Upload file `.jar` ke folder `mcserver-vanillaplus/mods` (seret dari komputer ke Explorer).
2. `./restart.sh`
3. Teman restart game sekali → AutoModpack mengunduh mod barunya.

### Mod khusus teman/klien (shader, minimap, UI, dsb.)
Taruh di `automodpack/host-modpack/main/mods`, lalu `./restart.sh`.
Server sendiri tidak memuatnya.

### Mod khusus server (tidak boleh dikirim ke teman)
Taruh di `mods/`, lalu tambahkan namanya ke daftar `exclude` di `automodpack/server.conf`, contoh:
`"mods/nama-mod-*.jar"`. Yang sudah dikecualikan: graves, polymer, Chunky, illager_expansion, blossom.

### Ganti versi mod
Hapus `.jar` versi lama dari `mods/`, upload yang baru, `./restart.sh`. **Jangan biarkan dua versi mod yang sama.**

### Hapus mod
Pindahkan ke `mods-nonaktif/` (bukan dihapus permanen) lalu `./restart.sh`.
Hati-hati: blok/item dari mod yang dihapus akan hilang dari world.

> Selalu `./backup.sh` dulu sebelum menambah/menghapus mod.

---

## 4. Config & datapack

- Config mod: folder `config/` (mis. `waystones-common.toml`, `mobchampions-common.toml`, `lootr-common.jsonc`).
  Ubah → `./restart.sh`.
- Pengaturan server: `server.properties` (view-distance, difficulty, max-players, ...). Ubah → `./restart.sh`.
- Datapack world: `world/datapacks/`. Setelah mengubah datapack cukup ketik `reload` di console.
- Whitelist: server ini mode offline (crack). **Jangan** pakai `whitelist add` biasa untuk akun crack — kadang memberi UUID premium
  sehingga temannya tetap ditolak (pernah terjadi pada Javieboy). Pakai:
  ```bash
  ./whitelist-add.sh NamaPemain
  ```
  (menambah UUID offline yang benar dan langsung aktif kalau server sedang jalan).

---

## 5. Backup & restore

- Backup ada di `~/backups/` (sebelum update dungeon: `pre-dungeon-20261005-1442.tar.gz`).
- Restore (server harus mati dulu):
  ```bash
  ./down.sh
  mv world world.rusak-$(date +%s)
  tar -xzf ~/backups/NAMA-FILE.tar.gz world
  ./up.sh
  ```
- Hapus backup lama kalau disk penuh: `ls -lh ~/backups` lalu `rm ~/backups/NAMA-FILE.tar.gz`.

---

## 6. Perintah admin Dungeon Realm (dari console, tanpa `/`)

| Perintah | Fungsi |
|---|---|
| `dungeonguard boss list` | Posisi & status semua boss |
| `dungeonguard boss reset all` | Munculkan ulang semua boss (tanpa tunggu 15 menit) |
| `dungeonguard boss reset lake_boss` | Reset satu boss |
| `dungeonguard check X Y Z` | Blok di dungeon itu asli map (terlindung) atau taruhan |

Perintah yang butuh posisi pemain (`boss tp`, `boss move`) harus dijalankan pemain yang punya izin OP:
console `op NamaKamu` → pakai → `deop NamaKamu`.

**Jangan** menjalankan `function vanillaplus:admin/setup/start` di server — persiapan dungeon sudah dilakukan.

---

## 7. Perintah untuk semua pemain

| Perintah | Fungsi |
|---|---|
| `/tpa <nama>` | Minta teleport ke pemain |
| `/tpahere <nama>` | Minta pemain teleport ke kamu |
| `/tpaaccept`, `/tpadeny`, `/tpacancel` | Terima / tolak / batalkan |
| `/back` | Kembali ke posisi sebelum teleport terakhir atau tempat mati terakhir |

Semua perintah di atas diblokir di dalam Dungeon Realm.
