import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Mail, Send, Save, Eye, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/SimpleAuthContext';
import { UserRole } from '@/types';
import type { EmailTemplate } from '@/types';

export default function EmailSettingsPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      setLocation('/employee');
    }
  }, [user, setLocation]);

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  // Fetch email templates
  const { data: templates, isLoading, error } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/email-templates'],
    retry: 1,
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
      'LEAVE_SUBMITTED': 'Employee: Request Submitted',
      'LEAVE_APPROVED': 'Employee: Request Approved',
      'LEAVE_REJECTED': 'Employee: Request Not Approved',
      'ADMIN_NOTIFICATION': 'Admin: New Request Alert',
    };
    return labels[type] || type;
  };

  const getTemplateScenario = (type: string) => {
    const scenarios: Record<string, { trigger: string; recipient: string; purpose: string }> = {
      'LEAVE_SUBMITTED': {
        trigger: 'When employee submits a leave request',
        recipient: 'Employee who submitted',
        purpose: 'Confirm submission and set expectations'
      },
      'LEAVE_APPROVED': {
        trigger: 'When admin approves the request',
        recipient: 'Employee whose request was approved',
        purpose: 'Notify approval with preparation reminders'
      },
      'LEAVE_REJECTED': {
        trigger: 'When admin does not approve the request',
        recipient: 'Employee whose request was not approved',
        purpose: 'Inform decision with next steps guidance'
      },
      'ADMIN_NOTIFICATION': {
        trigger: 'When employee submits new request',
        recipient: 'Admin/HR personnel',
        purpose: 'Alert for pending approval action'
      }
    };
    return scenarios[type];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-[15px] text-gray-600">Loading email templates...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="max-w-md text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-[20px] font-semibold text-red-900 mb-2">Database Not Set Up</h2>
            <p className="text-[14px] text-red-700 mb-4">
              The email templates table doesn't exist in your database yet.
            </p>
            <div className="bg-white rounded-xl p-4 text-left text-[13px] text-gray-700 mb-4">
              <p className="font-semibold mb-2">Quick Fix:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to Supabase Dashboard</li>
                <li>Open SQL Editor</li>
                <li>Run the SQL from <code className="bg-gray-100 px-1 rounded">supabase-email-templates.sql</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="max-w-md text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
            <div className="text-yellow-600 text-5xl mb-4">📭</div>
            <h2 className="text-[20px] font-semibold text-yellow-900 mb-2">No Templates Found</h2>
            <p className="text-[14px] text-yellow-700 mb-4">
              The email templates table is empty. Please run the SQL migration to insert default templates.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      {/* Apple-style blur header */}
      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLocation('/admin')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium text-[15px]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Admin</span>
              </button>
              <div className="h-6 w-px bg-gray-300/50"></div>
              <div>
                <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
                  Email Notifications
                </h1>
                <p className="text-[13px] text-gray-500 mt-1">Customize your notification templates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[13px] font-medium text-blue-700">Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template List - Apple Card Style */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-[17px] font-semibold text-gray-900">Templates</h3>
                <p className="text-[13px] text-gray-500 mt-1">Choose a template to edit</p>
              </div>
              <div className="p-3 space-y-2">
                {templates?.map((template) => {
                  const scenario = getTemplateScenario(template.templateType);
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                          : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <span className={`text-[14px] font-semibold ${
                          selectedTemplate?.id === template.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {getTemplateTypeLabel(template.templateType)}
                        </span>
                        <span className={`text-[11px] leading-relaxed ${
                          selectedTemplate?.id === template.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {scenario?.trigger}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Template Editor - Apple Card Style */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-[17px] font-semibold text-gray-900">
                  {selectedTemplate ? 'Edit Template' : 'Select a Template'}
                </h3>
                <p className="text-[13px] text-gray-500 mt-1">
                  {selectedTemplate
                    ? getTemplateTypeLabel(selectedTemplate.templateType)
                    : 'Choose a template from the list to start editing'}
                </p>
              </div>
              <div className="p-6">
              {selectedTemplate ? (
                <>
                  {/* Scenario Information Card */}
                  {(() => {
                    const scenario = getTemplateScenario(selectedTemplate.templateType);
                    return scenario ? (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6">
                        <h4 className="text-[15px] font-semibold text-blue-900 mb-3">Email Scenario</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <span className="text-[12px] font-medium text-blue-700 min-w-[80px]">Trigger:</span>
                            <span className="text-[13px] text-blue-800">{scenario.trigger}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[12px] font-medium text-blue-700 min-w-[80px]">Recipient:</span>
                            <span className="text-[13px] text-blue-800">{scenario.recipient}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[12px] font-medium text-blue-700 min-w-[80px]">Purpose:</span>
                            <span className="text-[13px] text-blue-800">{scenario.purpose}</span>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-xl">
                    <TabsTrigger 
                      value="content"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-[14px] font-medium transition-all duration-200"
                    >
                      Content
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-[14px] font-medium transition-all duration-200"
                    >
                      Settings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="test"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-[14px] font-medium transition-all duration-200"
                    >
                      Test
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-[14px] font-medium text-gray-700">Email Subject</Label>
                      <Input
                        value={selectedTemplate.subject}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                        }
                        placeholder="Enter email subject"
                        className="h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-[15px] transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[14px] font-medium text-gray-700">Banner Text</Label>
                      <Input
                        value={selectedTemplate.bannerText}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, bannerText: e.target.value })
                        }
                        placeholder="Text displayed in the banner"
                        className="h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-[15px] transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[14px] font-medium text-gray-700">Email Body (HTML)</Label>
                      <Textarea
                        value={selectedTemplate.emailBody}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, emailBody: e.target.value })
                        }
                        placeholder="Email content (HTML supported)"
                        rows={12}
                        className="font-mono text-[13px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                      />
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                        <p className="text-[12px] text-blue-700 leading-relaxed">
                          <span className="font-semibold">Available variables:</span> {'{{employeeName}}, {{leaveType}}, {{totalDays}}, {{startDate}}, {{endDate}}, {{reason}}, {{approver}}, {{position}}, {{email}}, {{phone}}'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        disabled={updateTemplateMutation.isPending}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-[14px] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateTemplateMutation.isPending ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-[14px] transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-[14px] font-medium text-gray-700">Sender Name</Label>
                      <Input
                        value={selectedTemplate.senderName}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, senderName: e.target.value })
                        }
                        placeholder="Display name for sender"
                        className="h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-[15px] transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[14px] font-medium text-gray-700">Sender Email</Label>
                      <Input
                        value={selectedTemplate.senderEmail}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, senderEmail: e.target.value })
                        }
                        placeholder="sender@company.com"
                        type="email"
                        className="h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-[15px] transition-all duration-200"
                      />
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                        <p className="text-[12px] text-amber-700 leading-relaxed">
                          <span className="font-semibold">Note:</span> Must match the email configured in Gmail SMTP settings
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSave}
                        disabled={updateTemplateMutation.isPending}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-[14px] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateTemplateMutation.isPending ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Save Settings</span>
                          </>
                        )}
                      </button>
                    </div>
                  </TabsContent>

                  <TabsContent value="test" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-[14px] font-medium text-gray-700">Test Email Address</Label>
                      <Input
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        type="email"
                        className="h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-[15px] transition-all duration-200"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSendTest}
                        disabled={sendTestEmailMutation.isPending || !testEmail}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium text-[14px] transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendTestEmailMutation.isPending ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Test Email</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 text-[15px] mb-1">Test Data</h4>
                          <p className="text-[13px] text-blue-700 leading-relaxed">
                            The test email will use sample data to demonstrate how the template will appear to recipients.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl mb-6">
                    <Mail className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-2">Select a Template</h3>
                  <p className="text-[14px] text-gray-500 max-w-sm mx-auto">
                    Choose a template from the list on the left to start customizing your email notifications
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal - Apple Style */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-gray-900">Email Preview</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">How your email will appear</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
                <div className="bg-gray-50 rounded-2xl p-6 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-gray-500 w-16">From:</span>
                      <span className="text-[14px] text-gray-900">{selectedTemplate?.senderName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-gray-500 w-16">Subject:</span>
                      <span className="text-[14px] text-gray-900">{selectedTemplate?.subject}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}