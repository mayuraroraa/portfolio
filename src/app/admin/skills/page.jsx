'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, FolderPlus, X } from 'lucide-react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Skill form state
  const [skillForm, setSkillForm] = useState({
    name: '',
    categoryId: 'frontend',
    proficiencyLabel: 'Comfortable',
    sortOrder: 1,
    status: 'published'
  });

  // Cat form state
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    sortOrder: 1
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddSkill = (catId = 'frontend') => {
    setEditingSkill(null);
    setSkillForm({
      name: '',
      categoryId: catId,
      proficiencyLabel: 'Comfortable',
      sortOrder: skills.filter(s => s.categoryId === catId).length + 1,
      status: 'published'
    });
    setIsSkillModalOpen(true);
  };

  const openEditSkill = (s) => {
    setEditingSkill(s);
    setSkillForm({
      name: s.name,
      categoryId: s.categoryId,
      proficiencyLabel: s.proficiencyLabel || 'Comfortable',
      sortOrder: s.sortOrder || 1,
      status: s.status || 'published'
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      const url = editingSkill ? `/api/admin/skills/${editingSkill._id || editingSkill.name}` : '/api/admin/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillForm)
      });

      if (res.ok) {
        setIsSkillModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (s) => {
    if (!confirm(`Remove skill "${s.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/skills/${s._id || s.name}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm)
      });
      if (res.ok) {
        setIsCatModalOpen(false);
        setCatForm({ name: '', description: '', sortOrder: categories.length + 1 });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (c) => {
    if (!confirm(`Delete category "${c.name}"? Skills under this category should be reassigned.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${c._id || c.id || c.slug}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Skills & Technologies</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Configure categorized skills, proficiency badges, and display orders for the /skills page.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => setIsCatModalOpen(true)}>
            <FolderPlus size={16} /> New Category
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => openAddSkill()}>
            <Plus size={16} /> Add Skill
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          Loading skills from database...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categories.map((cat) => {
            const catSkills = skills.filter(s => s.categoryId === (cat.id || cat.slug || cat._id));
            return (
              <div key={cat.id || cat.slug || cat._id} className="admin-panel">
                <div className="admin-panel-header" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{cat.name}</h2>
                    {cat.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{cat.description}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                      className="admin-btn admin-btn-outline" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => openAddSkill(cat.id || cat.slug)}
                    >
                      <Plus size={13} /> Add into {cat.name}
                    </button>
                    <button 
                      className="admin-icon-btn" 
                      style={{ width: '30px', height: '30px' }}
                      onClick={() => handleDeleteCategory(cat)} 
                      title="Delete category"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                  {catSkills.map((skill) => (
                    <div 
                      key={skill._id || skill.name}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--admin-input-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{skill.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {skill.proficiencyLabel || 'Comfortable'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="admin-icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => openEditSkill(skill)}>
                          <Edit2 size={13} />
                        </button>
                        <button className="admin-icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => handleDeleteSkill(skill)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {catSkills.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', color: 'var(--admin-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      No skills added in this category yet. Click "Add into {cat.name}" to add one.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isSkillModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsSkillModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button className="admin-icon-btn" onClick={() => setIsSkillModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill}>
              <div className="admin-form-group">
                <label className="admin-form-label">Skill Name</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. Next.js, Docker, WebGL"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  className="admin-select"
                  value={skillForm.categoryId}
                  onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c.id || c.slug} value={c.id || c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Proficiency Label</label>
                  <select
                    className="admin-select"
                    value={skillForm.proficiencyLabel}
                    onChange={(e) => setSkillForm({ ...skillForm, proficiencyLabel: e.target.value })}
                  >
                    <option value="Comfortable">Comfortable</option>
                    <option value="Practicing">Practicing</option>
                    <option value="Learning">Learning</option>
                    <option value="Mastered">Mastered</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={skillForm.sortOrder}
                    onChange={(e) => setSkillForm({ ...skillForm, sortOrder: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsSkillModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingSkill ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCatModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add Skill Category</h2>
              <button className="admin-icon-btn" onClick={() => setIsCatModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCategory}>
              <div className="admin-form-group">
                <label className="admin-form-label">Category Name</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. AI & Machine Learning"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description (optional)</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Summary of this technical domain..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsCatModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
