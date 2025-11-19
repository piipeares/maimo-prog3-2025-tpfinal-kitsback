import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CamisetaSchema = new Schema({
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

export default mongoose.model('Camiseta', CamisetaSchema, 'Camisetas');