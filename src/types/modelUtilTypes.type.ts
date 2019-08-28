import BaseModel from "../model/model.base";
import {Includeable} from "sequelize/types";

export type Scope = Includeable[];

export type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof BaseModel>;
type NonAbstract<T> = { [P in keyof T]: T[P] }; // "abstract" gets lost here
type Constructor<T> = (new () => T);
