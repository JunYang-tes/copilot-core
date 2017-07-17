import { utils } from "../util"
import { IServiceParam } from "../types"
const { debug, error } = require("b-logger")("copilot.services.store")
const sqlite3 = require("sqlite3").verbose()
/**
 * namespace|key|value
 * --|--|--
 * who want use store | store key | json
 * 
 * 
 */
interface IRun {
  changes: number
}
const db = new sqlite3.Database(":memory:")
const query: (q: string, ...param) => any = utils.promisify(db.each.bind(db))
const get: (sql: string, ...param) => any = utils.promisify(db.get.bind(db))
const run: (sql: string, ...param) => Promise<IRun> =
  (sql: string, ...param) => new Promise<IRun>((res, rej) => {
    db.run(sql, ...param, function cb(err) {
      if (err) {
        rej(err)
      } else {
        res(this)
      }
    })
  })
let inilizedResolver;
let inilizedReject;
let inilizedPromise = new Promise((res, rej) => { inilizedResolver = res, inilizedReject = rej })

async function initializeDb() {
  return new Promise((res, rej) => {
    db.serialize(async () => {
      try {
        let queryTables = "SELECT count(0) as number FROM sqlite_master WHERE type='table' AND name='store'"
        let ret = await get(queryTables)
        debug("Ret", ret)
        if (ret.number === 0) {
          await run(`CREATE TABLE store(
            namespace text,
            key text,
            value text
          )`)
          await run(`INSERT INTO store values("test","key","value")`)
        }
        debug(await get(queryTables))
        inilizedResolver()
        res()
      } catch (e) {
        rej(e)
        inilizedReject(e)
      }
    })
  })
}
initializeDb()
  .then(() => {
    debug("Db initialized")
  })
  .catch((e) => error("Error", e))

export class Store {
  private namespace: string
  constructor({ namespace }: IServiceParam) {
    this.namespace = namespace
  }

  public async get(key: string): Promise<string> {
    await this.wait4init()
    let ret = await query(`select value from store where namespace = ? and key = ?`,
      this.namespace,
      key)
    if (ret) {
      return ret.value
    }
    return null
  }
  public async set(key: string, value: string) {
    await this.wait4init()
    try {
      let ret = await run("UPDATE store SET value=? WHERE namespace = ? and key = ? ", value, this.namespace, key)
      debug("Update ", ret)
      if (!ret.changes) {
        run("INSERT INTO store values(?,?,?)",
          this.namespace, key, value)
      }
    } catch (e) {
      debug(e)
      throw new Error("ESQL")
    }
  }
  public async getJson(key: string): Promise<any> {
    return JSON.stringify(await this.get(key))
  }
  public async setJson(key: string, json: any) {
    this.set(key, JSON.parse(json))
  }

  private wait4init() {
    return inilizedPromise;
  }
}
