import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquareWarning, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const ReportIssueModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let userContext = null;
      if (user) {
         userContext = {
             fullName: user.user_metadata?.full_name,
             email: user.email,
             ubcLevel: user.user_metadata?.ubc_level,
         };
      }

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'User Feedback',
          message: message.trim(),
          userContext
        })
      });

      if (!response.ok) throw new Error('Failed to send');

      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setStatus('idle');
      }, 2500);
    } catch (error) {
      console.error('Failed to report issue:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button right bottom */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white p-3 md:px-4 md:py-3 rounded-full shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group border border-white/20"
        aria-label="แจ้งปัญหาการใช้งาน"
      >
        <MessageSquareWarning className="w-6 h-6 animate-pulse" />
        <span className="hidden md:block font-thai font-medium pr-1 text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          แจ้งปัญหาการใช้งาน
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-thai">
                <MessageSquareWarning className="w-5 h-5 text-red-500" /> แจ้งปัญหาการใช้งาน
              </h3>
              <button
                onClick={() => !isSubmitting && setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 font-thai">ส่งข้อความสำเร็จ</h4>
                  <p className="text-gray-500 font-thai">ขอบคุณที่แจ้งปัญหา เราจะรีบดำเนินการแก้ไขให้โดยเร็วที่สุดครับ</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <div className="mb-4">
                    <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-2 font-thai">
                      อธิบายปัญหาที่คุณพบ (หรือข้อเสนอแนะ)
                    </label>
                    <textarea
                      id="issue"
                      rows={5}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none shadow-sm font-thai"
                      placeholder="ตัวอย่าง: กดปุ่มบันทึกโปรไฟล์ไม่ได้, หน้าจอแสดงผลผิดปกติ..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex gap-2 items-center font-thai border border-red-100">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</span>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors font-thai"
                      disabled={isSubmitting}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] font-thai"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          กำลังส่ง...
                        </>
                      ) : (
                        'ส่งข้อความ'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportIssueModal;
