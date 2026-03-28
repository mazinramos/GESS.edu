import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  deleteDoc, doc, query, orderBy 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';
import { 
  BookOpen, Video, FileText, FileQuestion, 
  Plus, Trash2, LogOut, ChevronLeft, 
  GraduationCap, FolderOpen, 
  User, Lock, Settings, LayoutDashboard, X, ShieldCheck,
  Search, Bell, Menu
} from 'lucide-react';

// --- استبدل هذه القيم ببيانات Firebase الحقيقية الخاصة بك ---
const firebaseConfig = {
  apiKey: "AIzaSyB...", // الصق الـ API Key الحقيقي هنا
  authDomain: "gess-edu.firebaseapp.com",
  projectId: "gess-edu",
  storageBucket: "gess-edu.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = 'gess-edu-platform';

const GESS_LOGO = "https://i.ibb.co/L6V2M7Q/GESS-Logo.png";

export default function App() {
  const [user, setUser] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login'); 
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  
  const [path, setPath] = useState([]); 
  const [contents, setContents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const years = [1, 2, 3, 4, 5].map(y => ({ id: y, title: `السنة ${y === 1 ? 'الأولى' : y === 2 ? 'الثانية' : y === 3 ? 'الثالثة' : y === 4 ? 'الرابعة' : 'الخامسة'}` }));
  const semesters = [{ id: 1, title: 'السمستر الأول' }, { id: 2, title: 'السمستر الثاني' }];

  useEffect(() => {
    const initAuth = async () => { 
        try {
            await signInAnonymously(auth); 
        } catch (e) {
            console.error("Auth Error", e);
        }
    };
    initAuth();
    onAuthStateChanged(auth, setUser);

    // ملاحظة: تأكد أنك أنشأت الـ Collection في Firebase بنفس المسار
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'materials'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setContents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Error:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.password.value === "Hala@123") {
      setStudentName(e.target.name.value);
      setIsLoggedIn(true);
      setView('student');
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  };

  const checkAdminAuth = (e) => {
    e.preventDefault();
    if (adminPassInput === "Hala@123") {
      setView('admin');
      setShowAdminAuth(false);
      setAdminPassInput("");
      setPath([]);
    } else {
      alert("كلمة مرور الإدارة خاطئة!");
    }
  };

  const addMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'materials'), {
      ...data,
      yearId: parseInt(data.yearId),
      semesterId: parseInt(data.semesterId),
      createdAt: new Date().toISOString()
    });
    e.target.reset();
    alert("تمت إضافة المادة بنجاح!");
  };

  if (view === 'login') return (
    <div dir="rtl" className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#f58220]/10 mix-blend-multiply z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?q=80&w=1600&auto=format&fit=crop" 
          className="w-full h-full object-cover blur-md scale-110" 
          alt="Khartoum University Background"
        />
      </div>

      <div className="relative z-20 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 animate-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2 mb-4 border-2 border-[#f58220]">
            <img src={GESS_LOGO} className="w-full h-full object-contain rounded-full" alt="GESS Logo" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">GESS EDU PLATFORM</h1>
          <p className="text-[#f58220] font-bold text-sm tracking-widest mt-1">هندسة الجيوماتيك - جامعة الخرطوم</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <div className="relative group">
              <User className="absolute right-4 top-4 text-gray-400 group-focus-within:text-[#f58220] transition-colors" size={20} />
              <input name="name" required placeholder="اسم المستخدم" className="w-full pr-12 p-4 bg-white border-2 border-transparent focus:border-[#f58220] rounded-2xl outline-none font-bold shadow-inner transition-all" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute right-4 top-4 text-gray-400 group-focus-within:text-[#f58220] transition-colors" size={20} />
              <input name="password" type="password" required placeholder="كلمة المرور" className="w-full pr-12 p-4 bg-white border-2 border-transparent focus:border-[#f58220] rounded-2xl outline-none font-bold shadow-inner transition-all" />
            </div>
          </div>
          <button className="w-full bg-[#f58220] text-white p-4 rounded-2xl font-black shadow-lg shadow-[#f58220]/30 hover:bg-[#d96e1a] hover:-translate-y-1 transition-all">دخول للمنصة</button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-xs font-medium uppercase tracking-tighter">Geomatics Engineering Students Society</p>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#fafafa] font-sans text-gray-900 pb-20">
      {showAdminAuth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-[#f58220] flex items-center gap-2"><ShieldCheck size={20}/> الإدارة فقط</h3>
               <button onClick={() => setShowAdminAuth(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={checkAdminAuth} className="space-y-4">
              <p className="text-xs text-gray-500 font-bold leading-relaxed">يرجى إدخال كلمة المرور الخاصة بالمشرف للوصول للوحة التحكم والتعديلات.</p>
              <input 
                type="password" 
                autoFocus
                placeholder="كلمة المرور" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f58220] outline-none font-bold text-center transition-all"
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
              />
              <button className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black hover:bg-black transition-all">تأكيد الهوية</button>
            </form>
          </div>
        </div>
      )}

      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setView('student'); setPath([]); setSelectedItem(null);}}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-100 rounded-lg p-1">
              <img src={GESS_LOGO} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-black leading-none text-gray-800">GESS EDU</h1>
              <p className="text-[10px] text-[#f58220] font-bold mt-1">نحو آفاق هندسية أوسع</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-[#f58220]/5 px-4 py-2 rounded-xl border border-[#f58220]/10 text-[#f58220]">
              <User size={16} />
              <span className="text-sm font-black italic">{studentName}</span>
            </div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              <button 
                onClick={() => view === 'admin' ? setView('student') : setShowAdminAuth(true)}
                className={`p-2 sm:p-3 rounded-lg transition-all ${view === 'admin' ? 'bg-[#f58220] text-white shadow-md' : 'text-gray-400 hover:text-[#f58220]'}`}
                title="لوحة التحكم"
              >
                <Settings size={20} />
              </button>
              <button onClick={() => window.location.reload()} className="p-2 sm:p-3 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="خروج"><LogOut size={20} /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'admin' ? (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-top-4 duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                 <div className="bg-[#f58220]/10 p-3 rounded-2xl text-[#f58220]"><LayoutDashboard size={24}/></div>
                 <h2 className="text-xl font-black">مركز التحكم - إضافة المحتوى</h2>
              </div>
              <form onSubmit={addMaterial} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase mr-2">اسم المادة</label><input name="subject" required placeholder="مثلاً: جيوديسيا" className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-[#f58220]" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase mr-2">عنوان الدرس</label><input name="title" required placeholder="مثلاً: مقدمة المساحة" className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-[#f58220]" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase mr-2">الرابط المباشر</label><input name="url" required placeholder="YouTube / Drive Link" className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-[#f58220] text-left" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase mr-2">السنة الدراسية</label><select name="yearId" className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold">{years.map(y => <option key={y.id} value={y.id}>{y.title}</option>)}</select></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase mr-2">السمستر</label><select name="semesterId" className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold">{semesters.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase mr-2">نوع المحتوى</label><select name="type" className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold"><option value="video">محاضرة فيديو</option><option value="pdf">ملف ملخص / شيت</option><option value="exam">نموذج امتحان سابق</option></select></div>
                <button className="col-span-full bg-[#f58220] text-white p-5 rounded-[1.5rem] font-black shadow-xl shadow-[#f58220]/20 hover:bg-[#d96e1a] transition-all mt-4">نشر المحتوى لجميع الطلاب</button>
              </form>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center"><h3 className="font-black text-gray-700">المواد الحالية بالمنصة ({contents.length})</h3><div className="text-xs text-[#f58220] font-bold">نظام الربط التلقائي فعّال ✅</div></div>
                <div className="divide-y divide-gray-50">
                   {contents.map(item => (
                     <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${item.type === 'video' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>{item.type === 'video' ? <Video size={20}/> : <FileText size={20}/>}</div>
                          <div><p className="font-bold text-gray-800">{item.subject} <span className="text-gray-300 font-normal px-1">|</span> {item.title}</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">سنة {item.yearId} • سمستر {item.semesterId} • {item.type}</p></div>
                       </div>
                       <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'materials', item.id))} className="text-red-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                     </div>
                   ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            {(path.length > 0 || selectedItem) && (
              <button onClick={() => selectedItem ? setSelectedItem(null) : setPath(path.slice(0, -1))} className="mb-8 flex items-center gap-2 text-[#f58220] font-black bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
                <ChevronLeft className="rotate-180" size={20} /> رجوع للخلف
              </button>
            )}
            {path.length === 0 && !selectedItem && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {years.map(y => (
                  <button key={y.id} onClick={() => setPath([{type: 'year', ...y}])} className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#f58220]/20 hover:-translate-y-2 transition-all group text-right relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#f58220]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                    <div className="bg-[#f58220]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#f58220] mb-8 group-hover:bg-[#f58220] group-hover:text-white transition-all duration-500 shadow-inner"><GraduationCap size={32} /></div>
                    <h3 className="text-2xl font-black text-gray-800">{y.title}</h3>
                    <p className="text-gray-400 text-sm mt-2 font-medium">عرض الفصول الدراسية والمواد</p>
                  </button>
                ))}
              </div>
            )}
            {path.length === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {semesters.map(s => (
                  <button key={s.id} onClick={() => setPath([...path, {type: 'semester', ...s}])} className="bg-white p-16 rounded-[3rem] border-2 border-transparent hover:border-[#f58220] shadow-xl text-center group transition-all">
                    <div className="w-24 h-24 bg-[#f58220]/5 rounded-full flex items-center justify-center mx-auto mb-8 text-[#f58220] group-hover:rotate-12 transition-all"><BookOpen size={48} /></div>
                    <h3 className="text-3xl font-black text-gray-800">{s.title}</h3>
                  </button>
                ))}
              </div>
            )}
            {path.length === 2 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from(new Set(contents.filter(c => c.yearId === path[0].id && c.semesterId === path[1].id).map(c => c.subject))).map(sub => (
                  <button key={sub} onClick={() => setPath([...path, {type: 'subject', title: sub}])} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:bg-[#f58220]/5 transition-all text-center group">
                    <FolderOpen size={40} className="mx-auto mb-4 text-[#f58220]/30 group-hover:text-[#f58220] transition-colors" />
                    <span className="font-black text-gray-700 block text-lg">{sub}</span>
                  </button>
                ))}
              </div>
            )}
            {path.length === 3 && !selectedItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {contents.filter(c => c.yearId === path[0].id && c.semesterId === path[1].id && c.subject === path[2].title).map(item => (
                  <button key={item.id} onClick={() => setSelectedItem(item)} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all group text-right">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${item.type === 'video' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>{item.type === 'video' ? <Video size={30} /> : <FileText size={30} />}</div>
                      <div><h4 className="font-black text-xl text-gray-800">{item.title}</h4></div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-[#f58220] group-hover:text-white transition-all shadow-inner"><ChevronLeft size={20} /></div>
                  </button>
                ))}
              </div>
            )}
            {selectedItem && (
              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
                   <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full border border-gray-200 p-1 bg-white"><img src={GESS_LOGO} className="w-full h-full object-contain" /></div><span className="text-xs font-black text-gray-500">{selectedItem.subject}</span></div>
                   <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
                </div>
                {selectedItem.type === 'video' ? (
                  <div className="aspect-video bg-black relative"><iframe src={selectedItem.url.replace("watch?v=", "embed/")} className="w-full h-full border-none" allowFullScreen></iframe></div>
                ) : (
                  <div className="py-24 px-10 text-center bg-gradient-to-br from-[#f58220]/5 to-transparent">
                    <FileText size={100} className="mx-auto text-[#f58220]/20 mb-8" />
                    <h3 className="text-2xl font-black mb-2">{selectedItem.title}</h3>
                    <a href={selectedItem.url} target="_blank" rel="noreferrer" className="bg-[#f58220] text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-[#f58220]/30 hover:scale-105 transition-transform inline-flex items-center gap-3"><Plus size={24}/> فتح الملف الآن</a>
                  </div>
                )}
                <div className="p-10 border-t border-gray-50">
                  <h2 className="text-4xl font-black text-gray-900 leading-tight">{selectedItem.title}</h2>
                  <p className="mt-4 text-gray-500 font-medium leading-relaxed max-w-2xl">تم رفع هذا المحتوى بواسطة قسم هندسة الجيوماتيك - جامعة الخرطوم لخدمة الطلاب أكاديمياً.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-white/50 backdrop-blur-md border-t border-gray-100 flex items-center justify-center px-4">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">GESS • University of Khartoum • Faculty of Engineering</p>
      </footer>
    </div>
  );
}

