import { useState, useEffect } from 'react';
import axios from 'axios';

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const fetchPeople = async () => {
    const res = await axios.get('http://localhost:5000/api/people');
    setPeople(res.data);
  };

  useEffect(() => { fetchPeople(); }, []);

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/people/${deleteModal.id}`);
    setDeleteModal({ show: false, id: null });
    fetchPeople();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/people/${id}`, { 
      full_name: editData.name, 
      email: editData.email 
    });
    setEditingId(null);
    fetchPeople();
  };

 
  const tableContainerStyle = {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#1e1b4b',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#1e1b4b',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #4f46e5',
    maxWidth: '400px'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#818cf8', marginBottom: '30px' }}>Kayıtlı Kişiler</h2>
      
      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#312e81' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Ad Soyad</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>E-posta</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {people.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #312e81' }}>
                <td style={{ padding: '15px' }}>
                  {editingId === p.id ? 
                    <input style={{ backgroundColor: '#4338ca', color: 'white', border: '1px solid #6366f1', padding: '8px', borderRadius: '4px', width: '90%' }} 
                           value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /> 
                    : p.full_name}
                </td>
                <td style={{ padding: '15px' }}>
                  {editingId === p.id ? 
                    <input style={{ backgroundColor: '#4338ca', color: 'white', border: '1px solid #6366f1', padding: '8px', borderRadius: '4px', width: '90%' }} 
                           value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} /> 
                    : p.email}
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  {editingId === p.id ? (
                    <button onClick={() => handleUpdate(p.id)} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>Kaydet</button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingId(p.id); setEditData({ name: p.full_name, email: p.email }) }} 
                              style={{ backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Düzenle</button>
                      <button onClick={() => setDeleteModal({ show: true, id: p.id })} 
                              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Sil</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {}
      {deleteModal.show && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: 'white' }}>Emin misiniz?</h3>
            <p style={{ color: '#cbd5e1' }}>Bu kayıt kalıcı olarak silinecektir.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setDeleteModal({ show: false, id: null })} 
                      style={{ backgroundColor: '#475569', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Vazgeç</button>
              <button onClick={handleDelete} 
                      style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PeopleList;