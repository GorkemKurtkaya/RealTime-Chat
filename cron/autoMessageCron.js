import cron from "node-cron";
import { scheduleAutoMessages, processPendingMessages } from "../services/autoMessageService.js";



cron.schedule("0 2 * * *", async () => {
  try {
    await scheduleAutoMessages();
    console.log("Otomatik mesajlar planlandı");

    await processPendingMessages();
    
    console.log("Otomatik mesaj işlemleri tamamlandı");
  } catch (err) {
    console.error("Cron hatası:", err);
  }
});