import mongoose, { Document, Schema } from 'mongoose';
import JobListingModel, { JobListing } from './job.model';

export interface Company extends Document {
    name: string;
    description: string;
    location: string;
    listings?: JobListing[]
}

const CompanySchema = new Schema<Company>({
    name: String,
    description: String,
    location: String,
    listings: [
        {
            type: Schema.Types.ObjectId,
            ref: JobListingModel
        }
    ]
});

const CompanyModel = mongoose.model<Company>('Company', CompanySchema);

export default CompanyModel;