'use client';

import { useState, useEffect } from 'react';

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'textarea';
  required: boolean;
}

interface EntitySchema {
  id?: string;
  name: string;
  description: string;
  fields: Field[];
}

interface Props {
  onSave: (schema: EntitySchema) => void;
  editingEntity?: EntitySchema | null;
  onCancel: () => void;
}

export default function EntitySchemaEditor({ onSave, editingEntity, onCancel }: Props) {
  const [entityName, setEntityName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<Field['type']>('text');
  const [fieldRequired, setFieldRequired] = useState(false);

  useEffect(() => {
    if (editingEntity) {
      setEntityName(editingEntity.name);
      setDescription(editingEntity.description);
      setFields(editingEntity.fields);
    }
  }, [editingEntity]);

  const addField = () => {
    if (!fieldName.trim()) return;
    
    const newField: Field = {
      id: Date.now().toString(),
      name: fieldName,
      type: fieldType,
      required: fieldRequired
    };
    
    setFields([...fields, newField]);
    setFieldName('');
    setFieldType('text');
    setFieldRequired(false);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSave = () => {
    if (!entityName.trim() || fields.length === 0) return;
    
    const schema: EntitySchema = {
      ...(editingEntity?.id && { id: editingEntity.id }),
      name: entityName,
      description,
      fields
    };
    
    onSave(schema);
    resetForm();
  };

  const resetForm = () => {
    setEntityName('');
    setDescription('');
    setFields([]);
    setFieldName('');
    setFieldType('text');
    setFieldRequired(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const exportSchema = () => {
    const schema = { name: entityName, description, fields };
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityName || 'entity'}-schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const schema = JSON.parse(event.target?.result as string);
        setEntityName(schema.name || '');
        setDescription(schema.description || '');
        setFields(schema.fields || []);
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editingEntity ? 'Edit Entity' : 'Create Entity'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportSchema}
            disabled={!entityName || fields.length === 0}
            className="px-3 py-1 text-sm bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export JSON
          </button>
          <label className="px-3 py-1 text-sm bg-green-500/20 text-green-200 rounded-lg hover:bg-green-500/30 cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={importSchema}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Entity Name</label>
          <input
            type="text"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            placeholder="e.g., Customer, Product, Order"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this entity..."
            rows={2}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-semibold text-white mb-3">Fields</h3>
          
          <div className="grid grid-cols-12 gap-2 mb-3">
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Field name"
              className="col-span-5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as Field['type'])}
              className="col-span-4 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
            </select>
            <label className="col-span-2 flex items-center text-sm text-slate-200">
              <input
                type="checkbox"
                checked={fieldRequired}
                onChange={(e) => setFieldRequired(e.target.checked)}
                className="mr-1"
              />
              Required
            </label>
            <button
              onClick={addField}
              className="col-span-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium"
            >
              +
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <span className="text-white font-medium">{field.name}</span>
                  <span className="text-slate-400 text-sm ml-3">
                    {field.type}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </span>
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={!entityName.trim() || fields.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingEntity ? 'Update Entity' : 'Create Entity'}
          </button>
          {editingEntity && (
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-500/20 text-slate-200 rounded-lg font-semibold hover:bg-slate-500/30"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

