# 🚀 RealTime-Chat

> **RealTime-Chat**, Node.js, Express.js, Socket.io, MongoDB, Redis ve RabbitMQ teknolojileriyle geliştirilmiş, gerçek zamanlı mesajlaşma ve otomatik mesaj servisleri sunan, ölçeklenebilir ve güvenli bir sohbet uygulamasıdır.

---

## 📚 İçindekiler

- [⚡ Kurulum](#-kurulum)
- [🛠️ Kullanılan Teknolojiler](#-kullanılan-teknolojiler)
- [🏗️ Proje Mimarisi](#-proje-mimarisi)
- [👨‍💻 Çalıştırma ve Geliştirme](#-çalıştırma-ve-geliştirme)
- [🔌 API ve Gerçek Zamanlı Özellikler](#-api-ve-gerçek-zamanlı-özellikler)
- [🤖 Otomatik Mesaj Sistemi](#-otomatik-mesaj-sistemi)
- [🛡️ Rate Limit ve Güvenlik](#-rate-limit-ve-güvenlik)
- [📑 Loglama](#-loglama)
- [🟢 Çevrim İçi Kullanıcı Yönetimi](#-çevrim-içi-kullanıcı-yönetimi)
- [⚙️ Çevre Değişkenleri](#-çevre-değişkenleri)

---

## ⚡ Kurulum

1. **Depoyu Klonla:**
   ```bash
   git clone https://github.com/GorkemKurtkaya/RealTime-Chat.git
   cd RealTime-Chat
   ```

2. **Bağımlılıkları Kur:**
   ```bash
   npm install
   ```

3. **Çevre Değişkenlerini Ayarla:**
   `.env` dosyası oluşturup aşağıdaki değişkenleri ekleyin:
   ```env
   PORT=3000
   DB_URI=mongodb://localhost:27017
   JWT_SECRET=....(Şifreniz)
   REDIS_URL=redis://localhost:6379
   RABBITMQ_URL=amqp://localhost
   ```

4. **Docker Servislerini Başlat :**
   ```bash
   docker-compose up -d
   ```
   > ⚠️ **Redis ve RabbitMQ servislerini başlatmak zorunlu!!!**

5. **Uygulamayı Başlat:**
   ```bash
   npm start
   ```

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji         | Açıklama                        |
|------------------|---------------------------------|
| Node.js & Express| REST API ve sunucu işlemleri     |
| Socket.io        | Gerçek zamanlı mesajlaşma        |
| MongoDB & Mongoose| NoSQL veritabanı ve modelleme   |
| Redis            | Online kullanıcı yönetimi        |
| RabbitMQ         | Kuyruk tabanlı otomatik mesaj   |
| Winston          | Loglama                         |
| express-rate-limit| Rate limit/güvenlik            |
| dotenv           | Çevre değişkenleri yönetimi      |
| bcryptjs         | Şifreleme                       |
| cookie-parser    | Cookie işlemleri                |


---

## 🏗️ Proje Mimarisi

```
/controllers      → API iş mantığı (auth, user, message, conversation)
/routes           → API endpoint tanımları
/services         → Servis katmanı (iş mantığı, otomatik mesaj, kullanıcı, mesaj)
/models           → Mongoose modelleri (User, Message, Conversation, AutoMessage)
/middleware       → JWT auth, rate limit, socket auth
/utils            → Socket handler, logger, redis, rabbitmq entegrasyonları
/cron             → Otomatik mesaj için zamanlanmış görevler
db.js             → MongoDB bağlantısı
app.js            → Uygulama ana dosyası
docker-compose.yaml → Redis ve RabbitMQ servisleri
```

---

## 👨‍💻 Çalıştırma ve Geliştirme

- **Geliştirme için:** `npm start` _(nodemon ile otomatik yeniden başlatma)_
- **Loglar:** `logs/` klasöründe günlük olarak tutulur.

---

## 🔌 API ve Gerçek Zamanlı Özellikler

### 🔑 Kimlik Doğrulama (JWT + Cookie)

- `POST   /auth/register` → Kullanıcı kaydı
- `POST   /auth/login`    → Giriş _(JWT token ve refresh token cookie olarak döner)_
- `POST   /auth/refresh`  → Token yenileme
- `POST   /auth/logout`   → Çıkış
- `GET    /auth/me`  → Profil bilgisi

### 👤 Kullanıcı İşlemleri

- `GET    /user/list`              → Kullanıcı listesi
- `PUT    /user/update`             → Ad ve e-posta güncelleme
- `GET    /user/online/count`       → Online kullanıcı sayısı
- `GET    /user/online/ids`        → Online kullanıcı idleri
- `GET    /user/online/:userid`  → Belirli kullanıcının online durumu


### 💬 Mesajlaşma

- `POST   /messages`               → Mesaj gönderme
- `GET    /messages/:conversationId`→ Mesajları getirme
- `POST   /conservations`          → Konuşma (sohbet odası) oluşturma
- `GET    /conservations/:userId`  → Kullanıcıya ait konuşmaları getirme

### 🏢 Oda (Konuşma) Yönetimi

- `POST   /conservations/`                       → Oda oluşturma
- `PUT    /conservations/:conversationId`         → Oda bilgisi güncelleme (isim, açıklama)
- `POST   /conservations/:conversationId/add-user`    → Odaya kullanıcı ekle
- `POST   /conservations/:conversationId/remove-user` → Odayan kullanıcı çıkar
- `GET    /conservations/info/:conversationId`        → Oda bilgisi getir
- `GET    /conservations/:conversationId/users`       → Oda üyelerini getir
- `GET    /conservations/:conversationId/admins`      → Oda adminlerini getir
- `POST   /conservations/:conversationId/add-admin`   → Odaya admin ekle
- `POST   /conservations/:conversationId/remove-admin`→ Oda adminliğinden çıkar

> 🔒 Tüm bu endpointler için JWT ile kimlik doğrulama zorunludur.

### 🌐 Socket.io ile Gerçek Zamanlı

- Oda katılma/ayrılma (`join_room`, `leave_room`)
- Mesaj gönderme/alma (`send_message`, `message_received`)
- Yazıyor bildirimi (`typing`, `stop_typing`)
- Okundu bildirimi (`message_read`)
- Online/Offline kullanıcı bildirimi (`user_online`, `user_offline`)

> 🔒 **Not:** Socket.io bağlantısı sırasında JWT token ile kimlik doğrulama zorunludur.

---

## 🤖 Otomatik Mesaj Sistemi

- **Her gece 02:00'da** cron ile online kullanıcılar eşleştirilir ve rastgele mesajlar otomatik olarak gönderilir.
- Otomatik mesajlar önce MongoDB'ye kaydedilir, sonra RabbitMQ kuyruğuna eklenir ve oradan ilgili kullanıcıya iletilir.
- Otomatik mesajlar gerçek zamanlı olarak ilgili sohbet odasına düşer.

---

## 🛡️ Rate Limit ve Güvenlik

| Endpoint         | Limit                        |
|------------------|-----------------------------|
| /auth            | 5 dakikada 7 istek           |
| /messages        | Dakikada 40 istek            |
| /conservations   | Dakikada 20 istek            |
| /user            | Dakikada 50 istek            |

- **JWT tabanlı auth** ve admin guard

---

## 📑 Loglama

- **Winston** ve **winston-daily-rotate-file** ile günlük loglar `logs/` klasöründe tutulur.
- Hatalar, uyarılar ve önemli işlemler detaylı şekilde loglanır.

---

## 🟢 Çevrim İçi Kullanıcı Yönetimi

- **Redis** ile online kullanıcılar ve durumları yönetilir.
- Oda bazlı online kullanıcı listesi ve genel online kullanıcı sayısı API ve socket ile alınabilir.

---

## 📑 API Dökümantasyonu & Postman

- [API Dökümanı (Swagger veya benzeri)](DOKUMAN_LINKINIZI_BURAYA_EKLEYIN)
- [Postman Koleksiyonu](POSTMAN_LINKINIZI_BURAYA_EKLEYIN)

## 📡 Socket.io Event Dökümantasyonu

- [Socket.io Event Listesi ve Payload Detayları](SOCKET_IO_DOKUMAN_LINKINIZI_BURAYA_EKLEYIN)

## 📑 Loglama

- **Winston** ve **winston-daily-rotate-file** ile günlük loglar `logs/` klasöründe tutulur.
- Hatalar, uyarılar ve önemli işlemler detaylı şekilde loglanır.

---

## 🟢 Çevrim İçi Kullanıcı Yönetimi

- **Redis** ile online kullanıcılar ve durumları yönetilir.
- Oda bazlı online kullanıcı listesi ve genel online kullanıcı sayısı API ve socket ile alınabilir.

---

## ⚙️ Çevre Değişkenleri

Aşağıdaki değişkenler `.env` dosyasında tanımlanmalıdır:

```env
PORT=3000
DB_URI=mongodb://localhost:27017
JWT_SECRET=....(Şifreniz)
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
```

---

> 📫 Daha fazla bilgi ve katkı için: [GitHub Proje Sayfası](https://github.com/GorkemKurtkaya/RealTime-Chat)

