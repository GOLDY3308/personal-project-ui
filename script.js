console.log("JS berhasil terhubung ke HTML!");

const API_KATEGORI = 'http://localhost:8080/api/kategori';
const API_TRANSAKSI = 'http://localhost:8080/api/transaksi';

// =======================================================
// 1. FUNGSI MENGAMBIL KATEGORI (UNTUK DROPDOWN)
// =======================================================
async function muatKategori() {
    try {
        const respon = await fetch('http://localhost:8080/api/kategori');
        const daftarKategori = await respon.json();
        
        const dropdown = document.getElementById('input-kategori');
        
        daftarKategori.forEach(kategori => {
            dropdown.innerHTML += `
                <option value="${kategori.id_kategori}">${kategori.nama_kategori}</option>
            `;
        });
    } catch (error) {
        console.error("Gagal menarik data kategori:", error);
    }
}

// Panggil fungsinya agar langsung jalan saat web dibuka
muatKategori();

// =======================================================
// 2. FUNGSI MENYIMPAN TRANSAKSI SAAT TOMBOL DIKLIK
// =======================================================
document.getElementById('formTransaksi').addEventListener('submit', async function(event) {
    event.preventDefault(); // Mencegah halaman web refresh otomatis

    const inputKategori = document.getElementById('pilihKategori').value;
    const inputNominal = document.getElementById('inputNominal').value;
    const inputCatatan = document.getElementById('inputCatatan').value;

    const dataTransaksi = {
        id_kategori: parseInt(inputKategori),
        nominal: parseInt(inputNominal),
        catatan: inputCatatan
    };

    console.log("Mengirim data ini ke Java:", dataTransaksi);

    try {
        const response = await fetch(API_TRANSAKSI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataTransaksi)
        });

        if (response.ok) {
            alert('Mantap! Transaksi berhasil disimpan ke Aiven.');
            document.getElementById('formTransaksi').reset(); // Mengosongkan form
        } else {
            alert('Gagal menyimpan transaksi.');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Gagal terhubung ke server Java.');
    }
});

// =======================================================
// 3. FUNGSI MENGAMBIL RIWAYAT TRANSAKSI
// =======================================================
async function muatRiwayat() {
    try {
        const response = await fetch(API_TRANSAKSI); // Menembak method GET di Java
        const data = await response.json();
        
        const daftar = document.getElementById('daftarRiwayat');
        daftar.innerHTML = ''; // Hapus teks "Loading..."
        
        // Membalik urutan agar transaksi terbaru (es sanger) muncul paling atas
        data.reverse().forEach(transaksi => {
            const li = document.createElement('li');
            // Menampilkan Nominal dan Catatan
            li.textContent = `Rp ${transaksi.nominal} - ${transaksi.catatan}`;
            daftar.appendChild(li);
        });
    } catch (error) {
        console.error('Gagal mengambil riwayat:', error);
        document.getElementById('daftarRiwayat').innerHTML = '<li>Gagal memuat riwayat</li>';
    }
}

// Eksekusi fungsi agar riwayat muncul saat web pertama kali dibuka
muatRiwayat();