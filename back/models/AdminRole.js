import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de cargos
const adminRoleSchema = new Schema({
  admin_id: {
    type: Schema.Types.ObjectId,
    ref: 'Admin', // Referência ao modelo de usuário (Admin)
    required: true,
  },
  role_id: {
    type: Schema.Types.ObjectId,
    ref: 'Roles',
    require: true,
  }
});

// Método personalizado para buscar o usuário e cargo
adminRoleSchema.statics.findAdminAndRole = async function (adminId) {
  try {
    const result = await this.aggregate([
      {
        '$match': { 'admin_id': new mongoose.Types.ObjectId(adminId) } // busca pelo adminId
      }, {
        '$lookup': { // relaciona a collection admin
          'from': 'admins', 
          'localField': 'admin_id', 
          'foreignField': '_id', 
          'as': 'admin'
        }
      }, {
        '$lookup': { // relaciona a collection role
          'from': 'roles', 
          'localField': 'role_id', 
          'foreignField': '_id', 
          'as': 'role'
        }
      }, {
        '$unwind': '$admin' // Transforma o array 'admin' em objeto
      }, {
        '$unwind': '$role' // Transforma o array 'role' em objeto
      }, { 
        '$project': { // exclui todos os campos abaixo
          'admin_id': 0,
          'role_id': 0,
          'admin.password': 0,
        }
      },
    ]);
    return result
  } catch (error) {
    throw error;
  }
};

// Criação e exportação do modelo de cargos
const AdminRole = mongoose.model('AdminRole', adminRoleSchema);

export default AdminRole;
