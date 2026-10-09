#!/usr/bin/env bash
# Vanilla+ 26.3 (Fabric) - server setup for GitHub Codespaces
set -e
MC=26.3
LOADER=0.19.5
INSTALLER=1.1.2
DIR=$HOME/mcserver-vanillaplus
mkdir -p "$DIR/mods" "$DIR/automodpack/host-modpack/main/mods" && cd "$DIR"

echo '==> [1/6] Java 25'
JAVA=$HOME/jdk25/bin/java
if [ ! -x "$JAVA" ]; then
  mkdir -p $HOME/jdk25
  curl -fsSL "https://api.adoptium.net/v3/binary/latest/25/ga/linux/x64/jre/hotspot/normal/eclipse" | tar -xz -C $HOME/jdk25 --strip-components=1
fi
"$JAVA" -version 2>&1 | head -1

echo "==> [2/6] Fabric server $MC (loader $LOADER)"
[ -f fabric-server.jar ] || curl -fsSL -o fabric-server.jar "https://meta.fabricmc.net/v2/versions/loader/$MC/$LOADER/$INSTALLER/server/jar"

echo '==> [3/6] Mods (70 server + 18 client-only untuk AutoModpack)'
fetch() {
  fail=0
  while IFS='|' read -r dest file url sha; do
    [ -z "$file" ] && continue
    mkdir -p "$dest"
    if [ -f "$dest/$file" ] && echo "$sha  $dest/$file" | sha1sum -c --quiet - 2>/dev/null; then continue; fi
    if curl -fsSL -o "$dest/$file" "$url" && echo "$sha  $dest/$file" | sha1sum -c --quiet -; then echo "   ok $file"; else echo "   GAGAL $file"; fail=1; fi
  done
  [ "$fail" = 0 ] || { echo 'Ada file yang gagal diunduh, jalankan ulang skrip ini.'; exit 1; }
}
fetch <<'MODS'
mods|enchants-plus-2.0.jar|https://cdn.modrinth.com/data/N72bKhby/versions/OwKjklnC/enchants-plus-2.0.jar|5286c79d32ce4bf6c76e37f4bbb8757a4474fea8
mods|enchantments-encore-5.7.jar|https://cdn.modrinth.com/data/GD1QoExk/versions/m0eqeecx/enchantments-encore-5.7.jar|41adf4afb648055f6fd89b3d694d35f8a400f548
mods|dungeons-and-taverns-6.0.2.jar|https://cdn.modrinth.com/data/tpehi7ww/versions/WilF7nqU/dungeons-and-taverns-6.0.2.jar|172ba3915c8da4c46bdf63a24a8cff2b485b838d
mods|chopt-1.0.10+mc26.3.jar|https://cdn.modrinth.com/data/omDn2JEQ/versions/EefpN74x/chopt-1.0.10%2Bmc26.3.jar|387cee9420b19414c0347d44bd31e7f19f8cc1d7
automodpack/host-modpack/main/mods|iris-fabric-1.11.7+mc26.3.jar|https://cdn.modrinth.com/data/YL57xq9U/versions/vTN4NRGW/iris-fabric-1.11.7%2Bmc26.3.jar|fa03640ba1e4ef2f7ae3619c6373a06e46d0ba2c
automodpack/host-modpack/main/mods|enhancedblockentities-0.13.1+26.3-fabric.jar|https://cdn.modrinth.com/data/vpenrdOI/versions/vhH2bwq7/enhancedblockentities-0.13.1%2B26.3-fabric.jar|8f55da0f2db4da8dcd3d0a55d49bf423f7638199
mods|dungeons+-1.13.1.jar|https://cdn.modrinth.com/data/nHORcEHd/versions/iys4iiPH/dungeons%2B-1.13.1.jar|2bf0bce86e26d84234fc06bd8f1442f25cc2897b
mods|mobchampions-26.3-fabric-1.0.2.1-FABRIC.jar|https://cdn.modrinth.com/data/zrbKKaSr/versions/ZL43RsmE/mobchampions-26.3-fabric-1.0.2.1-FABRIC.jar|d65637be63dba36d58f0bf430d94688b9283f34a
mods|illager_arena-1.0.0 Fabric 26.3.jar|https://cdn.modrinth.com/data/6Eq86tCy/versions/fVj7sO1D/illager_arena-1.0.0%20Fabric%2026.3.jar|14cc738302108292fe0aec8ba989d30d99a0a0ac
mods|ExplorersCompass-26.3-2.5.2-fabric.jar|https://cdn.modrinth.com/data/RV1qfVQ8/versions/69AbLioc/ExplorersCompass-26.3-2.5.2-fabric.jar|ed3ce8679835d81406c4b57f583a17db1b75be4e
mods|collective-26.3.0-8.41.jar|https://cdn.modrinth.com/data/e0M1UDsY/versions/NVCphSNt/collective-26.3.0-8.41.jar|84d03b19a0c7df0a8acec8e9389342a7534f9e17
mods|replantingcrops-26.3.0-5.7.jar|https://cdn.modrinth.com/data/EXzIPtJo/versions/rTb70pLv/replantingcrops-26.3.0-5.7.jar|00d2a20597c308aa2f6dbf6143f04ec4251f52a0
automodpack/host-modpack/main/mods|AmbientSounds_FABRIC_v6.3.6_mc26.3.jar|https://cdn.modrinth.com/data/fM515JnW/versions/ViiM66Of/AmbientSounds_FABRIC_v6.3.6_mc26.3.jar|2b2e14a4aad85da51bf11a3bd84bdff06a14260e
automodpack/host-modpack/main/mods|blur-fabric-6.3.1+26.3.jar|https://cdn.modrinth.com/data/NK39zBp2/versions/5tm9vpXT/blur-fabric-6.3.1%2B26.3.jar|071851748916ec2e5ff711c0098578ea1b084783
automodpack/host-modpack/main/mods|continuity-3.0.1+26.3.jar|https://cdn.modrinth.com/data/1IjD5062/versions/Jt2sCWTQ/continuity-3.0.1%2B26.3.jar|63d51781b2c87e3b4b4ca98a133db8c98d3f2afb
automodpack/host-modpack/main/mods|CreativeCore_FABRIC_v2.14.19_mc26.3.jar|https://cdn.modrinth.com/data/OsZiaDHq/versions/GO707F1h/CreativeCore_FABRIC_v2.14.19_mc26.3.jar|1b3681bc987c6ce360220d4173139fc392080fe0
automodpack/host-modpack/main/mods|EnchantmentDescriptions-fabric-MC26.3-26.3.0.2.jar|https://cdn.modrinth.com/data/UVtY3ZAC/versions/uZf2qbql/EnchantmentDescriptions-fabric-MC26.3-26.3.0.2.jar|df05cffc9b065262262e649dd90da0defb70f31a
automodpack/host-modpack/main/mods|entityculling-fabric-1.11.2-mc26.3.jar|https://cdn.modrinth.com/data/NNAgCjsB/versions/F4loCvYt/entityculling-fabric-1.11.2-mc26.3.jar|f2196e803fe77cfbb62c4a2acb64803d98b4f61c
automodpack/host-modpack/main/mods|fallingleaves-2.0.8+26.3.jar|https://cdn.modrinth.com/data/WhbRG4iK/versions/5i0SxXxj/fallingleaves-2.0.8%2B26.3.jar|029c64703879734d7d325449852e0bf9309f3b8c
automodpack/host-modpack/main/mods|lambdynamiclights-4.13.0+26.3.jar|https://cdn.modrinth.com/data/yBW8D80W/versions/rylKnJ4M/lambdynamiclights-4.13.0%2B26.3.jar|18c8ab40f03219bfcf809a83db6e3958ed8bb866
automodpack/host-modpack/main/mods|modmenu-21.0.0.jar|https://cdn.modrinth.com/data/mOgUt4GM/versions/kyy7dbrZ/modmenu-21.0.0.jar|66ec40f1cd0c037ddca2b5fc6b4b976d479c18e8
automodpack/host-modpack/main/mods|MouseTweaks-fabric-mc26.3-2.31.jar|https://cdn.modrinth.com/data/aC3cM3Vq/versions/LeMuMhLv/MouseTweaks-fabric-mc26.3-2.31.jar|65c0f5588900e7ade476164ec4915bfab52c129a
automodpack/host-modpack/main/mods|PresenceFootsteps-1.14.0+26.3.jar|https://cdn.modrinth.com/data/rcTfTZr3/versions/UUNiN7Tm/PresenceFootsteps-1.14.0%2B26.3.jar|2747a6c39d42ef4024a26bb43fc17be5f1eb86b5
automodpack/host-modpack/main/mods|reeses-sodium-options-fabric-2.2.5+mc26.3.jar|https://cdn.modrinth.com/data/Bh37bMuy/versions/EfchygKx/reeses-sodium-options-fabric-2.2.5%2Bmc26.3.jar|305aa813172358eb5e95d0a7af02a44326261226
automodpack/host-modpack/main/mods|skinlayers3d-fabric-1.11.3-mc26.3.jar|https://cdn.modrinth.com/data/zV5r3pPn/versions/G8BCRxv5/skinlayers3d-fabric-1.11.3-mc26.3.jar|31ee367d5900d20a77c9c610cdd6dc9361c26865
automodpack/host-modpack/main/mods|sodium-fabric-0.9.2+mc26.3.jar|https://cdn.modrinth.com/data/AANobbMI/versions/bAZQdGpg/sodium-fabric-0.9.2%2Bmc26.3.jar|9acfe851e36f4fb27d7c5baa224e8bd4e0334283
automodpack/host-modpack/main/mods|statuseffecttimer-2.0.0+26.3.jar|https://cdn.modrinth.com/data/T9FDHbY5/versions/NfHPutHW/statuseffecttimer-2.0.0%2B26.3.jar|a3447fee0a1fc1401e580bc727a1ac617951c181
automodpack/host-modpack/main/mods|zoomify-2.16.3+26.3.jar|https://cdn.modrinth.com/data/w7ThoJFB/versions/bvz5KJLQ/zoomify-2.16.3%2B26.3.jar|3fd4cccef3a5d7d1d0771d3cbe87f450409fd384
mods|appleskin-fabric-mc26.3-3.0.10.jar|https://cdn.modrinth.com/data/EsAfCjCV/versions/PHjDtQay/appleskin-fabric-mc26.3-3.0.10.jar|3d19e40c5f97186857db98e622c01c2cd0030497
mods|armored-elytra-1.16.0.jar|https://cdn.modrinth.com/data/AuFCCYMx/versions/Oe6DS1BQ/armored-elytra-1.16.0.jar|c61ce228a4e332a41805488ee7c8db54cd807e4a
mods|AttributeFix-fabric-MC26.3-26.3.0.1.jar|https://cdn.modrinth.com/data/lOOpEntO/versions/zJLURVLx/AttributeFix-fabric-MC26.3-26.3.0.1.jar|8563a9c958a1534cb935ee2eb220170c6b9f0219
mods|automodpack-5.0.0-rc.2.jar|https://cdn.modrinth.com/data/k68glP2e/versions/bBBmWoC3/automodpack-5.0.0-rc.2.jar|7734ac6961d70ac09be6e12e5e3ceed87a4e526c
mods|balm-fabric-26.3-26.3.0.3.jar|https://cdn.modrinth.com/data/MBAkmtvl/versions/MYj31XNG/balm-fabric-26.3-26.3.0.3.jar|1b44d97048c1c2e9cc7e0a03c00f5cb117463a60
mods|Chunky-Fabric-1.5.3.jar|https://cdn.modrinth.com/data/fALzjamp/versions/4Eotm6ov/Chunky-Fabric-1.5.3.jar|fc1f2f374c5c82117599071ed18b6ef9bba2c7fb
mods|cicada-lib-0.15.3+26.3.jar|https://cdn.modrinth.com/data/IwCkru1D/versions/f5sDzSl6/cicada-lib-0.15.3%2B26.3.jar|5e4923c662e08c73b5cd28fe23cd8a1e54cd11ef
mods|clientsort-fabric-3.104.1+26.3.jar|https://cdn.modrinth.com/data/K0AkAin6/versions/UWMryUad/clientsort-fabric-3.104.1%2B26.3.jar|96cbf8e292a1c5325f0050af1091ea778b967578
mods|cloth-config-fabric-26.3.159.jar|https://cdn.modrinth.com/data/9s6osm5g/versions/fg2uyxOW/cloth-config-fabric-26.3.159.jar|9a5cce069380a2047250831dcb19f4ef1b15872d
mods|copperhopper-fabric-0.25.2+26.3.jar|https://cdn.modrinth.com/data/mTI5Xg5F/versions/srILbFOk/copperhopper-fabric-0.25.2%2B26.3.jar|05f5fa79215a695cc1310568ca7da4b2d673d1bf
mods|cratedelight-26.09.15-26.3-fabric.jar|https://cdn.modrinth.com/data/9rlXSyLg/versions/JoQeIy9i/cratedelight-26.09.15-26.3-fabric.jar|1f23efb23a744832cf1675abfddc326b0306b553
mods|delightlib-26.09.16-26.3-fabric.jar|https://cdn.modrinth.com/data/rmDY6fYt/versions/dABf1m0k/delightlib-26.09.16-26.3-fabric.jar|393b42752dd42463b8bfea99ebb615742b0ad00b
mods|do_a_barrel_roll-fabric-3.8.5+26.3.jar|https://cdn.modrinth.com/data/6FtRfnLg/versions/fmAJrjVS/do_a_barrel_roll-fabric-3.8.5%2B26.3.jar|c328a45b5b34fb1c7a7da35ae2099c8cbc8ae55c
mods|elytratrims-fabric-4.9.1+26.3.jar|https://cdn.modrinth.com/data/XpzGz7KD/versions/KiDLWRiF/elytratrims-fabric-4.9.1%2B26.3.jar|76553c51e0a4268e482d0a97711891f4e2a5bc36
mods|fabric-api-0.161.0+26.3.jar|https://cdn.modrinth.com/data/P7dR8mSH/versions/bNnaTiuM/fabric-api-0.161.0%2B26.3.jar|53f9ee02c3702734d90520aa8c9719bf0e1c8d4f
mods|fabric-language-kotlin-1.14.1+kotlin.2.4.20.jar|https://cdn.modrinth.com/data/Ha28R6CL/versions/eRRZzGMc/fabric-language-kotlin-1.14.1%2Bkotlin.2.4.20.jar|62ae40a31b689b52fde399f2143d547a631e942c
mods|FarmersDelight-26.3-3.6.27+refabricated.jar|https://cdn.modrinth.com/data/7vxePowz/versions/hTNvMewX/FarmersDelight-26.3-3.6.27%2Brefabricated.jar|8c00b5f004fafe157df7ddb241d32f28f458a4d6
mods|ferritecore-9.0.0-fabric.jar|https://cdn.modrinth.com/data/uXXizFIs/versions/d5ddUdiB/ferritecore-9.0.0-fabric.jar|eac76ff0f3753422c61b2c44487d0d195d88d4bc
mods|ForgeConfigAPIPort-v26.3.1-mc26.3.x-Fabric.jar|https://cdn.modrinth.com/data/ohNO6lps/versions/JpKvrr9J/ForgeConfigAPIPort-v26.3.1-mc26.3.x-Fabric.jar|a0d802d2cb010a5054c72f1ccf248433b6e0bafb
mods|graves-3.13.0+26.3.jar|https://cdn.modrinth.com/data/yn9u3ypm/versions/r9hY06vQ/graves-3.13.0%2B26.3.jar|b18202703051275d9d4f7f7ddab18e54a21d14f5
mods|grind-enchantments-4.2.2+26.3.jar|https://cdn.modrinth.com/data/WC4UgDcZ/versions/XqJ6meX9/grind-enchantments-4.2.2%2B26.3.jar|d2fb2f197d2562f667e6e9c1123d6bdbb51141a5
mods|hardcorerevival-fabric-26.3-26.3.0.1.jar|https://cdn.modrinth.com/data/HqKoXaXz/versions/9d4cslv4/hardcorerevival-fabric-26.3-26.3.0.1.jar|b3b4bb2937f88502c0211a14eeea3216944b0728
mods|Jade-mc26.3-Fabric-26.3.5.jar|https://cdn.modrinth.com/data/nvQzSEkH/versions/71CTWqdE/Jade-mc26.3-Fabric-26.3.5.jar|da61413c586c8918c14e2bbfdc808ce2d56ea9df
mods|jei-26.3-fabric-31.9.0.56.jar|https://cdn.modrinth.com/data/u6dRKJwZ/versions/pjjNQBoS/jei-26.3-fabric-31.9.0.56.jar|e2f129702a3dbd6a45fa9f29eb71593d5e364bca
mods|lithium-fabric-0.26.2+mc26.3.jar|https://cdn.modrinth.com/data/gvQqBUqZ/versions/xS0Q8LSi/lithium-fabric-0.26.2%2Bmc26.3.jar|dd5a4ec2c68d7601d8bce9076f789c55a5f8bef3
mods|lithostitched-2.0.4-fabric-26.3.jar|https://cdn.modrinth.com/data/XaDC71GB/versions/FhKHD2LJ/lithostitched-2.0.4-fabric-26.3.jar|f93e848eaa72aee51c2094880c6ad5d583c6b647
mods|mcw-bridges-3.1.2-mc26.3fabric.jar|https://cdn.modrinth.com/data/GURcjz8O/versions/htICLqtu/mcw-bridges-3.1.2-mc26.3fabric.jar|fb392ca506454764ac827aee61d9c4de4a34969e
mods|mcw-doors-1.1.5-mc26.3fabric.jar|https://cdn.modrinth.com/data/kNxa8z3e/versions/xfU8SZ7D/mcw-doors-1.1.5-mc26.3fabric.jar|4314bdcf52cd4261cb6cf20d80c733453364ceff
mods|mcw-fences-1.2.1-mc26.3fabric.jar|https://cdn.modrinth.com/data/GmwLse2I/versions/IYu8DBo9/mcw-fences-1.2.1-mc26.3fabric.jar|0b0447b14c4af5b3968f25f4630c47bc9903cc99
mods|mcw-furniture-3.4.2-mc26.3fabric.jar|https://cdn.modrinth.com/data/dtWC90iB/versions/8Z6HSCVW/mcw-furniture-3.4.2-mc26.3fabric.jar|7d861470d63fdbf22e8080b21d8490143cc41d9e
mods|mcw-lights-1.1.5-mc26.3fabric.jar|https://cdn.modrinth.com/data/w4an97C2/versions/LolTDv3X/mcw-lights-1.1.5-mc26.3fabric.jar|0bee69eb0cd2e491c64252d1a6f7df8b8dcc8eb1
mods|mcw-paintings-1.1.0-mc26.3fabric.jar|https://cdn.modrinth.com/data/okE6QVAY/versions/pzqkBlHr/mcw-paintings-1.1.0-mc26.3fabric.jar|416b80bc9c97cad571b17ab7ff34fb82db02a8b6
mods|mcw-paths-1.1.1-mc26.3fabric.jar|https://cdn.modrinth.com/data/VRLhWB91/versions/8OfVcwHY/mcw-paths-1.1.1-mc26.3fabric.jar|1b87246aa80b273c72ee08d68816b9bd2cdb79ac
mods|mcw-roofs-2.3.3-mc26.3fabric.jar|https://cdn.modrinth.com/data/B8jaH3P1/versions/yNXIY14C/mcw-roofs-2.3.3-mc26.3fabric.jar|6b3414eb4cf690d9eee6269651440175c83414c4
mods|mcw-stairs-1.0.2-mc26.3fabric.jar|https://cdn.modrinth.com/data/iP3wH1ha/versions/yYYDbarh/mcw-stairs-1.0.2-mc26.3fabric.jar|025bd582d1787db76a5d96498d8ec68ce2cc6a02
mods|mcw-trapdoors-1.1.5-mc26.3fabric.jar|https://cdn.modrinth.com/data/n2fvCDlM/versions/NWZ83OcB/mcw-trapdoors-1.1.5-mc26.3fabric.jar|7f8303efd4f705649586285c53c4f9563e7bbb03
mods|mcw-windows-2.4.2-mc26.3fabric.jar|https://cdn.modrinth.com/data/C7I0BCni/versions/GIK1xDxr/mcw-windows-2.4.2-mc26.3fabric.jar|d0982e89cf577682361f1e43435be4605c198894
mods|mezz_config-26.3-fabric-0.6.8.jar|https://cdn.modrinth.com/data/7tEfOcA7/versions/GKiA7PV4/mezz_config-26.3-fabric-0.6.8.jar|7e7770093973e2ffb53ff9fb8d32304bf73744c4
mods|moredelight-26.09.16-26.3-fabric.jar|https://cdn.modrinth.com/data/znHQQtuU/versions/pX0gsjqf/moredelight-26.09.16-26.3-fabric.jar|f0ec4121af9901895c4c32bbddd08d3930969ce6
mods|MoreVillagers-Re-26.3-fabric-1.26.9.4.jar|https://cdn.modrinth.com/data/1fOqTPRO/versions/JJOlX2C0/MoreVillagers-Re-26.3-fabric-1.26.9.4.jar|4ada567b8fd6d4d1d9ffa8493d27f33269e67ddd
mods|NaturesCompass-26.3-2.5.1-fabric.jar|https://cdn.modrinth.com/data/fPetb5Kh/versions/pHan4UQ9/NaturesCompass-26.3-2.5.1-fabric.jar|d09078e6793530a52e1ef9984c6f23174fa95385
mods|placeholder-api-3.2.0+26.3.jar|https://cdn.modrinth.com/data/eXts2L7r/versions/lXytLqWj/placeholder-api-3.2.0%2B26.3.jar|4c455faa6333dbaef72cedbb91fe4a2a03176741
mods|polymer-bundled-0.18.2+26.3.jar|https://cdn.modrinth.com/data/xGdtZczs/versions/REBDssAz/polymer-bundled-0.18.2%2B26.3.jar|8571b8aaa1533e08739e75f01020836a76daa30d
mods|PrickleMC-fabric-MC26.3-26.3.0.2.jar|https://cdn.modrinth.com/data/aaRl8GiW/versions/aPdekuq6/PrickleMC-fabric-MC26.3-26.3.0.2.jar|30321451a787179cd9df0c01373cc5cb8c4fe2e1
mods|shogi-fabric-26.3-26.3.0.3.jar|https://cdn.modrinth.com/data/bi4iCmsw/versions/9gkJoFhj/shogi-fabric-26.3-26.3.0.3.jar|5a24c09a6b175c9fc2a0f4a9cab114c14e00aaa9
mods|shulkerboxtooltip-fabric-5.4.2+26.3.jar|https://cdn.modrinth.com/data/2M01OLQq/versions/Cj9VEeGt/shulkerboxtooltip-fabric-5.4.2%2B26.3.jar|2280c8ca8d77b4dcd5617daab3428b8115bef8d6
mods|sit-fabric-26.1.1-1.5.1.jar|https://cdn.modrinth.com/data/VKXzIykF/versions/vU0mXH0A/sit-fabric-26.1.1-1.5.1.jar|9a60018b802781eadd45eb073328bfb8c2b3348f
mods|skinrestorer-2.11.0+26.3-fabric.jar|https://cdn.modrinth.com/data/ghrZDhGW/versions/K7BFrFJD/skinrestorer-2.11.0%2B26.3-fabric.jar|1da011465f62f631a95775aa9843a8b413a71db5
mods|stackedblocks-26.09.15-26.3-fabric.jar|https://cdn.modrinth.com/data/UYrNpKJN/versions/VBD7okxm/stackedblocks-26.09.15-26.3-fabric.jar|ebd47423ab8ebb63447b201886c2e153e050a300
mods|stackedblocksfarmersdelight-26.09.15-26.3-fabric.jar|https://cdn.modrinth.com/data/LQlQFBH9/versions/SdvNCqKY/stackedblocksfarmersdelight-26.09.15-26.3-fabric.jar|4e061f1edd5903fffd9359cd8adda1fdc6c10148
mods|storagedelight-26.08.15-26.3-fabric.jar|https://cdn.modrinth.com/data/LTTvOp5L/versions/S7N0BJMX/storagedelight-26.08.15-26.3-fabric.jar|eed6d93d2f74c1883c71b958243deb1f466da0dd
mods|StorageDrawers-fabric-26.3.0.1.jar|https://cdn.modrinth.com/data/guitPqEi/versions/wE2d96Vp/StorageDrawers-fabric-26.3.0.1.jar|a90d324a8031fc9e8a966bcc7aa9931e0f0cb26f
mods|toms_storage_fabric-26.3-2.12.1.jar|https://cdn.modrinth.com/data/XZNI4Cpy/versions/znUwcb7Z/toms_storage_fabric-26.3-2.12.1.jar|46813104ffc92051185ec306877da7a02bbc14f6
mods|trashslot-fabric-26.3-26.3.0.1.jar|https://cdn.modrinth.com/data/vRYk0bv7/versions/aq0EjIas/trashslot-fabric-26.3-26.3.0.1.jar|32492f2610c701f32a04adc79539d2e40363cd10
mods|travelersbackpack-fabric-26.3-11.4.1.jar|https://cdn.modrinth.com/data/rlloIFEV/versions/SmhjfeWr/travelersbackpack-fabric-26.3-11.4.1.jar|47c1f44461eafff9a3d7998c79bcdfa612931584
mods|Villager-API-26.3-fabric-1.26.9.6.jar|https://cdn.modrinth.com/data/9Tp2Becg/versions/fk8afDIw/Villager-API-26.3-fabric-1.26.9.6.jar|d7a92fda995850944e00a2f99be6b0dc190b1783
mods|waystones-fabric-26.3-26.3.0.1.jar|https://cdn.modrinth.com/data/LOpKHB2A/versions/UKjvFJAV/waystones-fabric-26.3-26.3.0.1.jar|5de88d705e3d17a70a4f87dff7359c437e0235c9
mods|xaerominimap-fabric-26.3-26.5.3.jar|https://cdn.modrinth.com/data/1bokaNcj/versions/YPkAliDt/xaerominimap-fabric-26.3-26.5.3.jar|28b67391892582747bd17a7525318a954e54c80a
mods|xaeroworldmap-fabric-26.3-1.46.4.jar|https://cdn.modrinth.com/data/NcUtCpym/versions/UleMm8za/xaeroworldmap-fabric-26.3-1.46.4.jar|11bd97b82a33585cab32678dc92a1ea7e3da5954
mods|yet_another_config_lib_v3-3.9.7+26.3-fabric.jar|https://cdn.modrinth.com/data/1eAoo2KR/versions/s9SjoFu1/yet_another_config_lib_v3-3.9.7%2B26.3-fabric.jar|e54d86dd4a78f95cd6ec0309d96fae01e661c00d
MODS

echo '==> [4/6] World'
if [ -d world ]; then
  echo '   world/ sudah ada, tidak ditimpa'
else
  WORLD=$(ls -t /workspaces/*/world*.zip 2>/dev/null | head -1)
  [ -n "$WORLD" ] || { echo 'Upload world zip (world*.zip) ke Explorer codespace dulu'; exit 1; }
  # zip dari panel server punya entri folder yang ditolak unzip, jadi pakai python
  python3 - "$WORLD" "$DIR" <<'PY' || { echo "$WORLD belum selesai terunggah / rusak, tunggu lalu jalankan ulang"; exit 1; }
import sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
for i in z.infolist():
    if not i.is_dir(): z.read(i)
z.extractall(sys.argv[2])
PY
  echo "   pakai $WORLD"
  # Terralith tetap sebagai datapack di world (tidak perlu di client); bukkit sisa Paper
  rm -rf world/datapacks/bukkit world/session.lock
fi
[ -d world/dimensions/minecraft/the_nether ] || echo '   PERINGATAN: Nether tidak ada di world ini, akan dibuat ulang dari nol'
[ -d world/dimensions/minecraft/the_end ] || echo '   PERINGATAN: End tidak ada di world ini, akan dibuat ulang dari nol'
# World asal mode Hardcore; matikan flag-nya di level.dat (jalankan saat server mati)
python3 - <<'PY'
import gzip
p = "world/level.dat"
d = bytearray(gzip.decompress(open(p, "rb").read()))
tag = b"\x01\x00\x08hardcore"
i = d.find(tag)
if i >= 0 and d[i + len(tag)] == 1:
    d[i + len(tag)] = 0
    open(p, "wb").write(gzip.compress(bytes(d)))
    print("   level.dat: hardcore dimatikan")
PY
fetch <<'DATAPACKS'
world/datapacks|Nullscape_v2.0.1+26.3.zip|https://cdn.modrinth.com/data/LPjGiSO4/versions/BJjbILcf/Nullscape_v2.0.1%2B26.3.zip|d759ee004b6d6e633bc849eee0ea2a929de8eabc
DATAPACKS

echo '==> [5/6] Config'
echo 'eula=true' > eula.txt
if [ ! -f server.properties ]; then
cat > server.properties <<'PROPS'
motd=Vanilla+
level-name=world
hardcore=false
difficulty=hard
online-mode=false
enforce-secure-profile=false
white-list=true
enforce-whitelist=true
view-distance=10
simulation-distance=6
spawn-protection=0
max-players=5
sync-chunk-writes=false
PROPS
fi
if [ ! -f whitelist.json ]; then
  if [ -f $HOME/mcserver/whitelist.json ]; then cp $HOME/mcserver/whitelist.json $HOME/mcserver/ops.json .; else
  echo '[{"uuid":"cd464dd1-0fad-3b89-9205-6bf27bc28828","name":"Yushika_"}]' > whitelist.json
  echo '[]' > ops.json
  fi
fi

# Sisa config Enchancement (mod-nya sudah dilepas) tetap ada di pack dengan isi yang sama persis.
# Kalau file ini dihapus dari pack, update AutoModpack di client gagal terus ("Captured source changed").
mkdir -p automodpack/host-modpack/main/config
cat > automodpack/host-modpack/main/config/enchancement.json <<'JSON'
{
  "disallowedEnchantments": [],
  "invertedList": false,
  "overhaulEnchanting": "DISABLED",
  "singleLevelMode": false,
  "enchantmentLimit": 0,
  "disableDurability": "NONE",
  "enhanceMobs": true,
  "rebalanceConsumables": true,
  "rebalanceEffects": true,
  "rebalanceEnchantments": true,
  "rebalanceEquipment": true,
  "rebalanceProjectiles": true,
  "toggleablePassives": true,
  "coyoteBiteTicks": 3,
  "weaponEffectCooldownRequirement": 0.7,
  "maxFellTreesBlocks": 1024,
  "maxFellTreesHorizontalLength": 11,
  "maxMineOreVeinsBlocks": 64,
  "fixVanillaBugs": true,
  "enchantmentDescriptions": true,
  "coloredEnchantmentNames": true,
  "chiseledBookshelfPeeking": true,
  "invertedBounce": false,
  "doublePressDirectionBurst": false,
  "inputlessDirectionBurst": false
}
JSON

# AutoModpack: mod khusus server tidak dikirim ke client (server.conf dibuat saat start pertama)
if [ -f automodpack/server.conf ] && ! grep -q 'mods/graves-' automodpack/server.conf; then
  sed -i 's#^\(\s*exclude: \[.*\)\]#\1, "mods/graves-*.jar", "mods/polymer-bundled-*.jar", "mods/Chunky-*.jar"]#' automodpack/server.conf
fi

# Heap 4 GB: RAM codespace ~8 GB juga dipakai VS Code; 5 GB pernah membuat Java dimatikan paksa (kehabisan RAM).
# Kalau server mati tidak normal, otomatis dinyalakan lagi. Perintah "stop" (kode keluar 0) tetap mematikan.
cat > start.sh <<EOF
#!/usr/bin/env bash
cd "$DIR" || exit 1
while true; do
  "$JAVA" -Xms2G -Xmx4G -XX:+UseG1GC -XX:MaxGCPauseMillis=130 -jar fabric-server.jar nogui
  code=\$?
  [ "\$code" -eq 0 ] && break
  echo "\$(date '+%F %T') server mati tidak normal (kode \$code), nyala lagi 10 detik lagi" | tee -a crash-restarts.log
  sleep 10
done
EOF
chmod +x start.sh

# Resource pack: tampilan heart hardcore di world non-hardcore (dikirim ke client lewat AutoModpack)
RP=automodpack/host-modpack/main/resourcepacks/Hardcore-Hearts.zip
if [ ! -f "$RP" ]; then
  mkdir -p "$(dirname "$RP")"
  CJ=$(curl -fsSL https://piston-meta.mojang.com/mc/game/version_manifest_v2.json | python3 -c "import json,sys; print([v['url'] for v in json.load(sys.stdin)['versions'] if v['id']=='$MC'][0])" | xargs curl -fsSL | python3 -c "import json,sys; print(json.load(sys.stdin)['downloads']['client']['url'])")
  curl -fsSL -o /tmp/mc-client.jar "$CJ"
  python3 - "$RP" <<'PY'
import sys, json, zipfile
src = zipfile.ZipFile("/tmp/mc-client.jar")
pv = json.loads(src.read("version.json"))["pack_version"]
fmt = [pv["resource_major"], pv["resource_minor"]]
base = "assets/minecraft/textures/gui/sprites/hud/heart/"
with zipfile.ZipFile(sys.argv[1], "w", zipfile.ZIP_DEFLATED) as out:
    out.writestr("pack.mcmeta", json.dumps({"pack": {"description": "Heart hardcore tanpa mode hardcore",
                                                     "min_format": [fmt[0], 0], "max_format": fmt}}, indent=2))
    n = 0
    for name in src.namelist():
        f = name[len(base):]
        if name.startswith(base) and "hardcore" in f:
            out.writestr(base + f.replace("hardcore_", "").replace("_hardcore", ""), src.read(name)); n += 1
print(f"   resource pack Hardcore-Hearts: {n} sprite")
PY
  rm -f /tmp/mc-client.jar
fi

echo '==> [6/6] playit.gg agent (v1: daemon playit + playit-cli)'
which tmux > /dev/null || { sudo apt-get update -qq > /dev/null; sudo apt-get install -y -qq tmux > /dev/null 2>&1; }
[ -x playit ] || { curl -fsSL -o playit https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-linux-amd64; chmod +x playit; }
[ -x playit-cli ] || { curl -fsSL -o playit-cli https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-cli-linux-amd64; chmod +x playit-cli; }
cat > up.sh <<'EOF'
#!/usr/bin/env bash
# Nyalakan server + tunnel playit di tmux (aman dijalankan berkali-kali)
cd "$(dirname "$0")"
tmux has-session -t playit 2>/dev/null || tmux new-session -d -s playit "./playit --socket-path /tmp/playitd.sock -l /tmp/playit.log"
tmux has-session -t mc 2>/dev/null || tmux new-session -d -s mc "./start.sh"
if [ ! -s ~/.config/playit_gg/playit.toml ]; then
  echo 'Agent playit belum di-claim. Jalankan:  ./playit-cli --socket-path /tmp/playitd.sock setup'
fi
echo 'Server: tmux attach -t mc   (keluar tanpa mematikan: Ctrl+B lalu D)'
EOF
chmod +x up.sh

echo
echo 'SELESAI. Langkah berikutnya:'
echo '  ~/mcserver-vanillaplus/up.sh'
echo '  Pertama kali: claim agent playit (perintah muncul di atas), buat tunnel Minecraft Java ke 127.0.0.1:25565,'
echo '  lalu di console server: automodpack host fingerprint share <alamat-playit>'
