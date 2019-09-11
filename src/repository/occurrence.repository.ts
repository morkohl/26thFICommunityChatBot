import {CRUDRepository} from "./repository";
import Occurrence from "../model/occurrence.model";
import {IOccurrenceCreateDto, IOccurrenceSearchDto, IOccurrenceUpdateDto} from "../command/occurrence.dto";
import {Service} from "typedi";

@Service()
export class OccurrenceRepository extends CRUDRepository<Occurrence> {

    constructor() {
        super(Occurrence);
    }

    public async search(dao: IOccurrenceSearchDto): Promise<Occurrence[]> {
        return super.search(dao);
    }

    public async searchOne(dao: IOccurrenceSearchDto): Promise<Occurrence | null> {
        return super.searchOne(dao);
    }

    public async create(dao: IOccurrenceCreateDto): Promise<Occurrence> {
        return super.create(dao);
    }

    public async update(searchDao: IOccurrenceSearchDto, updateDao: IOccurrenceUpdateDto): Promise<Occurrence | null> {
        return super.update(searchDao, updateDao);
    }

    public async delete(dao?: IOccurrenceSearchDto): Promise<number> {
        return super.delete(dao);
    }
}
