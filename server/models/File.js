import mongoose from 'mongoose';
import crypto from 'crypto';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  accessibleTo: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  category: { 
    type: String, 
    enum: ['medical-record', 'lab-result', 'prescription', 'symptom-image', 'other'],
    required: true 
  },
  encryptionKey: { type: String, required: true },
  iv: { type: String, required: true },
  description: String
}, { timestamps: true });

fileSchema.methods.encryptFile = function(buffer) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from(this._id.toString()));
  
  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const authTag = cipher.getAuthTag();
  
  this.encryptionKey = key.toString('hex');
  this.iv = iv.toString('hex');
  
  return Buffer.concat([iv, authTag, encrypted]);
};

fileSchema.methods.decryptFile = function(encryptedBuffer) {
  const algorithm = 'aes-256-gcm';
  
  const iv = encryptedBuffer.slice(0, 16);
  const authTag = encryptedBuffer.slice(16, 32);
  const encrypted = encryptedBuffer.slice(32);
  
  const decipher = crypto.createDecipher(algorithm, Buffer.from(this.encryptionKey, 'hex'));
  decipher.setAAD(Buffer.from(this._id.toString()));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted;
};

export default mongoose.model('File', fileSchema);