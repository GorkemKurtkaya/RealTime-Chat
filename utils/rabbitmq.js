import amqplib from 'amqplib';

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.connected = false;
  }

  
  async connect() {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      this.connected = true;
      console.log('RabbitMQ bağlantısı başarılı');
    } catch (err) {
      console.error('RabbitMQ bağlantı hatası:', err);
      throw err;
    }
  }

  async sendToQueue(queue, message) {
    if (!this.connected) await this.connect();
    
    await this.channel.assertQueue(queue, { durable: true });
    return this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async consume(queue, callback) {
    if (!this.connected) await this.connect();
    
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          await callback(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        } catch (err) {
          console.error('Mesaj işleme hatası:', err);
          this.channel.nack(msg, false, false); 
        }
      }
    });
  }
}

export default new RabbitMQ();