import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Mail, Send, Save, Eye, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import type { EmailTemplate } from '@/types';

export default function EmailSettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Fetch email templates
  const { data: templates, isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/email-templates'],
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async (data: Partial<EmailTemplate>) => {
      const response = await fetch(`/api/email-templates/${selectedTemplate?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/email-templates'] });
      toast({
        title: 'บันทึกสำเร็จ',
        description: 'อัพเดตเทมเพลตอีเมลเรียบร้อยแล้ว',
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัพเดตเทมเพลตได้',
        variant: 'destructive',
      });
    },
  });

  // Send test email mutation
  const sendTestEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/email-templates/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate?.id,
          testEmail,
        }),
      });
      if (!response.ok) throw new Error('Failed to send test email');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'ส่งอีเมลทดสอบสำเร็จ',
        description: `ส่งอีเมลไปที่ ${testEmail} เรียบร้อยแล้ว`,
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งอีเมลทดสอบได้',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!selectedTemplate) return;
    updateTemplateMutation.mutate(selectedTemplate);
  };

  const handleSendTest = () => {
    if (!testEmail || !selectedTemplate) {
      toast({
        title: 'กรุณากรอกอีเมล',
        description: 'กรุณากรอกอีเมลที่ต้องการส่งทดสอบ',
        variant: 'destructive',
      });
      return;
    }
    sendTestEmailMutation.mutate();
  };

  const handlePreview = () => {
    if (!selectedTemplate) return;
    
    // Replace variables with sample data
    let html = selectedTemplate.emailBody;
    html = html.replace(/{{employeeName}}/g, 'สมชาย ใจดี');
    html = html.replace(/{{leaveType}}/g, 'ลาพักผ่อน');
    html = html.replace(/{{totalDays}}/g, '3');
    html = html.replace(/{{startDate}}/g, '1 มกราคม 2025');
    html = html.replace(/{{endDate}}/g, '3 มกราคม 2025');
    html = html.replace(/{{reason}}/g, 'ไปเที่ยวกับครอบครัว');
    html = html.replace(/{{approver}}/g, 'ผู้จัดการ');
    html = html.replace(/{{position}}/g, 'Software Developer');
    html = html.replace(/{{email}}/g, 'somchai@in2it.co.th');
    html = html.replace(/{{phone}}/g, '081-234-5678');
    
    setPreviewHtml(html);
    setShowPreview(true);
  };

  const getTemplateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'LEAVE_SUBMITTED': '📝 แจ้งเตือนพนักงาน: ส่งคำขอลาแล้ว',
      'LEAVE_APPROVED': '✅ แจ้งเตือนพนักงาน: คำขอลาได้รับอนุมัติ',
      'LEAVE_REJECTED': '❌ แจ้งเตือนพนักงาน: คำขอลาไม่ได้รับอนุมัติ',
      'ADMIN_NOTIFICATION': '🔔 แจ้งเตือนแอดมิน: มีคำขอลาใหม่',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับ
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ตั้งค่าการแจ้งเตือนทางอีเมล</h1>
              <p className="text-gray-600 mt-1">จัดการเทมเพลตอีเมลและการแจ้งเตือน</p>
            </div>
          </div>
          <Mail className="h-10 w-10 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>เทมเพลตอีเมล</CardTitle>
              <CardDescription>เลือกเทมเพลตที่ต้องการแก้ไข</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {templates?.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">
                      {getTemplateTypeLabel(template.templateType)}
                    </span>
                    <span className="text-xs opacity-70">{template.templateName}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Template Editor */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>แก้ไขเทมเพลต</CardTitle>
              <CardDescription>
                {selectedTemplate
                  ? getTemplateTypeLabel(selectedTemplate.templateType)
                  : 'เลือกเทมเพลตจากรายการด้านซ้าย'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">เนื้อหา</TabsTrigger>
                    <TabsTrigger value="settings">ตั้งค่า</TabsTrigger>
                    <TabsTrigger value="test">ทดสอบ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>หัวข้ออีเมล (Subject)</Label>
                      <Input
                        value={selectedTemplate.subject}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                        }
                        placeholder="หัวข้ออีเมล"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ข้อความแบนเนอร์</Label>
                      <Input
                        value={selectedTemplate.bannerText}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, bannerText: e.target.value })
                        }
                        placeholder="ข้อความที่แสดงในแบนเนอร์"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>เนื้อหาอีเมล (HTML)</Label>
                      <Textarea
                        value={selectedTemplate.emailBody}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, emailBody: e.target.value })
                        }
                        placeholder="เนื้อหาอีเมล (รองรับ HTML)"
                        rows={12}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        ตัวแปรที่ใช้ได้: {'{'}{'{'}}employeeName{'}'}{'}'}, {'{'}{'{'}}leaveType{'}'}{'}'}, {'{'}{'{'}}totalDays{'}'}{'}'}, {'{'}{'{'}}startDate{'}'}{'}'}, {'{'}{'{'}}endDate{'}'}{'}'}, {'{'}{'{'}}reason{'}'}{'}'}, {'{'}{'{'}}approver{'}'}{'}'}, {'{'}{'{'}}position{'}'}{'}'}, {'{'}{'{'}}email{'}'}{'}'}, {'{'}{'{'}}phone{'}'}{'}'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={updateTemplateMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        บันทึก
                      </Button>
                      <Button variant="outline" onClick={handlePreview}>
                        <Eye className="h-4 w-4 mr-2" />
                        ดูตัวอย่าง
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>ชื่อผู้ส่ง</Label>
                      <Input
                        value={selectedTemplate.senderName}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, senderName: e.target.value })
                        }
                        placeholder="ชื่อที่แสดงเป็นผู้ส่ง"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>อีเมลผู้ส่ง</Label>
                      <Input
                        value={selectedTemplate.senderEmail}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, senderEmail: e.target.value })
                        }
                        placeholder="อีเมลผู้ส่ง"
                        type="email"
                      />
                      <p className="text-xs text-gray-500">
                        หมายเหตุ: ต้องใช้อีเมลที่ตั้งค่าใน Gmail SMTP
                      </p>
                    </div>

                    <Button onClick={handleSave} disabled={updateTemplateMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      บันทึกการตั้งค่า
                    </Button>
                  </TabsContent>

                  <TabsContent value="test" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>อีเมลสำหรับทดสอบ</Label>
                      <Input
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        type="email"
                      />
                    </div>

                    <Button
                      onClick={handleSendTest}
                      disabled={sendTestEmailMutation.isPending || !testEmail}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sendTestEmailMutation.isPending ? 'กำลังส่ง...' : 'ส่งอีเมลทดสอบ'}
                    </Button>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">ข้อมูลทดสอบ</h4>
                      <p className="text-sm text-blue-800">
                        อีเมลทดสอบจะใช้ข้อมูลตัวอย่างเพื่อแสดงผลเทมเพลต
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>เลือกเทมเพลตจากรายการด้านซ้ายเพื่อเริ่มแก้ไข</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ตัวอย่างอีเมล</CardTitle>
                  <Button variant="ghost" onClick={() => setShowPreview(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-600">จาก: {selectedTemplate?.senderName}</p>
                    <p className="text-sm text-gray-600">หัวข้อ: {selectedTemplate?.subject}</p>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}