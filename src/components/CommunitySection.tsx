import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, Tag, Search, Sparkles, Send, MapPin, Award, Users } from 'lucide-react';

export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState<'forum' | 'kolaborasi' | 'heroes' | 'event'>('forum');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive forum state
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      author: 'Ahmad Fauzi (Kopi Temanggung)',
      avatar: 'A',
      tag: 'Legalitas',
      content: 'Teman-teman regional Jawa Tengah, apakah ada yang sedang mengurus sertifikat Halal Self-Declare bulan ini? Kemarin draf saya sempat dikembalikan karena penamaan bahan baku bumbu kurang detail. Ada tips?',
      likes: 12,
      hasLiked: false,
      replies: 5,
      time: '3 jam lalu'
    },
    {
      id: 2,
      author: 'Ibu Ratna (Keripik Singkong Renyah)',
      avatar: 'R',
      tag: 'Digitalisasi',
      content: 'Alhamdulillah, setelah dapet materi kasir digital kemarin, saya coba pasang QRIS di warung. Pembeli anak muda seneng banget ga usah cari kembalian receh lagi! Sangat merekomendasikan POS Kasir Pintar gratisan.',
      likes: 24,
      hasLiked: true,
      replies: 12,
      time: 'Yesterday'
    }
  ]);
  const [newPostText, setNewPostText] = useState('');

  // Collaboration posts
  const collaborationPosts = [
    {
      title: 'Mencari Reseller Sambal Wilayah Surabaya',
      author: 'Siti Rahmawati (Rasa Nusantara)',
      type: 'Kemitraan',
      desc: 'Membuka slot reseller kuliner sambal kemasan botol. Harga grosir sangat kompetitif, margin hingga 30% bagi mitra berlisensi.'
    },
    {
      title: 'Butuh Supplier Kemasan Botol Kaca Grosir',
      author: 'Budi Hartono (Saus Alami)',
      type: 'Pasokan',
      desc: 'Dibutuhkan suplai botol kaca sterilisasi ukuran 150ml kapasitas 2.000 pcs per bulan untuk regional Solo/Semarang.'
    }
  ];

  const handleLike = (id: number) => {
    setForumPosts(forumPosts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: forumPosts.length + 1,
      author: 'Siti Rahmawati (Rasa Nusantara)',
      avatar: 'S',
      tag: 'Diskusi Umum',
      content: newPostText,
      likes: 0,
      hasLiked: false,
      replies: 0,
      time: 'Baru saja'
    };

    setForumPosts([newPost, ...forumPosts]);
    setNewPostText('');
  };

  return (
    <div id="community-section-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Komunitas UMK Academy</h2>
          <p className="text-xs text-gray-500">Kamar dagang digital & jejaring sosial alumni pembinaan TJSL Pertamina se-Indonesia</p>
        </div>

        {/* View switcher tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border space-x-1">
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'forum' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Forum Tanya Jawab
          </button>
          <button
            onClick={() => setActiveTab('kolaborasi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'kolaborasi' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Peluang Kolaborasi
          </button>
          <button
            onClick={() => setActiveTab('heroes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'heroes' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            UMK Heroes (Success Story)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Area (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* SEARCH BAR */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik diskusi, produk kolaborasi, atau alumni sukses..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 shadow-sm rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0072BC]"
            />
          </div>

          {/* VIEW: FORUM DISKUSI */}
          {activeTab === 'forum' && (
            <div className="space-y-4">
              {/* Post writing widget */}
              <form onSubmit={handleAddPost} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <span className="font-bold text-xs text-gray-700 block">Mulai Diskusi Baru</span>
                <div className="flex space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#0072BC] text-white flex items-center justify-center font-bold">
                    S
                  </div>
                  <div className="flex-grow flex flex-col space-y-2">
                    <textarea
                      rows={2}
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder="Bagikan tips usaha, tanyakan kendala legalitas, atau sapa rekan UMK lainnya..."
                      className="w-full p-2 bg-gray-50 border rounded-xl text-xs text-gray-800 focus:outline-none"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">Gunakan tagar #Halal #NIB #Pemasaran</span>
                      <button
                        type="submit"
                        className="bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold px-4 py-1.5 rounded-lg flex items-center space-x-1"
                      >
                        <Send className="h-3 w-3" />
                        <span>Kirim Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Discussion lists */}
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <div key={post.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs leading-relaxed">
                    <div className="flex justify-between items-start text-xs">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0072BC] font-black flex items-center justify-center border">
                          {post.avatar}
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800">{post.author}</h5>
                          <span className="text-[9px] text-gray-400">{post.time}</span>
                        </div>
                      </div>

                      <span className="text-[9px] font-bold bg-blue-50 text-[#0072BC] px-2 py-0.5 rounded">
                        #{post.tag}
                      </span>
                    </div>

                    <p className="text-gray-600 font-sans">{post.content}</p>

                    <div className="pt-2 border-t flex space-x-4 text-xs text-gray-400">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1.5 font-bold transition ${
                          post.hasLiked ? 'text-[#0072BC]' : 'hover:text-gray-600'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} Suka</span>
                      </button>

                      <span className="flex items-center space-x-1.5 font-medium">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replies} Balasan</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: KOLABORASI BISNIS */}
          {activeTab === 'kolaborasi' && (
            <div className="space-y-4 text-xs">
              {collaborationPosts.map((col, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 leading-relaxed">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{col.type}</span>
                      <h4 className="font-black text-sm text-gray-800 mt-1">{col.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Dibuat oleh: {col.author}</p>
                    </div>
                    <span className="bg-green-50 text-green-600 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Buka Kemitraan</span>
                  </div>

                  <p className="text-gray-600">{col.desc}</p>

                  <div className="pt-2 border-t flex justify-end">
                    <button className="bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold text-[10px] px-3.5 py-1 rounded-lg">
                      Hubungi Melalui WA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: UMK HEROES */}
          {activeTab === 'heroes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
                  alt="Hero 1"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-2">
                  <span className="text-[9px] bg-amber-50 text-amber-600 font-extrabold px-2 py-0.5 rounded uppercase flex items-center w-max gap-1">
                    <Award className="h-3 w-3" />
                    <span>Lulusan Terbaik 2024</span>
                  </span>
                  <h4 className="font-bold text-sm text-gray-800">Ibu Sri Handayani (Batik Sri Kencono)</h4>
                  <p className="text-gray-500 leading-normal">
                    &ldquo;Berawal dari industri batik rumahan di Solo, setelah mengikuti UMK Academy, kami dibina standarisasi ekspor dan berhasil mengirim kontainer perdana ke Jepang.&rdquo;
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
                  alt="Hero 2"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-2">
                  <span className="text-[9px] bg-green-50 text-green-600 font-extrabold px-2 py-0.5 rounded uppercase flex items-center w-max gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Go Global Champion</span>
                  </span>
                  <h4 className="font-bold text-sm text-gray-800">Bapak Heri (Keripik Tempe Rejeki)</h4>
                  <p className="text-gray-500 leading-normal">
                    &ldquo;Dulu kemasan kami plastik tipis kiloan biasa. Berkat bimbingan packaging modern di Academy, sekarang keripik tempe kami dipajang di Bright Store seluruh Jawa Tengah!&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community sidebar (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-4 text-xs font-sans">
          
          {/* Class Rep Info */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider border-b pb-2">Komite Kelas Semarang</h4>
            
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">
                P
              </div>
              <div>
                <p className="font-bold text-gray-800">Prasetyo Utomo</p>
                <p className="text-[10px] text-gray-400 font-medium">Ketua Paguyuban Regional</p>
              </div>
            </div>

            <p className="text-gray-500 leading-normal">
              Butuh koordinasi pameran lokal Jawa Tengah? Hubungi ketua paguyuban regional Anda untuk bergabung di grup WhatsApp resmi.
            </p>

            <button className="w-full bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-[#16365C] font-black py-2 rounded-xl transition text-center shadow-sm">
              Hubungi Paguyuban
            </button>
          </div>

          {/* Quick FAQ / Code of Conduct */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-gray-500 leading-normal">
            <span className="font-bold text-xs text-gray-700 block mb-1">Panduan Komunitas</span>
            <p>1. Saling menghormati sesama pengusaha mikro.</p>
            <p>2. Dilarang memposting tautan politik atau spamming.</p>
            <p>3. Prioritaskan gotong royong dan kemitraan pasokan lokal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
