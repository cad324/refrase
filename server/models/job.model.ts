import mongoose, { Document, Schema } from 'mongoose';
import CompanyModel, { Company } from './company.model';

export interface JobListing extends Document {
    title: string;
    company: Company;
    posted?: Date;
    description: string;
    location: string;
    status: ListingStatus;
    noOfApplicants: number;
}

type ListingStatus = "active" | "inactive";

const JobListingSchema: Schema<JobListing> = new Schema<JobListing>({
    title: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: CompanyModel
    },
    posted: Date,
    description: String,
    location: String,
    noOfApplicants: Number
});

const JobListingModel = mongoose.model<JobListing>('JobListing', JobListingSchema);

export default JobListingModel;