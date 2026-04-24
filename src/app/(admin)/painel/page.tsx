"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getModules, createModule, createLesson, updateLesson, Module, Lesson } from "@/lib/api";
import styles from "@/styles/admin.module.css";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function AdminDashboardPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Module Form State
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [modulePos, setModulePos] = useState("");
  
  // Lesson Form State (active module id for creation)
  const [activeLessonForm, setActiveLessonForm] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonUrl, setLessonUrl] = useState("");
  const [lessonPos, setLessonPos] = useState("");

  function handleNewLesson(moduleId: number) {
    setLessonTitle("");
    setLessonUrl("");
    setLessonPos("");
    setActiveLessonForm(moduleId);
    setEditingLessonId(null);
  }

  function handleEditClick(lesson: Lesson) {
    setLessonTitle(lesson.title);
    setLessonUrl(lesson.videoUrl);
    setLessonPos(lesson.position.toString());
    setEditingLessonId(lesson.id);
    setActiveLessonForm(null);
  }

  const token = Cookies.get("admin_token");

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getModules(token);
      setModules(data);
    } catch (err) {
      console.error("Failed to fetch modules", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      const position = modulePos ? parseInt(modulePos, 10) : undefined;
      await createModule(token, { title: moduleTitle, description: moduleDesc, position });
      setModuleTitle("");
      setModuleDesc("");
      setModulePos("");
      setShowModuleForm(false);
      fetchModules();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar módulo");
    }
  }

  async function handleSubmitLesson(e: React.FormEvent, moduleId: number) {
    e.preventDefault();
    if (!token) return;
    try {
      const position = lessonPos ? parseInt(lessonPos, 10) : undefined;
      if (editingLessonId) {
        await updateLesson(token, editingLessonId, { title: lessonTitle, videoUrl: lessonUrl, moduleId, position });
      } else {
        await createLesson(token, { title: lessonTitle, videoUrl: lessonUrl, moduleId, position });
      }
      setLessonTitle("");
      setLessonUrl("");
      setLessonPos("");
      setActiveLessonForm(null);
      setEditingLessonId(null);
      fetchModules();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar aula");
    }
  }

  if (loading) {
    return <div>Carregando conteúdo...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gerenciador de Conteúdo</h1>
        <Button onClick={() => setShowModuleForm(!showModuleForm)}>
          {showModuleForm ? "Cancelar" : "+ Novo Módulo"}
        </Button>
      </header>

      {showModuleForm && (
        <form onSubmit={handleAddModule} className={styles.formBox}>
          <h3>Adicionar Novo Módulo</h3>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <Input
                label="Título do Módulo"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                label="Posição (Opcional)"
                type="number"
                value={modulePos}
                onChange={(e) => setModulePos(e.target.value)}
              />
            </div>
          </div>
          <Input
            label="Descrição (Opcional)"
            value={moduleDesc}
            onChange={(e) => setModuleDesc(e.target.value)}
          />
          <div className={styles.actions}>
            <Button type="submit" size="sm">Salvar Módulo</Button>
          </div>
        </form>
      )}

      <div className={styles.modulesList}>
        {modules.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum módulo cadastrado ainda.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Clique em "+ Novo Módulo" para começar.</p>
          </div>
        ) : (
          modules.map((mod) => (
            <div key={mod.id} className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <div className={styles.moduleInfo}>
                  <span className={styles.modulePosition}>Módulo {mod.position}</span>
                  <h2 className={styles.moduleTitle}>{mod.title}</h2>
                  {mod.description && <p className={styles.moduleDesc}>{mod.description}</p>}
                </div>
                <Button size="sm" onClick={() => handleNewLesson(mod.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Nova Aula
                </Button>
              </div>

              {activeLessonForm === mod.id && (
                <form onSubmit={(e) => handleSubmitLesson(e, mod.id)} className={styles.formBox}>
                  <h4>Adicionar Aula ao Módulo: {mod.title}</h4>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <Input
                        label="Título da Aula"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <Input
                        label="Posição (Opcional)"
                        type="number"
                        value={lessonPos}
                        onChange={(e) => setLessonPos(e.target.value)}
                      />
                    </div>
                  </div>
                  <Input
                    label="URL do Vídeo (YouTube/Vimeo)"
                    type="url"
                    value={lessonUrl}
                    onChange={(e) => setLessonUrl(e.target.value)}
                    required
                  />
                  <div className={styles.actions}>
                    <Button type="button" size="sm" onClick={() => setActiveLessonForm(null)} style={{ background: "transparent", color: "var(--text-secondary)" }}>
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm">Salvar Aula</Button>
                  </div>
                </form>
              )}

              {mod.lessons && mod.lessons.length > 0 && (
                <div className={styles.lessonsList}>
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className={styles.lessonItem}>
                      <div className={styles.lessonInfo}>
                        <span className={styles.lessonPosition}>{lesson.position}</span>
                        <span className={styles.lessonTitle}>{lesson.title}</span>
                      </div>
                      
                      <div className={styles.lessonActions}>
                        <button
                          type="button"
                          className={styles.lessonUrl}
                          onClick={() => handleEditClick(lesson)}
                          style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          Editar
                        </button>
                        <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className={styles.lessonUrl}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l-5.94 5.94"/>
                          </svg>
                          Assistir
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário de Edição de Aula (se estiver editando uma aula deste módulo) */}
              {mod.lessons && mod.lessons.some(l => l.id === editingLessonId) && (
                <form onSubmit={(e) => handleSubmitLesson(e, mod.id)} className={styles.formBox} style={{ marginTop: 'var(--space-md)' }}>
                  <h4>Editar Aula</h4>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <Input
                        label="Título da Aula"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <Input
                        label="Posição (Opcional)"
                        type="number"
                        value={lessonPos}
                        onChange={(e) => setLessonPos(e.target.value)}
                      />
                    </div>
                  </div>
                  <Input
                    label="URL do Vídeo (YouTube/Vimeo)"
                    type="url"
                    value={lessonUrl}
                    onChange={(e) => setLessonUrl(e.target.value)}
                    required
                  />
                  <div className={styles.actions}>
                    <Button type="button" size="sm" onClick={() => setEditingLessonId(null)} style={{ background: "transparent", color: "var(--text-secondary)" }}>
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm">Atualizar Aula</Button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
