import {CRUDRepository} from "./repository";
import Occurrence from "../model/occurrence.model";
import {IOccurrenceCreateDao, IOccurrenceSearchDao, IOccurrenceUpdateDao} from "../command/occurrence.dao";
import {Service} from "typedi";

@Service()
export class OccurrenceRepository extends CRUDRepository<Occurrence> {

    constructor() {
        super(Occurrence);
    }

    public async search(dao: IOccurrenceSearchDao): Promise<Occurrence[]> {
        return super.search(dao);
    }

    public async searchOne(dao: IOccurrenceSearchDao): Promise<Occurrence | null> {
        return super.searchOne(dao);
    }

    public async create(dao: IOccurrenceCreateDao): Promise<Occurrence> {
        return super.create(dao);
    }

    public async update(searchDao: IOccurrenceSearchDao, updateDao: IOccurrenceUpdateDao): Promise<Occurrence | null> {
        return super.update(searchDao, updateDao);
    }

    public async delete(dao?: IOccurrenceSearchDao): Promise<number> {
        return super.delete(dao);
    }
}
