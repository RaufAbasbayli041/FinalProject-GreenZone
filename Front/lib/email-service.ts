// Email service simulation without external integrations
export interface EmailNotification {
  id: string
  to: string
  subject: string
  body: string
  type: "registration" | "order_confirmation" | "order_status" | "admin_notification"
  sentAt: Date
  read: boolean
}

export class EmailService {
  private static getNotifications(): EmailNotification[] {
    const notifications = localStorage.getItem("email_notifications")
    return notifications ? JSON.parse(notifications) : []
  }

  private static saveNotifications(notifications: EmailNotification[]): void {
    localStorage.setItem("email_notifications", JSON.stringify(notifications))
  }

  static sendRegistrationConfirmation(email: string, name: string): void {
    const notification: EmailNotification = {
      id: Date.now().toString(),
      to: email,
      subject: "Добро пожаловать в Green Zone!",
      body: `
        Здравствуйте, ${name}!
        
        Спасибо за регистрацию в Green Zone - вашем надежном партнере по искусственному газону.
        
        Ваш аккаунт успешно создан. Теперь вы можете:
        • Просматривать каталог товаров
        • Оформлять заказы с персональными данными
        • Отслеживать статус заказов в личном кабинете
        • Получать специальные предложения
        
        С уважением,
        Команда Green Zone
      `,
      type: "registration",
      sentAt: new Date(),
      read: false,
    }

    const notifications = this.getNotifications()
    notifications.push(notification)
    this.saveNotifications(notifications)

    // Show browser notification if supported
    this.showBrowserNotification("Регистрация завершена", `Добро пожаловать, ${name}!`)
  }

  static sendOrderConfirmation(email: string, orderId: string, totalAmount: number): void {
    const notification: EmailNotification = {
      id: Date.now().toString(),
      to: email,
      subject: `Заказ #${orderId} подтвержден`,
      body: `
        Ваш заказ успешно оформлен!
        
        Номер заказа: #${orderId}
        Сумма заказа: ${totalAmount.toLocaleString()}₽
        
        Мы свяжемся с вами в ближайшее время для уточнения деталей доставки и установки.
        
        Отследить статус заказа можно в личном кабинете.
        
        Спасибо за выбор Green Zone!
      `,
      type: "order_confirmation",
      sentAt: new Date(),
      read: false,
    }

    const notifications = this.getNotifications()
    notifications.push(notification)
    this.saveNotifications(notifications)

    this.showBrowserNotification("Заказ подтвержден", `Заказ #${orderId} на сумму ${totalAmount.toLocaleString()}₽`)
  }

  static sendOrderStatusUpdate(email: string, orderId: string, status: string): void {
    const statusMessages = {
      pending: "принят в обработку",
      confirmed: "подтвержден",
      in_production: "в производстве",
      shipped: "отправлен",
      delivered: "доставлен",
      completed: "завершен",
    }

    const notification: EmailNotification = {
      id: Date.now().toString(),
      to: email,
      subject: `Статус заказа #${orderId} изменен`,
      body: `
        Статус вашего заказа #${orderId} изменен на: ${statusMessages[status] || status}
        
        Вы можете отследить актуальный статус заказа в личном кабинете.
        
        С уважением,
        Команда Green Zone
      `,
      type: "order_status",
      sentAt: new Date(),
      read: false,
    }

    const notifications = this.getNotifications()
    notifications.push(notification)
    this.saveNotifications(notifications)

    this.showBrowserNotification("Статус заказа изменен", `Заказ #${orderId}: ${statusMessages[status] || status}`)
  }

  static sendAdminNotification(newOrderId: string, customerName: string, totalAmount: number): void {
    const notification: EmailNotification = {
      id: Date.now().toString(),
      to: "admin@gazonpro.ru",
      subject: `Новый заказ #${newOrderId}`,
      body: `
        Получен новый заказ!
        
        Номер заказа: #${newOrderId}
        Клиент: ${customerName}
        Сумма: ${totalAmount.toLocaleString()}₽
        
        Требуется обработка в админ-панели.
      `,
      type: "admin_notification",
      sentAt: new Date(),
      read: false,
    }

    const notifications = this.getNotifications()
    notifications.push(notification)
    this.saveNotifications(notifications)
  }

  static getNotificationsForUser(email: string): EmailNotification[] {
    return this.getNotifications().filter((n) => n.to === email)
  }

  static getAdminNotifications(): EmailNotification[] {
    return this.getNotifications().filter((n) => n.type === "admin_notification")
  }

  static markAsRead(notificationId: string): void {
    const notifications = this.getNotifications()
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications(notifications)
    }
  }

  private static showBrowserNotification(title: string, body: string): void {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" })
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body, icon: "/favicon.ico" })
        }
      })
    }
  }
}
