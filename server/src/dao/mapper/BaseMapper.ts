import mysql from "mysql";
import { pool } from "..";

// type SelectType = "exact and" | "exact or" | "like or"

export enum SelectType {
  EXACT_AND,
  EXACT_OR,
  LIKE_OR,
}
export default class BaseMapper<T> {
  // 关联的表名
  TABLE_NAME: string;
  // 数据库连接池
  POOL: mysql.Pool;

  constructor(tableName: string) {
    this.TABLE_NAME = tableName;
    this.POOL = pool;
  }

  async selectOne(whereValues: T) {
    const result = await this.select(whereValues);
    return result[0];
  }

  select(whereValues: T, type?: SelectType) {
    let sql = this.warpWhere(
      `select * from \`${this.TABLE_NAME}\``,
      whereValues,
      type
    );
    return this.selectBySql(sql);
  }

  selectBySql<G = T[]>(sql: string) {
    return new Promise<G>((resolve, reject) => {
      console.warn(sql);
      this.POOL.query(sql, function (error, results, fields) {
        if (error) throw error;
        fields.forEach((field) => {
          if (field.type === mysql.Types.JSON) {
            results.forEach(
              (item: T) => (item[field.name] = JSON.parse(item[field.name]))
            );
          }
          if (field.type === mysql.Types.TINY) {
            results.forEach(
              (item: T) => (item[field.name] = !!item[field.name])
            );
          }
          // 如果为求总计数
          if (field.name === "count(*)") {
            resolve(results[0]["count(*)"]);
          }
        });
        resolve(results);
      });
    });
  }

  async search(keyWord: string, searchFields: (keyof T)[]) {
    let whereValues = {} as T;

    searchFields.forEach((item) => {
      whereValues[item.toString()] = keyWord;
    });
    return await this.select(whereValues, SelectType.LIKE_OR);
  }

  insert(obj: T) {
    return new Promise<number>((resolve, reject) => {
      this.POOL.query(
        `insert into \`${this.TABLE_NAME}\` set ?`,
        obj,
        function (error, results, fields) {
          if (error) throw error;
          resolve(results.insertId);
        }
      );
    });
  }

  update(updateValues: T, whereValues: T) {
    return new Promise<number>((resolve, reject) => {
      let sqlBuilder = `update \`${this.TABLE_NAME}\` set `;
      for (const key in updateValues) {
        if (Object.hasOwnProperty.call(updateValues, key)) {
          if (updateValues[key] !== undefined && updateValues[key] !== null) {
            sqlBuilder += `${"`" + key + "`"}=${mysql.escape(
              updateValues[key]
            )},`;
          }
        }
      }
      sqlBuilder = sqlBuilder.substring(0, sqlBuilder.length - 1);

      const sql = this.warpWhere(sqlBuilder, whereValues);
      console.log(sql);
      this.POOL.query(sql, function (error, results, fields) {
        if (error) throw error;
        resolve(results.changedRows);
      });
    });
  }

  remove(whereValues: T) {
    return new Promise<number>((resolve, reject) => {
      let sql = this.warpWhere(`delete from \`${this.TABLE_NAME}\``, whereValues);
      console.warn(sql);
      this.POOL.query(sql, function (error, results, fields) {
        if (error) throw error;
        resolve(results.affectedRows);
      });
    });
  }
  warpWhere(
    sql: string,
    values: any,
    whereType: SelectType = SelectType.EXACT_AND
  ) {
    if (!values) {
      return sql;
    }
    let isFirstValue = true;
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        if (values[key]) {
          if (isFirstValue) {
            sql += " where";
            isFirstValue = false;
          } else {
            sql += whereType !== SelectType.EXACT_AND ? " or" : " and";
          }
          if (whereType === SelectType.LIKE_OR) {
            sql += ` ${"`" + key + "`"} like ${mysql.escape(
              "%" + values[key] + "%"
            )}`;
          } else {
            sql += ` ${"`" + key + "`"} = ${mysql.escape(values[key])}`;
          }
        }
      }
    }
    return sql;
  }
}
