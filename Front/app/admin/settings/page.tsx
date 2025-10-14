"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Mail,
  Shield,
  Bell,
  Palette,
  Globe,
} from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // Общие настройки
    siteName: 'GreenZone',
    siteDescription: 'Премиум искусственная трава',
    timezone: 'Europe/Moscow',
    language: 'ru',
    currency: 'RUB',
    
    // Уведомления
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    customerNotifications: true,
    systemNotifications: true,
    
    // Безопасность
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    ipWhitelist: '',
    
    // Внешний вид
    theme: 'light',
    primaryColor: '#10B981',
    sidebarCollapsed: false,
    compactMode: false,
    
    // Система
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    autoBackup: true,
    backupFrequency: 'daily',
    
    // Email настройки
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@greenzone.com',
    fromName: 'GreenZone Admin',
  })

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // Здесь будет логика сохранения настроек
  }

  const handleReset = () => {
    console.log('Resetting settings')
    // Здесь будет логика сброса настроек
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки системы</h1>
          <p className="text-gray-600">Конфигурация админ-панели и системы</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Общие настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Общие настройки
            </CardTitle>
            <CardDescription>
              Основные параметры сайта и системы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Название сайта</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Описание сайта</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Часовой пояс</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                  <SelectItem value="Europe/London">Лондон (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">Нью-Йорк (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Язык</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Валюта</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">Рубль (₽)</SelectItem>
                  <SelectItem value="USD">Доллар ($)</SelectItem>
                  <SelectItem value="EUR">Евро (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
            <CardDescription>
              Настройки уведомлений и оповещений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email уведомления</Label>
                <p className="text-sm text-gray-500">Получать уведомления на email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS уведомления</Label>
                <p className="text-sm text-gray-500">Получать SMS уведомления</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Push уведомления</Label>
                <p className="text-sm text-gray-500">Браузерные уведомления</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderNotifications">Уведомления о заказах</Label>
                <p className="text-sm text-gray-500">Новые заказы и изменения статуса</p>
              </div>
              <Switch
                id="orderNotifications"
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="customerNotifications">Уведомления о клиентах</Label>
                <p className="text-sm text-gray-500">Новые регистрации и активность</p>
              </div>
              <Switch
                id="customerNotifications"
                checked={settings.customerNotifications}
                onCheckedChange={(checked) => setSettings({...settings, customerNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemNotifications">Системные уведомления</Label>
                <p className="text-sm text-gray-500">Ошибки и предупреждения системы</p>
              </div>
              <Switch
                id="systemNotifications"
                checked={settings.systemNotifications}
                onCheckedChange={(checked) => setSettings({...settings, systemNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>
              Настройки безопасности и доступа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Двухфакторная аутентификация</Label>
                <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Таймаут сессии (минуты)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="passwordPolicy">Политика паролей</Label>
              <Select value={settings.passwordPolicy} onValueChange={(value) => setSettings({...settings, passwordPolicy: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкая</SelectItem>
                  <SelectItem value="medium">Средняя</SelectItem>
                  <SelectItem value="high">Высокая</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ipWhitelist">IP Whitelist</Label>
              <Textarea
                id="ipWhitelist"
                placeholder="192.168.1.1&#10;10.0.0.1"
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({...settings, ipWhitelist: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-1">Один IP на строку</p>
            </div>
          </CardContent>
        </Card>

        {/* Внешний вид */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>
              Настройки интерфейса и темы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Тема</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Темная</SelectItem>
                  <SelectItem value="auto">Автоматически</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="primaryColor">Основной цвет</Label>
              <Input
                id="primaryColor"
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sidebarCollapsed">Свернутая боковая панель</Label>
                <p className="text-sm text-gray-500">По умолчанию свернута</p>
              </div>
              <Switch
                id="sidebarCollapsed"
                checked={settings.sidebarCollapsed}
                onCheckedChange={(checked) => setSettings({...settings, sidebarCollapsed: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactMode">Компактный режим</Label>
                <p className="text-sm text-gray-500">Уменьшенные отступы и размеры</p>
              </div>
              <Switch
                id="compactMode"
                checked={settings.compactMode}
                onCheckedChange={(checked) => setSettings({...settings, compactMode: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Система */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Система
            </CardTitle>
            <CardDescription>
              Настройки производительности и обслуживания
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Режим обслуживания</Label>
                <p className="text-sm text-gray-500">Временно отключить сайт</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debugMode">Режим отладки</Label>
                <p className="text-sm text-gray-500">Показывать ошибки разработчика</p>
              </div>
              <Switch
                id="debugMode"
                checked={settings.debugMode}
                onCheckedChange={(checked) => setSettings({...settings, debugMode: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cacheEnabled">Кэширование</Label>
                <p className="text-sm text-gray-500">Ускорение загрузки страниц</p>
              </div>
              <Switch
                id="cacheEnabled"
                checked={settings.cacheEnabled}
                onCheckedChange={(checked) => setSettings({...settings, cacheEnabled: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">Автоматическое резервное копирование</Label>
                <p className="text-sm text-gray-500">Регулярное создание бэкапов</p>
              </div>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
              />
            </div>
            <div>
              <Label htmlFor="backupFrequency">Частота резервного копирования</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Каждый час</SelectItem>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Email настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email настройки
            </CardTitle>
            <CardDescription>
              Конфигурация SMTP сервера
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP хост</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP порт</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="smtpUsername">SMTP пользователь</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="smtpPassword">SMTP пароль</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="fromEmail">Email отправителя</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="fromName">Имя отправителя</Label>
              <Input
                id="fromName"
                value={settings.fromName}
                onChange={(e) => setSettings({...settings, fromName: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
