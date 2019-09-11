import BaseModel from "../model/model.base";
import {IBasicSearchDto} from "../command/dto";
import {NonAbstractTypeOfModel, Scope} from "../util/types/modelUtilTypes.type";

export class CRDRepository<Model extends BaseModel<Model>> {

    constructor(protected model: NonAbstractTypeOfModel<Model>) {
        this.model = model;
    }

    /**
     * Searches for multiple instances in the database
     *
     * @param dao the data access object to search with
     * @param scope the provided scope (defualts to #getDefaultScope)
     * @returns the models found
     */
    public async search(dao: any & IBasicSearchDto, scope?: Scope): Promise<Model[]> {
        return await this.model.findAll({
            where: dao,
            include: !!scope ? scope : this.getDefaultScope(),
        });
    }

    /**
     * Searches for one instance in the database
     *
     * @param dao the data access object to search with
     * @param scope the provided scope (defaults to #getDefaultScope)
     * @returns the model if found, else null
     */
    public async searchOne(dao: any & IBasicSearchDto, scope?: Scope): Promise<Model | null> {
        return await this.model.findOne({
            where: dao,
            include: !!scope ? scope : this.getDefaultScope(),
        });
    }

    /**
     * Creates a new instance in the database
     *
     * @param dao the data access object to create with
     * @param scope the provided scope (defaults to #getDefaultScope)
     * @returns the created model
     */
    public async create(dao: any, scope?: Scope): Promise<Model> {
        return await this.model.create(dao, {
                include: scope !== undefined ? scope : this.getDefaultScope(),
            },
        );
    }

    /**
     * Deletes instances in the database
     *
     * @param dao the data access object to search for objects to delete with
     * @returns the number of deleted instances in the database
     */
    public async delete(dao?: any): Promise<number> {
        return !!dao ? await this.model.destroy({where: dao}) : await this.model.destroy();
    }

    /**
     * Provides the default scope
     *
     * @returns the default scope
     */
    public getDefaultScope(): Scope {
        return [{all: true}];
    }
}

export class CRUDRepository<Model extends BaseModel<Model>> extends CRDRepository<Model> {

    /**
     * Updates an instance in the database
     *
     * @param searchDao the data access object to search for update candidates
     * @param updateDao the data access object that describes values to be updated
     * @param scope the scope to update with
     * @returns the updated instance if it was found
     */
    public async update(searchDao: any & IBasicSearchDto, updateDao: any, scope?: Scope): Promise<Model | null> {
        const model: Model | null = await this.model.findOne({
            where: searchDao,
            include: !!scope ? scope : this.getDefaultScope(),
        });

        if (model === null) {
            return model;
        }

        return await model.update(updateDao, {
            fields: Object.keys(updateDao),
        });
    }
}
