import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { flushSync } from 'hono/jsx/dom'
import { trimTrailingSlash } from 'hono/trailing-slash'

const app = new Hono()

//Route sederhana Hello World
app.get('/', (c) => {
    return c.text('Hello World! Server siap menerima data.')
})

const port = 3100
console.log(`Server berjalan di port ${port}`)

serve({
    fetch: app.fetch,
    port
})

app.post('/daftar', async (c) => {
    // Mengambil data body dari request (misal format JSON)
    const body = await c.req.json()

    // Cek di terminal, data apa yang dikirim user
    console.log('Data yang masuk:', body)

    return c.json({ message: 'Data di terima (tapi belum di cek)' })
})

app.post('/daftar-basic', async (c) => {
    const body = await c.req.json()
    const nama = body.nama
    const email = body.email

    //VALIDASI MANUAL
    // 1. Cek apakah nama ada?
    if (!nama)
        return c.json({ error: 'Nama waajib diisi' }, 400)

// 2. Cek apakah Email ada?
if (!email) {
    return c.json({ error: 'Email wajib diisi' }, 400)
}

// Jika lolos semua if di atas:
return c.json({ message: 'Pendaftaran Berhasil', data: body })
})

// validasi nama
function isNameValid(nama){
    //jika nama tidak ada, atau string kosong
    if (!nama || nama.trim() === '') return false; 
    // jika nama kependekan (misal 3 huruf )
    if (nama.leng < 3) return false;
    return true;
}

// validasi email
// fungsi cek email sederhana (tanpa regex)
function isEmailvalid(email) {
    if (!email) return false;
    // Harus ada karakter '@'
    if (!email.includes('@')) return false;
    return true;
}

// Area Route (Jalur Utama)
app.post('/daftar-rapi', async (c) => {
    const body = await c.req.json()

    //panggil satpam (function) kita
    if (!isNameValid(body.nama)){
        return c.json({ error: 'Nama tidak valid! Minimal 3 huruf @.' }, 400)
    }

    if (!isEmailvalid(body.email)) {
        return c.json({ error: 'Email tidah valid! Harus ada @.' }, 400)
    }

    return c.json({
        message: 'Validasi Lolos! Data disimpan.',
        data: body
    })
})