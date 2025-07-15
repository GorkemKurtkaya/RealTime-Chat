import cron from "node-cron";
import { scheduleAutoMessages, processPendingMessages } from "../services/autoMessageService.js";
import rabbitMQ from "../utils/rabbitmq.js";



// TEST: Her dakika çalışan cron (aslında gece 02:00'da çalışacak)
cron.schedule("0 2 * * *", async () => {
  try {
    await scheduleAutoMessages();

    await processPendingMessages();
    
    console.log("Otomatik mesaj işlemleri tamamlandı");
  } catch (err) {
    console.error("Cron hatası:", err);
  }
});