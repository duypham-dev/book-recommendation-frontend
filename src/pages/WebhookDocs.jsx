import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  FileText,
  Settings,
  Terminal,
  Send,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Save,
  Globe,
  Key,
  Shield,
  BookOpen,
  Code
} from "lucide-react";
import { message } from "antd";
import {
  getWebhookDoc,
  updateWebhookDoc,
  triggerManualWebhook
} from "../services/webhookDocService";

// Default content matching the official Webhook documentation schema provided by user
const DEFAULT_DOC = {
  id: "tekbook-webhook-guide",
  title: "Hướng Dẫn Tích Hợp Webhook Cập Nhật Tự Động Cho Nguồn Website (Web Crawl)",
  category: "Tài liệu Tích hợp Webhook",
  description: "Tài liệu hướng dẫn cấu hình webhook push để đồng bộ nội dung tự động từ CMS của trang web với cơ sở dữ liệu tri thức của chatbot.",
  version: 1,
  lastUpdated: new Date().toISOString(),
  sections: [
    {
      heading: "1. Tổng Quan về Webhook Cập Nhật",
      body: "Một nguồn dữ liệu được thêm vào chatbot bằng cách crawl website có 2 cơ chế cập nhật nội dung:\n- Lịch tự động (polling): Hệ thống tự kiểm tra định kỳ mỗi N giờ, crawl lại bất kể nội dung có đổi hay không.\n- Webhook (push): Hệ thống nguồn (CMS) chủ động gửi tín hiệu ngay khi có nội dung mới, giảm độ trễ cập nhật xuống khoảng 15 giây.\n\nWebhook chỉ áp dụng được khi chúng ta kiểm soát trực tiếp hệ thống CMS của trang nguồn, nhằm cấu hình phía CMS chủ động gửi request."
    },
    {
      heading: "2. Cơ Chế Debounce Tránh Quét Trùng Lặp",
      body: "Khi CMS cập nhật nhiều trang liên tiếp trong một thao tác (ví dụ chỉnh sửa cả một mục tài liệu), nó có thể gửi nhiều request webhook dồn dập trong vài giây. Cơ chế xử lý:\n- Request đầu tiên trong một cửa sổ 15 giây: hệ thống lên lịch crawl lại sau đúng 15 giây.\n- Mọi request tiếp theo trong cùng cửa sổ: bị loại bỏ (debounced), không tạo thêm tác vụ crawl lặp lại không cần thiết."
    },
    {
      heading: "3. Cơ Chế Bảo Mật với X-Webhook-Secret",
      body: "- webhook_token (thành phần trong URL) là khoá định tuyến, không phải bí mật - chỉ cần đủ khó đoán để tránh dò quét.\n- Secret xác thực được truyền riêng qua header 'X-Webhook-Secret', không nằm trong URL và không xuất hiện trong access log.\n- Secret được mã hoá (Fernet) trước khi lưu vào database, không lưu ở dạng plaintext. Giá trị plaintext chỉ hiển thị đúng một lần tại thời điểm tạo.\n- Các trường hợp lỗi xác thực (token không tồn tại, webhook đang tắt, hoặc secret sai) đều trả về chung lỗi 403 Forbidden để ngăn dò quét."
    },
    {
      heading: "4. Cấu Hình Webhook Phía CMS",
      body: "Đưa các thông tin cấu hình webhook sau vào CMS của bạn:\n- Webhook URL: Callback URL được cấp cho nguồn này (ví dụ: http://localhost:5000/api/v1/web-crawls/webhook/<webhook_token>)\n- Method: POST\n- Header: X-Webhook-Secret: <secret_token>\n- Body: Không bắt buộc (hệ thống không đọc nội dung body)."
    }
  ]
};

export default function WebhookDocs() {
  // Document state (synchronized with Backend)
  const [doc, setDoc] = useState(DEFAULT_DOC);

  // Webhook settings state (synchronized with Backend)
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [isAutoTrigger, setIsAutoTrigger] = useState(true);

  // Editor edit state
  const [editTitle, setEditTitle] = useState(DEFAULT_DOC.title);
  const [editDescription, setEditDescription] = useState(DEFAULT_DOC.description);
  const [editSections, setEditSections] = useState(DEFAULT_DOC.sections);

  // Terminal logging & delivery status state
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);

  const logsEndRef = useRef(null);

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Load document and configurations from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWebhookDoc();
        if (res && res.data) {
          const { doc: storedDoc, webhookUrl: storedUrl, webhookSecret: storedSecret, isAutoTrigger: storedAutoTrigger } = res.data;
          
          setDoc(storedDoc || DEFAULT_DOC);
          setWebhookUrl(storedUrl || "");
          setWebhookSecret(storedSecret || "");
          setIsAutoTrigger(storedAutoTrigger !== false);
          
          setEditTitle(storedDoc?.title || DEFAULT_DOC.title);
          setEditDescription(storedDoc?.description || DEFAULT_DOC.description);
          setEditSections(storedDoc?.sections || DEFAULT_DOC.sections);
          
          addLog("info", "Đã đồng bộ thành công thông tin tài liệu & cấu hình từ Backend Server.");
        }
      } catch (err) {
        addLog("error", `Không thể kết nối Backend Server: ${err.message}. Đang sử dụng dữ liệu cục bộ tạm thời.`);
        message.error("Lỗi đồng bộ dữ liệu từ backend!");
      }
    };
    fetchData();
  }, []);

  // Append new log item to terminal screen
  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { type, message, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setCurrentResponse(null);
  };

  /**
   * Triggers the webhook POST request through backend server.
   * Conforms with the API format: POST {webhook_url} with header X-Webhook-Secret.
   */
  const triggerWebhook = async () => {
    if (!webhookUrl) {
      addLog("error", "Không thể kích hoạt webhook: Webhook URL chưa được cấu hình.");
      message.error("Vui lòng cấu hình Webhook URL trước!");
      return;
    }

    setIsSending(true);
    addLog("info", "Đang gửi yêu cầu kích hoạt Webhook qua Backend Server...");

    try {
      // First save configurations to make sure backend has the latest Webhook URL and Secret Key
      const updatedDoc = { ...doc };
      addLog("info", "Đồng bộ cấu hình tạm thời lên Backend trước khi kích hoạt...");
      
      const saveRes = await updateWebhookDoc({
        doc: updatedDoc,
        webhookUrl: webhookUrl.trim(),
        webhookSecret: webhookSecret.trim(),
        isAutoTrigger
      });
      
      if (saveRes && saveRes.data) {
        setWebhookUrl(saveRes.data.store.webhookUrl);
        setWebhookSecret(saveRes.data.store.webhookSecret);
        
        // Execute manual trigger endpoint on Backend
        const res = await triggerManualWebhook();
        if (res && res.data) {
          const trigger = res.data;
          
          // Append all logs generated on the Backend to the UI console logs
          if (trigger.logs && trigger.logs.length > 0) {
            trigger.logs.forEach(l => {
              addLog(l.type, l.message);
            });
          }
          if (trigger.response) {
            setCurrentResponse(trigger.response);
            if (trigger.success) {
              message.success("Webhook đã gửi thành công qua Backend!");
            } else {
              message.error("Gửi Webhook từ Backend thất bại!");
            }
          }
        }
      }
    } catch (err) {
      addLog("error", `Lỗi kích hoạt webhook từ Backend: ${err.message}`);
      message.error("Lỗi gửi Webhook!");
    } finally {
      setIsSending(false);
    }
  };

  // Handles updating the document locally and pushing webhook
  const handleSaveDocument = async () => {
    setIsSending(true);
    const updatedDoc = {
      ...doc,
      title: editTitle.trim() || doc.title,
      description: editDescription.trim() || doc.description,
      sections: editSections,
      version: doc.version + 1,
      lastUpdated: new Date().toISOString()
    };

    try {
      addLog("info", `Đang gửi yêu cầu cập nhật tài liệu (Phiên bản v${updatedDoc.version}) lên Backend Server...`);
      
      const res = await updateWebhookDoc({
        doc: updatedDoc,
        webhookUrl: webhookUrl.trim(),
        webhookSecret: webhookSecret.trim(),
        isAutoTrigger
      });
      
      if (res && res.data) {
        const { store, triggerResult } = res.data;
        setDoc(store.doc);
        setWebhookUrl(store.webhookUrl);
        setWebhookSecret(store.webhookSecret);
        setIsAutoTrigger(store.isAutoTrigger);
        
        message.success(`Cập nhật thành công! Phiên bản hiện tại: v${store.doc.version}`);
        addLog("success", `Đã lưu tài liệu mới lên Backend Server.`);

        // If backend executed the auto-trigger Webhook, render its logs too
        if (triggerResult) {
          if (triggerResult.logs && triggerResult.logs.length > 0) {
            triggerResult.logs.forEach(l => {
              addLog(l.type, l.message);
            });
          }
          if (triggerResult.response) {
            setCurrentResponse(triggerResult.response);
            if (triggerResult.success) {
              message.success("Tự động kích hoạt gửi Webhook thành công!");
            } else {
              message.error("Tự động gửi Webhook từ Backend thất bại!");
            }
          }
        }
      }
    } catch (err) {
      addLog("error", `Gặp lỗi khi lưu lên Backend: ${err.message}`);
      message.error("Lỗi khi cập nhật tài liệu!");
    } finally {
      setIsSending(false);
    }
  };

  // Reset document back to default template
  const handleResetDocument = () => {
    setEditTitle(DEFAULT_DOC.title);
    setEditDescription(DEFAULT_DOC.description);
    setEditSections(DEFAULT_DOC.sections);
    message.info("Đã khôi phục form soạn thảo về bản gốc. Hãy nhấn 'Cập nhật tài liệu' để lưu lên server.");
  };

  // Helper to handle input updates for dynamic section list
  const handleSectionBodyChange = (index, value) => {
    const newSections = [...editSections];
    newSections[index].body = value;
    setEditSections(newSections);
  };

  const handleSectionHeadingChange = (index, value) => {
    const newSections = [...editSections];
    newSections[index].heading = value;
    setEditSections(newSections);
  };

  return (
    <MainLayout>
      <div className="px-4 py-8 max-w-7xl mx-auto dark:text-gray-100 animate-fadeIn">
        
        {/* Top Header Intro Banner with gradients */}
        <div className="relative overflow-hidden rounded-3xl mb-10 p-8 md:p-12 bg-gradient-to-r from-emerald-900 via-indigo-950 to-slate-900 border border-emerald-500/20 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 inline-flex items-center gap-1.5 mb-4">
              <Globe className="w-3.5 h-3.5 animate-pulse" /> Sandbox Webhook & Crawler Verification
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Tài Liệu Mẫu & Giả Lập Webhook
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
              Trang web này đóng vai trò là nguồn tài liệu công khai (tải tĩnh) để chatbot thực hiện crawl. 
              Sử dụng bảng điều khiển bên phải để cấu hình kết nối Webhook theo đặc tả kỹ thuật, 
              cho phép kiểm tra chức năng kích hoạt tái crawl (recrawl) tức thì mỗi khi có tài liệu cập nhật.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Xác thực X-Webhook-Secret</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                <span>Hỗ trợ cơ chế Debounce 15s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Document Display (This is what chatbots crawl) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative group rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              
              {/* Card top bar with indicator badges */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-800 dark:text-white">Giao diện tài liệu thực tế (Public HTML)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full">
                    Crawlable
                  </span>
                </div>
              </div>

              {/* Crawlable Content Area (Pure semantic HTML structure for chatbot parsing) */}
              <article id="crawlable-document" className="p-6 md:p-8 space-y-6">
                
                {/* Meta details bar */}
                <div className="flex flex-wrap gap-3 items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/60 pb-4">
                  <span className="font-medium bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md text-gray-600 dark:text-gray-300">
                    ID: <code className="font-mono">{doc.id}</code>
                  </span>
                  <span className="font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                    Phiên bản: v{doc.version}
                  </span>
                  <span className="font-medium">
                    Cập nhật: {new Date(doc.lastUpdated).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
                    {doc.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {doc.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1 bg-gray-50 dark:bg-gray-900/30 rounded-r-lg">
                    {doc.description}
                  </p>
                </div>

                <div className="space-y-6 mt-6">
                  {doc.sections && doc.sections.map((section, idx) => (
                    <section key={idx} className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {section.heading}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {section.body}
                      </p>
                    </section>
                  ))}
                </div>

                {/* Additional metadata helpers representing structured data */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/60">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Structured keywords (Metadata tags)</h4>
                  <div className="flex flex-wrap gap-2">
                    {["API Docs", "Webhook Integration", "Chatbot Crawler", "Debounce 15s", "X-Webhook-Secret"].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </article>
            </div>
            
            {/* Display JSON Data Representation */}
            <div className="rounded-3xl bg-gray-950 border border-gray-850 shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-850 bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-bold text-sm">Cơ cấu JSON được crawl bởi Chatbot</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
                    message.success("Đã copy dữ liệu JSON!");
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  title="Copy JSON Data"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <pre className="p-6 text-xs text-emerald-400 font-mono overflow-x-auto max-h-72 leading-relaxed">
                <code>{JSON.stringify(doc, null, 2)}</code>
              </pre>
            </div>

          </div>

          {/* RIGHT: Webhook Settings & Editor Console */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Webhook Configuration Card */}
            <div className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                <Settings className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Cấu hình Webhook kết nối</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> Webhook Callback URL
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="http://localhost:5000/api/v1/web-crawls/webhook/<webhook_token>"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/45 focus:border-emerald-500 transition-all text-sm shadow-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1.5 leading-normal">
                    Địa chỉ nhận webhook được sinh ra từ trang quản trị nguồn website của chatbot. 
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-gray-400" /> X-Webhook-Secret Key (Mật mã bí mật)
                  </label>
                  <input
                    type="password"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="Nhập secret key để xác thực request"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/45 focus:border-emerald-500 transition-all text-sm shadow-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1.5 leading-normal">
                    Mã băm token xác thực. Hệ thống backend sẽ đối chiếu trực tiếp qua header <code className="font-mono text-emerald-500 bg-emerald-50 dark:bg-indigo-950/40 px-1 py-0.5 rounded">X-Webhook-Secret</code>.
                  </p>
                </div>

                {/* Autotrigger Switch */}
                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-750">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Tự động push Webhook
                    </span>
                    <p className="text-xs text-gray-400">
                      Tự động gửi tín hiệu POST webhook ngay khi bấm Lưu tài liệu.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoTrigger}
                      onChange={(e) => setIsAutoTrigger(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Webhook trigger actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={triggerWebhook}
                    disabled={isSending || !webhookUrl}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md shadow-emerald-600/10"
                  >
                    {isSending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Gửi Test Webhook (POST)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Document Content Editor Card */}
            <div className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Chỉnh sửa tài liệu để giả lập thay đổi</h3>
                </div>
                <button
                  onClick={handleResetDocument}
                  className="text-xs font-semibold text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Khôi phục gốc
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tiêu đề tài liệu</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm shadow-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tóm tắt mô tả</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm shadow-sm resize-none"
                  />
                </div>

                {/* Edit internal sections */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Các đề mục chi tiết</label>
                  {editSections && editSections.map((section, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60 space-y-2">
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleSectionHeadingChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-bold text-sm focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={section.body}
                        onChange={(e) => handleSectionBodyChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveDocument}
                  className="w-full py-3 rounded-xl bg-gray-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Cập nhật tài liệu & Tăng phiên bản (v{doc.version + 1})</span>
                </button>
              </div>
            </div>

            {/* Webhook Delivery Terminal Logs */}
            <div className="rounded-3xl bg-gray-950 border border-gray-800 shadow-xl overflow-hidden animate-fadeIn">
              
              {/* Terminal header */}
              <div className="px-6 py-4 border-b border-gray-850 bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-gray-200">Terminal Webhook Log Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearLogs}
                    className="text-xs text-gray-500 hover:text-gray-300 bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800 transition-colors"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              {/* Logs display */}
              <div className="p-6 font-mono text-xs space-y-2.5 min-h-60 max-h-96 overflow-y-auto leading-relaxed">
                {logs.length === 0 ? (
                  <p className="text-gray-600 italic">Chưa có bản ghi hoạt động. Click "Gửi Test Webhook" hoặc "Cập nhật tài liệu" để xem logs giả lập.</p>
                ) : (
                  logs.map((log, idx) => {
                    let colorClass = "text-gray-400";
                    if (log.type === "success") colorClass = "text-emerald-400 font-bold";
                    if (log.type === "error") colorClass = "text-red-400 font-bold";
                    if (log.type === "warning") colorClass = "text-amber-400";
                    if (log.type === "info") colorClass = "text-indigo-300";

                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-gray-600 select-none">[{log.timestamp}]</span>
                        <span className={colorClass + " whitespace-pre-wrap"}>{log.message}</span>
                      </div>
                    );
                  })
                )}
                <div ref={logsEndRef} />
              </div>

              {/* Server Response details inside console */}
              {currentResponse && (
                <div className="p-6 bg-gray-900/60 border-t border-gray-800/60 font-mono text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <span>Response Details</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${currentResponse.status === "FAILED" ? "bg-red-500/20 text-red-400" : currentResponse.status >= 200 && currentResponse.status < 300 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {currentResponse.status} {currentResponse.statusText}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-400">
                    <div>Thời gian phản hồi: <span className="text-white">{currentResponse.duration}</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Headers nhận lại:</div>
                    <pre className="p-3 bg-gray-950/80 rounded-xl text-gray-300 overflow-x-auto text-[10px]">
                      {JSON.stringify(currentResponse.headers, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Response Body:</div>
                    <pre className="p-3 bg-gray-950/80 rounded-xl text-emerald-300 overflow-x-auto text-[10px]">
                      {JSON.stringify(currentResponse.body, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
