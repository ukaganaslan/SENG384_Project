import { useState } from 'react';
import axios from 'axios';

function Form() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ msg: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim()) {
      setStatus({ msg: 'Lütfen hem isim hem de e-posta alanını doldurun! ⚠️', type: 'error' });
      setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/people', { 
        full_name: fullName, 
        email: email 
      });
      
      setStatus({ msg: 'Kişi başarıyla kaydedildi! 🎉', type: 'success' });
      setFullName(''); 
      setEmail('');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setStatus({ msg: 'Bu e-posta adresi zaten sistemde kayıtlı! ❌', type: 'error' });
      } else {
        setStatus({ msg: 'Sunucu hatası oluştu, lütfen tekrar deneyin. ⚠️', type: 'error' });
      }
    }

    setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', backgroundColor: '#1e1b4b', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
      <h2 style={{ textAlign: 'center', color: '#818cf8', marginBottom: '20px' }}>Yeni Kişi Ekle</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Ad Soyad" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #312e81', backgroundColor: '#312e81', color: 'white', outline: 'none' }} 
        />
        <input 
          placeholder="E-posta" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #312e81', backgroundColor: '#312e81', color: 'white', outline: 'none' }} 
        />
        <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
          Kaydet
        </button>
      </form>

      {status.msg && (
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          fontWeight: '600',
          fontSize: '0.9rem',
          backgroundColor: status.type === 'success' ? '#065f46' : '#991b1b',
          color: 'white',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}>
          {status.msg}
        </div>
      )}
    </div>
  );
}

export default Form;