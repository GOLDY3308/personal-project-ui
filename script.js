// =======================================================
// 1. FUNGSI-FUNGSI PENGAMBILAN DATA DARI JAVA
// =======================================================

async function muatKategori() {
    try {
        const respon = await fetch('http://localhost:8080/api/kategori');
        const daftarKategori = await respon.json();
        const dropdown = document.getElementById('input-kategori');
        
        // Membersihkan dropdown agar tidak dobel saat di-refresh
        dropdown.innerHTML = '<option value="">-- Pilih Kategori --</option>';
        
        daftarKategori.forEach(kategori => {
            dropdown.innerHTML += `<option value="${kategori.id_kategori}">${kategori.nama_kategori}</option>`;
        });
    } catch (error) {
        console.error("Gagal menarik kategori:", error);
    }
}

async function muatRiwayat() {
    try {
        const respon = await fetch('http://localhost:8080/api/transaksi');
        const daftarTransaksi = await respon.json();
        const wadahTabel = document.getElementById('tabel-riwayat');
        
        if (!wadahTabel) return; // Mencegah error jika tabel belum dimuat
        wadahTabel.innerHTML = ''; 

        daftarTransaksi.forEach(transaksi => {
            wadahTabel.innerHTML += `
                <tr>
                    <td>${transaksi.tanggal}</td>
                    <td>${transaksi.catatan}</td>
                    <td>Rp ${transaksi.nominal.toLocaleString('id-ID')}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Gagal menarik data transaksi:", error);
    }
}

async function muatSaldo() {
    try {
        const respon = await fetch('http://localhost:8080/api/periode/aktif');
        const dataPeriode = await respon.json();
        
        const teksSaldo = document.getElementById('teks-saldo');
        if (teksSaldo && dataPeriode.saldoAwal !== undefined) {
            // Menggunakan saldoAwal sesuai format JSON dari Spring Boot
            const saldoRupiah = dataPeriode.saldoAwal.toLocaleString('id-ID');
            teksSaldo.innerText = `Rp ${saldoRupiah}`;
        }
    } catch (error) {
        console.error("Gagal menarik data saldo:", error);
    }
}


// =======================================================
// 2. FUNGSI MENYIMPAN TRANSAKSI (MENCEGAT FORM)
// =======================================================

const formTransaksi = document.getElementById('formTransaksi');
if (formTransaksi) {
    formTransaksi.addEventListener('submit', async function(event) {
        event.preventDefault();

        const idKategoriPilihan = document.getElementById('input-kategori').value;
        const nominalKetik = document.getElementById('inputNominal').value;
        const catatanKetik = document.getElementById('inputCatatan').value;

        const dataBaru = {
            id_kategori: idKategoriPilihan,
            nominal: nominalKetik,
            catatan: catatanKetik
        };

        try {
            const respon = await fetch('http://localhost:8080/api/transaksi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataBaru)
            });

            if (respon.ok) {
                formTransaksi.reset(); // Mengosongkan form
                muatRiwayat();         // Memperbarui tabel instan
                muatSaldo();           // Memperbarui sisa saldo instan
            } else {
                alert("Gagal menyimpan data ke database!");
            }
        } catch (error) {
            console.error("Gagal menghubungi Java:", error);
        }
    });
}


// =======================================================
// 3. JALANKAN SEMUA SAAT WEB DIBUKA
// =======================================================
muatKategori();
muatRiwayat();
muatSaldo();