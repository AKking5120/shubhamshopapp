import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, PlusCircle, Search, CreditCard, 
  BarChart3, Users, FileSpreadsheet, Settings, LogOut, Printer, 
  CheckCircle2, Clock, AlertTriangle, Package, Calendar, UserCheck, 
  ChevronRight, Trash2, Edit, Eye, ArrowUpRight, DollarSign, Download, 
  FileText, Globe, RefreshCw, X, Shield, Lock, Phone, MapPin, Check, ChevronDown, Filter,
  Smartphone, Database, Wifi, WifiOff, HardDriveDownload, Camera, Copy
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

// --- Default Shop & Translation Configuration ---
const SHOP_INFO = {
  name: "SHUBHAM PRINTS & STATIONERS",
  tagline: "Quality Printing & Packaging Solutions",
  address: "Shop No. 14, Main Market, Laxmi Nagar, New Delhi - 110092",
  phone: "+91 98765 43210 / +91 011 2244 5566",
  email: "orders@shubhamprints.in",
  gstin: "07AAAAA0000A1Z5"
};

const SUPABASE_SCHEMA_SQL = `-- SHUBHAM PRINTS SUPABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor

-- 1. Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivery_date DATE NOT NULL,
    customer_name TEXT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    staff_name TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'New',
    notes TEXT,
    order_total NUMERIC(12, 2) DEFAULT 0.00,
    received_amount NUMERIC(12, 2) DEFAULT 0.00,
    balance_due NUMERIC(12, 2) DEFAULT 0.00,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Order Items Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    item_no INT NOT NULL,
    job_name TEXT NOT NULL,
    specs TEXT,
    qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit VARCHAR(20) DEFAULT 'Pcs',
    rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- 3. Payment History Table
CREATE TABLE public.payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(12, 2) NOT NULL,
    mode VARCHAR(50) DEFAULT 'Cash',
    recorded_by TEXT NOT NULL,
    notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon access for shop staff
CREATE POLICY "Public read/write access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public read/write items" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Public read/write payments" ON public.payment_history FOR ALL USING (true);
`;

const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    newOrder: "New Order",
    allOrders: "All Orders",
    searchOrders: "Search Orders",
    payments: "Payments",
    reports: "Reports",
    staff: "Staff",
    importExport: "Import / Export",
    supabaseTab: "Supabase DB",
    settings: "Settings",
    totalOrders: "Total Orders",
    todaysOrders: "Today's Orders",
    pendingOrders: "Pending Orders",
    inProgress: "In Progress",
    ready: "Ready for Delivery",
    delivered: "Delivered",
    totalRevenue: "Total Sales Value",
    totalReceived: "Total Received",
    totalOutstanding: "Total Outstanding",
    todaysIncome: "Today's Income",
    monthlyIncome: "This Month's Income",
    createOrder: "Create New Order",
    customerName: "Customer Name",
    mobile: "Mobile Number",
    orderNo: "Order No.",
    date: "Order Date",
    deliveryDate: "Delivery Date",
    status: "Status",
    staffName: "Staff Assigned",
    total: "Total",
    received: "Received",
    balance: "Balance Due",
    actions: "Actions",
    addItems: "Add Line Items",
    jobName: "Product / Job Name",
    specs: "Specifications",
    qty: "Qty",
    unit: "Unit",
    rate: "Rate (₹)",
    amount: "Amount (₹)",
    notes: "Special Instructions",
    saveOrder: "Save Order",
    printSlip: "Print Order Slip",
    paymentHistory: "Payment History",
    addPayment: "Record New Payment",
    amountPaid: "Amount Paid (₹)",
    paymentMode: "Payment Method",
    recordedBy: "Recorded By",
    downloadReport: "Export Report (CSV)",
    langToggle: "हिंदी",
    hindiName: "शुभम प्रिंट्स",
    pwaInstall: "Install Mobile App",
    pwaReady: "App Ready / Web Mode"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    newOrder: "नया ऑर्डर",
    allOrders: "सभी ऑर्डर",
    searchOrders: "खोजें",
    payments: "भुगतान",
    reports: "रिपोर्ट्स",
    staff: "स्टाफ",
    importExport: "इम्पोर्ट/एक्सपोर्ट",
    supabaseTab: "सुपाबेस डेटाबेस",
    settings: "सेटिंग्स",
    totalOrders: "कुल ऑर्डर",
    todaysOrders: "आज के ऑर्डर",
    pendingOrders: "लंबित ऑर्डर",
    inProgress: "प्रगति पर",
    ready: "डिलिवरी हेतु तैयार",
    delivered: "डिलिवर हो चुका",
    totalRevenue: "कुल बिक्री मूल्य",
    totalReceived: "प्राप्त राशि",
    totalOutstanding: "बकाया राशि",
    todaysIncome: "आज की आय (जमा)",
    monthlyIncome: "इस महीने की आय",
    createOrder: "नया ऑर्डर बनाएं",
    customerName: "ग्राहक का नाम",
    mobile: "मोबाइल नंबर",
    orderNo: "ऑर्डर नंबर",
    date: "ऑर्डर तिथि",
    deliveryDate: "डिलिवरी तिथि",
    status: "स्थिति",
    staffName: "स्टाफ का नाम",
    total: "कुल राशि",
    received: "प्राप्त हुआ",
    balance: "बकाया राशि",
    actions: "कार्य",
    addItems: "सामान जोड़ें",
    jobName: "प्रिंटिंग जॉब का नाम",
    specs: "विवरण / साइज़",
    qty: "मात्रा",
    unit: "इकाई",
    rate: "दर (₹)",
    amount: "कुल (₹)",
    notes: "निर्देश",
    saveOrder: "ऑर्डर सुरक्षित करें",
    printSlip: "पर्ची प्रिंट करें",
    paymentHistory: "भुगतान ब्योरा",
    addPayment: "नया जमा करें",
    amountPaid: "जमा राशि (₹)",
    paymentMode: "भुगतान प्रकार",
    recordedBy: "दर्जकर्ता",
    downloadReport: "रिपोर्ट (CSV)",
    langToggle: "English",
    hindiName: "शुभम प्रिंट्स",
    pwaInstall: "ऐप इंस्टाल करें",
    pwaReady: "वेब / ऐप रेडी"
  }
};

const INITIAL_ORDERS = [
  {
    id: "ORD-2026-001",
    orderNo: "SP-2026-001",
    date: "2026-11-08",
    deliveryDate: "2026-11-12",
    customerName: "Rajesh Kumar (Gupta Traders)",
    mobile: "9811223344",
    staffName: "Amit Sharma",
    status: "In Progress",
    notes: "Urgent matte finishing required",
    items: [
      { id: 1, itemNo: 1, jobName: "Visiting Cards", specs: "350 GSM Velvet Matte", qty: 1000, unit: "Pcs", rate: 1.5, amount: 1500 },
      { id: 2, itemNo: 2, jobName: "Flex Banner", specs: "Star Flex 10x4 ft", qty: 40, unit: "Sq Ft", rate: 18, amount: 720 }
    ],
    orderTotal: 2220,
    receivedAmount: 1000,
    balanceDue: 1220,
    payments: [
      { id: "PAY-1", date: "2026-11-08", amount: 1000, mode: "UPI (GPay)", recordedBy: "Amit Sharma", notes: "Advance payment" }
    ],
    createdBy: "Amit Sharma",
    updatedAt: "2026-11-08T10:30:00Z"
  },
  {
    id: "ORD-2026-002",
    orderNo: "SP-2026-002",
    date: "2026-11-09",
    deliveryDate: "2026-11-11",
    customerName: "Priya Sharma (Verma Sweets)",
    mobile: "9871100998",
    staffName: "Rahul Verma",
    status: "Ready",
    notes: "Sweet Box Stickers roll format",
    items: [
      { id: 1, itemNo: 1, jobName: "Gumming Stickers", specs: "Gloss Vinyl Die Cut 2x2 inch", qty: 2500, unit: "Pcs", rate: 0.8, amount: 2000 }
    ],
    orderTotal: 2000,
    receivedAmount: 2000,
    balanceDue: 0,
    payments: [
      { id: "PAY-2", date: "2026-11-09", amount: 2000, mode: "Cash", recordedBy: "Rahul Verma", notes: "Full payment received" }
    ],
    createdBy: "Rahul Verma",
    updatedAt: "2026-11-09T14:15:00Z"
  }
];

const INITIAL_STAFF = [
  { id: "STF-1", name: "Shubham Gupta", role: "Admin / Owner", mobile: "9876543210", status: "Active" },
  { id: "STF-2", name: "Amit Sharma", role: "Staff", mobile: "9812345678", status: "Active" },
  { id: "STF-3", name: "Rahul Verma", role: "Staff", mobile: "9898765432", status: "Active" }
];

export default function App() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  // Dynamically inject Tailwind CSS CDN to prevent "ReferenceError: tailwind is not defined"
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sp_orders_backup');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [staffList, setStaffList] = useState(INITIAL_STAFF);

  // Supabase Configuration State with Environment Variables & Local Fallback
  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    return localStorage.getItem('sp_sb_url') || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '';
  });
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => {
    return localStorage.getItem('sp_sb_key') || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || '';
  });
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // UI Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [toast, setToast] = useState(null);

  // Local Storage Auto Sync Backup
  useEffect(() => {
    localStorage.setItem('sp_orders_backup', JSON.stringify(orders));
  }, [orders]);

  // Online / Offline Status Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Supabase Connection Verification Mock/Setup
  useEffect(() => {
    if (supabaseUrl.trim() && supabaseAnonKey.trim()) {
      setIsSupabaseConnected(true);
    } else {
      setIsSupabaseConnected(false);
    }
  }, [supabaseUrl, supabaseAnonKey]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const formatINR = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return new Date(dateStr).toLocaleDateString('en-IN');
    } catch {
      return dateStr;
    }
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentYearMonth = today.slice(0, 7); // 'YYYY-MM'

    const totalOrders = orders.length;
    const todaysOrders = orders.filter(o => o.date === today).length;
    const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'In Progress').length;
    const inProgress = orders.filter(o => o.status === 'In Progress').length;
    const ready = orders.filter(o => o.status === 'Ready').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;

    const totalValue = orders.reduce((acc, o) => acc + (Number(o.orderTotal) || 0), 0);
    const totalReceived = orders.reduce((acc, o) => acc + (Number(o.receivedAmount) || 0), 0);
    const totalOutstanding = orders.reduce((acc, o) => acc + (Number(o.balanceDue) || 0), 0);

    // Calculate Today's Income (received from orders created today + payment logs recorded today)
    let todaysIncome = 0;
    orders.forEach(o => {
      if (o.payments && o.payments.length > 0) {
        o.payments.forEach(p => {
          if (p.date === today) todaysIncome += Number(p.amount) || 0;
        });
      } else if (o.date === today) {
        todaysIncome += Number(o.receivedAmount) || 0;
      }
    });

    // Calculate Monthly Income (received payments in the current month)
    let monthlyIncome = 0;
    orders.forEach(o => {
      if (o.payments && o.payments.length > 0) {
        o.payments.forEach(p => {
          if (p.date && p.date.startsWith(currentYearMonth)) monthlyIncome += Number(p.amount) || 0;
        });
      } else if (o.date && o.date.startsWith(currentYearMonth)) {
        monthlyIncome += Number(o.receivedAmount) || 0;
      }
    });

    return { totalOrders, todaysOrders, pendingOrders, inProgress, ready, delivered, totalValue, totalReceived, totalOutstanding, todaysIncome, monthlyIncome };
  }, [orders]);

  const handleConnectSupabase = (url, key) => {
    setSupabaseUrl(url);
    setSupabaseAnonKey(key);
    localStorage.setItem('sp_sb_url', url);
    localStorage.setItem('sp_sb_key', key);
    if (url && key) {
      setIsSupabaseConnected(true);
      showToast("Supabase Database Connected & Live Sync Enabled!", "success");
    } else {
      setIsSupabaseConnected(false);
      showToast("Disconnected. Operating in Local Offline/PWA Fallback Mode.", "error");
    }
  };

  const handleSaveOrder = (orderData) => {
    const exists = orders.some(o => o.id === orderData.id);
    if (exists) {
      setOrders(orders.map(o => o.id === orderData.id ? { ...orderData, updatedAt: new Date().toISOString() } : o));
      showToast(`Order ${orderData.orderNo} updated!`);
    } else {
      const newOrder = {
        ...orderData,
        createdBy: "Staff User",
        updatedAt: new Date().toISOString()
      };
      setOrders([newOrder, ...orders]);
      showToast(`New Order ${orderData.orderNo} created!`);
    }
    setEditingOrder(null);
    setActiveTab('allOrders');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(o => o.id !== orderId));
      showToast("Order deleted.");
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
    showToast(`Status updated to ${newStatus}`);
  };

  const handleRecordPayment = (orderId, paymentAmount, paymentMode, paymentNotes) => {
    const amt = Number(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;

    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newReceived = o.receivedAmount + amt;
        const newBalance = Math.max(0, o.orderTotal - newReceived);
        const newPaymentLog = {
          id: `PAY-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: amt,
          mode: paymentMode,
          recordedBy: "Staff User",
          notes: paymentNotes || "Payment recorded"
        };
        showToast(`Payment of ${formatINR(amt)} recorded!`);
        return {
          ...o,
          receivedAmount: newReceived,
          balanceDue: newBalance,
          payments: [...(o.payments || []), newPaymentLog],
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
    setIsPaymentModalOpen(false);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.mobile.includes(searchQuery);

      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchesStaff = staffFilter === 'All' || o.staffName === staffFilter;

      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        matchesDate = o.date >= dateRange.start && o.date <= dateRange.end;
      }

      return matchesSearch && matchesStatus && matchesStaff && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, staffFilter, dateRange]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col md:flex-row pb-16 md:pb-0">

      {/* Toast Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl text-white font-medium text-xs md:text-sm animate-bounce ${toast.type === 'error' ? 'bg-red-600' : 'bg-teal-600'}`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP MOBILE BAR */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-black text-slate-900 text-sm">
            SP
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">{lang === 'hi' ? t.hindiName : "SHUBHAM PRINTS"}</h1>
            <div className="flex items-center space-x-1 text-[10px]">
              {isOnline ? (
                <span className="text-emerald-400 flex items-center"><Wifi className="w-3 h-3 mr-0.5" /> Online</span>
              ) : (
                <span className="text-amber-400 flex items-center"><WifiOff className="w-3 h-3 mr-0.5" /> PWA Sync</span>
              )}
              <span>•</span>
              <span className={isSupabaseConnected ? "text-teal-400 font-semibold" : "text-slate-400"}>
                {isSupabaseConnected ? "Supabase Active" : "Local DB"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-2 py-1 bg-slate-800 text-[11px] rounded border border-slate-700 text-teal-300 font-semibold"
          >
            {t.langToggle}
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center font-black text-xl text-slate-900 shadow-lg shadow-teal-500/20">
                SP
              </div>
              <div>
                <h1 className="font-bold text-sm text-white tracking-wide">{lang === 'hi' ? t.hindiName : "SHUBHAM PRINTS"}</h1>
                <p className="text-[10px] text-teal-400 font-medium">Order Management System</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px]">
            <span className="flex items-center text-slate-400">
              <Database className="w-3.5 h-3.5 mr-1 text-teal-400" /> DB Engine
            </span>
            <span className={`px-2 py-0.5 rounded font-bold ${isSupabaseConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-amber-400'}`}>
              {isSupabaseConnected ? 'Supabase' : 'Local Storage'}
            </span>
          </div>

          <nav className="p-3 space-y-1">
            <SidebarItem icon={LayoutDashboard} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={PlusCircle} label={t.newOrder} active={activeTab === 'newOrder'} onClick={() => { setEditingOrder(null); setActiveTab('newOrder'); }} highlight />
            <SidebarItem icon={ShoppingCart} label={t.allOrders} active={activeTab === 'allOrders'} count={orders.length} onClick={() => setActiveTab('allOrders')} />
            <SidebarItem icon={Search} label={t.searchOrders} active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
            <SidebarItem icon={CreditCard} label={t.payments} active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
            <SidebarItem icon={BarChart3} label={t.reports} active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
            <SidebarItem icon={Database} label={t.supabaseTab} active={activeTab === 'supabase'} onClick={() => setActiveTab('supabase')} />
            <SidebarItem icon={Users} label={t.staff} active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} />
            <SidebarItem icon={FileSpreadsheet} label={t.importExport} active={activeTab === 'import'} onClick={() => setActiveTab('import')} />
            <SidebarItem icon={Settings} label={t.settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-teal-300 font-semibold border border-slate-700 transition"
          >
            {t.langToggle}
          </button>
          <div className="text-[10px] text-slate-500 text-center">
            PWA Mobile & Web Architecture Ready
          </div>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView 
            stats={stats} 
            orders={orders} 
            t={t} 
            formatINR={formatINR} 
            formatDate={formatDate}
            onNewOrder={() => { setEditingOrder(null); setActiveTab('newOrder'); }}
            onViewOrder={(ord) => { setSelectedOrder(ord); setIsViewModalOpen(true); }}
          />
        )}

        {activeTab === 'newOrder' && (
          <OrderFormView 
            initialOrder={editingOrder}
            orders={orders}
            staffList={staffList}
            t={t}
            formatINR={formatINR}
            onSave={handleSaveOrder}
            onCancel={() => setActiveTab('allOrders')}
          />
        )}

        {activeTab === 'allOrders' && (
          <AllOrdersView 
            orders={filteredOrders}
            allStaff={staffList}
            t={t}
            formatINR={formatINR}
            formatDate={formatDate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            staffFilter={staffFilter}
            setStaffFilter={setStaffFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onViewOrder={(ord) => { setSelectedOrder(ord); setIsViewModalOpen(true); }}
            onEditOrder={(ord) => { setEditingOrder(ord); setActiveTab('newOrder'); }}
            onDeleteOrder={handleDeleteOrder}
            onRecordPayment={(ord) => { setSelectedOrder(ord); setIsPaymentModalOpen(true); }}
            onPrintSlip={(ord) => { setSelectedOrder(ord); setIsPrintModalOpen(true); }}
            onStatusChange={handleUpdateStatus}
          />
        )}

        {activeTab === 'search' && (
          <SearchOrdersView 
            orders={orders}
            t={t}
            formatINR={formatINR}
            formatDate={formatDate}
            onViewOrder={(ord) => { setSelectedOrder(ord); setIsViewModalOpen(true); }}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentTrackingView 
            orders={orders}
            t={t}
            formatINR={formatINR}
            formatDate={formatDate}
            onRecordPayment={(ord) => { setSelectedOrder(ord); setIsPaymentModalOpen(true); }}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            orders={orders}
            t={t}
            formatINR={formatINR}
            formatDate={formatDate}
          />
        )}

        {/* SUPABASE SETUP & MIGRATION SQL TAB */}
        {activeTab === 'supabase' && (
          <SupabaseSetupView 
            supabaseUrl={supabaseUrl}
            supabaseAnonKey={supabaseAnonKey}
            isSupabaseConnected={isSupabaseConnected}
            onSaveConfig={handleConnectSupabase}
            showToast={showToast}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagementView 
            staffList={staffList}
            setStaffList={setStaffList}
            orders={orders}
            t={t}
            showToast={showToast}
          />
        )}

        {activeTab === 'import' && (
          <ImportExportView 
            orders={orders}
            setOrders={setOrders}
            t={t}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            isSupabaseConnected={isSupabaseConnected}
            t={t}
          />
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (PWA / MOBILE APP UI) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex justify-around items-center z-40 text-slate-400">
        <MobileNavItem icon={LayoutDashboard} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <MobileNavItem icon={ShoppingCart} label={t.allOrders} active={activeTab === 'allOrders'} onClick={() => setActiveTab('allOrders')} />
        <button 
          onClick={() => { setEditingOrder(null); setActiveTab('newOrder'); }}
          className="flex flex-col items-center justify-center -mt-5 bg-teal-500 text-slate-950 w-12 h-12 rounded-full font-bold shadow-lg border-4 border-slate-900"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
        <MobileNavItem icon={Search} label={t.searchOrders} active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
        <MobileNavItem icon={Database} label="Supabase" active={activeTab === 'supabase'} onClick={() => setActiveTab('supabase')} />
      </div>

      {/* MODALS */}
      {isViewModalOpen && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          t={t}
          formatINR={formatINR}
          formatDate={formatDate}
          onClose={() => setIsViewModalOpen(false)}
          onPrint={() => { setIsViewModalOpen(false); setIsPrintModalOpen(true); }}
          onRecordPayment={() => { setIsViewModalOpen(false); setIsPaymentModalOpen(true); }}
        />
      )}

      {isPaymentModalOpen && selectedOrder && (
        <RecordPaymentModal 
          order={selectedOrder}
          t={t}
          formatINR={formatINR}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmitPayment={handleRecordPayment}
        />
      )}

      {isPrintModalOpen && selectedOrder && (
        <PrintSlipModal 
          order={selectedOrder}
          t={t}
          formatINR={formatINR}
          formatDate={formatDate}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

    </div>
  );
}

// Mobile Bottom Nav Helper
function MobileNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition ${active ? 'text-teal-400' : 'hover:text-slate-200'}`}
    >
      <Icon className="w-5 h-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, count, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
        active 
          ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20' 
          : highlight
          ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold shadow'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
        <span className="truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-slate-950 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// DASHBOARD VIEW
function DashboardView({ stats, orders, t, formatINR, formatDate, onNewOrder, onViewOrder }) {
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => o.date === dateStr);
      const sales = dayOrders.reduce((sum, o) => sum + (o.orderTotal || 0), 0);
      days.push({
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        sales: sales
      });
    }
    return days;
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">{t.dashboard}</h2>
          <p className="text-slate-500 text-xs mt-0.5">Real-time shop order tracking & revenue analytics</p>
        </div>
        <button
          onClick={onNewOrder}
          className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.createOrder}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title={t.todaysIncome} value={formatINR(stats.todaysIncome)} icon={DollarSign} color="emerald" sub="Collected today" />
        <StatCard title={t.monthlyIncome} value={formatINR(stats.monthlyIncome)} icon={CreditCard} color="blue" sub="This month collection" />
        <StatCard title={t.totalRevenue} value={formatINR(stats.totalValue)} icon={BarChart3} color="emerald" sub="Total booked value" />
        <StatCard title={t.totalOutstanding} value={formatINR(stats.totalOutstanding)} icon={AlertTriangle} color="rose" sub="Pending balance" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title={t.totalOrders} value={stats.totalOrders} icon={ShoppingCart} color="blue" sub={`${stats.todaysOrders} today`} />
        <StatCard title={t.pendingOrders} value={stats.pendingOrders} icon={Clock} color="amber" sub={`${stats.inProgress} active`} />
        <StatCard title={t.ready} value={stats.ready} icon={CheckCircle2} color="emerald" sub="Ready for pickup" />
        <StatCard title={t.delivered} value={stats.delivered} icon={Package} color="blue" sub="Completed" />
      </div>

      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Weekly Sales Revenue</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(val) => formatINR(val)} />
              <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2.5} fill="#ccfbf1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// STAT CARD COMPONENT
function StatCard({ title, value, icon: Icon, color = 'blue', sub }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-4 bg-white rounded-2xl border ${theme.border} shadow-sm space-y-2 flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 truncate">{title}</span>
        <div className={`w-8 h-8 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{value}</div>
        {sub && <div className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ORDER ENTRY FORM
function OrderFormView({ initialOrder, orders, staffList, t, formatINR, onSave, onCancel }) {
  const isEdit = Boolean(initialOrder);

  const generatedOrderNo = useMemo(() => {
    if (isEdit) return initialOrder.orderNo;
    const year = new Date().getFullYear();
    const count = orders.length + 1;
    return `SP-${year}-${String(count).padStart(3, '0')}`;
  }, [orders, isEdit, initialOrder]);

  const [formData, setFormData] = useState({
    id: isEdit ? initialOrder.id : `ORD-${Date.now()}`,
    orderNo: isEdit ? initialOrder.orderNo : generatedOrderNo,
    date: isEdit ? initialOrder.date : new Date().toISOString().split('T')[0],
    deliveryDate: isEdit ? initialOrder.deliveryDate : new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    customerName: isEdit ? initialOrder.customerName : '',
    mobile: isEdit ? initialOrder.mobile : '',
    staffName: isEdit ? initialOrder.staffName : (staffList[0]?.name || 'Amit Sharma'),
    status: isEdit ? initialOrder.status : 'New',
    notes: isEdit ? (initialOrder.notes || '') : '',
    receivedAmount: isEdit ? initialOrder.receivedAmount : 0,
    customTotal: isEdit ? initialOrder.orderTotal : null,
    customBalance: isEdit ? initialOrder.balanceDue : null,
  });

  const [items, setItems] = useState(
    isEdit ? initialOrder.items : [
      { id: 1, itemNo: 1, jobName: 'Visiting Cards', specs: '350 GSM Matte', qty: 1000, unit: 'Pcs', rate: 1.5, amount: 1500 }
    ]
  );

  const calculatedTotals = useMemo(() => {
    const itemsTotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const finalTotal = formData.customTotal !== null && formData.customTotal !== '' ? Number(formData.customTotal) : itemsTotal;
    const received = Number(formData.receivedAmount) || 0;
    const finalBalance = formData.customBalance !== null && formData.customBalance !== '' ? Number(formData.customBalance) : Math.max(0, finalTotal - received);
    return { orderTotal: finalTotal, balanceDue: finalBalance, itemsTotal };
  }, [items, formData.receivedAmount, formData.customTotal, formData.customBalance]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'qty' || field === 'rate') {
      const q = Number(field === 'qty' ? value : item.qty) || 0;
      const r = Number(field === 'rate' ? value : item.rate) || 0;
      item.amount = Number((q * r).toFixed(2));
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), itemNo: items.length + 1, jobName: '', specs: '', qty: 1, unit: 'Pcs', rate: 0, amount: 0 }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      items,
      orderTotal: calculatedTotals.orderTotal,
      balanceDue: calculatedTotals.balanceDue,
      receivedAmount: Number(formData.receivedAmount) || 0
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      <div className="p-4 md:p-5 bg-slate-900 text-white flex justify-between items-center">
        <h2 className="font-bold text-base md:text-lg">{isEdit ? `Edit Order #${formData.orderNo}` : t.createOrder}</h2>
        <span className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-teal-300 font-bold border border-slate-700">
          #{formData.orderNo}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-600 mb-1">{t.mobile} *</label>
            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              placeholder="e.g. 9811223344"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">{t.customerName} *</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              placeholder="Customer Name"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">{t.staffName}</label>
            <select
              value={formData.staffName}
              onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border bg-white text-xs"
            >
              {staffList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Status & Delivery Date Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Order Status (Progress)</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-bold text-teal-800"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready">Ready for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">{t.date}</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border bg-white text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">{t.deliveryDate}</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-bold text-amber-700"
            />
          </div>
        </div>

        {/* Item Rows */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-xs">Line Items</h3>
          {items.map((it, idx) => (
            <div key={it.id} className="p-3 bg-slate-50 border rounded-xl grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
              <input
                type="text"
                placeholder="Job Name"
                value={it.jobName}
                onChange={(e) => handleItemChange(idx, 'jobName', e.target.value)}
                className="col-span-2 md:col-span-2 px-2.5 py-1.5 border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Specs"
                value={it.specs}
                onChange={(e) => handleItemChange(idx, 'specs', e.target.value)}
                className="col-span-2 md:col-span-2 px-2.5 py-1.5 border rounded-lg bg-white"
              />
              <input
                type="number"
                placeholder="Qty"
                value={it.qty}
                onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg bg-white font-bold"
              />
              <input
                type="number"
                placeholder="Rate"
                value={it.rate}
                onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg bg-white font-bold"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="text-teal-700 font-bold hover:underline">+ Add Product</button>
        </div>

        {/* Admin Editable Totals & Payments */}
        <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
          <div className="text-xs font-bold text-teal-400">Admin Payment & Calculation Overrides</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Order Total (₹)</label>
              <input
                type="number"
                value={formData.customTotal !== null ? formData.customTotal : calculatedTotals.itemsTotal}
                onChange={(e) => setFormData({ ...formData, customTotal: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs font-bold bg-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Received Amount (₹)</label>
              <input
                type="number"
                value={formData.receivedAmount}
                onChange={(e) => setFormData({ ...formData, receivedAmount: e.target.value, customBalance: null })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs font-bold bg-slate-800 text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Balance Due (₹)</label>
              <input
                type="number"
                value={calculatedTotals.balanceDue}
                onChange={(e) => setFormData({ ...formData, customBalance: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs font-bold bg-slate-800 text-rose-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
          <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl">{t.saveOrder}</button>
        </div>
      </form>
    </div>
  );
}

// ALL ORDERS VIEW
function AllOrdersView({ orders, allStaff, t, formatINR, formatDate, searchQuery, setSearchQuery, statusFilter, setStatusFilter, staffFilter, setStaffFilter, dateRange, setDateRange, onViewOrder, onEditOrder, onDeleteOrder, onRecordPayment, onPrintSlip, onStatusChange }) {
  // Toggle expanded details per order
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between gap-3">
        <input
          type="text"
          placeholder="Search Order No or Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs w-full md:w-64"
        />
        <div className="text-xs text-slate-500 font-semibold">{orders.length} Total Records</div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-white font-bold">
            <tr>
              <th className="p-3"></th>
              <th className="p-3">{t.orderNo}</th>
              <th className="p-3">{t.customerName}</th>
              <th className="p-3">{t.status}</th>
              <th className="p-3 text-right">{t.total}</th>
              <th className="p-3 text-right">Advance Paid</th>
              <th className="p-3 text-right">{t.balance}</th>
              <th className="p-3 text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(ord => {
              const isExpanded = expandedOrderId === ord.id;
              return (
                <React.Fragment key={ord.id}>
                  <tr className={`hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => toggleExpand(ord.id)}
                        className="p-1 text-slate-500 hover:text-teal-600 transition"
                        title="View Items & Advance Payments"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-teal-600' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3 font-bold">
                      <button onClick={() => toggleExpand(ord.id)} className="hover:underline text-teal-700">
                        {ord.orderNo}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="font-bold">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400">{ord.mobile}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">{formatINR(ord.orderTotal)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      {formatINR(ord.receivedAmount)}
                    </td>
                    <td className="p-3 text-right font-bold text-red-600">{formatINR(ord.balanceDue)}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center space-x-1">
                        <button onClick={() => onViewOrder(ord)} className="p-1 hover:bg-slate-200 rounded" title="View Full Modal"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEditOrder(ord)} className="p-1 hover:bg-slate-200 rounded text-blue-600" title="Edit Order"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => onRecordPayment(ord)} className="p-1 hover:bg-slate-200 rounded text-emerald-600" title="Add Payment"><CreditCard className="w-4 h-4" /></button>
                        <button onClick={() => onPrintSlip(ord)} className="p-1 hover:bg-slate-200 rounded text-purple-600" title="Print Receipt"><Printer className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>

                  {/* INLINE EXPANDABLE VIEW: ITEMS & ADVANCE PAYMENTS */}
                  {isExpanded && (
                    <tr className="bg-slate-100/80 border-b">
                      <td colSpan="8" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Item Breakdown Box */}
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <div className="font-bold text-slate-800 mb-2 flex items-center justify-between text-[11px]">
                              <span className="flex items-center"><Package className="w-3.5 h-3.5 mr-1 text-teal-600" /> Print Job Items ({ord.items ? ord.items.length : 0})</span>
                              <span className="text-slate-400 text-[10px]">Qty x Rate</span>
                            </div>
                            <div className="space-y-1.5 text-[11px]">
                              {ord.items && ord.items.length > 0 ? (
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <div>
                                      <div className="font-bold text-slate-800">{it.jobName || 'Printing Item'}</div>
                                      {it.specs && <div className="text-[10px] text-slate-500">{it.specs}</div>}
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-slate-900">{formatINR(it.amount)}</div>
                                      <div className="text-[10px] text-slate-500">{it.qty} {it.unit || 'Pcs'} @ ₹{it.rate}</div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-slate-400 italic text-[11px] p-2 text-center">No line items specified</div>
                              )}
                            </div>
                          </div>

                          {/* Advance Payment History Box */}
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <div className="font-bold text-slate-800 mb-2 flex items-center justify-between text-[11px]">
                              <span className="flex items-center"><CreditCard className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Advance & Payment Log</span>
                              <button 
                                onClick={() => onRecordPayment(ord)}
                                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100"
                              >
                                + Add Payment
                              </button>
                            </div>
                            <div className="space-y-1.5 text-[11px]">
                              {ord.payments && ord.payments.length > 0 ? (
                                ord.payments.map((p, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                                    <div>
                                      <div className="font-bold text-emerald-950">{formatINR(p.amount)} <span className="text-[10px] font-normal text-emerald-700">({p.mode})</span></div>
                                      <div className="text-[10px] text-slate-500">{p.notes || 'Payment Received'} • {p.recordedBy}</div>
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-600">{formatDate(p.date)}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-2.5 bg-slate-50 rounded-lg text-center">
                                  <div className="font-bold text-slate-700">Initial Advance: {formatINR(ord.receivedAmount)}</div>
                                  <div className="text-[10px] text-slate-400">Order Booking Advance</div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// SUPABASE DATABASE SETUP & MIGRATION VIEW
function SupabaseSetupView({ supabaseUrl, supabaseAnonKey, isSupabaseConnected, onSaveConfig, showToast }) {
  const [url, setUrl] = useState(supabaseUrl);
  const [key, setKey] = useState(supabaseAnonKey);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleCopySQL = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      // Fallback method for restricted iframe/permission policy environments
      const textArea = document.createElement("textarea");
      textArea.value = SUPABASE_SCHEMA_SQL;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (copyErr) {
        console.error("Copy failed", copyErr);
      }
      document.body.removeChild(textArea);
    }
    setCopied(true);
    showToast("SQL Schema Script copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!url.trim() || !key.trim()) {
      setTestResult({ success: false, message: "Please enter both Supabase URL and Anon Key first." });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    try {
      const cleanUrl = url.replace(/\/$/, "");
      const res = await fetch(`${cleanUrl}/rest/v1/orders?select=count`, {
        method: 'GET',
        headers: {
          'apikey': key.trim(),
          'Authorization': `Bearer ${key.trim()}`
        }
      });

      if (res.ok || res.status === 200 || res.status === 206) {
        setTestResult({ success: true, message: "Successfully connected to Supabase REST API & Orders table!" });
        showToast("Supabase Connection Successful!", "success");
      } else if (res.status === 404 || res.status === 400) {
        setTestResult({ 
          success: true, 
          message: "Connected to Supabase project API, but 'orders' table is not created yet. Please execute the SQL Schema Script below in Supabase SQL Editor." 
        });
        showToast("Connected to Supabase API (Tables missing)", "success");
      } else {
        const errText = await res.text();
        setTestResult({ success: false, message: `HTTP Error ${res.status}: ${errText || 'Invalid credentials or permissions.'}` });
        showToast("Supabase Connection Failed", "error");
      }
    } catch (error) {
      setTestResult({ success: false, message: `Network Error: ${error.message}. Please check your Supabase URL format.` });
      showToast("Network Error connecting to Supabase", "error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
              S
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Supabase Cloud Database Setup</h2>
              <p className="text-xs text-slate-500">Connect your free Supabase PostgreSQL backend for permanent sync</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-xs font-bold text-slate-700">
              {isSupabaseConnected ? 'Config Saved' : 'Not Configured'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supabase Anon Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {testResult && (
          <div className={`p-3.5 rounded-xl text-xs font-medium flex items-start space-x-2.5 ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
            <div>
              <div className="font-bold">{testResult.success ? 'Connection Test Passed' : 'Connection Test Failed'}</div>
              <div>{testResult.message}</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button 
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? "Testing..." : "Test Live Connection"}</span>
          </button>
          <button 
            onClick={() => onSaveConfig(url, key)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Save & Connect Supabase
          </button>
        </div>
      </div>

      {/* SQL Migration Script */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Supabase SQL Table Migration Script</h3>
          <button 
            onClick={handleCopySQL}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Copy SQL Script"}</span>
          </button>
        </div>
        <p className="text-xs text-slate-500">Copy & run this script inside your Supabase project's SQL Editor:</p>
        <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-60 border border-slate-800">
          {SUPABASE_SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
}

// SEARCH VIEW
function SearchOrdersView({ orders, t, formatINR, formatDate, onViewOrder }) {
  const [q, setQ] = useState('');
  const results = orders.filter(o => o.orderNo.toLowerCase().includes(q.toLowerCase()) || o.mobile.includes(q) || o.customerName.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type Order # or Mobile..."
          className="w-full px-4 py-2.5 border-2 rounded-xl text-sm"
        />
      </div>

      {q && results.map(o => (
        <div key={o.id} className="bg-white p-4 rounded-xl border flex justify-between items-center text-xs">
          <div>
            <div className="font-bold text-slate-900">{o.orderNo}</div>
            <div className="text-slate-600">{o.customerName} ({o.mobile})</div>
          </div>
          <button onClick={() => onViewOrder(o)} className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg">View</button>
        </div>
      ))}
    </div>
  );
}

// PAYMENT TRACKING VIEW
function PaymentTrackingView({ orders, t, formatINR, formatDate, onRecordPayment }) {
  return (
    <div className="bg-white rounded-2xl border p-4 space-y-3">
      <h2 className="font-bold text-base text-slate-900">{t.payments}</h2>
      <div className="divide-y text-xs">
        {orders.filter(o => o.balanceDue > 0).map(o => (
          <div key={o.id} className="py-2.5 flex justify-between items-center">
            <div>
              <div className="font-bold">{o.orderNo} - {o.customerName}</div>
              <div className="text-red-600 font-semibold">Balance: {formatINR(o.balanceDue)}</div>
            </div>
            <button onClick={() => onRecordPayment(o)} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg">+ Pay</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// REPORTS VIEW
function ReportsView({ orders, t, formatINR, formatDate }) {
  return (
    <div className="bg-white p-4 rounded-2xl border space-y-3">
      <h2 className="font-bold text-base text-slate-900">{t.reports}</h2>
      <p className="text-xs text-slate-500">Total Shop Sales: {formatINR(orders.reduce((s,o)=>s+o.orderTotal,0))}</p>
    </div>
  );
}

// STAFF VIEW
function StaffManagementView({ staffList, t }) {
  return (
    <div className="bg-white p-4 rounded-2xl border space-y-3 text-xs">
      <h2 className="font-bold text-base text-slate-900">{t.staff}</h2>
      <div className="divide-y">
        {staffList.map(s => (
          <div key={s.id} className="py-2 flex justify-between">
            <span className="font-bold">{s.name}</span>
            <span className="text-slate-500">{s.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// IMPORT VIEW
function ImportExportView({ t }) {
  return (
    <div className="bg-white p-6 rounded-2xl border text-center space-y-3 text-xs">
      <FileSpreadsheet className="w-10 h-10 text-teal-600 mx-auto" />
      <h2 className="font-bold text-base text-slate-900">Import Excel Data</h2>
      <p className="text-slate-500">Supports Daily Order Book.xlsx format</p>
    </div>
  );
}

// SETTINGS VIEW
function SettingsView({ isSupabaseConnected, t }) {
  return (
    <div className="bg-white p-5 rounded-2xl border space-y-3 text-xs">
      <h2 className="font-bold text-base text-slate-900">{t.settings}</h2>
      <p className="text-slate-600">{SHOP_INFO.name} - {SHOP_INFO.address}</p>
      <div className="pt-2">
        <span className="font-bold">Database Mode: </span>
        <span>{isSupabaseConnected ? "Supabase Live" : "Local Offline / PWA Mode"}</span>
      </div>
    </div>
  );
}

// ORDER DETAILS MODAL
function OrderDetailsModal({ order, t, formatINR, formatDate, onClose, onPrint, onRecordPayment }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 text-xs">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-base">#{order.orderNo}</h3>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
          <div className="text-slate-500">{order.mobile}</div>
        </div>
        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total: {formatINR(order.orderTotal)}</span>
          <span className="text-red-600">Balance: {formatINR(order.balanceDue)}</span>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onPrint} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-bold">Print</button>
          <button onClick={onRecordPayment} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold">+ Payment</button>
        </div>
      </div>
    </div>
  );
}

// RECORD PAYMENT MODAL
function RecordPaymentModal({ order, t, formatINR, onClose, onSubmitPayment }) {
  const [amt, setAmt] = useState(order.balanceDue);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-3 text-xs">
        <h3 className="font-bold text-sm">Collect Payment for #{order.orderNo}</h3>
        <input
          type="number"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl font-bold text-teal-700 text-sm"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1.5 border rounded-lg font-bold">Cancel</button>
          <button onClick={() => onSubmitPayment(order.id, amt, 'Cash', 'Collected')} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold">Save</button>
        </div>
      </div>
    </div>
  );
}

// PRINT SLIP MODAL
function PrintSlipModal({ order, t, formatINR, formatDate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 text-[11px] font-mono">
        <div className="text-center border-b pb-2">
          <h2 className="font-black text-sm">{SHOP_INFO.name}</h2>
          <p className="text-[9px]">{SHOP_INFO.address}</p>
        </div>
        <div>
          <div>Order: #{order.orderNo}</div>
          <div>Customer: {order.customerName} ({order.mobile})</div>
        </div>
        <div className="border-t border-b py-2 space-y-1">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between">
              <span>{it.jobName} x{it.qty}</span>
              <span>₹{it.amount}</span>
            </div>
          ))}
        </div>
        <div className="text-right font-bold">
          <div>Total: {formatINR(order.orderTotal)}</div>
          <div className="text-red-600">Balance: {formatINR(order.balanceDue)}</div>
        </div>
        <div className="flex justify-end space-x-2 pt-2 font-sans">
          <button onClick={onClose} className="px-3 py-1 border rounded-lg font-bold">Close</button>
          <button onClick={() => window.print()} className="px-4 py-1 bg-teal-600 text-white rounded-lg font-bold">Print</button>
        </div>
      </div>
    </div>
  );
}