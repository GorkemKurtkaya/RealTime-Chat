# RealTime-Chat

## Proje Hakkında

**RealTime-Chat**, Node.js, Express.js, Socket.io, MongoDB, Redis ve RabbitMQ teknolojileriyle geliştirilmiş, gerçek zamanlı mesajlaşma ve otomatik mesaj servisleri sunan, ölçeklenebilir ve güvenli bir sohbet uygulamasıdır.

---

## İçindekiler

- [Kurulum](#kurulum)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Proje Mimarisi](#proje-mimarisi)
- [Çalıştırma ve Geliştirme](#çalıştırma-ve-geliştirme)
- [API ve Gerçek Zamanlı Özellikler](#api-ve-gerçek-zamanlı-özellikler)
- [Otomatik Mesaj Sistemi](#otomatik-mesaj-sistemi)
- [Rate Limit ve Güvenlik](#rate-limit-ve-güvenlik)
- [Loglama](#loglama)
- [Çevrim İçi Kullanıcı Yönetimi](#çevrim-içi-kullanıcı-yönetimi)
- [Çevre Değişkenleri](#çevre-değişkenleri)
- [Lisans](#lisans)

---

## Kurulum

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
   ```
   PORT=3000
   DB_URI=mongodb://localhost:27017
   JWT_SECRET=senin_jwt_secretin
   REDIS_URL=redis://localhost:6379
   RABBITMQ_URL=amqp://localhost
   ```

4. **Docker Servislerini Başlat (isteğe bağlı):**
   ```bash
   docker-compose up -d
   ```
   > Redis ve RabbitMQ servisleri için önerilir.

5. **Uygulamayı Başlat:**
   ```bash
   npm start
   ```

---

## Kullanılan Teknolojiler

- **Node.js & Express.js**: REST API ve sunucu işlemleri
- **Socket.io**: Gerçek zamanlı mesajlaşma
- **MongoDB & Mongoose**: NoSQL veritabanı ve modelleme
- **Redis**: Online kullanıcı yönetimi ve hızlı veri erişimi
- **RabbitMQ**: Kuyruk tabanlı otomatik mesajlaşma
- **Winston**: Loglama
- **express-rate-limit**: Rate limit/güvenlik
- **dotenv**: Çevre değişkenleri yönetimi
- **bcryptjs**: Şifreleme
- **cookie-parser**: Cookie işlemleri
- **sanitize-html**: XSS koruması

---

## Proje Mimarisi

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

## Çalıştırma ve Geliştirme

- **Geliştirme için:** `npm start` (nodemon ile otomatik yeniden başlatma)
- **Test için:** Test scripti eklenmemiştir, eklenmesi önerilir.
- **Loglar:** `logs/` klasöründe günlük olarak tutulur.

---

## API ve Gerçek Zamanlı Özellikler

### Kimlik Doğrulama (JWT + Cookie)

- **/auth/register**: Kullanıcı kaydı
- **/auth/login**: Giriş (JWT token ve refresh token cookie olarak döner)
- **/auth/refresh**: Token yenileme
- **/auth/logout**: Çıkış
- **/auth/profile**: Profil bilgisi

### Kullanıcı İşlemleri

- **/user**: Kullanıcı listesi
- **/user/changeNameAndEmail**: Ad ve e-posta güncelleme
- **/user/onlineCount**: Online kullanıcı sayısı
- **/user/onlineStatus/:userId**: Belirli kullanıcının online durumu
- **/user/onlineList**: Online kullanıcı listesi

### Mesajlaşma

- **/messages**: Mesaj gönderme ve alma
- **/conservations**: Konuşma (sohbet odası) oluşturma ve listeleme

### Socket.io ile Gerçek Zamanlı

- Oda katılma/ayrılma
- Mesaj gönderme/alma
- Yazıyor bildirimi
- Okundu bildirimi
- Online/Offline kullanıcı bildirimi

#### Socket.io Auth

- Bağlantı sırasında JWT token ile kimlik doğrulama zorunlu.

---

## Otomatik Mesaj Sistemi

- **Her gece 02:00'da** cron ile online kullanıcılar eşleştirilir ve rastgele mesajlar otomatik olarak gönderilir.
- Otomatik mesajlar önce MongoDB'ye kaydedilir, sonra RabbitMQ kuyruğuna eklenir ve oradan ilgili kullanıcıya iletilir.
- Otomatik mesajlar gerçek zamanlı olarak ilgili sohbet odasına düşer.

---

## Rate Limit ve Güvenlik

- **/auth**: 5 dakikada 7 istek
- **/messages**: Dakikada 40 istek
- **/conservations**: Dakikada 20 istek
- **/user**: Dakikada 50 istek
- **Tüm endpointlerde** XSS ve SQL Injection'a karşı koruma (sanitize-html, mongoose)
- **JWT tabanlı auth** ve admin guard

---

## Loglama

- **Winston** ve **winston-daily-rotate-file** ile günlük loglar `logs/` klasöründe tutulur.
- Hatalar, uyarılar ve önemli işlemler detaylı şekilde loglanır.

---

## Çevrim İçi Kullanıcı Yönetimi

- **Redis** ile online kullanıcılar ve durumları yönetilir.
- Oda bazlı online kullanıcı listesi ve genel online kullanıcı sayısı API ve socket ile alınabilir.

---

## Çevre Değişkenleri

Aşağıdaki değişkenler `.env` dosyasında tanımlanmalıdır:

```
PORT=3000
DB_URI=mongodb://localhost:27017
JWT_SECRET=senin_jwt_secretin
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
```

---

## Lisans

Bu proje [ISC Lisansı](LICENSE) ile lisanslanmıştır.

---

Daha fazla bilgi ve katkı için:  
[GitHub Proje Sayfası](https://github.com/GorkemKurtkaya/RealTime-Chat)