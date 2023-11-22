import mongoose from 'mongoose';

// Esquema para a vitrine na página inicial
const featuredProductsSchema = new mongoose.Schema({
    offer: {
      type: String,
      enum: ['promocao', 'recomendados'],
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});



const FeaturedProduct = mongoose.model('FeaturedProduct', featuredProductsSchema);

export default FeaturedProduct;