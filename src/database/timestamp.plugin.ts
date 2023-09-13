import { Schema } from 'mongoose';

function timestampPlugin(schema: Schema) {
  schema.add({
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });

  schema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
  });

}

export default timestampPlugin;