import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SupportTicket {
  id: string;
  title: string;
  problemType: string;
  deviceNumber: string;
  description: string;
  contactPerson: string;
  phone: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
}

const PROBLEM_TYPES = [
  'Неисправность оборудования',
  'Проблемы с ПО',
  'Сетевые проблемы',
  'Прочее'
];

export default function Index() {
  const [currentView, setCurrentView] = useState<'login' | 'support' | 'tickets'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      title: 'Не работает принтер HP LaserJet',
      problemType: 'Неисправность оборудования',
      deviceNumber: 'HP-001-2024',
      description: 'Принтер не печатает документы, мигает красный индикатор. Проверили бумагу и тонер - все в порядке.',
      contactPerson: 'Иванов Петр Сергеевич',
      phone: '+7 (912) 345-67-89',
      status: 'in-progress',
      createdAt: '2024-09-01T10:30:00Z'
    },
    {
      id: '2', 
      title: 'Медленная работа компьютера',
      problemType: 'Проблемы с ПО',
      deviceNumber: 'PC-125-2024',
      description: 'Компьютер стал очень медленно работать, долго загружается Windows, программы открываются с задержкой.',
      contactPerson: 'Сидорова Анна Владимировна',
      phone: '+7 (923) 456-78-90',
      status: 'new',
      createdAt: '2024-09-02T09:15:00Z'
    }
  ]);
  
  const [formData, setFormData] = useState({
    title: '',
    problemType: '',
    deviceNumber: '',
    description: '',
    contactPerson: '',
    phone: ''
  });

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      ...formData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setTickets([newTicket, ...tickets]);
    setFormData({
      title: '',
      problemType: '',
      deviceNumber: '',
      description: '',
      contactPerson: '',
      phone: ''
    });
    setCurrentView('tickets');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новое';
      case 'in-progress': return 'В работе';
      case 'resolved': return 'Решено';
      default: return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center">
              <img src="/img/d8f54b78-16b5-419d-a977-31308626fc57.jpg" alt="FlashFormat" className="w-16 h-16 object-cover rounded" />
            </div>
            <CardTitle className="text-2xl">Техническая поддержка</CardTitle>
            <p className="text-muted-foreground">Войдите в систему для подачи обращений</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                setIsLoggedIn(true);
                setCurrentView('support');
              }}
            >
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mr-3">
                <Icon name="Headphones" size={20} className="text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Техподдержка</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === 'support' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('support')}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать обращение
              </Button>
              <Button
                variant={currentView === 'tickets' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('tickets')}
              >
                <Icon name="List" size={16} className="mr-2" />
                Мои обращения
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentView('login');
                }}
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentView === 'support' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="FileText" size={24} className="mr-3 text-primary" />
                Создание обращения в техподдержку
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название обращения *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Кратко опишите проблему"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problemType">Тип проблемы *</Label>
                    <Select value={formData.problemType} onValueChange={(value) => setFormData({ ...formData, problemType: value })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип проблемы" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deviceNumber">Номер устройства</Label>
                    <Input
                      id="deviceNumber"
                      value={formData.deviceNumber}
                      onChange={(e) => setFormData({ ...formData, deviceNumber: e.target.value })}
                      placeholder="Например: PC-125-2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Контактное лицо *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="ФИО ответственного лица"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание проблемы *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Подробно опишите проблему, что происходит, когда она возникла, какие действия предпринимались..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить обращение
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentView === 'tickets' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="Clock" size={24} className="mr-3 text-primary" />
                  Мои обращения ({tickets.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><span className="font-medium">Тип:</span> {ticket.problemType}</p>
                          <p><span className="font-medium">Устройство:</span> {ticket.deviceNumber || 'Не указано'}</p>
                          <p><span className="font-medium">Дата:</span> {new Date(ticket.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Icon name="Eye" size={16} className="mr-2" />
                            Подробнее
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <span>{ticket.title}</span>
                              <Badge className={getStatusColor(ticket.status)}>
                                {getStatusText(ticket.status)}
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">Тип проблемы:</span>
                                <p>{ticket.problemType}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Номер устройства:</span>
                                <p>{ticket.deviceNumber || 'Не указано'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Контактное лицо:</span>
                                <p>{ticket.contactPerson}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Телефон:</span>
                                <p>{ticket.phone}</p>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Описание проблемы:</span>
                              <p className="mt-2 p-3 bg-gray-50 rounded-md">{ticket.description}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Создано:</span> {new Date(ticket.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Обращений пока нет</h3>
                    <p className="text-muted-foreground">Создайте первое обращение в техподдержку</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}