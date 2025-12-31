'use client';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

interface Entity {
  id: string;
  name: string;
  description: string;
  fields: Field[];
}

interface Props {
  entities: Entity[];
  onEdit: (entity: Entity) => void;
  onDelete: (id: string) => void;
}

export default function EntityList({ entities, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Your Entities</h2>
      
      {entities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-slate-300 text-lg">No entities yet</p>
          <p className="text-slate-400 text-sm mt-2">Create your first entity to get started</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{entity.name}</h3>
                  {entity.description && (
                    <p className="text-slate-400 text-sm mt-1">{entity.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(entity)}
                    className="px-3 py-1 text-sm bg-blue-500/20 text-blue-200 rounded hover:bg-blue-500/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(entity.id)}
                    className="px-3 py-1 text-sm bg-red-500/20 text-red-200 rounded hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Fields ({entity.fields.length})</p>
                <div className="grid grid-cols-2 gap-2">
                  {entity.fields.map((field) => (
                    <div
                      key={field.id}
                      className="bg-white/5 px-3 py-2 rounded text-sm border border-white/5"
                    >
                      <span className="text-white font-medium">{field.name}</span>
                      <span className="text-slate-400 text-xs ml-2">
                        {field.type}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

