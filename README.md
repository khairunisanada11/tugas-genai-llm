# GenAI Application

## Project Information

**Nama Project:**
ScreenSist — AI CV Screening Assistant

**Use Case:**
Membantu HR atau recruiter melakukan screening awal CV kandidat dengan membandingkan informasi yang ada di dalam CV dengan requirement pekerjaan dari lowongan yang dibuka. Aplikasi ini membantu menunjukkan informasi yang relevan, requirement yang belum ditemukan, serta hal yang masih perlu diklarifikasi. ScreenSist hanya membantu proses screening awal dan tidak menentukan kandidat diterima atau ditolak.

**Deskripsi Singkat:**
ScreenSist adalah aplikasi berbasis Generative AI yang membantu HR atau recruiter melakukan screening awal CV kandidat berdasarkan job requirement. HR memasukkan isi CV kandidat dan job requirement, kemudian aplikasi akan menganalisis keduanya dan menampilkan evidence yang ditemukan, requirement yang belum ditemukan, skill dan pengalaman yang relevan, serta pertanyaan klarifikasi jika ada informasi yang masih kurang jelas.


----

## Tech Stack
- Python sebagai bahasa pemrograman
- FastAPI untuk membuat API
- Groq API sebagai LLM provider
- Pydantic untuk validasi request dan response
- python-dotenv untuk membaca API Key dari file `.env`
- JSON sebagai format output terstruktur
- HTML, CSS, dan JavaScript untuk frontend

---

## Application Flow
User(HRD) mengimput isi cv dan job requirement. kemudian data tersebut dikirim melalui fastAPI ke LLM API untuk dilakukan analisis. Kemudian LLM akan membandingkan isi cv dengan job requirement yang diberikan. Setelah itu, hasil yang sudah dianalisis dikembalikan dalam bentuk structured output JSON yang berisi evidence yang ditemukan, requirement yang belum ditemukan, skill, pengalaman relevan, dan pertanyaan klarifikasi.

---

## API Endpoint
POST /api/analyze-cv
Endpoint ini digunakan untuk mengirim isi CV kandidat dan job requirement agar dapat dianalisis oleh aplikasi.

## Example Request
{
  "cv_text": "Skills: SQL, Excel, Python. Project: Membuat dashboard penjualan menggunakan Tableau.",
  "job_requirements": "Membutuhkan kandidat yang menguasai SQL, Excel, Power BI, dan memiliki pengalaman membuat dashboard."
}

## Example Response
{
  "evidence_found": [
    "menguasai SQL",
    "menguasai Excel",
    "memiliki pengalaman membuat dashboard"
  ],
  "requirements_not_found": [
    "Power BI"
  ],
  "relevant_skills": [
    "SQL",
    "Excel",
    "Python",
    "Tableau"
  ],
  "relevant_experience": [
    "Membuat dashboard penjualan menggunakan Tableau"
  ],
  "clarification_questions": [
    "Apakah kandidat memiliki pengalaman atau keahlian dalam Power BI?"
  ]
}

## Structured Output
{
  "evidence_found": [],
  "requirements_not_found": [],
  "relevant_skills": [],
  "relevant_experience": [],
  "clarification_questions": []
}

## Kenapa kalian memilih field-field tersebut?
Pemilihan field-field ini dipilih karena sesuai dengan kebutuhan dari aplikasi yang akan dibangun, field-field tersebut diantaranya: 
- `evidence_found`: ini digunakan untuk menunjukkan bukti yang ditemukan pada isi cv dan sesuai degan requirement pekerjaan
- `requirements_not_found`: ini digunakan untuk menunjukkan requirement yang belum ditemukan di CV
- `relevant_skills` dan  `relevant_experience`: digunakan untuk menampilkan skill dan pengalaman yang relavan dengan lowongan yang dibuka
- `clarification_questions`: digunakan untuk memberikan referensi pertanyaan tambahan jika ada informasi yang masih belum jelas atau belum ditemukan di CV.  


# Prompt Experiment
{
  "cv_text": "Skills: SQL, Excel, Python. Project: Membuat dashboard penjualan menggunakan Tableau.",
  "job_requirements": "Membutuhkan kandidat yang menguasai SQL, Excel, Power BI, dan memiliki pengalaman membuat dashboard."
} 

### Prompt A
Check whether the CV matches the job requirements. 

### Actual Output A
{
  "ai_response": "**Penilaian Kesesuaian CV dengan Persyaratan Pekerjaan**\n\n| Persyaratan Pekerjaan | Ada di CV? | Catatan |\n|------------------------|------------|----------|\n| **SQL**                | ✅ | CV menyebutkan kemampuan SQL. |\n| **Excel**              | ✅ | CV menyebutkan kemampuan Excel. |\n| **Power BI**           | ❌ | Tidak disebutkan. CV hanya mencantumkan Tableau. |\n| **Pengalaman membuat dashboard** | ✅ | Proyek “Membuat dashboard penjualan menggunakan Tableau” menunjukkan pengalaman membuat dashboard. Namun, alat yang dipakai berbeda (Tableau vs. Power BI). |\n\n### Kesimpulan\n- **Kesesuaian kuat** pada tiga dari empat poin: SQL, Excel, dan pengalaman membuat dashboard.\n- **Kekurangan** pada keahlian Power BI, yang merupakan persyaratan eksplisit.\n\n### Rekomendasi untuk Meningkatkan Kesesuaian\n1. **Tambahkan Power BI ke Daftar Keahlian**  \n   - Jika Anda memang memiliki pengalaman (meskipun terbatas) dengan Power BI, cantumkan di bagian *Skills* atau *Projects*.  \n   - Jika belum, pertimbangkan untuk menyelesaikan kursus singkat atau tutorial (mis. “Power BI Essentials” di Microsoft Learn, Coursera, atau Udemy) dan sertakan proyek mini (mis. dashboard penjualan sederhana) sebagai bukti.\n\n2. **Tegaskan Transferabilitas Antara Tableau dan Power BI**  \n   - Dalam *Summary* atau *Project Description*, jelaskan bahwa kemampuan Anda dalam membuat dashboard dengan Tableau memberikan dasar yang kuat untuk beralih ke Power BI karena kedua alat tersebut menggunakan konsep visualisasi data yang serupa (mis. penggunaan data source, pembuatan visual, interaktivitas).\n\n3. **Berikan Detail Lebih Lanjut pada Proyek Dashboard**  \n   - Sertakan metrik keberhasilan (mis. “meningkatkan kecepatan akses data 30%” atau “mengurangi waktu pembuatan laporan dari 2 hari menjadi 4 jam”).  \n   - Tambahkan poin tentang proses ETL atau manipulasi data (mis. menggunakan SQL untuk menyiapkan data sebelum di‑visualisasikan), yang menonjolkan kemampuan analitis Anda.\n\n4. **Sesuaikan Ringkasan (Summary) atau Objective**  \n   - Contoh: “Data Analyst dengan keahlian SQL, Excel, dan visualisasi menggunakan Tableau, sedang mengembangkan kompetensi Power BI untuk memberikan solusi dashboard end‑to‑end.”  \n\n5. **Jika Memiliki Pengetahuan Dasar Power BI**  \n   - Tuliskan: “Power BI (basic/working knowledge)” agar perekrut tahu Anda sudah familiar dan siap mengembangkan lebih lanjut.\n\n### Ringkasan\nCV Anda **cukup cocok** dengan sebagian besar persyaratan, namun **kurang pada keahlian Power BI**. Menambahkan atau menonjolkan kemampuan Power BI (bahkan pada level dasar) serta menekankan transferabilitas antara Tableau dan Power BI akan meningkatkan peluang Anda secara signifikan."
 }


### Prompt B
You are a professional HR recruiter.Your task is to review how the information in a candidate's CV matches the requirements of the available job.The CV is being reviewed to identify which requirements are supported by the information in the CV.

### Actual Output B
{
  "ai_response": "**Cocok dengan Persyaratan Pekerjaan**\n\n| Persyaratan | Ditemukan di CV? | Penjelasan |\n|--------------|-------------------|------------|\n| Menguasai **SQL** | ✅ | Tertera di bagian *Skills*. |\n| Menguasai **Excel** | ✅ | Tertera di bagian *Skills*. |\n| Menguasai **Power BI** | ❌ | Tidak ada penyebutan Power BI di CV. |\n| Pengalaman **membuat dashboard** | ✅ | Proyek “Membuat dashboard penjualan menggunakan Tableau” menunjukkan kemampuan membuat dashboard (meskipun menggunakan Tableau, bukan Power BI). |\n\n**Ringkasan**\n\n- CV mendukung tiga dari empat persyaratan utama: SQL, Excel, dan pengalaman membuat dashboard.  \n- Tidak ada bukti kemampuan Power BI; jika kandidat memang memiliki pengalaman dengan Power BI, sebaiknya ditambahkan ke CV atau dijelaskan dalam surat lamaran.  \n\n**Rekomendasi untuk Kandidat**\n\n1. **Tambahkan** kompetensi Power BI (jika ada) ke bagian *Skills* atau jelaskan dalam deskripsi proyek.  \n2. **Sorot** kembali pengalaman pembuatan dashboard, menekankan prinsip‑prinsip desain dan analisis yang dapat diterapkan di Power BI.  \n3. **Jika tidak memiliki** pengalaman Power BI, pertimbangkan untuk menyebutkan kemampuan belajar cepat dan pengalaman dengan alat visualisasi serupa (Tableau) yang dapat dipindahkan ke Power BI.  "
}

### Prompt C
ROLE:
You are a professional HR recruiter.

TASK:
Review the information in a candidate's CV and compare it with the provided job requirements. Identify which requirements are supported by evidence in the CV and which requirements are not found.

CONTEXT:
The CV is being reviewed to help HR quickly identify relevant evidence related to the job requirements. The purpose is to extract and organize information from the CV, not to make a hiring decision.

CONSTRAINTS:
- Use only information explicitly written in the CV and job requirements.
- Do not invent or assume any skills, experience, qualifications, achievements, certifications, companies,   dates, or numerical results.
- Do not decide whether the candidate should be hired or rejected.
- Do not rank the candidate or give a hiring score.
- If a job requirement is not supported by information in the CV, state that the requirement was not found in the CV. Do not say that the candidate does not have the skill.
- Only include relevant skills and experience that are actually written in the CV.
- Clarification questions should only be used for requirements or information that are missing or unclear.
- Respond in the same language used in the CV and job requirements.

OUTPUT FORMAT:
Return only valid JSON. Do not use markdown, code blocks, tables, or any text outside the JSON.

Use exactly these five fields:

{
  "evidence_found": [],
  "requirements_not_found": [],
  "relevant_skills": [],
  "relevant_experience": [],
  "clarification_questions": []
}
All five fields must contain lists of strings. 

### Actual Output C
{
  "ai_response": "{\n  \"evidence_found\": [\n    \"SQL\",\n    \"Excel\",\n    \"pengalaman membuat dashboard\"\n  ],\n  \"requirements_not_found\": [\n    \"Power BI\"\n  ],\n  \"relevant_skills\": [\n    \"SQL\",\n    \"Excel\",\n    \"Python\",\n    \"Tableau\"\n  ],\n  \"relevant_experience\": [\n    \"Membuat dashboard penjualan menggunakan Tableau\"\n  ],\n  \"clarification_questions\": [\n    \"Apakah kandidat memiliki pengalaman atau pengetahuan tentang Power BI?\",\n    \"Berapa lama kandidat telah mengerjakan proyek dashboard dan apa peran spesifiknya?\"\n  ]\n}"
}

# Prompt Evaluation
Dari ketiga prompt tersebut, mana yang menurut kalian menghasilkan output paling baik?
Output paling baik tentunya ada di prompt C

### Kenapa?
karena pada prompt C tersebut jelas dan lebih terarah seperti rolenya sebagai apa, tugasnya ngapain, terus konteksnya, dan ada batasan untuk ai nya supaya ga menambah hal yang memang tidak ada dan diperlukan.

### Apa perbedaan paling terlihat antara Prompt A, Prompt B, dan Prompt C berdasarkan hasil testing kalian?
- PROMPT A: Hasil yang diberikan masih terlalu umum dan juga panjang, hasil  AI tersebut juga memberikan hal yang tidak diminta seperti Rekomendasi untuk Meningkatkan Kesesuaian cv.
- PROMPT B: Hasil yang diberikan sudah lebih terarah karena dibagian ini sudah diberikan role, task dan juga contextnya, namun hasilnya masih belum sempurna karena masih ada tambahan seperti rekomendasi kandidat dan belum ada batasan yang jelas 
- PROMPT C: Hasil yang diberikan jauh lebih jelas dan terstruktur serta langsung to the point sesuai dengan isi cv dan juga requirement job. AI tidak menambahkan informasi yang tidak diminta dan hasilnya jauh lebih rapi karena menggunakan structured output JSON. 

# Failure Case

## Input yang menghasilkan output kurang baik
{
  "cv_text": "Skills: Python, SQL, Microsoft Excel. Project: Melakukan data cleaning menggunakan Python dan membuat laporan analisis menggunakan Excel.",
  "job_requirements": "Kandidat wajib menguasai Python, SQL, dan Microsoft Excel. Pengalaman menggunakan Power BI atau Tableau hanya menjadi nilai tambah."
}

## Actual Output
{
  "evidence_found": [
    "Python",
    "SQL",
    "Microsoft Excel"
  ],
  "requirements_not_found": [
    "Pengalaman menggunakan Power BI atau Tableau"
  ],
  "relevant_skills": [
    "Python",
    "SQL",
    "Microsoft Excel"
  ],
  "relevant_experience": [
    "Melakukan data cleaning menggunakan Python dan membuat laporan analisis menggunakan Excel."
  ],
  "clarification_questions": []
}

## Menurut kalian apa masalah dari output tersebut?
Masalahnya terletak pada bagian output "requirements_not_found" yang dimana ai masih menganggap Power Bi atau Tubleau sebagai requirement yang belum ditemukan, padahal seharusnya ouput pada bagian tersebut kosong, karena powe BI atau Tableu itu merupakan nilai tambah bukan merupakan syarat yang wajib ada

## Apa yang kalian ubah pada prompt / constraint / kode?
Hanya menambahkan di bagian constraint agar AI tersebut dapat membedakan requirement yang wajib ada dengan requirement yang hanya bersifat nilai tambah atau opsional.

Bagian constraint yang ditambahkan yaitu: 
Distinguish mandatory requirements from optional or preferred qualifications. Skills or experience described  as "nilai tambah", "preferred", "optional", or similar must not be included in requirements_not_found.

## Output setelah diperbaiki
{
  "evidence_found": [
    "Python",
    "SQL",
    "Microsoft Excel"
  ],
  "requirements_not_found": [],  
  "relevant_skills": [
    "Python",
    "SQL",
    "Microsoft Excel"
  ],
  "relevant_experience": [
    "Melakukan data cleaning menggunakan Python dan membuat laporan analisis menggunakan Excel."
  ],
  "clarification_questions": []
}

# Personal Reflection

1. Menurut kalian, bagian apa yang paling sulit dari project ini?
Bagian yang sulit itu pada saat menentukan alur kerja dari aplikasinya, karena pada saat itu sempat terkendala apakah alur yang sudah ditentukan itu sudah sesuai dengan di dunia nyata atau tidak. Selain itu, bagian yang paling sulit yaitu pada saat menyusun prompt agar AI bisa menghasilkan output yang baik dan sesuai dengan kebutuhan aplikasi.

2. Bagian kode mana yang paling banyak dibantu oleh AI?
Sebagian besar code yang ada pada project ini dibuat dengan bantuan AI. Bagian yang paling banyak dibantu yaitu pada endpoint /api/analyze-cv terutama pada saat menghubungkan FastApi dengan GroqApi, mengirim input kedalam LLM, menerima response, dan mengubah hasil outputnya menjadi struktur JSON.

3. Setelah melihat kode tersebut, jelaskan menggunakan bahasa kalian sendiri bagaimana bagian tersebut bekerja.
Bagian tersebut cara kerjanya yaitu dengan menerima input isi CV dan job requirement dari si user, setelah itu hasil input dikirim ke Goq Api dengan promptnya juga, lalu LLM membandingkan isi cv dengan job requirement, lalu hasilnya dikembalikan dalam bentuk JSON, dan setelah itu hasilnya diproses agar sesuai dengan field yang sudah ditentukan seperti evidence_found, requirements_not_found, relevant_skills, relevant_experience, dan clarification_questions.

4. Menurut kalian, apa kekurangan terbesar dari aplikasi yang kalian buat jika digunakan oleh user sungguhan?
Kekurangannya yaitu user masih harus memasukkan isi cv secara manual dalam bentuk teks, jika projek ini digunakan oleh hr sungguhan di dunia nyata cara ini masih kurang efisien untuk membantu hr melakukan screening banyak cv karena masih harus menginput teksnya satu persatu.

5. Jika provider LLM kalian diganti, misalnya dari Groq ke Gemini atau OpenAI, bagian mana dari project yang menurut kalian perlu diubah?
Yang perlu diubah yaitu pada bagian integrasi dengan LLM seperti libray yang digunakan oleh API key, client, nama model, dan cara pemanggilan API. Sedangkan untuk alur utama aplikasi dll tidak ada yang perlu diubah.

6. Setelah mencoba aplikasi kalian sendiri, apa satu improvement yang menurut kalian paling penting jika project ini dilanjutkan?
Jika projek ini dilanjutkan, improvment yang paling utama yaitu menambahkan fitur upload  CV secara langsung seperti file pdf, jadi user tidak perlu menyalin manual isi cv kedalam aplikasi, hal ini akan membuat proses screening awal menjadi lebih praktis jika dipakai oleh user sungguhan didunia nyata.

# AI Usage
AI tools yang digunakan
ChatGPT, Antigravity CLI, dan Groq API dengan model openai/gpt-oss-120b.

AI digunakan untuk membantu bagian apa?
Pastinya AI banyak membantu pada proses pengerjaan. AI digunakan untuk membantu memahami tugas yang diberikan itu apa saja, membantu menentukan struktur projek yang akan dikerjakan, membantu membuat code,membantu menghubungkan FastApi ke Groq Api, membantu menyusun prompt dan memperbaiki prompt yang kurang tepat, melakukan debugging,dan juga membantu evaluasi hasil testing yang dilakukan. Selain itu, AI juga membantu dalam membuat frontend

Bagian apa yang kalian tentukan, perbaiki, atau ubah sendiri setelah melihat hasil dari AI?
Saya tidak banyak mengubah kode secara mandiri karena sebagian besar dibuat dengan bantuan AI. Bagian yang saya lakukan sendiri lebih ke mengecek kembali hasil dari AI, terutama apakah konsep dan alur aplikasi masuk akal jika digunakan oleh HR di dunia nyata. Saya juga melakukan testing pada output dan memberikan perbaikan pada prompt ketika menemukan hasil yang kurang tepat.
