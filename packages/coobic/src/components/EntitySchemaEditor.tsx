'use client';

import { useState } from 'react';

export interface EntityField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'textarea' | 'select' | 'multiselect' | 'relation';
  required: boolean;
  options?: string[]; // For select/multiselect
  relationConfig?: {
    targetEntity: string; // ID or name of the target entity
    relationType: 'one-to-one' | 'one-to-many' | 'many-to-many';
    displayField?: string; // Which field to display from related entity
  };
  defaultValue?: string | number | boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface EntitySchema {
  id: string;
  name: string;
  description: string;
  fields: EntityField[];
  permissions?: {
    create: string[];
    read: string[];
    update: string[];
    delete: string[];
  };
}

interface Props {
  onBack: () => void;
}

export default function EntitySchemaEditor({ onBack }: Props) {
  const [schemas, setSchemas] = useState<EntitySchema[]>([]);
  const [currentSchema, setCurrentSchema] = useState<EntitySchema | null>(null);
  const [editingField, setEditingField] = useState<EntityField | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  const createNewSchema = () => {
    const newSchema: EntitySchema = {
      id: crypto.randomUUID(),
      name: 'Nuova Entità',
      description: '',
      fields: [],
    };
    setCurrentSchema(newSchema);
  };

  const addField = () => {
    if (!currentSchema) return;
    
    const newField: EntityField = {
      id: crypto.randomUUID(),
      name: 'Nuovo Campo',
      type: 'text',
      required: false,
    };
    
    setCurrentSchema({
      ...currentSchema,
      fields: [...currentSchema.fields, newField],
    });
    setEditingField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<EntityField>) => {
    if (!currentSchema) return;
    
    setCurrentSchema({
      ...currentSchema,
      fields: currentSchema.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
    
    if (editingField?.id === fieldId) {
      setEditingField({ ...editingField, ...updates });
    }
  };

  const deleteField = (fieldId: string) => {
    if (!currentSchema) return;
    
    setCurrentSchema({
      ...currentSchema,
      fields: currentSchema.fields.filter(f => f.id !== fieldId),
    });
    
    if (editingField?.id === fieldId) {
      setEditingField(null);
    }
  };

  const saveSchema = () => {
    if (!currentSchema) return;
    
    const existingIndex = schemas.findIndex(s => s.id === currentSchema.id);
    if (existingIndex >= 0) {
      setSchemas(schemas.map((s, i) => i === existingIndex ? currentSchema : s));
    } else {
      setSchemas([...schemas, currentSchema]);
    }
    
    setCurrentSchema(null);
    setEditingField(null);
  };

  const exportSchema = (schema: EntitySchema) => {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSchema = () => {
    try {
      const schema = JSON.parse(importJson) as EntitySchema;
      schema.id = crypto.randomUUID(); // New ID for imported schema
      setSchemas([...schemas, schema]);
      setImportJson('');
      setShowImport(false);
    } catch (error) {
      alert('JSON non valido. Controlla il formato.');
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'Testo' },
    { value: 'textarea', label: 'Testo Lungo' },
    { value: 'number', label: 'Numero' },
    { value: 'boolean', label: 'Booleano' },
    { value: 'date', label: 'Data' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
    { value: 'select', label: 'Selezione' },
    { value: 'multiselect', label: 'Selezione Multipla' },
    { value: 'relation', label: 'Relazione' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              ← Indietro
            </button>
            <h1 className="text-4xl font-bold">Editor Schemi Entità</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              📥 Importa JSON
            </button>
            <button
              onClick={createNewSchema}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              + Nuova Entità
            </button>
          </div>
        </div>

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Importa Schema JSON</h2>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full h-64 bg-slate-900 text-white p-4 rounded-lg font-mono text-sm"
                placeholder="Incolla qui il JSON dello schema..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={importSchema}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Importa
                </button>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportJson('');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schema List */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Schemi Salvati</h2>
              {schemas.length === 0 ? (
                <p className="text-slate-400 text-sm">Nessuno schema creato ancora</p>
              ) : (
                <div className="space-y-2">
                  {schemas.map(schema => (
                    <div
                      key={schema.id}
                      className="bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          onClick={() => setCurrentSchema({ ...schema })}
                          className="flex-1"
                        >
                          <h3 className="font-semibold">{schema.name}</h3>
                          <p className="text-sm text-slate-400">{schema.fields.length} campi</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportSchema(schema);
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all"
                        >
                          📤
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schema Editor */}
          <div className="lg:col-span-2">
            {currentSchema ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="mb-6">
                  <input
                    type="text"
                    value={currentSchema.name}
                    onChange={(e) => setCurrentSchema({ ...currentSchema, name: e.target.value })}
                    className="text-3xl font-bold bg-transparent border-b border-white/20 focus:border-white/40 outline-none w-full mb-2"
                    placeholder="Nome Entità"
                  />
                  <textarea
                    value={currentSchema.description}
                    onChange={(e) => setCurrentSchema({ ...currentSchema, description: e.target.value })}
                    className="w-full bg-white/5 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descrizione..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Campi ({currentSchema.fields.length})</h3>
                  <button
                    onClick={addField}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                  >
                    + Aggiungi Campo
                  </button>
                </div>

                {/* Fields List */}
                <div className="space-y-3 mb-6">
                  {currentSchema.fields.map(field => (
                    <div
                      key={field.id}
                      className={`bg-white/5 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        editingField?.id === field.id
                          ? 'border-purple-500'
                          : 'border-transparent hover:border-white/20'
                      }`}
                      onClick={() => setEditingField(field)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{field.name}</span>
                            {field.required && (
                              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                                Obbligatorio
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">
                            {fieldTypes.find(t => t.value === field.type)?.label}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteField(field.id);
                          }}
                          className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Field Editor Panel */}
                {editingField && (
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Modifica Campo</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome Campo</label>
                        <input
                          type="text"
                          value={editingField.name}
                          onChange={(e) => updateField(editingField.id, { name: e.target.value })}
                          className="w-full bg-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo</label>
                        <select
                          value={editingField.type}
                          onChange={(e) => updateField(editingField.id, { type: e.target.value as EntityField['type'] })}
                          className="w-full bg-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(editingField.type === 'select' || editingField.type === 'multiselect') && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Opzioni (una per riga)</label>
                          <textarea
                            value={editingField.options?.join('\n') || ''}
                            onChange={(e) => updateField(editingField.id, { 
                              options: e.target.value.split('\n').filter(o => o.trim()) 
                            })}
                            className="w-full bg-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                            rows={4}
                            placeholder="Opzione 1&#10;Opzione 2&#10;Opzione 3"
                          />
                        </div>
                      )}

                      {editingField.type === 'relation' && (
                        <div className="space-y-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Entità Collegata</label>
                            <select
                              value={editingField.relationConfig?.targetEntity || ''}
                              onChange={(e) => updateField(editingField.id, { 
                                relationConfig: {
                                  ...editingField.relationConfig,
                                  targetEntity: e.target.value,
                                  relationType: editingField.relationConfig?.relationType || 'one-to-one',
                                }
                              })}
                              className="w-full bg-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleziona entità...</option>
                              {schemas.map(schema => (
                                <option key={schema.id} value={schema.id}>
                                  {schema.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Tipo di Relazione</label>
                            <select
                              value={editingField.relationConfig?.relationType || 'one-to-one'}
                              onChange={(e) => updateField(editingField.id, { 
                                relationConfig: {
                                  ...editingField.relationConfig,
                                  targetEntity: editingField.relationConfig?.targetEntity || '',
                                  relationType: e.target.value as 'one-to-one' | 'one-to-many' | 'many-to-many',
                                }
                              })}
                              className="w-full bg-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="one-to-one">Uno a Uno</option>
                              <option value="one-to-many">Uno a Molti</option>
                              <option value="many-to-many">Molti a Molti</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Campo da Visualizzare</label>
                            <input
                              type="text"
                              value={editingField.relationConfig?.displayField || ''}
                              onChange={(e) => updateField(editingField.id, { 
                                relationConfig: {
                                  ...editingField.relationConfig,
                                  targetEntity: editingField.relationConfig?.targetEntity || '',
                                  relationType: editingField.relationConfig?.relationType || 'one-to-one',
                                  displayField: e.target.value,
                                }
                              })}
                              className="w-full bg-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="es: name, title, email..."
                            />
                            <p className="text-xs text-slate-400 mt-1">
                              Campo dell&apos;entità collegata da mostrare nella selezione
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="required"
                          checked={editingField.required}
                          onChange={(e) => updateField(editingField.id, { required: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label htmlFor="required" className="text-sm font-medium">
                          Campo Obbligatorio
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex gap-3">
                  <button
                    onClick={saveSchema}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold"
                  >
                    💾 Salva Schema
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSchema(null);
                      setEditingField(null);
                    }}
                    className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-2xl font-semibold mb-2">Nessuno schema selezionato</h3>
                <p className="text-slate-400 mb-6">
                  Crea un nuovo schema o selezionane uno esistente per iniziare
                </p>
                <button
                  onClick={createNewSchema}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold"
                >
                  + Crea Nuovo Schema
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




