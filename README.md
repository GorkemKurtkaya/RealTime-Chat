# 🚀 RealTime-Chat

> **RealTime-Chat**, Node.js, Express.js, Socket.io, MongoDB, Redis ve RabbitMQ teknolojileriyle geliştirilmiş, gerçek zamanlı mesajlaşma ve otomatik mesaj servisleri sunan, ölçeklenebilir ve güvenli bir sohbet uygulamasıdır.

---
## 📑 API Dökümantasyonu & Postman

- [API Dökümanı (Postman)](https://documenter.getpostman.com/view/33385054/2sB34hHgiC)

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
## 📑 API Dökümantasyonu & Postman

- [API Dökümanı (Postman)](https://documenter.getpostman.com/view/33385054/2sB34hHgiC)

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

## 🌐 Socket.io Kullanım Rehberi

Gerçek zamanlı özellikleri test etmek ve kullanmak için Socket.io ile bağlantı kurmanız gerekir. Aşağıda, Postman veya benzeri araçlarla nasıl bağlantı kuracağınızı ve eventleri nasıl dinleyeceğinizi adım adım bulabilirsiniz.

### 1. Socket.io Sunucusuna Bağlanma

- Sunucu adresi genellikle: `ws://localhost:3000` veya `wss://sunucu-adresi`
- Bağlantı sırasında **JWT token** ile kimlik doğrulama zorunludur.

#### Postman ile Bağlantı Kurma
1. **Yeni WebSocket Request** oluşturun.
2. **URL** kısmına: `ws://localhost:3000` yazın.
3. **Query Params** sekmesine gelin, aşağıdaki gibi parametre ekleyin:
   - Key: `auth.token`
   - Value: `<JWT_TOKENINIZ>`
   > JWT token'ı `/auth/login` endpointinden alabilirsiniz.
4. **Connect** butonuna tıklayın.

### 2. Event Dinleme (Listen)
- Bağlantı kurulduktan sonra, dinlemek istediğiniz eventleri ekleyin.
- Örneğin, aşağıdaki eventleri dinleyebilirsiniz:
  - `message_received`
  - `send_message`
  - `join_room`
  - `online_users`
  - `message_read`
  - `typing`
  - `stop_typing`
  - `message_read`
  - `notification`
- Postman'da **Listen for an event** kısmına event adını yazıp dinlemeye başlayabilirsiniz.

### 3. Odaya Katılma (join_room)
- Bir odaya katılmak için aşağıdaki şekilde bir event gönderin:
  - Event: `join_room`
  - Data: Oda ID'si (ör: `{"roomId": "<CONVERSATION_ID>"}` veya sadece oda id)

### 4. Mesaj Gönderme (send_message)
- Odaya mesaj göndermek için:
  - Event: `send_message`
  - Data:
    ```json
    {
      "roomId": "<CONVERSATION_ID>",
      "content": "Merhaba!"
    }
    ```

### 5. Yazıyor Bildirimi (typing/stop_typing)
- Yazmaya başladığınızda:
  - Event: `typing`
  - Data: Oda ID'si
- Yazmayı bıraktığınızda:
  - Event: `stop_typing`
  - Data: Oda ID'si

### 6. Odadan Ayrılma (leave_room)
- Event: `leave_room`
- Data: Oda ID'si

### 7. Bağlantı Sonlandırma
- WebSocket bağlantısını kapatmak için Postman'da **Disconnect** butonunu kullanabilirsiniz.


---

## 📡 Socket.io Event Dökümantasyonu

Aşağıda uygulamada kullanılan tüm Socket.io eventlerinin açıklamaları ve payload örnekleri yer almaktadır.

### Bağlantı
- **URL:** `ws://localhost:3000`
- **Auth:** Query param ile `auth.token=<JWT_TOKEN>`

---

### Client → Server Eventleri

| Event Adı         | Açıklama                        | Payload/Parametre Örneği                |
|-------------------|---------------------------------|-----------------------------------------|
| `join_room`       | Odaya katılma                   | `"<roomId>"` veya `{ "roomId": "..." }`|
| `send_message`    | Odaya mesaj gönderme            | `{ "roomId": "...", "content": "Merhaba!" }` |
| `typing`          | Yazıyor bildirimi başlatma      | `"<roomId>"`                            |
| `stop_typing`     | Yazıyor bildirimi bitirme       | `"<roomId>"`                            |
| `message_read`    | Mesajı okundu olarak işaretleme | `{ "roomId": "...", "messageId": "..." }` |
| `leave_room`      | Odadan ayrılma                  | `"<roomId>"`                            |

---

### Server → Client Eventleri

| Event Adı           | Açıklama                                 | Payload Örneği |
|---------------------|------------------------------------------|----------------|
| `online_users`      | Oda içindeki online kullanıcılar         | `{ "roomId": "...", "users": ["..."] }` |
| `message_received`  | Odaya yeni mesaj geldi                   | `{ "message": "...", "senderId": "...", "timestamp": "..." }` |
| `notification`      | Yeni mesaj bildirimi                     | `{ "type": "new_message", "message": "Yeni mesajınız var!", "roomId": "...", "senderId": "..." }` |
| `typing`            | Bir kullanıcı yazıyor                    | `{ "userId": "...", "roomId": "..." }` |
| `stop_typing`       | Bir kullanıcı yazmayı bıraktı            | `{ "userId": "...", "roomId": "..." }` |
| `message_read`      | Mesaj okundu bildirimi                   | `{ "messageId": "...", "userId": "..." }` |
| `error`             | Hata mesajı                              | `{ "message": "..." }` |

---

### Event Akış Örnekleri

#### Odaya Katılma
- **Client → Server:**
  ```json
  // join_room
  "6876717eb556b1ecc6993c78"
  ```
- **Server → Client:**
  ```json
  // online_users
  { "roomId": "6876717eb556b1ecc6993c78", "users": ["...", "..."] }
  ```

#### Mesaj Gönderme
- **Client → Server:**
  ```json
  // send_message
  { "roomId": "6876717eb556b1ecc6993c78", "content": "Merhaba!" }
  ```
- **Server → Client:**
  ```json
  // message_received
  { "message": "Merhaba!", "senderId": "...", "timestamp": "..." }
  // notification
  { "type": "new_message", "message": "Yeni mesajınız var!", "roomId": "...", "senderId": "..." }
  ```

#### Yazıyor Bildirimi
- **Client → Server:**
  ```json
  // typing
  "6876717eb556b1ecc6993c78"
  ```
- **Server → Client:**
  ```json
  // typing
  { "userId": "...", "roomId": "..." }
  // stop_typing
  { "userId": "...", "roomId": "..." }
  ```

#### Mesaj Okundu
- **Client → Server:**
  ```json
  // message_read
  { "roomId": "6876717eb556b1ecc6993c78", "messageId": "..." }
  ```
- **Server → Client:**
  ```json
  // message_read
  { "messageId": "...", "userId": "..." }
  ```

#### Odadan Ayrılma
- **Client → Server:**
  ```json
  // leave_room
  "6876717eb556b1ecc6993c78"
  ```
- **Server → Client:**
  ```json
  // user_offline
  { "userId": "..." }
  ```

---

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

