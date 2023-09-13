import { Schema } from "mongoose";

function softDeletePlugin(schema: Schema){
    schema.add({
        deleted_at: { type: Date, default: null },
    });

    // Override default deleteOne method
    schema.statics.deleteOne = function (conditions, callback) {
        return this.updateOne(conditions, { deleted_at: new Date() }, callback);
    };
    
    // Override default deleteMany method
    schema.statics.deleteMany = async function (conditions, callback) {
        const result = await this.updateMany(conditions, { deleted_at: new Date() });
        if (callback) {
            callback(null, result);
        }
        return result;
    };

    // Override default findByIdAndRemove method
    schema.statics.findByIdAndDelete = function (id, callback) {
    return this.findByIdAndUpdate(id, { deleted_at: new Date() }, callback);
    };


    // Custom method to restore a soft-deleted document
    schema.methods.restore = function () {
    this.set('deleted_at', null);
    return this.save();
    };

    // Set default filter to exclude soft-deleted documents 
    schema.pre('find', function () {
    this.where({ deleted_at: null });
    });
    schema.pre('findOne', function () {
    this.where({ deleted_at: null });
    });
    schema.pre('findOneAndUpdate', function () {
    this.where({ deleted_at: null });
    });
    schema.pre('findOneAndRemove', function () {
    this.where({ deleted_at: null });
    });
    schema.pre('updateMany', function () {
    this.where({ deleted_at: null });
    });
    schema.pre('updateOne', function () {
    this.where({ deleted_at: null });
    });
    schema.pre('count', function () {
    this.where({ deleted_at: null });
    });    
}

export default softDeletePlugin;