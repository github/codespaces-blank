const fs = require("fs");
const path = require("path");

const rootFiles = [
  {
    name: "App.js",
    content: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PesertaScreen from './screens/PesertaScreen';
import DaftarPesertaScreen from './screens/DaftarPesertaScreen';
import PertubuhanScreen from './screens/PertubuhanScreen';
import WarisScreen from './screens/WarisScreen';
import TransaksiScreen from './screens/TransaksiScreen';
import KematianScreen from './screens/KematianScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import EmergencyLogScreen from './screens/EmergencyLogScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Utama">
        <Stack.Screen name="Utama" component={HomeScreen} />
        <Stack.Screen name="Peserta" component={PesertaScreen} />
        <Stack.Screen name="Daftar Peserta" component={DaftarPesertaScreen} />
        <Stack.Screen name="Pertubuhan" component={PertubuhanScreen} />
        <Stack.Screen name="Waris" component={WarisScreen} />
        <Stack.Screen name="Transaksi" component={TransaksiScreen} />
        <Stack.Screen name="Kematian" component={KematianScreen} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
        <Stack.Screen name="Emergency Log" component={EmergencyLogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
`
  },
  {
    name: "package.json",
    content: `{
  "name": "ekematian-expo",
  "version": "1.0.0",
  "main": "App.js",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.16",
    "react": "18.2.0",
    "react-native": "0.73.7",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.21"
  }
}
`
  },
  {
    name: "app.json",
    content: `{
  "expo": {
    "name": "eKematian",
    "slug": "ekematian-expo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"]
  }
}
`
  },
  {
    name: ".gitignore",
    content: `node_modules
.expo
.expo-shared
.DS_Store
npm-debug.log
`
  }
];

// All screens
const screens = [
  {
    name: "HomeScreen.js",
    content: `import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>eKematian</Text>
      <Text style={styles.subtitle}>Sistem Pengurusan Kematian</Text>
      <View style={styles.menu}>
        <Button title="Peserta" onPress={() => navigation.navigate('Peserta')} />
        <Button title="Daftar Peserta" onPress={() => navigation.navigate('Daftar Peserta')} />
        <Button title="Pertubuhan" onPress={() => navigation.navigate('Pertubuhan')} />
        <Button title="Waris" onPress={() => navigation.navigate('Waris')} />
        <Button title="Transaksi" onPress={() => navigation.navigate('Transaksi')} />
        <Button title="Kematian" onPress={() => navigation.navigate('Kematian')} />
        <Button title="Playlist" onPress={() => navigation.navigate('Playlist')} />
        <Button title="Emergency Log" onPress={() => navigation.navigate('Emergency Log')} />
      </View>
      <Text style={styles.info}>
        * Aplikasi ini menggunakan data dummy/simulasi. Untuk kegunaan sebenar, sambungkan ke backend API.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fafafa' },
  title: { fontSize: 32, fontWeight: 'bold', marginVertical: 12, color: '#444' },
  subtitle: { fontSize: 18, marginBottom: 20, color: '#666' },
  menu: { width: '100%', gap: 10, marginBottom: 30 },
  info: { fontSize: 13, color: '#888', marginTop: 30, textAlign: 'center' }
});
`
  },
  {
    name: "PesertaScreen.js",
    content: `import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

// Dummy data peserta
const initialPeserta = [
  {
    id: 1,
    nama: "Ahmad Bin Ali",
    tarikh_lahir: "1985-01-01",
    no_keahlian: "EKM-240101-1",
    status: "aktif",
    phone: "0123456789",
    tarikh_keahlian: "2024-01-01"
  },
  {
    id: 2,
    nama: "Siti Binti Abu",
    tarikh_lahir: "1990-05-13",
    no_keahlian: "EKM-240513-2",
    status: "aktif",
    phone: "0198765432",
    tarikh_keahlian: "2024-01-05"
  }
];

export default function PesertaScreen({ navigation }) {
  const [peserta, setPeserta] = useState(initialPeserta);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Senarai Peserta</Text>
      <FlatList
        data={peserta}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nama}</Text>
            <Text>No Keahlian: {item.no_keahlian}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Tarikh Lahir: {item.tarikh_lahir}</Text>
            <Text>Tarikh Keahlian: {item.tarikh_keahlian}</Text>
            <Text>No Telefon: {item.phone}</Text>
          </View>
        )}
      />
      <Button title="Daftar Peserta Baru" onPress={() => navigation.navigate('Daftar Peserta')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold' }
});
`
  },
  {
    name: "DaftarPesertaScreen.js",
    content: `import React, { useState } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';

export default function DaftarPesertaScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!nama || !tarikhLahir) {
      Alert.alert("Ralat", "Sila isi nama dan tarikh lahir");
      return;
    }
    // Simulasi no keahlian
    const today = new Date();
    const dateCode = today.toISOString().slice(2, 10).replace(/-/g, '');
    const no_keahlian = \`EKM-\${dateCode}-\${Math.floor(Math.random() * 900 + 100)}\`;
    Alert.alert("Berjaya", \`Peserta \${nama} berjaya didaftarkan!\\nNo Keahlian: \${no_keahlian}\`);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Peserta Baru</Text>
      <Text>Nama Penuh:</Text>
      <TextInput style={styles.input} value={nama} onChangeText={setNama} placeholder="Nama peserta" />
      <Text>Tarikh Lahir (YYYY-MM-DD):</Text>
      <TextInput style={styles.input} value={tarikhLahir} onChangeText={setTarikhLahir} placeholder="cth: 1990-01-01" />
      <Text>No Telefon:</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="cth: 0123456789" keyboardType="phone-pad" />
      <View style={{ height: 16 }} />
      <Button title="Daftar" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 18 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }
});
`
  },
  {
    name: "PertubuhanScreen.js",
    content: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const pertubuhan = {
  id: 1,
  nama: "Pertubuhan Contoh",
  visi: "Memperkasakan komuniti melalui kebajikan.",
  misi: "Membantu ahli dan waris dalam urusan kematian.",
  background_url: "",
  background_music_url: "",
  syarat_kelayakan: "Warganegara Malaysia",
  syarat_keahlian: "Berumur 18 tahun ke atas",
};

export default function PertubuhanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info Pertubuhan</Text>
      <Text style={styles.label}>Nama:</Text>
      <Text style={styles.value}>{pertubuhan.nama}</Text>
      <Text style={styles.label}>Visi:</Text>
      <Text style={styles.value}>{pertubuhan.visi}</Text>
      <Text style={styles.label}>Misi:</Text>
      <Text style={styles.value}>{pertubuhan.misi}</Text>
      <Text style={styles.label}>Syarat Kelayakan:</Text>
      <Text style={styles.value}>{pertubuhan.syarat_kelayakan}</Text>
      <Text style={styles.label}>Syarat Keahlian:</Text>
      <Text style={styles.value}>{pertubuhan.syarat_keahlian}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  value: { marginLeft: 12 }
});
`
  },
  {
    name: "WarisScreen.js",
    content: `import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const waris = [
  { id: 1, peserta_id: 1, nama: "Fatimah Binti Ali", hubungan: "Ibu", no_tel: "01122334455" },
  { id: 2, peserta_id: 2, nama: "Abu Bin Ali", hubungan: "Bapa", no_tel: "0123344556" }
];

export default function WarisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Senarai Waris</Text>
      <FlatList
        data={waris}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nama}</Text>
            <Text>Hubungan: {item.hubungan}</Text>
            <Text>No Tel: {item.no_tel}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 },
  name: { fontWeight: 'bold', fontSize: 16 }
});
`
  },
  {
    name: "TransaksiScreen.js",
    content: `import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const transaksi = [
  { id: 1, peserta_id: 1, tarikh: "2024-03-01", jenis: "yuran", jumlah: 100.00 },
  { id: 2, peserta_id: 2, tarikh: "2024-04-01", jenis: "derma", jumlah: 50.00 }
];

export default function TransaksiScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Senarai Transaksi</Text>
      <FlatList
        data={transaksi}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Peserta ID: {item.peserta_id}</Text>
            <Text>Tarikh: {item.tarikh}</Text>
            <Text>Jenis: {item.jenis}</Text>
            <Text>Jumlah: RM{item.jumlah.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 }
});
`
  },
  {
    name: "KematianScreen.js",
    content: `import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const kematian = [
  { id: 1, peserta_id: 1, tarikh: "2024-07-10", sebab: "Sakit tua" }
];

export default function KematianScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekod Kematian</Text>
      <FlatList
        data={kematian}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Peserta ID: {item.peserta_id}</Text>
            <Text>Tarikh: {item.tarikh}</Text>
            <Text>Sebab: {item.sebab}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 }
});
`
  },
  {
    name: "PlaylistScreen.js",
    content: `import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const playlist = [
  { id: 1, nama_lagu: "Lagu Peringatan", file_url: "https://example.com/lagu.mp3", is_active: true }
];

export default function PlaylistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Senarai Lagu Playlist</Text>
      <FlatList
        data={playlist}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Nama Lagu: {item.nama_lagu}</Text>
            <Text>Fail: {item.file_url}</Text>
            <Text>Status: {item.is_active ? "Aktif" : "Tidak Aktif"}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 }
});
`
  },
  {
    name: "EmergencyLogScreen.js",
    content: `import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const emergencyLog = [
  { id: 1, peserta_id: 1, action_by: 1, action_type: "emergency_called", action_time: "2024-08-16 09:12:00" }
];

export default function EmergencyLogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Log</Text>
      <FlatList
        data={emergencyLog}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Peserta ID: {item.peserta_id}</Text>
            <Text>Action By (Admin ID): {item.action_by}</Text>
            <Text>Action Type: {item.action_type}</Text>
            <Text>Action Time: {item.action_time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 }
});
`
  }
];

function createStructure() {
  // Create main folders
  if (!fs.existsSync("screens")) fs.mkdirSync("screens");
  if (!fs.existsSync("assets")) fs.mkdirSync("assets");

  // Top-level files
  rootFiles.forEach(f => fs.writeFileSync(f.name, f.content));

  // Screens
  screens.forEach(screen =>
    fs.writeFileSync(path.join("screens", screen.name), screen.content)
  );

  // Dummy assets (empty files, user can upload later)
  ["icon.png", "splash.png", "favicon.png"].forEach(f =>
    fs.writeFileSync(path.join("assets", f), "")
  );

  console.log(
    "Projek Expo eKematian SIAP!\n- Sila jalankan 'npm install'\n- Kemudian 'npx expo start'\n- Scan QR code dengan Expo Go"
  );
}

createStructure();
