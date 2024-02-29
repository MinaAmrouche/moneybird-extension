import Dexie, { Table } from "dexie";
import { IProjectProductMap } from "../definitions";

export class DB extends Dexie {
  projects!: Table<IProjectProductMap>;
  constructor() {
    super("moneybird-report");
    this.version(1).stores({
      projects: "projectId, productId",
    });
  }
}

export const db = new DB();
